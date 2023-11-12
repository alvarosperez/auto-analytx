import React, { useEffect, useState, useRef } from 'react';

// import clsx from 'clsx';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { min, max, bin } from 'd3-array';

import styles from './Histogram.module.scss';
import { COLORS, GRAPH_HEIGHT, GRAPH_WIDTH } from '../utilities/variables';
import { formatNumber } from '../utilities/format';

const Correlation = ({ data, name, forcedHeight = false, colorCategories = false, selectedCategory = undefined }) => {
    const domRef = useRef();
    const [svg, setSvg] = useState(null);

    const margin = {
        top: 20, right: 70, bottom: 70, left: 0,
    };
    const fullWidth = GRAPH_WIDTH;
    const fullHeight = forcedHeight || GRAPH_HEIGHT;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;
    const x = scaleBand()
        .range([0, width])
        .padding(0.03);
    // Y axis: scale and draw:
    const y = scaleBand()
        .range([height, 0])
        .padding(0.03);
    const xR = scaleBand()
        .range([width, 0])
        .padding(0.03);


    const create = () => {
        const svgElem = select(domRef.current).select('svg > g');
        setSvg(svgElem);
    };

    // linear scale from blue to white to red
    const color = scaleLinear()
        .domain([-1, 0, 1])
        .range(['#1077f3', '#ffffff', '#e83326']);

    const draw = (info) => {
        const variables = Object.keys(info);
        const value_list = [];
        for (let i = 0; i < variables.length; i++) {
            for (let j = 0; j < variables.length; j++) {
                value_list.push([variables[i], variables[j], info[variables[i]][variables[j]]]);
            }
        }

        xR.domain(variables);
        x.domain(variables);
        y.domain(variables);

        console.log(value_list);

        // append the bar rectangles to the svg element
        const bars = svg.selectAll('rect.histogram').data(value_list);

        bars.enter()
            .append('rect')
            .classed('histogram', true)
            .attr('x', (d) => xR(d[0]))
            .attr('width', x.bandwidth())
            .attr('y', (d) => y(d[1]) - y.bandwidth() / 2)
            .attr('height', y.bandwidth())
            .attr('fill', (d) => color(d[2]))
            ;

        bars
            .attr('x', (d) => xR(d[0]))
            .attr('width', x.bandwidth())
            .attr('y', (d) => y(d[1]) - y.bandwidth() / 2)
            .attr('height', y.bandwidth())
            .attr('fill', (d) => color(d[2]))
            ;

        bars.exit().remove();

        // append the bar rectangles to the svg element
        const texts = svg.selectAll('text.left').data(variables);

        texts.enter()
            .append('text')
            .classed(styles.info, true)
            .classed('left', true)
            .attr('x', width)
            .attr('y', (d) => y(d))
            .text(d => d);

        texts
            .attr('x', width + 5)
            .attr('y', (d) => y(d) + 4)
            .text(d => d);

        texts.exit().remove();

        // append the bar rectangles to the svg element
        const vTexts = svg.selectAll('text.bottom').data(variables);

        vTexts.enter()
            .append('text')
            .classed(styles.info, true)
            .classed('bottom', true)
            .attr('x', -margin.left)
            .attr('y', (d) => x(d))
            .text(d => d)
            .attr('transform', `rotate(+90) translate(${width / 2 + margin.bottom}, ${-(width - margin.top)})`);

        vTexts
            .attr('x', -margin.left)
            .attr('y', (d) => x(d))
            .text(d => d)
            .attr('transform', `rotate(+90) translate(${width / 2 + margin.bottom / 2 + 20}, ${-(width - margin.top)})`);

        vTexts.exit().remove();

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
                </g>
            </svg>
        </div>
    );
};

export default Correlation;
