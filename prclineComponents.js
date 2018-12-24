/*
filename: prclineComponents.js
description: Partial PRC Line Chart
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    matrix_data: PropTypes.array,
    predictedLineData: PropTypes.array,
}

class LineChartPRCComponent extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var chart = new CanvasJS.Chart("chartContainer", {
            width: 600,
            height: 300,
            axisX: {
                title: "Recall",
            },
            axisY: {
                title: "Precision",
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
        var chart = new CanvasJS.Chart("chartContainer", {
            width: 600,
            height: 300,
            axisX: {
                title: "Recall",
            },
            axisY: {
                title: "Precision",
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
                <div id="chartContainer"></div>
            </div>
        );
    }
}

export default LineChartPRCComponent;
