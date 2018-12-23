window.addEventListener('DOMContentLoaded', ()=>{
    
    let svgMeasurement = {
        height: 0,
        width: 0
    },
        tooltip = {
            width: 0,
            height: 0
        },
        dataPoint = {
            radius: 0
        };

    const padding = 90,
        margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        colors = {
            orange: '#F67E00',
            blue: '#3378B6'
        },
        svg = document.getElementById('scatterplot');

    // setup xhr to fetch json
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
    xhr.send();
    xhr.onload = function(){
        let json = JSON.parse(xhr.responseText);
        console.log('json data:', json);
        createScatterplot(svg, json);
    }

    function setDimensions(dom, data){
        svgMeasurement.height = d3.select(dom).node().clientHeight;
        svgMeasurement.width = d3.select(dom).node().clientWidth;
    }

    function createScatterplot(dom, data){
        setDimensions(dom, data);

        const svg = d3.select('#scatterplot')
            .append('svg')
            .attr('width', svgMeasurement.width)
            .attr('height', svgMeasurement.height);

        const svgTitle = svg.append('text')
            .attr('id', 'title')
            .attr('x', (svgMeasurement.width / 2))
            .attr('y', padding)
            .attr('text-anchor', 'middle')
            .text('Doping in Professional Bicycle Racing');

        const svgSubTitle = svg.append('text')
            .attr('id', 'subtitle')
            .attr('x', (svgMeasurement.width / 2))
            .attr('y', padding)
            .attr('dy', '1.25em')
            .attr('text-anchor', 'middle')
            .text("35 Fastest times up Alpe d'Huez");

        const svgYAxisTitle = svg.append('text')
            .attr('id', 'svgYAxisTitle')
            .attr('x', -(svgMeasurement.width / 4))
            .attr('y', (svgMeasurement.height / 15))
            .attr('text-anchor', 'start')
            .attr('transform', 'rotate(-90)')
            .text('Time in Minutes');

        let dataset = data;
        let minYear = d3.min(dataset, (d)=>{
            return d['Year'];
        });
        let maxYear = d3.max(dataset, (d)=>{
            return d['Year'];
        });
        

        //years on x axis
        const xScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([padding, (svgMeasurement.width - padding)]);

        const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));

        //times on y axis - longer times at bottom, shorter times at top

        svg.append('g')
        .attr('transform', 'translate(0,' + (svgMeasurement.height - padding) + ')')
        .attr('id', 'x-axis')
        .call(xAxis);


    }

}); //end of doc ready