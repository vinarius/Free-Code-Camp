window.addEventListener('DOMContentLoaded', () => {

    let height = 0;
    let width = 0;

    const margin = {
        top: 50,
        right: 20,
        bottom: 100,
        left: 80
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const testText = document.getElementById('test-text');
    const colorBox = document.getElementById('test-color-box');
    const colorArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const colorTextArray = [
        '#343797', // 0
        '#4D76B6', // 1
        '#7CADD2', // 2
        '#B0D9EA', // 3
        '#E2F3F8', // 4
        '#FEFFBC', // 5
        '#FBDF8B', // 6
        '#F6AD5A', // 7
        '#EB6C3C', // 8
        '#CE2D1F', // 9
        '#9E0023' // 10
    ];
    const padding = 40;
    const heatMap = document.getElementById('heatMap');
    const jsonURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    const color = d3.scaleLinear()
        .domain(colorArray)
        .range(colorTextArray);

    let xhr = new XMLHttpRequest();
    xhr.open('GET', jsonURL);
    xhr.send();
    xhr.onload = function (d) {
        let json = JSON.parse(d.currentTarget.responseText);
        createHeatMap(json, heatMap);
    };


    function convertNumberToMonth(int) {
        switch (int) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";
            default:
                return;
        }
    }

    function setDimensions(_parent) {
        let parent = _parent;
        height = parent.clientHeight - margin.top - margin.bottom;
        width = parent.clientWidth - margin.left - margin.right;
        margin.top = parent.clientHeight / 6;
        margin.right = parent.clientWidth / 10;
        margin.bottom = (parent.clientHeight / 6) + 25;
    }

    function createHeatMap(_data, _parent) {
        setDimensions(_parent);
        let data = JSON.parse(JSON.stringify(_data));

        console.log(data);

        const svg = d3.select(_parent)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        const xAxisGroup = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(${margin.left}, ${height + margin.top})`);

        const yAxisGroup = svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        const x = d3.scaleBand()
            .domain(data.monthlyVariance.map(variance => variance.year))
            .rangeRound([0, width]);

        const y = d3.scaleBand()
            .domain(months)
            .rangeRound([0, height]);

        const yAxisCall = d3.axisLeft(y)
            .tickSizeOuter(0);
        const xAxisCall = d3.axisBottom(x)
            .tickValues(x.domain().filter(year => year % 10 === 0))
            .tickSizeOuter(0);

        yAxisGroup.call(yAxisCall);
        xAxisGroup.call(xAxisCall);

        // Heading Title
        svg.append('text')
            .attr('id', 'title')
            .attr('x', () => {
                return width / 9;
            })
            .attr('text-anchor', 'center')
            .attr('y', () => {
                return padding;
            })
            .text('Monthly Global Land-Surface Temperature');

        // Heading Description
        svg.append('text')
            .attr('id', 'description')
            .attr('x', () => {
                return width / 9;
            })
            .attr('y', () => {
                return padding * 1.5;
            })
            .text('1753 - 2015: base temperature 8.66°C');

        // legend
        const legendSize = {
            height: 55,
            width: 275
        };

        const lowestTemp = d3.min(data.monthlyVariance, function (d) {
            return data.baseTemperature + d.variance;
        });

        const highestTemp = d3.max(data.monthlyVariance, function (d) {
            return data.baseTemperature + d.variance;
        });

        const xAxisGroupLegend = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(${_parent.clientWidth - legendSize.width - 10}, ${legendSize.height / 1.15})`);

        const xLegend = d3.scaleLinear()
            .domain([lowestTemp, highestTemp])
            .range([0, legendSize.width]);

        const legendThreshold = d3.scaleThreshold()
            .domain((function (min, max, count) {
                const result = [];
                const step = (max - min) / count;
                for (let i = 1; i < count; i++) {
                    let tickMark = (min + step * i);
                    tickMark = tickMark.toFixed(2);
                    result.push(+tickMark);
                }
                return result;
            })(lowestTemp, highestTemp, colorArray.length))
            .range(colorTextArray);

        // domain
        // 0: 2.79
        // 1: 3.9
        // 2: 5.01
        // 3: 6.12
        // 4: 7.23
        // 5: 8.34
        // 6: 9.45
        // 7: 10.56
        // 8: 11.67
        // 9: 12.78

        xAxisGroupLegend.call(
            d3.axisBottom(xLegend)
                .tickValues(legendThreshold.domain())
                .tickFormat(d3.format(".1f"))
                .tickSizeOuter(0)
        );

        xAxisGroupLegend.selectAll('rect')
            .data(colorTextArray.map((colorString) => {
                let d = legendThreshold.invertExtent(colorString);
                if (!d[0]) d[0] = lowestTemp;
                if (!d[1]) d[1] = highestTemp;
                return d;
            }))
            .enter()
            .append('rect')
            .attr('height', legendSize.height / 2)
            .attr('width', function (d) {
                return xLegend(d[1]) - xLegend(d[0]);
            })
            .attr('x', function (d, i) {
                return xLegend(d[0]);
            })
            .attr('y', function (d) {
                return -(legendSize.height / 2);
            })
            .style('fill', function (d, i) {
                return color(i);
            });

        const earliestYear = d3.min(data.monthlyVariance, (d) => {
            return d.year;
        });

        const latestYear = d3.max(data.monthlyVariance, (d) => {
            return d.year;
        });

        const yearAverage = (latestYear - earliestYear) / data.monthlyVariance.length;
        console.log(data.monthlyVariance.length);

        // heat map
        svg.selectAll('rect')
            .data(data.monthlyVariance)
            .enter()
            .append('rect')
            .attr('x', (d) => {
                return x(d.year);
            })
            .attr('y', (d) => {
                const month = convertNumberToMonth(d.month);
                return y(month);
            })
            .attr('width', (d) => {
                return x.bandwidth();
            })
            .attr('height', (d) => {
                return y.bandwidth();
            })
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .style('fill', function (d) {
                return legendThreshold(d.variance + data.baseTemperature);
            });

    }

}); //end of doc ready
