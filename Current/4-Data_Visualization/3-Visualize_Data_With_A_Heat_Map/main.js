window.addEventListener('DOMContentLoaded', ()=>{
    
    const svgMeasurement = {
        height: 0,
        width: 0
    };
    const padding = 40;
    const heatMap = document.getElementById('heatMap');
    const jsonURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    // const colorScheme = d3.scaleOrdinal(d3.schemeBlues[11]);
    const color = d3.scaleThreshold()
    .domain([0, 10])
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
    xhr.onload = function(d){
        let json = JSON.parse(d.currentTarget.responseText);
        console.log('json fetched:', json);
        createHeatMap(json, heatMap);
    };

    function setDimensions(_parent){
        let parent = _parent;
        svgMeasurement.height = parent.clientHeight;
        svgMeasurement.width = parent.clientWidth;
        console.log(svgMeasurement);
    }

    function createHeatMap(_data, _parent){
        setDimensions(_parent);
        let data = _data;

        const svg = d3.select(_parent)
        .append('svg')
        .attr('width', svgMeasurement.width)
        .attr('height', svgMeasurement.height);

        const headingTitle = svg.append('text')
        .attr('id', 'title')
        .attr('x', ()=>{
            return svgMeasurement.width / 4;
        })
        .attr('text-anchor', 'center')
        .attr('y', ()=>{
            return padding;
        })
        .text('Monthly Global Land-Surface Temperature');

        const headingDescription = svg.append('text')
        .attr('id', 'description')
        .attr('x', ()=>{
            return svgMeasurement.width / 4;
        })
        .attr('y', ()=>{
            return padding * 1.5;
        })
        .text('1753 - 2015: base temperature 8.66°C');


        // need an x and y axis
        // need titles
        // need a legend

        const legend = svg.select('div')
        .data(colorScheme)
        .enter()
        .append('div')
        .style('fill', (d)=>{
            console.log('d:', d);
            return d;
        });



    }



}); //end of doc ready