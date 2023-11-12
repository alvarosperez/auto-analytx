import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './Exploratory.module.scss';
import commonStyles from "../utilities/common.module.scss";
import SingleBar from '../components/SingleBar';
import { COLUMN_TYPES, MIN_MAX_MEAN } from '../utilities/variables';
import { formatNumber } from '../utilities/format';
import Histogram from '../components/Histogram';
import BarChart from '../components/BarChart';
import Correlation from '../components/Correlation';


const Exploratory = ({ data, description, fileName }) => {
    const [selectedColumn, setSelectedColumn] = useState(data.header[0]);

    const seeDetails = (column) => {
        setSelectedColumn(column);
    };

    return (
        <div>
            <div className={styles.tableContainer}>
                <div className={styles.fileDescription}>
                    <div>
                        Fichero de datos:
                        <span className={styles.fileName}>{fileName}</span>
                    </div>
                    {description}
                    <div>Tiene <span className={styles.column}>{data.columns} columnas</span> y <span className={styles.row}>{data.rows} filas</span></div>
                    <div>Se muestran los primeros registros del fichero cargado:</div>
                </div>
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        {data.header.map((header) => (
                            <div key={header} className={styles.headerItem}>{header}</div>
                        ))}
                    </div>
                    <div className={styles.tableContent}>
                        {data.values.map((row, index) => (
                            <div className={styles.tableRow} key={index}>
                                {row.map((cell) => (
                                    <div className={styles.tableData} key={cell}>{cell}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <hr className={commonStyles.divider} />
            <div className={styles.variablesContainer}>
                <div className={commonStyles.Title2}>Análisis de variables</div>
                <div className={styles.descriptiveContainer}>
                    <div className={styles.variables}>
                        <div className={styles.line} />
                        <div className={styles.variableHeader}>Nombre</div>
                        <div className={styles.variableHeader}>Tipo</div>
                        <div className={styles.variableHeader}>Completitud</div>
                        <div className={styles.variableHeader}></div>
                        <div className={styles.variableHeader}>Distribución de valores</div>
                        <div className={styles.variableHeader}></div>
                        <div className={styles.line} />
                        {Object.keys(data.columns_info).map((columnKey) => {
                            const column = data.columns_info[columnKey];
                            return (
                                <>
                                    <div className={styles.variableName}>{columnKey}</div>
                                    <div className={styles.variableType}>{COLUMN_TYPES[column.type]}</div>
                                    <div className={styles.variableBar}>
                                        <SingleBar
                                            pct={(1 - column.missing / data.rows).toFixed(2)}
                                            width={150}
                                            height={25}
                                            backgroundColor="black"
                                            fillColor="#00B3D4"
                                            withBorder={true}
                                        />
                                    </div>
                                    <div className={styles.variableMissing}>
                                        {column.missing ? `${column.missing} valores faltantes` : ''}
                                    </div>
                                    <div className={styles.variableUnique}>
                                        {column.type === 'text' ? (
                                            `${column.unique} valores únicos`
                                        ) : (
                                            <>
                                                {column.min_max_mean.map((value, index) => (
                                                    <div key={index}>{MIN_MAX_MEAN[index]}{formatNumber(value)}</div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.seeDetails}>
                                        <div
                                            className={clsx(selectedColumn === columnKey && styles.active)}
                                            onClick={() => seeDetails(columnKey)}>
                                            Ver detalle
                                        </div>
                                    </div>
                                    <div className={styles.line} />
                                </>
                            );
                        })}
                    </div>
                    <div>
                        <div className={styles.histograma}>
                            <div className={styles.Title2}>{selectedColumn}</div>
                            {data.columns_info[selectedColumn].type === 'number' && Object.keys(data.columns_info[selectedColumn].bins).length > 0 && (
                                <Histogram
                                    data={data.columns_info[selectedColumn].bins}
                                    min_max_mean={data.columns_info[selectedColumn].min_max_mean}
                                    name={selectedColumn}
                                />
                            )}
                            {data.columns_info[selectedColumn].type === 'text' && Object.keys(data.columns_info[selectedColumn].categories).length > 0 && (
                                <BarChart
                                    data={data.columns_info[selectedColumn].categories}
                                    name={selectedColumn}
                                />
                            )}
                            <div className={styles.description}>
                                {data.columns_description[selectedColumn] || 'No hay descripción para esta variable'}
                            </div>
                        </div>
                        <div className={clsx(styles.histograma, commonStyles.withMargin10)}>
                            <div className={styles.Title2}>Relación entre variables numéricas</div>
                            <Correlation
                                data={data.correlation_matrix}
                            />
                            <div className={styles.description}>
                                Este gráfico muestra la relación entre las variables numéricas del fichero. Las variables en rojo tienen una correlación positiva, que significa que cuando una aumenta, la otra también. Las azules tienen una correlación negativa: cuando una aumenta, la otra disminuye. Las variables en blanco no tienen correlación.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exploratory;
