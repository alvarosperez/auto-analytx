from fastapi import FastAPI
from fastapi import File
from fastapi import UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from pydantic import BaseModel
import shutil

import numpy as np
import pandas as pd

from src.aux import identify_header, detect_separator, bin
from src.chat_gpt import summarize_headers, get_columns_info, get_possible_analysis
from src.analytics.main import get_model, test_model

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# endpoint to upload a file
@app.post("/files/upload/")
async def create_upload_file(file: UploadFile = File(...)):
    try:
        with open(f"./{file.filename}", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    separator = detect_separator(f"./{file.filename}")

    if not separator:
        return {"error": "Error: No se han podido detectar la estructura del fichero"}

    has_header = identify_header(f"./{file.filename}", sep=separator)
    if not has_header:
        return {"error": "Error: No se han detectado cabeceras en el fichero"}

    df = pd.read_csv(f"./{file.filename}", sep=separator)

    # for each column, identify the type, and missing values and unique values
    columns_info = {}
    simple_column_info = {}
    for col in df.columns:
        col_type = "number" if df[col].dtype == np.float64 or df[col].dtype == np.int64 else "text"
        columns_info[col] = {
            "name": col,
            "type": col_type,
            "missing": int(df[col].isnull().sum()),
            "unique": int(df[col].nunique()),
        }
        simple_column_info[col] = {
            "type": col_type,
        }
        if df[col].dtype == np.float64 or df[col].dtype == np.int64:
            columns_info[col]["min_max_mean"] = [
                int(df[col].min()), int(df[col].max()), int(df[col].mean())
            ]
            try:
                new_df = df.copy()
                columns_info[col]["bins"] = bin(new_df, col, 30, columns_info[col]["min_max_mean"])
            except Exception as e:
                print(col, e)
                columns_info[col]["bins"] = {}
        if df[col].dtype == object:
            try:
                columns_info[col]["categories"] = df.groupby(col).size().to_dict()
            except Exception as e:
                print(col, e)
                columns_info[col]["categories"] = {}


    return {
        "filename": file.filename,
        "header": df.columns.tolist(),
        "values": df.head(5).values.tolist(),
        "rows": df.shape[0],
        "columns": df.shape[1],
        "columns_info": columns_info,
        "description" : summarize_headers(df.columns.tolist()),
        "columns_description": get_columns_info(columns_info),
        "models": {
            "options": get_possible_analysis(simple_column_info),
        },
    }

class AIModel(BaseModel):
    fileName: str
    model: str = None
    columns: str = None
    data: dict = None

@app.post("/models/train/")
async def analyse_file(trainModel: AIModel):
    separator = detect_separator(f"./{trainModel.fileName}")
    df = pd.read_csv(f"./{trainModel.fileName}", sep=separator)

    return get_model(trainModel.fileName, trainModel.model, trainModel.columns.split(','), df)

# endpoint to download a file with the model trained. URL parameter: filename
@app.get("/models/download/{filename}")
async def download_file(filename):
    return FileResponse(f"./{filename}_best_model.pickle", media_type="application/octet-stream", filename=f"{filename}_best_model.pickle")

# endpoint to test a model
@app.post("/models/test/")
async def testing_model(model: AIModel):
    df = pd.DataFrame([model.data], index=[0]).apply(pd.to_numeric)
    print(df)
    model_response = test_model(model.fileName, model.model, df)
    print(model_response)
    return {
        "value": model_response
    }
