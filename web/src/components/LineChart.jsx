import React, { useEffect, useState, useRef } from 'react';

// import clsx from 'clsx';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { line } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { min, max, bin } from 'd3-array';

import styles from './Histogram.module.scss';
import { COLORS, GRAPH_HEIGHT, GRAPH_WIDTH } from '../utilities/variables';
import { formatNumber } from '../utilities/format';

const LineChart = ({ data, name, forcedHeight = false, forcedWidth = false }) => {
    const domRef = useRef();
    const [svg, setSvg] = useState(null);

    const margin = {
        top: 20, right: 20, bottom: 20, left: 30,
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
        svgElem.select('.axisLeft').call(
            axisLeft(x).ticks(0)
        );
        svgElem.select('.axisBottom').call(
            axisBottom(x).ticks(0)
        );
        setSvg(svgElem);
    };

    const draw = (info) => {
        x.domain([min(info.range) - 1, max(info.range) + 1]);
        y.domain([min(info.scores) - 0.1, max(info.scores) * 1.1]);

        svg.select('.axisLeft').call(
            axisLeft(y).ticks(5)
        );
        svg.select('.axisBottom').call(
            axisBottom(x).ticks(info.scores.length)
        );

        // define a line
        const valueline = line()
            .x((d) => x(d))
            .y((d, i) => y(info.scores[i]));

        const linea = svg.selectAll('path.histogram').data([0]);
        linea.enter()
            .append("path")
            .classed('histogram', true)
            .attr("d", valueline(info.range))
            .attr("stroke", "#c9c9c9")
            .attr("stroke-width", 1)
            .attr("fill", "none");

        linea
            .attr("d", valueline(info.range))
            .attr("stroke", "#c9c9c9")
            .attr("stroke-width", 1)
            .attr("fill", "none");

        linea.exit().remove();

        // append the bar rectangles to the svg element
        const circles = svg.selectAll('circle.histogram').data(info.range);

        circles.enter()
            .append('circle')
            .classed('histogram', true)
            .attr('cx', (d) => x(d))
            .attr('cy', (d, i) => y(info.scores[i]))
            .attr('r', 4)
            .attr('opacity', 0.7)
            .attr('fill', (d, i) => (d === info.cluster_no) ? "#a64dff" : "#551153" );

        circles
            .attr('cx', (d) => x(d))
            .attr('cy', (d, i) => y(info.scores[i]))
            .attr('r', 4)
            .attr('opacity', 0.7)
            .attr('fill', (d, i) => (d === info.cluster_no) ? "#a64dff" : "#551153" );

        circles.exit().remove();

        const bar = svg.selectAll('rect.histogram').data([info.cluster_no]);

        bar.enter()
            .append('rect')
            .classed('histogram', true)
            .attr('x', x(info.cluster_no) - 0.5)
            .attr('y', y(info.best))
            .attr('height', height - y(info.best))
            .attr('width', 1)
            .attr('fill', "#a64dff");

        bar
            .classed('histogram', true)
            .attr('x', x(info.cluster_no) - 0.5)
            .attr('y', y(info.best))
            .attr('height', height - y(info.best))
            .attr('width', 1)
            .attr('fill', "#a64dff");

        bar.exit().remove();
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
                <text className={styles.AxisBottomLabel} x={fullWidth / 2} y={fullHeight - 2}>{name}</text>
            </svg>
        </div>
    );
};

export default LineChart;
