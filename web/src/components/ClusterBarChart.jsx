import React, { useEffect, useState, useRef } from 'react';

// import clsx from 'clsx';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { min, max, bin } from 'd3-array';

import styles from './Histogram.module.scss';
import { COLORS, GRAPH_HEIGHT, GRAPH_WIDTH } from '../utilities/variables';
import { formatNumber } from '../utilities/format';

const ClusterBarChart = ({ data, name, forcedHeight = false, forcedWidth = false, colorCategories = false, selectedCategory = undefined }) => {
    const domRef = useRef();
    const [svg, setSvg] = useState(null);

    const margin = {
        top: 20, right: 60, bottom: 20, left: 10,
    };
    const fullWidth = forcedWidth || GRAPH_WIDTH;
    const fullHeight = forcedHeight || GRAPH_HEIGHT;
    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;
    const x = scaleBand()
        .range([0, width])
        .padding(0.1);
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
        const subcategories = Object.keys(info[categories[0]]);
        const cat_subcat_list = [];
        for (let i = 0; i < categories.length; i++) {
            for (let j = 0; j < subcategories.length; j++) {
                cat_subcat_list.push([categories[i], subcategories[j], info[categories[i]][subcategories[j]]]);
            }
        }

        x.domain(categories);
        svg.select('.axisBottom').call(
            axisBottom(x)
        );
        y.domain([0, 1.1]);

        // append the bar rectangles to the svg element
        const bars = svg.selectAll('rect.histogram').data(cat_subcat_list);

        bars.enter()
            .append('rect')
            .classed('histogram', true)
            .attr('x', (d) => x(d[0]) + (x.bandwidth() / subcategories.length) * subcategories.indexOf(d[1]))
            .attr('width', x.bandwidth() / subcategories.length - 1)
            .attr('y', (d) => y(d[2]))
            .attr('height', (d) => height - y(d[2]))
            .attr('fill', (d) => COLORS[d[1]])
            ;

        bars
            .attr('x', (d) => x(d[0]) + (x.bandwidth() / subcategories.length) * subcategories.indexOf(d[1]))
            .attr('width', x.bandwidth() / subcategories.length - 1)
            .attr('y', (d) => y(d[2]))
            .attr('height', (d) => height - y(d[2]))
            .attr('fill', (d) => COLORS[d[1]])
            ;

        bars.exit().remove();

        // append the bar rectangles to the svg element
        const texts = svg.selectAll('text.histogram').data(categories.filter((d) => d === selectedCategory));

        texts.enter()
            .append('text')
            .classed(styles.info, true)
            .classed(styles.middle, true)
            .classed('histogram', true)
            .attr('x', (d) => x(d) + x.bandwidth() / 2)
            .attr('y', 10)
            .text('Mejor');

        texts
            .attr('x', (d) => x(d) + x.bandwidth() / 2)
            .attr('y', 10)
            .text('Mejor');

        texts.exit().remove();

        const legends = svg.selectAll('rect.legend').data(subcategories);

        legends.enter()
            .append('rect')
            .classed('legend', true)
            .attr('x', fullWidth - 70)
            .attr('y', (d, i) => height / 2 + i * 15)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', (d) => COLORS[d]);

        legends
            .attr('x', fullWidth - 70)
            .attr('y', (d, i) => height / 2 + i * 15)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', (d) => COLORS[d]);

        const legendsText = svg.selectAll('text.legend').data(subcategories);

        legendsText.enter()
            .append('text')
            .classed('legend', true)
            .classed(styles.legend, true)
            .attr('x', fullWidth - 58)
            .attr('y', (d, i) => height / 2 + 8 + i * 15)
            .text((d) => d);

        legendsText
            .attr('x', fullWidth - 58)
            .attr('y', (d, i) => height / 2 + 8 + i * 15)
            .text((d) => d);
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

export default ClusterBarChart;
