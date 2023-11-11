import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, f1_score, recall_score
import pickle

def build_classification_models(file_name, X_train, y_train, X_test, y_test, test_columns):
    models = {
        'LogisticRegression': LogisticRegression(),
        'KNN': KNeighborsClassifier(),
        'RandomForest': RandomForestClassifier(random_state=42),
        'DecisionTree': DecisionTreeClassifier(random_state=42)
    }

    results = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        results[name] = {
            'Accuracy': accuracy_score(y_test, y_pred),
            'F1 Score': f1_score(y_test, y_pred, average='macro'),
            'Recall': recall_score(y_test, y_pred, average='macro')
        }

    best = max(results, key=lambda k: results[k]['F1 Score'])
    best_model = models[best]

    pickle.dump(best_model, open(f'./{file_name}_best_model.pickle', 'wb'))

    return {
        "models": results,
        "best_model": best,
        "test_columns": test_columns,
    }
