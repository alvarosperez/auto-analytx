import React from 'react';
import clsx from 'clsx';
import styles from './Header.module.scss';
import logo from '../assets/img/logo.png';


const Header = (props) => {
    const {
        title, customClassname, ExtraComponent, confidentialWarning,
    } = props;

    return (
        <div className={clsx(styles.HeaderContainer, customClassname)}>
            <img className={styles.Logo} src={logo} alt="app logo" />
            <div className={styles.Title}>{title}</div>

            {ExtraComponent && <ExtraComponent />}

            {confidentialWarning && (
                <div className={clsx(styles.Warning, ExtraComponent && styles.hasExtraComponent)}>
                    Alpha version
                    <br />
                    Work in progress
                </div>
            )}
        </div>
    );
};

export default Header;
