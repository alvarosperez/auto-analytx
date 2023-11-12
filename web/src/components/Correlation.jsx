import React, { useEffect, useState, useRef } from 'react';

// import clsx from 'clsx';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisRight } from 'd3-axis';
import { min, max, bin } from 'd3-array';

import styles from './Histogram.module.scss';
import { COLORS, GRAPH_HEIGHT, GRAPH_WIDTH } from '../utilities/variables';
import { formatNumber } from '../utilities/format';

const Correlation = ({ data, name, forcedHeight = false, forcedWidth = false, colorCategories = false, selectedCategory = undefined }) => {
    const domRef = useRef();
    const [svg, setSvg] = useState(null);

    const margin = {
        top: 20, right: 100, bottom: 100, left: 20,
    };
    const fullWidth = forcedWidth || GRAPH_WIDTH;
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

        svg.select('.axisBottom').call(
            axisBottom(x)
        ).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")
            .style("text-transform", "uppercase")

        svg.select('.axisRight').call(
            axisRight(y)
        ).selectAll("text")
            .style("text-transform", "uppercase")

        // append the bar rectangles to the svg element
        const bars = svg.selectAll('rect.histogram').data(value_list);

        bars.enter()
            .append('rect')
            .classed('histogram', true)
            .attr('x', (d) => xR(d[0]))
            .attr('width', x.bandwidth())
            .attr('y', (d) => y(d[1]))
            .attr('height', y.bandwidth())
            .attr('fill', (d) => color(d[2]))
            ;

        bars
            .attr('x', (d) => xR(d[0]))
            .attr('width', x.bandwidth())
            .attr('y', (d) => y(d[1]))
            .attr('height', y.bandwidth())
            .attr('fill', (d) => color(d[2]))
            ;

        bars.exit().remove();
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
                        className="axisRight"
                        transform={`translate(${width} , 0)`}
                    />
                </g>
            </svg>
        </div>
    );
};

export default Correlation;
