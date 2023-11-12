import React, { useEffect, useState, useRef } from 'react';

// import clsx from 'clsx';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { min, max, bin } from 'd3-array';

import styles from './Histogram.module.scss';
import { COLORS, GRAPH_HEIGHT, GRAPH_WIDTH } from '../utilities/variables';
import { formatNumber } from '../utilities/format';

const ScatterPlot = ({ data, xAxis, yAxis, forcedHeight = false, forcedWidth = false }) => {
    const domRef = useRef();
    const [svg, setSvg] = useState(null);

    const margin = {
        top: 5, right: 10, bottom: 30, left: yAxis ? 40 : 30,
    };
    const fullWidth = forcedWidth || GRAPH_WIDTH;
    const fullHeight = forcedHeight || GRAPH_HEIGHT;
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
        setSvg(svgElem);
    };

    const draw = (info) => {
        const axisNames = Object.keys(info[0]).filter((key) => key !== 'Cluster');
        x.domain([min(info, (d) => d[axisNames[0]]), max(info, (d) => d[axisNames[0]])]);
        if (axisNames.length > 1) {
            y.domain([min(info, (d) => d[axisNames[1]]), max(info, (d) => d[axisNames[1]])]);
            svg.select('.axisLeft').call(
                axisLeft(y).ticks(5)
            );
        } else {
            y.domain([-1, 2]);
        }
        svg.select('.axisBottom').call(
            axisBottom(x).ticks(8)
        );

        // categorical 8 color scale
        const color = scaleOrdinal()
            .range(["#903900", "#0e3724", "#33b983", "#1077f3", "#bf8cfc", "#f98517", "#e83326", "#551153"]);

        const getYPosition = (d) => {
            if (axisNames.length > 1) {
                return y(d[axisNames[1]]);
            } else {
                return y(Math.random());
            }
        }

        // append the bar rectangles to the svg element
        const circles = svg.selectAll('circle.histogram').data(info);

        circles.enter()
            .append('circle')
            .classed('histogram', true)
            .attr('cx', (d) => x(d[axisNames[0]]))
            .attr('cy', (d) => getYPosition(d))
            .attr('r', 4)
            .attr('opacity', 0.7)
            .attr('fill', (d) => color(d.Cluster))

        circles
            .attr('cx', (d) => x(d[axisNames[0]]))
            .attr('cy', (d) => getYPosition(d))
            .attr('r', 4)
            .attr('opacity', 0.7)
            .attr('fill', (d) => color(d.Cluster))

        circles.exit().remove();

    };

    useEffect(() => {
        if (!svg) {
            create();
        }

        if (data && svg) {
            if (Object.keys(data).length > 0) draw(data);
        }
    }, [data, svg]);

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
                    <g
                        className="axisLeft"
                    />
                </g>
                <text className={styles.AxisBottomLabel} x={fullWidth / 2} y={fullHeight - 2}>{xAxis}</text>
                <text className={styles.AxisBottomLabel} x={-fullHeight / 2} y={10}>{yAxis}</text>
            </svg>
        </div>
    );
};

export default ScatterPlot;
