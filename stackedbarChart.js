/*
filename: matrixpartialComponent.js
description: Advance Evalute Interactive Matrix Partial Component
*/

"use strict";

//from system
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
const propTypes = {
    data: PropTypes.array
}
var svg = ''
var tip = ''
var elementExists;
var margin = { top: 50, right: 50, bottom: 100, left: 100 };
class StackedBarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            empty: ''
        }
        this.findElement = this.findElement.bind(this);
    }
    renderGraph(data) {
        var margin = { top: 20, right: 160, bottom: 35, left: 30 };

        var width = 750 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var selector = "#stackedBarGraph";
        var svgtest = d3.select(selector + " > svg");
        if (!svgtest.empty()) {
            $(selector + " > svg").remove();
        }

        tip = d3
            .tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return (
                    "<span style='color:white'>" +
                    d.y +
                    '</span>'
                );
            });

        // let node = ReactDOM.findDOMNode(this);
        // node.setAttribute("style", "display:none");

        var svg = d3.select("#stackedBarGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        if (svg["0"]["0"] && svg["0"]["0"].tagName && svg["0"]["0"].tagName != null) {
            svg.call(tip);
        }
        /* Data in strings like it would be if imported from a csv */
        // var parse = d3.time.format("%Y").parse;


        // Transpose the data into layers
        var dataset = d3.layout.stack()(["TN", "FN", "TP", "FP"].map(function (id) {
            return data.map(function (d) {
                return { x: d.probabilities, y: +d[id] };
            });
        }));


        // Set x, y and colors
        var x = d3.scale.ordinal()
            // .domain([d3.min(dataset[0]), d3.max(dataset)])
            // .range([0, width - 100]);
            .domain(dataset[0].map(function (d) { return d.x; }))
            .rangeRoundBands([10, width - 10], 0.02);

        var y = d3.scale.linear()

            .domain([0, d3.max(dataset, function (d) { return d3.max(d, function (d) { return d.y0 + d.y; }); })])
            .range([height, 0]);

        var colors = ["#f28355", "#d6d6d6", "#d86333", "#5f5757"];


        // Define and draw axes
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickSize(-width, 0, 0)
            .tickFormat(function (d) { return d });

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
        // .tickFormat(d3.time.format("%Y"));

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .style("opacity", "0")
            .call(xAxis);

        // var xaxiss = svg.select("g.x axis")
        // .append("g")
        // .attr("class", "tick")
        // .attr('transform', 'translate(110, 0)')
        // .append("line")
        // .attr("y2", "6")
        // .attr("x2", "0")
        // .append("text")
        // .attr("dy", ".71em")
        // .attr("x", "0")
        // .attr("y", "9")
        // .style("text-anchor", "middle")
        // .text("0.2");

        // < g class= "x axis" transform = "translate(0,245)" style = "opacity: 1;" >
        //     <g class="tick" transform="translate(110,0)" style="opacity: 1;">
        //         <line y2="6" x2="0"></line><text dy=".71em" y="9" x="0" style="text-anchor: middle;">0.2</text></g>
        //     <g class="tick" transform="translate(190,0)" style="opacity: 1;">
        //         <line y2="6" x2="0"></line><text dy=".71em" y="9" x="0" style="text-anchor: middle;">0.4</text></g> <g class="tick" transform="translate(270,0)" style="opacity: 1;"><line y2="6" x2="0"></line><text dy=".71em" y="9" x="0" style="text-anchor: middle;">0.6000000000000002</text></g> <g class="tick" transform="translate(350,0)" style="opacity: 1;"><line y2="6" x2="0"></line><text dy=".71em" y="9" x="0" style="text-anchor: middle;">0.8000000000000004</text></g> <g class="tick" transform="translate(422,0)" style="opacity: 1;"><line y2="6" x2="0"></line><text dy=".71em" y="9" x="0" style="text-anchor: middle;">0.9800000000000005</text></g> <path class="domain" d="M10,6V0H450V6"></path></g >


        // Create groups for each series, rects for each segment 
        var groups = svg.selectAll("g.cost")
            .data(dataset)
            .enter().append("g")
            .attr("class", "cost")
            .style("fill", function (d, i) { return colors[i]; });

        var rect = groups.selectAll("rect")
            .data(function (d) { return d; })
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.x); })
            .attr("y", function (d) { return y(d.y0 + d.y); })
            .attr("height", function (d) { return y(d.y0) - y(d.y0 + d.y); })
            .attr("width", x.rangeBand())
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
        // .on("mousemove", function (d) {
        //     var xPosition = d3.mouse(this)[0] - 15;
        //     var yPosition = d3.mouse(this)[1] - 25;
        //     tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        //     tooltip.select("text").text(d.y);
        // });


        // Draw legend
        // var legend = svg.selectAll(".legend")
        //     .data(colors)
        //     .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; });

        // legend.append("rect")
        //     .attr("x", width - 18)
        //     .attr("width", 18)
        //     .attr("height", 18)
        //     .style("fill", function (d, i) { return colors.slice().reverse()[i]; });

        // legend.append("text")
        //     .attr("x", width + 5)
        //     .attr("y", 9)
        //     .attr("dy", ".35em")
        //     .style("text-anchor", "start")
        //     .text(function (d, i) {
        //         switch (i) {
        //             case 2: return "McIntosh apples";
        //             case 3: return "Red Delicious apples";
        //         }
        //     });


        // Prep the tooltip bits, initial display is hidden
        var tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 30)
            .attr("height", 20)
            .attr("fill", "white")
            .style("opacity", 0.5);

        tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold");

    }
    componentWillUnmount() {
        $('.d3-tip').css("display", "none")
    }

    findElement() {
        const { empty } = this.setState;
        elementExists = document.getElementById("stackedBarGraph");
        this.setState({ empty: '' })
    }

    componentWillReceiveProps(nextProps) {
        $('.d3-tip').css("display", "none")
        const { data } = nextProps;
        if (typeof (elementExists) != undefined && elementExists != null) {
            return (
                <div>
                    {this.renderGraph(data)}
                </div>
            );
        } else {
            return (
                <div>
                    {this.findElement()}
                </div>
            )
        }
    }

    componentWillMount() {
        elementExists = document.getElementById("stackedBarGraph");
    }

    render() {
        const { data } = this.props;
        if (typeof (elementExists) != undefined && elementExists != null) {
            return (
                <div>
                    {this.renderGraph(data)}
                </div>
            );
        } else {
            return (
                <div>
                    {this.findElement()}
                </div>
            )
        }
    }
}
StackedBarChart.propTypes = propTypes;
export default StackedBarChart;