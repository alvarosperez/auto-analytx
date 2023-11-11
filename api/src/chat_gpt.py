from openai import AzureOpenAI
import json
from .config import API_VERSION, API_BASE, API_KEY, MODEL


client = AzureOpenAI(
    api_version=API_VERSION,
    api_key=API_KEY,
    azure_endpoint=API_BASE,
)


def summarize_headers(headers):
    messages = []
    messages.append({
        "role": "user",
        "content": f'Resume brevemente de qué puede tratar un fichero con la siguiente cabecera: {", ".join(headers)}. No expliques las variables, solo el tema general. Máximo 55 palabras.'
    })

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(e)
        return "..."

def get_columns_info(columns_info):
    messages = []
    messages.append({
        "role": "user",
        "content": f'Para cada una de las variables, y con los datos que te doy, dime alguna cosa interesante. Ve al grano, sin hacer introducción de cada una, pero la estructura del texto puede ser distinta para cada variable. Devuelveme un json con un único párrafo en castellano de menos de 60 palabras por cada variable.\n\n{columns_info}'
    })

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(e)
        return {}


def get_possible_analysis(variables):
    messages = []
    messages.append({
        "role": "user",
        "content": f'Tenemos un fichero con las siguiente variables y tipos: {variables}.\nEntre clasificación, clustering, regresión y predicción temporal, cuáles crees que podrían hacerse con un dataset así? Responde con un json con el tipo de analisis y las variables targets, no añadas más información ni comentarios. Una variable puede estar en varios modelos. Si no hay ninguna variable de tipo fecha, no pongas predicción temporal. Por ejemplo "{{clustering: grupo, tipo, regresión: grupo, precio}}"'
    })

    print(messages[0]['content'])

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(e)
        return {}
