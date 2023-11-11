import React, { useEffect, useState, useRef } from 'react';

// import clsx from 'clsx';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { min, max, bin } from 'd3-array';

import styles from './Histogram.module.scss';
import { COLORS, GRAPH_HEIGHT, GRAPH_WIDTH } from '../utilities/variables';
import { formatNumber } from '../utilities/format';

const BarChart = ({ data, name, forcedHeight = false, colorCategories = false }) => {
    const domRef = useRef();
    const [svg, setSvg] = useState(null);

    const margin = {
        top: 20, right: 10, bottom: 32, left: 10,
    };
    const fullWidth = GRAPH_WIDTH;
    const fullHeight = forcedHeight || GRAPH_HEIGHT;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;
    const x = scaleBand()
        .range([0, width])
        .padding(0.03);
    // Y axis: scale and draw:
    const y = scaleLinear()
        .range([height - 5, 0]);

    const create = () => {
        const svgElem = select(domRef.current).select('svg > g');
        svgElem.select('g.axisBottom')
            .call(
                axisBottom(x).ticks(5).tickFormat((d) => `${Math.floor(d / 1000)}k`),
            );

        setSvg(svgElem);
    };

    const draw = (info) => {
        const categories = Object.keys(info);

        x.domain(categories);
        svg.select('.axisBottom').call(
            axisBottom(x)
        );
        y.domain([0, max(Object.values(info)) * 1.05]);

        // append the bar rectangles to the svg element
        const bars = svg.selectAll('rect.histogram').data(categories);

        bars.enter()
            .append('rect')
            .classed(styles.histogram, true)
            .classed(styles.evenOdd, colorCategories)
            .classed('histogram', true)
            .attr('x', (d) => x(d))
            .attr('width', x.bandwidth())
            .attr('y', (d) => y(info[d]))
            .attr('height', (d) => height - y(info[d]));

        bars
            .attr('x', (d) => x(d))
            .attr('width', x.bandwidth())
            .attr('y', (d) => y(info[d]))
            .attr('height', (d) => height - y(info[d]));

        bars.exit().remove();

        // append the bar rectangles to the svg element
        const texts = svg.selectAll('text.histogram').data(categories);

        texts.enter()
            .append('text')
            .classed(styles.info, true)
            .classed(styles.middle, true)
            .classed('histogram', true)
            .attr('x', (d) => x(d) + x.bandwidth() / 2)
            .attr('y', (d) => y(info[d]) - 3)
            .text(d => formatNumber(info[d]));

        texts
            .attr('x', (d) => x(d) + x.bandwidth() / 2)
            .attr('y', (d) => y(info[d]) - 3)
            .attr('height', (d) => height - y(info[d]))
            .text(d => formatNumber(info[d]));

        texts.exit().remove();
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
                </g>
                <text className={styles.AxisBottomLabel} x={fullWidth / 2} y={fullHeight - 2}>{name}</text>
            </svg>
        </div>
    );
};

export default BarChart;
