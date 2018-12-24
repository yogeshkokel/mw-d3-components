/*
filename: linechartd3PartialComponent.js
description: Partial ROC Line Chart
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    matrix_data: PropTypes.array,
    predictedLineData: PropTypes.array,
}

class LineChartROCComponent extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var chart = new CanvasJS.Chart("chartContainer1", {
            width: 600,
            height: 300,
            axisX: {
                title: "False Positive Rate",
            },
            axisY: {
                title: "True Positive Rate",
            },
            data: [
                {
                    type: "line",
                    color: "#F28355",
                    dataPoints: this.props.matrix_data
                },
            ]
        });
        chart.render();
    }

    componentWillReceiveProps(nextProps) {
        var chart = new CanvasJS.Chart("chartContainer1", {
            width: 600,
            height: 300,
            axisX: {
                title: "False Positive Rate",
            },
            axisY: {
                title: "True Positive Rate",
            },
            data: [
                {
                    type: "line",
                    color: "#F28355",
                    dataPoints: nextProps.matrix_data
                },
            ]
        });
        chart.render();
    }

    render() {
        return (
            <div>
                <div id="chartContainer1"></div>
            </div>
        );
    }
}

export default LineChartROCComponent;
