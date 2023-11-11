import React, { useState } from "react";
import clsx from "clsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import Button from "./components/Button";

import loadingImg from "./assets/img/loader.gif";

import styles from "./Main.module.scss";
import commonStyles from "./utilities/common.module.scss";
import Exploratory from "./sections/Exploratory";
import Models from "./sections/Models";
import { API_URL } from "./utilities/variables";

const Main = ({  }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({});

    const handleFileUpload = (e) => {
        const fileToUpload = e.target.files[0];
        setFile(fileToUpload);
    };

    const handleUpload = () => {
        setResult({});
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        fetch(`${API_URL}/files/upload`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((json) => {
                if ('error' in json) {
                    setResult({
                        error: true,
                        errorMessage: json.error,
                    });
                } else {
                    setResult({
                        error: false,
                        errorMessage: false,
                        data: json,
                        description: json.description,
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className={styles.Container}>
            <div className={commonStyles.Title}>Análisis de Datos Automático</div>
            {!result?.data && (
                <div className={clsx(styles.LoadDataContainer, loading && commonStyles.center)}>
                    <div className={styles.loadInput}>
                        <div>
                            Fichero de datos:
                            {(loading || result.data) && (
                                <span className={styles.fileName}>
                                    {file.name}
                                </span>
                            )}
                        </div>
                        {!loading && !result.data && (
                            <label className={styles.file}>
                                <input type="file" id="file" onChange={handleFileUpload} />
                                <span className={styles.fileCustom} datacontent={file?.name || 'Selecciona un archivo'}></span>
                            </label>
                        )}
                    </div>
                    {file && !loading && !result.data && (
                        <Button onClick={handleUpload} customClassname={styles.LoadButton}>
                            Cargar datos
                        </Button>
                    )}
                    {loading && (
                        <div className={commonStyles.loading}>
                            <img src={loadingImg} alt="loading" />
                            Cargando y procesando datos...
                        </div>
                    )}
                    {loading && (
                        <div className={clsx(commonStyles.Tutorial, styles.tutorial)}>
                            <FontAwesomeIcon icon={faLeftLong}/>
                            <span>
                                Este proceso puede tardar varios minutos.
                                <br />
                                Se van a preparar los datos y se hará un primer análisis exploratorio.
                            </span>
                        </div>
                    )}
                    {(!loading || result.error) && (
                        <div className={clsx(commonStyles.Tutorial, styles.tutorial)}>
                            <FontAwesomeIcon icon={faLeftLong}/>
                            <span>
                                Selecciona un fichero de datos para comenzar el análisis!
                                <br />
                                Tiene que ser un CSV o Excel y debe contener cabecera.
                            </span>
                        </div>
                    )}
                </div>
            )}
            {result?.error && (
                <div className={commonStyles.errorMessage}>
                    <FontAwesomeIcon icon={faCircleExclamation}/>
                    &nbsp;&nbsp;&nbsp;
                    {result.errorMessage}
                </div>
            )}
            {result?.data && (
                <>
                    {/* <hr className={commonStyles.divider} /> */}
                    <Exploratory
                        fileName={file.name}
                        data={result.data}
                        description={result.description}
                    />
                    <hr className={commonStyles.divider} />
                    <Models
                        data={result.data}
                        file={file}
                    />
                </>
            )}
        </div>
    );
};

export default Main;
