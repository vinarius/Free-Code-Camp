window.addEventListener("DOMContentLoaded", function(){
    
    const h = 550;
    const w = 900;
    const padding = 20;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    xhr.send();
    xhr.onload=function(){
        var json = JSON.parse(xhr.responseText);
        console.log(json.data);
    }

    // const xScale = d3.scaleLinear()
    //                 .domain([0])
    //                 .range([]);

    // const yScale = d3.scaleLinear()
    //                 .domain([])
    //                 .range([]);

    const svg = d3.select("main")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "customMt-5 customMb-5")
        .attr("id", "bar-chart-svg-js");

});//end of doc ready