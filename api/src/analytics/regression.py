from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_selection import RFE
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from math import sqrt
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error, r2_score
import pickle

def build_regression_model(X_train, y_train, X_test, y_test):
    # Declarar objeto estimator de la clase RandomForestRegressor
    estimator = RandomForestRegressor()

    # Declarar objeto rfe de la clase RFE
    rfe = RFE(estimator=estimator, n_features_to_select=4)

    # Declarar objeto linmod de la clase LinearRegression
    linmod = LinearRegression()

    # Declarar objeto pipeline de la clase Pipeline
    steps = [('rfe', rfe), ('linmod', linmod)]
    pipeline = Pipeline(steps=steps)

    pipeline.fit(X_train, y_train)

    # Hacer una predicción sobre el conjunto de prueba
    y_pred = pipeline.predict(X_test)

    # Calcular el RMSE
    rmse = sqrt(mean_squared_error(y_test, y_pred))

    print('RMSE:', rmse)

    return pipeline, rmse

def build_regression_models(file_name, X_train, y_train, X_test, y_test):
    model_rf = RandomForestRegressor(random_state=42)
    model_lr = LinearRegression()
    model_dt = DecisionTreeRegressor(random_state=42)

    model_rf.fit(X_train, y_train)
    model_lr.fit(X_train, y_train)
    model_dt.fit(X_train, y_train)

    # Hacer predicciones
    y_pred_rf = model_rf.predict(X_test)
    y_pred_lr = model_lr.predict(X_test)
    y_pred_dt = model_dt.predict(X_test)

    # Calcular MSE y R2
    mse_rf = sqrt(mean_squared_error(y_test, y_pred_rf))
    mse_lr = sqrt(mean_squared_error(y_test, y_pred_lr))
    mse_dt = sqrt(mean_squared_error(y_test, y_pred_dt))

    r2_rf = r2_score(y_test, y_pred_rf)
    r2_lr = r2_score(y_test, y_pred_lr)
    r2_dt = r2_score(y_test, y_pred_dt)

    best_model_name = "RandomForestRegressor" if mse_rf < mse_lr and mse_rf < mse_dt else "LinearRegression" if mse_lr < mse_dt else "DecisionTreeRegressor"
    best_model = model_rf if mse_rf < mse_lr and mse_rf < mse_dt else model_lr if mse_lr < mse_dt else model_dt
    pickle.dump(best_model, open(f'./{file_name}_best_model.pickle', 'wb'))

    return {
        "models": {
            "RandomForestRegressor": {
                "MSE": mse_rf,
                "R2": r2_rf
            },
            "LinearRegression": {
                "MSE": mse_lr,
                "R2": r2_lr
            },
            "DecisionTreeRegressor": {
                "MSE": mse_dt,
                "R2": r2_dt
            }
        },
        "MSE": {
            "RandomForestRegressor": mse_rf,
            "LinearRegression": mse_lr,
            "DecisionTreeRegressor": mse_dt
        },
        "R2": {
            "RandomForestRegressor": r2_rf,
            "LinearRegression": r2_lr,
            "DecisionTreeRegressor": r2_dt
        },
        "best_model": best_model_name,
        "test_columns": X_train.columns.tolist(),
    }
