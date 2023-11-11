import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from .regression import build_regression_models
from .classification import build_classification_models
from src.aux import detect_separator
import numpy as np
import pickle

def get_categorical_columns(df):
    df_text = df.select_dtypes(include='object')
    df_text = df_text.loc[:, df.nunique() < 10]
    return df_text

def get_one_hot_encoder(df_text):
    encoder = OneHotEncoder(sparse=False)
    encoder.fit(df_text)
    return encoder

def get_model(file_name, analysis, targets, df):
    # Eliminar las instancias con valores faltantes
    df = df.dropna()

    y = df[targets[0]].values

    if analysis == 'regresión':
        x = df.drop(targets, axis=1)

        # only numeric columns
        x = x.select_dtypes(include='number')

        X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=12)
        results = build_regression_models(file_name, X_train, y_train, X_test, y_test)
        return results

    elif analysis == 'clasificación':
        df = df.drop(targets, axis=1)

        df_text = get_categorical_columns(df)
        encoder = get_one_hot_encoder(df_text)
        encoded_text = encoder.transform(df_text)
        encoded_text_df = pd.DataFrame(encoded_text, columns=encoder.get_feature_names_out(df_text.columns))

        # Escalar las variables numéricas
        scaler = StandardScaler()
        df_num = df.select_dtypes(include='number')
        scaled_num_df = scaler.fit_transform(df_num)

        # Juntar las variables numéricas y las variables de texto
        x = pd.concat([pd.DataFrame(scaled_num_df, columns=df_num.columns), encoded_text_df], axis=1)

        # save columns to a file
        with open(f"./{file_name}_columns", 'w') as f:
            f.write('\n'.join(list(x.columns)))

        X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=12)
        results = build_classification_models(file_name, X_train, y_train, X_test, y_test, list(set(list(df_text.columns) + list(df_num.columns))))
        return results

def test_model(file_name, analysis, data):
    # load pickle file
    model = pickle.load(open(f"./{file_name}_best_model.pickle", 'rb'))
    print("model loaded", file_name, analysis)

    if analysis == 'regresión':
        return model.predict(data)[0]
    if analysis == 'clasificación':
        separator = detect_separator(f"./{file_name}")
        df = pd.read_csv(f"./{file_name}", sep=separator)
        df = df.dropna()
        df = df[data.columns]

        df_text = get_categorical_columns(df)
        data_text = get_categorical_columns(data)
        # append data_text to df_text
        df_text.loc[len(df)] = data_text.loc[0]

        encoder = get_one_hot_encoder(df_text)
        encoded_text = encoder.transform(df_text)
        encoded_text_df = pd.DataFrame(encoded_text, columns=encoder.get_feature_names_out(df_text.columns))
        encoded_text_df = encoded_text_df.tail(1).reset_index(drop=True)

        scaler = StandardScaler()
        df_num = df.select_dtypes(include='number')
        scaler.fit(df_num)

        scaled_num_df = scaler.transform(data.select_dtypes(include='number')[df_num.columns])
        x = pd.concat([pd.DataFrame(scaled_num_df, columns=df_num.columns), encoded_text_df], axis=1)

        with open(f"./{file_name}_columns", 'r') as f:
            columns = [x.rstrip() for x in f.readlines()]
        x = x[columns]

        return model.predict(x)[0]
