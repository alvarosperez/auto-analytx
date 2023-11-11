import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Models.module.scss';
import commonStyles from "../utilities/common.module.scss";
import { API_URL, COLUMN_TYPES, MIN_MAX_MEAN } from '../utilities/variables';
import { formatNumber } from '../utilities/format';
import Button from '../components/Button';
import Select from 'react-select';
import loadingImg from "../assets/img/loader.gif";
import BarChart from '../components/BarChart';
import Input from '../components/Input';

const Models = ({ data, file }) => {
    const columnsSelectorRef = React.createRef();
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({});
    const [loadingTest, setLoadingTest] = useState(false);
    const [resultTest, setResultTest] = useState({});
    const [testData, setTestData] = useState({});

    const dateColumns = Object.values(data.columns_info).filter((column) => column.type === 'date').map((column) => column.name);
    const numericColumns = Object.values(data.columns_info).filter((column) => column.type === 'number').map((column) => column.name);
    const categoricalColumns = Object.values(data.columns_info).filter((column) => column.type === 'text').map((column) => column.name);

    const availableModels = Object.keys(data.models.options).filter((model) => {
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

    console.log(dateColumns, numericColumns, categoricalColumns);
    console.log(resultTest);

    const inputTestData = (column, event) => {
        setTestData({
            ...testData,
            [column]: event.target.value,
        });
    };

    const generateModel = () => {
        setResult(null);
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
        setResultTest(null);
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
                {availableModels.map((option) => (
                    <li key={option} className={styles.option}>
                        <b>{option}</b>
                        , con las columnas:&nbsp;
                        {data.models.options[option].map((column) => (
                            <span key={column} className={styles.column}>
                                {column}
                                ,&nbsp;
                            </span>
                        ))}
                    </li>
                ))}
            </ul>
            <div className={styles.Selector}>
                <Select
                    className={clsx(styles.modelSelector, (loading || result.data) && styles.locked)}
                    options={availableModels.map((option) => ({ value: option, label: option })) }
                    isMulti={false}
                    onChange={(e) => {
                        setSelectedModel(e.value);
                        columnsSelectorRef.current.clearValue();
                    }}
                    placeholder="Selecciona un modelo"
                />
                <div className={clsx(styles.columnSelector, (loading || result.data) && styles.locked)}>
                    <Select
                        ref={columnsSelectorRef}
                        options={availableTargets[selectedModel]?.map((column) => ({ value: column, label: column })) || []}
                        isMulti={['clasificación', 'clustering'].includes(selectedModel)}
                        onChange={(e) => {
                            if (!e) return setSelectedColumns([]);
                            if (['clasificación', 'clustering'].includes(selectedModel)) {
                                setSelectedColumns(e.map((column) => column.value));
                            } else {
                                setSelectedColumns([e.value]);
                            };
                        }}
                        placeholder="Selecciona la(s) columna(s)"
                    />
                </div>
                {!loading && !result.data && (<Button onClick={generateModel}>Crear modelo</Button>)}
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
                            <div>
                                Se han generado y comparado <strong>{Object.keys(result.data.models).length}</strong> modelos de <strong>{selectedModel}</strong> distintos para predecir el valor de
                                <div className={commonStyles.column}>{selectedColumns}.</div>
                            </div>
                            <div>El mejor modelo es un <strong>{result.data.best_model.replace('_', ' ')}</strong></div>
                        </div>
                        <div className={commonStyles.box}>
                            <div className={commonStyles.TitleBox}>RMSE</div>
                            <BarChart
                                forcedHeight={200}
                                colorCategories={true}
                                data={result.data.MSE}
                                name={""}
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
                            />
                            <div className={styles.metricDescription}>
                                Un R² más alto generalmente indica un mejor ajuste del modelo a los datos.
                            </div>
                        </div>
                    </div>
                    <hr className={commonStyles.divider} />
                    ¿Quieres probar el modelo? Inserta los valores para realizar la predicción:
                    <div className={clsx(styles.modelTestInputs, commonStyles.withMargin20)}>
                        {result.data.test_columns.map((column) => (
                            <div key={column} className={styles.columnInput}>
                                <div className={styles.columnInputTitle}>{column}</div>
                                <Input onChange={(event) => { inputTestData(column, event) }} />
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => {testModel()}}>Generar predicción</Button>
                    {resultTest.testResult && (
                        <div className={styles.modelTestResult}>
                            Predicción:
                            <span>{formatNumber(resultTest.testResult.value)}</span>
                        </div>
                    )}
                    <hr className={commonStyles.divider} />
                    <div>
                        Puedes descargar el modelo para usarlo posteriormente:
                        <div className={commonStyles.withMargin10}>
                            <a href={`${API_URL}/models/download/${file.name}`} download="best_model" target='_blank'>
                                <Button onClick={() => {}}>Descargar modelo</Button>
                            </a>
                        </div>
                    </div>
                    {/*
                    <hr className={commonStyles.divider} />
                    <div>
                        Descarga los datos procesados con los grupos que ha generado el modelo:
                        <div className={commonStyles.withMargin10}>
                            <Button onClick={() => {}}>Descargar dataset procesado</Button>
                        </div>
                    </div>
                    */}
                </div>
            )}
        </div>
    );
};

export default Models;
