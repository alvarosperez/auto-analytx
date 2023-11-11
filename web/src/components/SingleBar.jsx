import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import styles from './SingleBar.module.scss';
import { displayPct } from '../utilities/format';

export const types = {
    MAIN: 'main',
    SECONDARY: 'secondary',
};

const SingleBar = (props) => {
    const {
        backgroundColor, fillColor, pct, width, height, borderColor,
    } = props;

    let innerWidth = borderColor ? width - 2 : width;
    innerWidth = (pct < 1 && pct > 0.98) ? innerWidth * 0.98 : innerWidth * pct;

    const innerHeight = borderColor ? height - 2 : height;

    return (
        <div
            className={clsx(styles.Container, borderColor && styles.withBorder)}
            style={{ backgroundColor: backgroundColor, width: `${width}px`, height: `${height}px`, borderColor: borderColor }}
        >
            <div className={styles.Value}>{displayPct(pct)}</div>
            <div className={styles.Bar} style={{ width: `${innerWidth}px`, backgroundColor: fillColor, height: `${innerHeight}px` }}></div>
        </div>
    );
};

export default SingleBar;