import React, { useEffect, useState, useRef } from 'react';

// import clsx from 'clsx';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { min, max, bin } from 'd3-array';

import styles from './Histogram.module.scss';
import { COLORS, GRAPH_HEIGHT, GRAPH_WIDTH } from '../utilities/variables';

const Histogram = ({ data, min_max_mean, name }) => {
    const domRef = useRef();
    const [svg, setSvg] = useState(null);

    const margin = {
        top: 20, right: 10, bottom: 32, left: 10,
    };
    const fullWidth = GRAPH_WIDTH;
    const fullHeight = GRAPH_HEIGHT;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;
    // X axis: scale and draw:
    const x = scaleLinear()
        .range([0, width]);
    // Y axis: scale and draw:
    const y = scaleLinear()
        .range([height, 0]);

    const create = () => {
        const svgElem = select(domRef.current).select('svg > g');
        svgElem.select('g.axisBottom')
            .call(
                axisBottom(x).ticks(5).tickFormat((d) => `${Math.floor(d / 1000)}k`),
            );

        setSvg(svgElem);
    };

    const draw = (info, min_max_mean) => {
        const bins = Object.keys(info).map((key) => ({
            x0: key.split(',')[0].replace('[', ''),
            x1: key.split(',')[1].replace(']', ''),
            length: info[key],
        }));
        const binSize = (min_max_mean[1] - min_max_mean[0]) / bins.length;
        x.domain([min_max_mean[0] - binSize, min_max_mean[1] + binSize]);

        svg.select('.axisBottom').call(
            axisBottom(x).ticks(8)//.tickFormat((d) => `${Math.floor(d / 1000)}k`),
        );

        y.domain([0, max(bins, (d) => d.length) * 1.05]);

        // append the bar rectangles to the svg element
        const bars = svg.selectAll('rect.histogram').data(bins);

        bars.enter()
            .append('rect')
            .classed(styles.histogram, true)
            .classed('histogram', true)
            .attr('x', 1)
            .attr('transform', (d) => `translate(${x(d.x0)}, ${y(d.length)})`)
            .attr('width', (d) => x(d.x1) - x(d.x0) - 1)
            .attr('height', (d) => height - y(d.length));

        bars
            .attr('transform', (d) => `translate(${x(d.x0)}, ${y(d.length)})`)
            .attr('width', (d) => x(d.x1) - x(d.x0) - 1)
            .attr('height', (d) => height - y(d.length));

        bars.exit().remove();

        const infoData = min_max_mean.map((value, index) => ({
            name: index === 0 ? 'min' : index === 1 ? 'max' : 'media',
            value,
            color: index === 0 ? COLORS.min : index === 1 ? COLORS.max : COLORS.mean,
            margin: index === 0 ? 0 : index === 1 ? 0 : 10,
        }));

        const infoBars = svg.selectAll('rect.info')
            .data(infoData);

        infoBars.enter()
            .append('rect')
            .attr('class', (d) => `info ${styles.info} ${styles[d.name]}`)
            .attr('height', (d) => height - d.margin - 5)
            .attr('x', (d) => x(d.value))
            .attr('y', (d) => d.margin + 5)
            .attr('fill', (d) => d.color);

        infoBars
            .attr('x', (d) => x(d.value))
            .attr('fill', (d) => d.color);

        infoBars.exit().remove();

        const infoText = svg.selectAll('text.info')
            .data(infoData);

        infoText.enter()
            .append('text')
            .attr('class', (d) => `info ${styles.info} ${styles[d.name]}`)
            .attr('x', (d) => x(d.value))
            .attr('y', (d) => d.margin)
            .attr('fill', (d) => d.color)
            .text((d) => d.name)
            .attr('text-anchor', "middle");

        infoText
            .attr('x', (d) => x(d.value))
            .attr('y', (d) => d.margin)
            .text((d) => d.name)
            .attr('text-anchor', "middle");

        infoText.exit().remove();
    };

    useEffect(() => {
        if (!svg) {
            create();
        }

        if (data && svg) {
            if (Object.keys(data).length > 0) draw(data, min_max_mean);
        }
    }, [data, svg, min_max_mean]);

    return (
        <div ref={domRef} className={styles.Container}>
            <svg
                height={fullHeight}
                width={fullWidth}
            >
                <g
                    transform={`translate(${margin.left} , ${margin.top})`}
                >
                    <g
                        className="axisBottom"
                        transform={`translate(0 , ${height})`}
                    />
                </g>
                <text className={styles.AxisBottomLabel} x={fullWidth / 2} y={fullHeight - 2}>{name}</text>
            </svg>
        </div>
    );
};

export default Histogram;
