window.addEventListener('DOMContentLoaded', () => {

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

    const tooltipDiv = d3.select('#scatterplot').append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    // setup xhr to fetch json
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
    xhr.send();
    xhr.onload = function () {
        let json = JSON.parse(xhr.responseText);
        console.log('json data:', json);
        createScatterplot(svg, json);
    }

    function setDimensions(dom, data) {
        svgMeasurement.height = d3.select(dom).node().clientHeight;
        svgMeasurement.width = d3.select(dom).node().clientWidth;
    }

    function createScatterplot(dom, data) {
        setDimensions(dom, data);

        const svg = d3.select('#scatterplot')
            .append('svg')
            .attr('width', svgMeasurement.width)
            .attr('height', svgMeasurement.height);

        const svgTitle = svg.append('text')
            .attr('id', 'title')
            .attr('x', (svgMeasurement.width / 2))
            .attr('y', (padding / 2))
            .attr('text-anchor', 'middle')
            .text('Doping in Professional Bicycle Racing');

        const svgSubTitle = svg.append('text')
            .attr('id', 'subtitle')
            .attr('x', (svgMeasurement.width / 2))
            .attr('y', (padding / 2))
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
        const colorData = [{
                'doping': true,
                'color': 'blue'
            },
            {
                'doping': false,
                'color': 'red'
            }
        ];

        dataset.forEach(d => {
            let splitTime = d.Time.split(':');
            d.Time = new Date(1970, 0, 1, 0, splitTime[0], splitTime[1]);
        });

        let minYear = d3.min(dataset, (d) => {
            return d['Year'];
        });
        let maxYear = d3.max(dataset, (d) => {
            return d['Year'];
        });


        //years on x axis
        const xScale = d3.scaleLinear()
            .domain([minYear - 1, maxYear + 1])
            .range([padding, (svgMeasurement.width - padding)]);

        const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));

        //times on y axis - longer times at bottom, shorter times at top
        const yAxisTimeFormat = d3.timeFormat('%M:%S');
        const yScale = d3.scaleTime().domain(d3.extent(dataset, (d) => {
                return d.Time;
            }))
            .range([padding, (svgMeasurement.height - padding)]);

        const yAxis = d3.axisLeft(yScale).tickFormat(yAxisTimeFormat);

        svg.append('g')
            .attr('transform', 'translate(0,' + (svgMeasurement.height - padding) + ')')
            .attr('id', 'x-axis')
            .call(xAxis);

        svg.append('g')
            .attr('transform', 'translate(' + padding + ')')
            .attr('id', 'y-axis')
            .call(yAxis);

        //append the dots according to the data
        svg.selectAll('.dataPoint')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('r', 5)
            .attr('cx', (d) => {
                return xScale(d.Year);
            })
            .attr('cy', (d) => {
                return yScale(d.Time);
            })
            .attr('data-xvalue', (d) => {
                return d.Year;
            })
            .attr('data-yvalue', (d) => {
                return d.Time.toISOString();
            })
            .style('fill', (d) => {
                if (d.Doping != '') {
                    return colorData[0].color;
                } else {
                    return colorData[1].color;
                }
            })
            .on('mouseover', (d) => {
                tooltipDiv.style('opacity', .9)
                    .attr('data-year', d.Year)
                    .html(
                        `${d.Name}: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${yAxisTimeFormat(d.Time)}<br/><br/>${d.Doping}`
                    )
                    .style('left', `${(d3.event.pageX + 25)}px`)
                    .style('top', `${(d3.event.pageY + 25)}px`);
            })
            .on('mouseout', (d) => {
                tooltipDiv.style('opacity', 0);
            });

        //legend
        const legend = svg.selectAll('.legend')
            .data(colorData)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('id', 'legend')
            .attr('transform', (d, i) => {
                return 'translate(0, ' + ((svgMeasurement.height / 3) + i * 25) + ')';
            });

        legend.append('rect')
            .attr('x', svgMeasurement.width - padding - 25)
            .attr('width', 20)
            .attr('height', 20)
            .style('fill', (d) => {
                if (d.doping) return colorData[0].color;
                else {
                    return colorData[1].color;
                }
            });

        legend.append('text')
            .attr('x', svgMeasurement.width - padding - 35)
            .attr('y', 10)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text((d) => {
                if (d.doping) return 'Riders with doping allegations';
                else {
                    return 'No doping allegations';
                }
            });




    }

}); //end of doc ready