import { StockSymbolDay } from "../Stock/stock.types";
import * as d3 from "d3";

const movingAverage = (data: any[], numberOfPricePoints: number) => {
    return data.map((row, index, total) => {
        const start = Math.max(0, index - numberOfPricePoints);
        const end = index;
        const subset = total.slice(start, end + 1);
        const sum = subset.reduce((a, b) => {
            return a + b['close'];
        }, 0);

        return {
            date: row['date'],
            average: sum / subset.length
        };
    });
};

export const initialiseChart = ((data: Array<StockSymbolDay>) => {
    const margin = { top: 170, right: 100, bottom: 50, left: 50 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom - 250;

    const xMin = d3.min(data, (d: { [x: string]: any; }): number => d['date']);
    const xMax = d3.max(data, (d: { [x: string]: any; }): number => d['date']);
    const yMin = d3.min(data, (d: { [x: string]: any; }): number => d['close']);
    const yMax = d3.max(data, (d: { [x: string]: any; }): number => d['close']);

    const xScale = d3
        .scaleTime()
        .domain([xMin, xMax])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain([yMin - 5, yMax])
        .range([height, 0]);

    d3.select("svg").remove();

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('width', width + margin['left'] + margin['right'])
        .attr('height', height + margin['top'] + margin['bottom'])
        .append('g')
        .attr('transform', `translate(${margin['left']}, ${margin['top']})`);

    svg
        .append('g')
        .attr('id', 'xAxis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    svg
        .append('g')
        .attr('id', 'yAxis')
        .attr('transform', `translate(${width}, 0)`)
        .call(d3.axisRight(yScale));

    const line = d3
        .line<any>()
        .x((d) => xScale(d['date']))
        .y((d) => yScale(d['close']));

    const movingAverageLine = d3
        .line<any>()
        .x((d) => xScale(d['date']))
        .y((d) => yScale(d['average']))
        .curve(d3.curveBasis);

    // price line
    svg
        .append('path')
        .data([data]) 
        .style('fill', 'none')
        .attr('id', 'priceChart')
        .attr('stroke', '#e64a19')
        .attr('stroke-width', '2')
        .attr('d', line);

    const movingAverageData = movingAverage(data, 49);
    svg
        .append('path')
        .data([movingAverageData])
        .style('fill', 'none')
        .attr('id', 'movingAverageLine')
        .attr('stroke', '#cccccc')
        .attr('d', movingAverageLine);

    const focus = svg
        .append('g')
        .attr('class', 'focus')
        .style('display', 'none');

    focus.append('circle').attr('r', 4.5);
    focus.append('line').classed('x', true);
    focus.append('line').classed('y', true);

    svg
        .append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', () => focus.style('display', null))
        .on('mouseout', () => focus.style('display', 'none'))
        .on('mousemove', generateCross);

    d3.select('.overlay').style('fill', 'none');
    d3.select('.overlay').style('pointer-events', 'all');

    d3.selectAll('.focus line').style('fill', 'none');
    d3.selectAll('.focus line').style('stroke', '#cccccc');
    d3.selectAll('.focus line').style('stroke-width', '1.5px');
    d3.selectAll('.focus line').style('stroke-dasharray', '3 3');

    const bisectDate = d3.bisector((d: any) => d.date).left;

    function generateCross() {
        const correspondingDate = xScale.invert(d3.mouse(this)[0]);
        const i = bisectDate(data, correspondingDate, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const currentPoint =
            correspondingDate.getTime() - d0['date'].getTime() > d1['date'].getTime() - correspondingDate.getTime() ? d1 : d0;
        focus.attr(
            'transform',
            `translate(${xScale(currentPoint['date'])}, ${yScale(
                currentPoint['close']
            )})`
        );

        focus
            .select('line.x')
            .attr('x1', 0)
            .attr('x2', width - xScale(currentPoint['date']))
            .attr('y1', 0)
            .attr('y2', 0);

        focus
            .select('line.y')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height - yScale(currentPoint['close']));

        updateLegends(currentPoint);
    }

    const updateLegends = (currentData: StockSymbolDay) => {
        d3.selectAll('.lineLegend').remove();

        const legendKeys = Object.keys(data[0]);
        const lineLegend = svg
            .selectAll('.lineLegend')
            .data(legendKeys)
            .enter()
            .append('g')
            .attr('class', 'lineLegend')
            .attr('transform', (d, i) => `translate(0, ${i * -20 - 40})`);
        lineLegend
            .append('text')
            .text((d: string) => {
                if (d === 'date') {
                    return `${d}: ${currentData[d].toLocaleDateString()}`;
                } else if (
                    d === 'high' ||
                    d === 'low' ||
                    d === 'open' ||
                    d === 'close'
                ) {
                    return `${d}: ${currentData[d].toFixed(2)}`;
                } else if (d === 'volume') {
                    return `${d}: ${currentData[d]}`;
                }
            })
            .style('fill', '#222')
            .attr('transform', 'translate(15,9)');

        
    };

    // init legends
    svg.append("rect")
        .attr("width", 200)
        .attr("height", 140)
        .attr('class', 'legend-wrapper')
        .attr('transform', `translate(0, -157)`);

    const legendKeys = Object.keys(data[0]);
    const lineLegend = svg
        .selectAll('.lineLegend')
        .data(legendKeys)
        .enter()
        .append('g')
        .attr('class', 'lineLegend')
        .attr('transform', (d, i) => `translate(0, ${i * -20 - 40})`);
    lineLegend
        .append('text')
        .text((d: string) => {
            return `${d}: -`;
        })
        .style('fill', '#222')
        .attr('transform', 'translate(15,9)');

    // bottom volumes
    const volData = data.filter((d: StockSymbolDay) => d['volume'] !== null && d['volume'] !== 0);

    const yMinVolume = d3.min(volData, (d: StockSymbolDay) => Math.min(d['volume']));
    const yMaxVolume = d3.max(volData, (d: StockSymbolDay) => Math.max(d['volume']));

    const yVolumeScale = d3
        .scaleLinear()
        .domain([yMinVolume, yMaxVolume])
        .range([height, height * (3 / 4)]);

    svg
        .selectAll()
        .data(volData)
        .enter()
        .append('rect')
        .attr('x', (d: StockSymbolDay) => xScale(d['date']))
        .attr('y', (d: StockSymbolDay) => yVolumeScale(d['volume']))
        .attr('fill', (d: StockSymbolDay, i: number) => {
            if (i === 0) {
                return '#03a678';
            } else {
                return volData[i - 1].close > d.close ? '#c0392b' : '#03a678';
            }
        })
        .attr('width', 1)
        .attr('height', (d: StockSymbolDay) => height - yVolumeScale(d['volume']));
});
