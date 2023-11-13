import commonStyles from './common.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faHashtag } from '@fortawesome/free-solid-svg-icons';
import classImg from '../assets/img/clas.png';
import clusteringImg from '../assets/img/clustering.png';
import regImg from '../assets/img/reg.png';

export const PROJECT_NAME = 'Auto Analytx';
export const PROJECT_PATH = '';

export const MODELS = ["clasificación", "clustering", "regresión", "predicción temporal"];

export const COLUMN_TYPES = {
    'number': <FontAwesomeIcon icon={faHashtag} className="fa-fw" />,
    'text': <FontAwesomeIcon icon={faFont} className="fa-fw" />,
    'date': <FontAwesomeIcon icon={faFont} className="fa-fw" />,
};

export const COLORS = {
    min: '#007a9c',
    max: '#ff6600',
    mean: 'black',
    Accuracy: '#c080ff',
    'F1 Score': '#a64dff',
    Recall: '#d9b3ff',
};

export const MIN_MAX_MEAN = [
    <div style={{ background: COLORS.min}} className={commonStyles.minMaxIcon}>Mín</div>,
    <div style={{ background: COLORS.max}} className={commonStyles.minMaxIcon}>Máx</div>,
    <div style={{ background: COLORS.mean}} className={commonStyles.minMaxIcon}>AVG</div>,
];

export const GRAPH_WIDTH = 370;
export const GRAPH_HEIGHT = 300;

export const TUTORIAL = {
    "regresión": <>
        <div>La regresión sirve para entender y predecir relaciones entre variables.</div>
        <div>Imagina que tienes una serie de puntos en un gráfico: la regresión intenta dibujar la mejor línea a través de estos puntos para mostrar la tendencia general.</div>
        <div>Por ejemplo, puedes usar regresión para predecir el precio de una casa basándote en su tamaño; a medida que aumenta el tamaño, probablemente aumente el precio.</div>
    </>,
    "clasificación": <>
        <div>La clasificación sirve para asignar categorías a diferentes objetos o situaciones.</div>
        <div>Imagina que tienes un montón de frutas y quieres separarlas en manzanas, naranjas y plátanos. La clasificación es como un sistema que te ayuda a decidir en qué grupo va cada fruta basándose en características como el color, la forma o el tamaño.</div>
        <div>Necesitas que tus datos tengan una variable con la categoría, para que el sistema aprenda del resto de características y puedas predecir nuevos registros.</div>
    </>,
    "clustering": <>
        <div>El clustering, o agrupamiento, sirve para organizar un conjunto de objetos en grupos basados en su similitud.</div>
        <div>Imagínate que tienes una caja de juguetes mezclados y quieres organizarlos en coches, muñecas y bloques. Clustering es un sistema que examinaría las características de los juguetes y los agruparía.</div>
        <div>Por ejemplo, puedes usar clustering para hacer grupos de clientes según lo que gastan.</div>
    </>,
}

export const TUTORIAL_IMG = {
    "clasificación": classImg,
    "clustering": clusteringImg,
    "regresión": regImg,
    "predicción temporal": regImg,
}

export const TUTORIAL_TARGET = {
    "regresión": "Elige la variable numérica a predecir, y el modelo encontrará las relaciones con otras columnas.",
    "clasificación": "Elige la variable que contiene la categoría que querrás predecir.",
    "clustering": "Elige las variables numéricas que quieres que se tengan en cuenta y, opcionalmente, el número de grupos que quieres que se formen. Si no, se elegirá automáticamente.",
}

// AWS
export const API_URL = 'http://ec2-13-39-155-245.eu-west-3.compute.amazonaws.com:8000'
// local
// export const API_URL = 'http://localhost:8000';
