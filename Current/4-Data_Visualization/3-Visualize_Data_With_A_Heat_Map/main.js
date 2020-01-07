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

    let baseTemperature;

    const testText = document.getElementById('test-text');
    const colorBox = document.getElementById('test-color-box');

    const padding = 40;
    const heatMap = document.getElementById('heatMap');
    const jsonURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    const color = d3.scaleLinear()
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .range([
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
            '#9E0023'  // 10
        ]);

    

    let xhr = new XMLHttpRequest();
    xhr.open('GET', jsonURL);
    xhr.send();
    xhr.onload = function (d) {
        let json = JSON.parse(d.currentTarget.responseText);
        baseTemperature = json.baseTemperature;
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
    
        const minYear = d3.min(data.monthlyVariance, (d) => {
            return d.year;
        });
    
        const maxYear = d3.max(data.monthlyVariance, (d) => {
            return d.year;
        });

        const yearsArray = [];

        data.monthlyVariance.forEach(element => {
            yearsArray.push(element.year);
        });
    
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
    
        const yAxisCall = d3.axisLeft(y);
        const xAxisCall = d3.axisBottom(x)
            .tickValues([1, 2, 3, 4]);
    
        yAxisGroup.call(yAxisCall);
        xAxisGroup.call(xAxisCall);
    
        // Heading Title
        svg.append('text')
            .attr('id', 'title')
            .attr('x', () => {
                return width / 4;
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
                return width / 4;
            })
            .attr('y', () => {
                return padding * 1.5;
            })
            .text('1753 - 2015: base temperature 8.66°C');

    
        // need an x and y axis
        // need titles
        // need a legend
    
        // const legend = svg.select('div')
        // .data(color)
        // .enter()
        // .append('div')
        // .style('fill', (d)=>{
        //     console.log('d:', d);
        //     return d;
        // });
    
        //left y axis
        //tick values
        //tick format
        //tick size?
        //tick padding?
    
        // const yScale = d3.scaleOrdinal() //figure out how to space out y axis ticks
        // .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        // .range([0, svgMeasurement.height]);
    
        // const yAxis = d3.axisLeft()
        // .scale(yScale)
        // .tickValues(yScale.domain())
        // .tickFormat(function(d){
        //     let delta = new Date();
        //     delta.setUTCMonth(d);
        //     return d3.utcFormat("%B")(delta);
        // });
    
        // svg.append('g')
        // .call(yAxis)
        // .attr('transform', 'translate(' + padding + ', ' + padding + ')');
    
    
    
    
    
    }

}); //end of doc ready
