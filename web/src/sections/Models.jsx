import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Models.module.scss';
import commonStyles from "../utilities/common.module.scss";
import { API_URL, COLUMN_TYPES, MIN_MAX_MEAN, MODELS, TUTORIAL, TUTORIAL_IMG, TUTORIAL_TARGET } from '../utilities/variables';
import { formatNumber } from '../utilities/format';
import Button from '../components/Button';
import Select from 'react-select';
import loadingImg from "../assets/img/loader.gif";
import BarChart from '../components/BarChart';
import ClusterBarChart from '../components/ClusterBarChart';
import Input from '../components/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import ScatterPlot from '../components/ScatterPlot';
import LineChart from '../components/LineChart';

const Models = ({ data, file }) => {
    const columnsSelectorRef = React.createRef();
    const clusteringSelectorRef = React.createRef();
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedClusterNo, setSelectedClusterNo] = useState(0);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({});
    const [loadingTest, setLoadingTest] = useState(false);
    const [resultTest, setResultTest] = useState({});
    const [testData, setTestData] = useState({});

    const dateColumns = Object.values(data.columns_info).filter((column) => column.type === 'date').map((column) => column.name);
    const numericColumns = Object.values(data.columns_info).filter((column) => column.type === 'number').map((column) => column.name);
    const categoricalColumns = Object.values(data.columns_info).filter((column) => column.type === 'text').map((column) => column.name);

    const availableModels = MODELS.filter((model) => {
        if (model === 'clasificación' && !categoricalColumns.length) return false;
        if (model === 'predicción temporal' && !dateColumns.length) return false;
        return true;
    });
    const availableTargets = {
        clasificación: categoricalColumns,
        regresión: numericColumns,
        // 'predicción temporal': ,
        clustering: numericColumns,
    };
    const chatGPTTargets = Object.keys(data.models.options).filter((option) => option !== 'predicción temporal' && data.models.options[option].length >= 1);

    console.log(dateColumns, numericColumns, categoricalColumns);
    console.log(resultTest);

    const inputTestData = (column, event) => {
        setTestData({
            ...testData,
            [column]: event.target.value,
        });
    };

    const generateModel = () => {
        setResult({});
        setLoading(true);

        const aiHeaders = new Headers();
        aiHeaders.append('Content-Type', 'application/json');
        fetch(`${API_URL}/models/train`, {
            method: 'POST',
            headers: aiHeaders,
            body: JSON.stringify({
                fileName: file.name,
                model: selectedModel,
                columns: selectedColumns.join(','),
                groups: selectedClusterNo,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setResult({
                    error: false,
                    errorMessage: false,
                    data: json,
                });
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    const testModel = () => {
        setResultTest({});
        setLoadingTest(true);

        const aiHeaders = new Headers();
        aiHeaders.append('Content-Type', 'application/json');
        fetch(`${API_URL}/models/test`, {
            method: 'POST',
            headers: aiHeaders,
            body: JSON.stringify({
                fileName: file.name,
                model: selectedModel,
                data: testData,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoadingTest(false);
                setResultTest({
                    error: false,
                    errorMessage: false,
                    testResult: json,
                });
            })
            .catch((error) => {
                console.error(error);
                setLoadingTest(false);
            });
    };

    return (
        <div className={styles.ModelsContainer}>
            <div className={commonStyles.Title2}>Analítica Avanzada</div>
            <div>Quieres realizar algún tipo de modelo? Para tus datos, estas son las opciones que podrían tener sentido:</div>
            <ul>
                {chatGPTTargets.map((option) => (
                    <li key={option} className={styles.option}>
                        <span className={commonStyles.analytics}>{option}</span>
                        , con las columnas:&nbsp;
                        {data.models.options[option]?.map((column) => (
                            <span key={column} className={clsx(styles.column, commonStyles.column)}>
                                {column}
                            </span>
                        ))}
                    </li>
                ))}
            </ul>
            <div className={styles.Selector}>
                <div className={styles.SelectoresYAyuda}>
                    <div>
                        <Select
                            className={clsx(styles.modelSelector, (loading || result?.data) && styles.locked)}
                            options={availableModels.map((option) => ({ value: option, label: option })) }
                            isMulti={false}
                            onChange={(e) => {
                                setSelectedModel(e.value);
                                columnsSelectorRef.current.clearValue();
                            }}
                            placeholder="Selecciona un modelo"
                        />
                        <div className={clsx(styles.columnSelector, (loading || result?.data) && styles.locked)}>
                            <Select
                                ref={columnsSelectorRef}
                                options={availableTargets[selectedModel]?.map((column) => ({ value: column, label: column })) || []}
                                isMulti={['clustering'].includes(selectedModel)}
                                onChange={(e) => {
                                    if (!e) return setSelectedColumns([]);
                                    if (['clustering'].includes(selectedModel)) {
                                        setSelectedColumns(e.map((column) => column.value));
                                    } else {
                                        setSelectedColumns([e.value]);
                                    };
                                }}
                                placeholder="Selecciona la(s) columna(s)"
                            />
                        </div>
                        {selectedModel === 'clustering' && (
                            <div className={clsx(styles.columnSelector, (loading || result?.data) && styles.locked)}>
                                <Select
                                    ref={clusteringSelectorRef}
                                    options={[[0, 'Grupos automáticos'], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7,], [8, 8]].map((column) => ({ value: column[0], label: column[1] }))}
                                    onChange={(e) => {
                                        if (!e) return setSelectedClusterNo(0);
                                        setSelectedClusterNo(e.value);
                                    }}
                                    placeholder="Grupos automáticos"
                                />
                            </div>

                        )}
                    </div>
                    {(!selectedModel) && (
                        <div className={clsx(commonStyles.Tutorial, styles.tutorial)}>
                            <FontAwesomeIcon icon={faLeftLong}/>
                            <span>
                                Selecciona un modelo para ver una explicación.
                            </span>
                        </div>
                    )}
                    {selectedModel && (
                        <div className={clsx(styles.HelpContainer, commonStyles.box)}>
                            <div className={clsx(commonStyles.TitleBox, commonStyles.analytics)}>{selectedModel}</div>
                            <div className={styles.HelpDescription}>
                                <img src={TUTORIAL_IMG[selectedModel]} />
                                <div>
                                    {TUTORIAL[selectedModel]}
                                </div>
                            </div>
                            <div className={styles.HelpTarget}>
                                {TUTORIAL_TARGET[selectedModel]}
                            </div>
                        </div>
                    )}
                </div>
                {!loading && !result?.data && (<Button onClick={generateModel}>Crear modelo</Button>)}
            </div>
            {loading && (
                <div className={clsx(commonStyles.loading, commonStyles.withMargin20)}>
                    <img src={loadingImg} alt="loading" />
                    Generando modelo... Esto puede tardar unos minutos
                </div>
            )}

            {!loading && result?.data && (
                <div className={styles.modelContainer}>
                    <hr className={commonStyles.divider} />
                    <div className={styles.evaluation}>
                        <div className={styles.evaluationDescription}>
                            {selectedModel === 'clustering' ? (
                                <>
                                    <div>
                                        Se ha generado un modelo de <strong>{selectedModel}</strong> con <strong>{result.data.silhouette.cluster_no}</strong> grupos.
                                    </div>
                                    {selectedClusterNo === 0 && <div>Se probaron varios números de grupos distintos para detectar el mejor.</div>}
                                </>
                            ) : (
                                <>
                                    <div>
                                        Se han generado y comparado <strong>{Object.keys(result.data.models).length}</strong> modelos de <strong>{selectedModel}</strong> distintos para predecir el valor de
                                        <div className={commonStyles.column}>{selectedColumns}.</div>
                                    </div>
                                    <div>El mejor modelo es un <span className={commonStyles.analytics}>{result.data.best_model.replace('_', ' ')}</span></div>
                                </>
                            )}
                        </div>
                        {selectedModel === 'regresión' && (
                            <>
                                <div className={commonStyles.box}>
                                    <div className={commonStyles.TitleBox}>RMSE</div>
                                    <BarChart
                                        forcedHeight={200}
                                        colorCategories={true}
                                        data={result.data.MSE}
                                        name={""}
                                        selectedCategory={result.data.best_model}
                                    />
                                    <div className={styles.metricDescription}>
                                        Proporciona una medida de error en las mismas unidades que la variable objetivo. Un RMSE más pequeño es mejor, indicando que las predicciones del modelo están más cerca de los valores reales.
                                    </div>
                                </div>
                                <div className={commonStyles.box}>
                                    <div className={commonStyles.TitleBox}>R2</div>
                                    <BarChart
                                        forcedHeight={200}
                                        colorCategories={true}
                                        data={result.data.R2}
                                        name={""}
                                        selectedCategory={result.data.best_model}
                                    />
                                    <div className={styles.metricDescription}>
                                        Un R² más alto generalmente indica un mejor ajuste del modelo a los datos.
                                    </div>
                                </div>
                            </>
                        )}
                        {selectedModel === 'clasificación' && (
                            <>
                                <div className={commonStyles.box}>
                                    <div className={commonStyles.TitleBox}>Comparación</div>
                                    <ClusterBarChart
                                        forcedHeight={200}
                                        forcedWidth={420}
                                        colorCategories={true}
                                        data={result.data.models}
                                        name={""}
                                        selectedCategory={result.data.best_model}
                                    />
                                    <div className={styles.metricDescription}>
                                    Accuracy es la proporción de predicciones correctas entre el total de casos, Recall mide la proporción de positivos reales identificados correctamente, y F1 Score combina precisión y recall en un balance. Cuanto más alto, mejor.
                                    </div>
                                </div>
                            </>
                        )}
                        {selectedModel === 'clustering' && (
                            <>
                                <div className={commonStyles.box}>
                                    <div className={commonStyles.TitleBox}>Clusters</div>
                                    <ScatterPlot
                                        forcedHeight={250}
                                        forcedWidth={350}
                                        data={result.data.clustered}
                                        xAxis={selectedColumns.length <= 2 ? Object.keys(result.data.clustered[0]).filter((key) => key !== 'Cluster')[0] : ""}
                                        yAxis={selectedColumns.length === 2 ? Object.keys(result.data.clustered[0]).filter((key) => key !== 'Cluster')[1] : ""}
                                    />
                                    <div className={styles.metricDescription}>
                                        Este gráfico muestra la distribución de los datos respecto a las variables seleccionadas, coloreados según el grupo al que pertenecen.
                                        {selectedColumns > 2 && (<div>Como seleccionaste más de dos columnas, se han agrupado para poder visualizarlas en 2 dimensiones.</div>)}
                                    </div>
                                </div>
                                {selectedClusterNo === 0 && (
                                    <div className={commonStyles.box}>
                                        <div className={commonStyles.TitleBox}>Número de clusters</div>
                                        <LineChart
                                            forcedHeight={250}
                                            forcedWidth={350}
                                            data={result.data.silhouette}
                                        />
                                        <div className={styles.metricDescription}>
                                            Mediante un proceso llamado "método de la silueta", se prueba el modelo con distintos números de clusters para encontrar el que mejor se ajusta a los datos.
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <hr className={commonStyles.divider} />
                    {selectedModel === 'clustering' ? (
                        <>
                            Descarga los datos procesados, con una columna nueva que indica el grupo al que pertenece cada fila:
                            <div className={commonStyles.withMargin10}>
                                <a href={`${API_URL}/models/download_processed/${file.name}`} download="best_model" target='_blank'>
                                    <Button customClassname={commonStyles.AnalyticsButton} onClick={() => {}}>Descargar datos procesados</Button>
                                </a>
                            </div>
                        </>
                    ) : (
                        <>
                            ¿Quieres probar el modelo? Inserta los valores para realizar la predicción:
                            <div className={clsx(styles.modelTestInputs, commonStyles.withMargin20)}>
                                {result.data.test_columns.map((column) => (
                                    <div key={column} className={styles.columnInput}>
                                        <div className={styles.columnInputTitle}>{column}</div>
                                        <Input onChange={(event) => { inputTestData(column, event) }} />
                                    </div>
                                ))}
                            </div>
                            <Button customClassname={commonStyles.AnalyticsButton} onClick={() => {testModel()}}>Generar predicción</Button>
                            {resultTest.testResult && (
                                <div className={styles.modelTestResult}>
                                    Predicción:
                                    <span>{formatNumber(resultTest.testResult.value)}</span>
                                </div>
                            )}
                        </>
                    )}
                    <hr className={commonStyles.divider} />
                    <div>
                        Puedes descargar el modelo para usarlo posteriormente:
                        <div className={commonStyles.withMargin10}>
                            <a href={`${API_URL}/models/download/${file.name}`} download="best_model" target='_blank'>
                                <Button customClassname={commonStyles.AnalyticsButton} onClick={() => {}}>Descargar modelo</Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Models;
