/*
filename: featureImpPartialComponent.js
description: (Lime Chart) Partial Component Horizontal Bar Chart on Advance Screen
*/

'use strict';

//from system
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
const propTypes = {
    matrix_data: PropTypes.array,
    className: PropTypes.string,
};
var svg = '';
var elementExists;
class FeatureImpComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empty: '',
        }
        this.renderGraph = this.renderGraph.bind(this);
        this.findElement = this.findElement.bind(this);
    }

    renderGraph(data, className) {
        var margin = { top: 20, right: 30, bottom: 40, left: 30 },
            width = 550 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], 0.1);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickSize(0)
            .tickPadding(6);

        var selector = "#featureImpGraph";
        var svgtest = d3.select(selector + " > svg");
        if (!svgtest.empty()) {
            $(selector + " > svg").remove();
        }
        // let node = ReactDOM.findDOMNode(this);
        // node.setAttribute("style", "display:none");
        svg = d3.select("#featureImpGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function (d) { return d.value; })).nice();
        y.domain(data.map(function (d) { return d.name; }));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", function (d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
            .attr("x", function (d) { return x(Math.min(0, d.value)); })
            .attr("y", function (d) { return y(d.name); })
            .attr("width", function (d) { return Math.abs(x(d.value) - x(0)); })
            .attr("height", y.rangeBand());

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis);
        svg
            .selectAll("text")
            .style("font-size", "12px")
            .attr('font-family', "Roboto")
            .style("font-weight", "100")
            .attr('stroke', "#818181")

        function type(d) {
            d.value = +d.value;
            return d;
        }
    }
    findElement() {
        const { empty } = this.setState;
        elementExists = document.getElementById("featureImpGraph");
        this.setState({ empty: '' })
    }

    componentWillMount() {
        elementExists = document.getElementById("featureImpGraph");
    }

    render() {
        const { matrix_data, className } = this.props;
        if (typeof (elementExists) != undefined && elementExists != null) {
            return (
                <div>
                    {this.renderGraph(matrix_data, className)}
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
FeatureImpComponent.propTypes = propTypes;
export default FeatureImpComponent;
