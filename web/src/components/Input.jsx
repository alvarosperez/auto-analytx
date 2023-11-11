import React from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

export const INPUT_TYPES = {
    TEXT: 'text',
    PASSWORD: 'password',
};
const VALID_TYPES = Object.values(INPUT_TYPES);

const Input = (props) => {
    const {
        customClassname, placeholderText, onChange, name, type,
    } = props;

    return (
        <input
            name={name}
            type={type && VALID_TYPES.includes(type) ? type : INPUT_TYPES.TEXT}
            className={clsx(styles.Input, customClassname)}
            onChange={onChange}
            placeholder={placeholderText}
        />
    );
};

export default Input;
