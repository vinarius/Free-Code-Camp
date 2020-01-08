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

    function calculateNewTemperature(base, variance) {
        return base + variance;
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
            .domain(data.monthlyVariance.map(variance => variance.year).filter(year => year % 10 === 0))
            .rangeRound([0, width]);

        const y = d3.scaleBand()
            .domain(months)
            .rangeRound([0, height]);

        const yAxisCall = d3.axisLeft(y);
        const xAxisCall = d3.axisBottom(x);

        yAxisGroup.call(yAxisCall);
        xAxisGroup.call(xAxisCall);

        // Heading Title
        svg.append('text')
            .attr('id', 'title')
            .attr('x', () => {
                return width / 5;
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
                return width / 5;
            })
            .attr('y', () => {
                return padding * 1.5;
            })
            .text('1753 - 2015: base temperature 8.66°C');


        // draw out the map
        // draw out the legend

        // heat map




        // legend
        const legendSize = {
            height: 40,
            width: 225
        };

        // const legend = svg.append('g')
        //     .attr('y', 30)
        //     .append('g')
        //     .attr('height', legendSize.height)
        //     .attr('width', legendSize.width)
        //     .attr('x', function(){
        //         return _parent.clientWidth - legendSize.width - 7.5;
        //     })
        //     .attr('x', 100)
        //     .attr('y', 100)
        // .attr('fill', function(){
        //     return color(Math.floor(Math.random() * 10))
        // });

        const lowestTemp = d3.min(data.monthlyVariance, function (d) {
            return data.baseTemperature + d.variance;
        });

        const highestTemp = d3.max(data.monthlyVariance, function (d) {
            return data.baseTemperature + d.variance;
        });

        const xAxisGroupLegend = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(${_parent.clientWidth - legendSize.width - 7.5}, ${30})`);

        const xLegend = d3.scaleLinear()
            .domain([lowestTemp, highestTemp])
            .range([0, legendSize.width]);

        const legendTicks = d3.scaleThreshold()
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

        xAxisGroupLegend.call(
            d3.axisBottom(xLegend)
            .tickValues(legendTicks.domain())
            .tickFormat(d3.format(".1f"))
            .tickSizeOuter(0)
        );

        xAxisGroupLegend.selectAll('g')
            .data(colorArray)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                // return (legendSize.width / colorArray.length) * d;
                return 10 * d;
            })
            .attr('fill', function (d) {
                return color(d);
            });




        // let counter = 0;
        // setInterval(() => {
        //     counter++;
        //     const randomNumber = Math.floor(Math.random() * 10);
        //     testText.innerHTML = 'The text is ' + randomNumber + ' ' + 'counter: ' + counter;
        //     colorBox.style.backgroundColor = color(randomNumber);
        // }, 500);


    }

}); //end of doc ready
