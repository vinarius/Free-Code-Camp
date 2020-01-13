window.addEventListener('DOMContentLoaded', () => {

    const svgDimensions = {
        measurements: {
            height: 0,
            width: 0,
        },
        margin: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
        }
    };

    const choroplethDOM = document.getElementById('choroplethMap');

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json');
    xhr.send();
    xhr.onload = function (data) {
        const json = JSON.parse(data.currentTarget.responseText);
        createChoroplethMap(json, choroplethDOM);
    }

    function createChoroplethMap(data, parent) {
        console.log(data);
        svgDimensions.measurements = setDimensions(parent);

        // Reset choropleth div for animation additions.
        const childNodes = d3.select(parent).node().children;
        for(let i=0; i<childNodes.length; i++) {
            childNodes[i].remove();
            i--;
        }

        const svg = d3.select(parent)
            .append('svg')
            .attr('height', `${svgDimensions.measurements.height + svgDimensions.margin.top + svgDimensions.margin.bottom}`)
            .attr('width', `${svgDimensions.measurements.width + svgDimensions.margin.right + svgDimensions.margin.left}`)

        

        console.log(d3.polygonArea([
            [-1, 415.44],
            [146.93, 304.47],
            [195.45, 152.13],
            [-1, 134.64]
          ]));














    }

    function setDimensions(parent) {
        return {
            height: parent.clientHeight - svgDimensions.margin.top - svgDimensions.margin.bottom,
            width: parent.clientWidth - svgDimensions.margin.left - svgDimensions.margin.right
        };
    }
});