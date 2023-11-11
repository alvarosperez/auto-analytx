import pandas as pd
from sklearn.model_selection import train_test_split
from .regression import build_regression_models
import pickle


def get_model(file_name, analysis, targets, df):
    # Eliminar las instancias con valores faltantes
    df = df.dropna()

    y = df[targets[0]].values

    if analysis == 'regresión':
        # only numeric columns
        df = df.select_dtypes(include='number')
        x = df.drop(targets, axis=1)

        X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=12)
        results = build_regression_models(file_name, X_train, y_train, X_test, y_test)
        return results

def test_model(file_name, analysis, data):
    # load pickle file
    model = pickle.load(open(f"./{file_name}_best_model.pickle", 'rb'))
    print("model loaded", file_name, analysis)

    if analysis == 'regresión':
        return model.predict(data)[0]
