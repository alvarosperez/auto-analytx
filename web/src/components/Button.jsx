import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import styles from './Button.module.scss';

export const types = {
    MAIN: 'main',
    SECONDARY: 'secondary',
};

const Button = (props) => {
    const {
        type, customClassname, onClick, children,
    } = props;

    return (
        <div
            onClick={onClick}
            className={clsx(styles.Container, styles[type], customClassname)}
        >
            {children}
        </div>
    );
};
Button.propTypes = {
    type: PropTypes.string,
    customClassname: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
};

export default Button;
