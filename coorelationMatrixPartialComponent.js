/*
filename: coorelationMatrixPartialComponent.js
description: Partial Component For Static Correaltion Matrix
*/

"use strict";

//from system
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  matrix_data: PropTypes.array,
  matrix_labels: PropTypes.array,
  container: PropTypes.object,
  legend: PropTypes.object
}
var svg = '';
var key = '';
var legend = '';
var margin = { top: 50, right: 50, bottom: 100, left: 100 };
class CoorelationMatrix extends Component {
  constructor(props) {
    super(props)
    var width = (props.matrix_labels).length < 12 ? 55 * (props.matrix_labels).length : 600,
      height = (props.matrix_labels).length < 12 ? 55 * (props.matrix_labels).length : 600,
      data = props.matrix_data,
      legend = props.legend.type,
      container = props.container.type,
      labelsData = props.matrix_labels,
      startColor = '#ffffff',
      endColor = '#ff8000';


    var widthLegend = 100;

    if (!data) {
      throw new Error('Please pass data');
    }

    if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
      throw new Error('It should be a 2-D array');
    }

    var maxValue = d3.max(data, function (layer) { return d3.max(layer, function (d) { return d; }); });
    var minValue = d3.min(data, function (layer) { return d3.min(layer, function (d) { return d; }); });

    var numrows = data.length;
    var numcols = data[0].length;
    var translateLeft = margin.left + 100;

    svg = d3.select(container).append("svg")
      .style("display", "block")
      .style("margin-left", "13%")
      .style("margin-top", "4%")
      .attr("width", width + margin.left + margin.right + 65)
      .attr("height", height + margin.top + margin.bottom + 145)
      .append("g")
      .attr("transform", "translate(" + translateLeft + "," + margin.top + ")");

    var background = svg.append("rect")
      .style("stroke", "black")
      .style("stroke-width", "2px")
      .attr("width", width)
      .attr("height", height);

    var x = d3.scale.ordinal()
      .domain(d3.range(numcols))
      .rangeBands([0, width]);

    var y = d3.scale.ordinal()
      .domain(d3.range(numrows))
      .rangeBands([0, height]);

    var colorMap = d3.scale.linear()
      .domain([minValue, maxValue])
      .range([startColor, endColor]);

    var row = svg.selectAll(".row")
      .data(data)
      .enter().append("g")
      .attr("class", "row")
      .attr("transform", function (d, i) { return "translate(0," + y(i) + ")"; });

    var cell = row.selectAll(".cell")
      .data(function (d) { return d; })
      .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function (d, i) { return "translate(" + x(i) + ", 0)"; });

    cell.append('rect')
      .attr("width", x.rangeBand())
      .attr("height", y.rangeBand())
      .style("stroke-width", 0);

    cell.append("text")
      .attr("dy", ".32em")
      .attr("x", x.rangeBand() / 2)
      .attr("y", y.rangeBand() / 2)
      .attr("text-anchor", "middle")
      .style("fill", function (d, i) { return d >= maxValue / 2 ? 'white' : 'black'; })
      .text(function (d, i) { return d; });

    row.selectAll(".cell")
      .data(function (d, i) { return data[i]; })
      .style("fill", colorMap);

    var labels = svg.append('g')
      .attr('class', "labels");

    var columnLabels = labels.selectAll(".column-label")
      .data(labelsData)
      .enter().append("g")
      .attr("class", "column-label")
      .attr("transform", function (d, i) { return "translate(" + x(i) + "," + height + ")"; });

    columnLabels.append("line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x1", x.rangeBand() / 2)
      .attr("x2", x.rangeBand() / 2)
      .attr("y1", 0)
      .attr("y2", 5);

    columnLabels.append("text")
      .attr("x", 0)
      .attr("y", y.rangeBand() / 2)
      .attr("dy", ".82em")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-60)")
      .text(function (d, i) { return d; });

    var rowLabels = labels.selectAll(".row-label")
      .data(labelsData)
      .enter().append("g")
      .attr("class", "row-label")
      .attr("transform", function (d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

    rowLabels.append("line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x1", 0)
      .attr("x2", -5)
      .attr("y1", y.rangeBand() / 2)
      .attr("y2", y.rangeBand() / 2);

    rowLabels.append("text")
      .attr("x", -8)
      .attr("y", y.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function (d, i) { return d; });

    key = d3.select(legend).append("svg")
      .style("margin-left", "81%")
      .style("margin-top", "-63%")
      .attr("width", widthLegend)
      .attr("height", height + margin.top + margin.bottom + 145);

    legend = key
      .append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", endColor)
      .attr("stop-opacity", 1);

    legend
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", startColor)
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", widthLegend / 2 - 10)
      .attr("height", height)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0," + margin.top + ")");

    var y = d3.scale.linear()
      .range([height, 0])
      .domain([minValue, maxValue]);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("right");

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(41," + margin.top + ")")
      .call(yAxis)
  }
  componentWillUnmount() {
    d3.select("svg").remove();
    d3.select("svg").remove();
  }
  render() {
    return (null)
  }
}
CoorelationMatrix.propTypes = propTypes;
export default CoorelationMatrix;