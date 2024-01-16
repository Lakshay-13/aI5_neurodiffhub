import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Plot from 'react-plotly.js';


import styles from './styles';

const LossPlot = (props) => {
    const { classes } = props;
    let { solution } = props;
    let { width } = props;
    let { height } = props;
    let { isLog } = props;

    // Component States
    const [data, setData] = useState([]);
    const loadData = () => {
        
        let curveData = [];

        if (("diff_equation_details" in solution) && ("sample_loss" in solution["diff_equation_details"])) {

            let sampleLoss = solution["diff_equation_details"]["sample_loss"];
            let epochsList = Array.from({ length: sampleLoss.length }, (x, i) => i + 1);

            if (isLog == true) {
                let logSampleLoss = [];
                for (var i = 0; i < sampleLoss.length; i++) {
                    logSampleLoss.push(sampleLoss[i]);
                }
                curveData = [{
                    x: epochsList,
                    y: logSampleLoss,
                    type: 'line',
                }]
            }
            else {
                curveData = [{
                    x: epochsList,
                    y: sampleLoss,
                    type: 'line',
                }];
            }
        }
        setData(curveData);
    }

    // Setup Component
    useEffect(() => {
        loadData();
    }, [isLog]);

    return (
        <div>
            {data.length == 0 &&
                <Plot
                    data={[]}
                    layout={{
                        width: width,
                        height: height,
                        showlegend: false,
                        xaxis: isLog == false ? { title: {text: "epochs"}} : {type: "log", autorange: true, title: { text: "epochs" }},
                        yaxis: isLog == false ? { title: {text: "loss" }} : { type: "log", autorange: true, title: { text: "log loss" }},
                        margin: {
                            l: 40,
                            r: 40,
                            b: 40,
                            t: 10,
                            pad: 4
                        }
                    }}
                />
            }
            {data.length > 0 &&
                <Plot
                    data={data}
                    layout={{
                        width: width,
                        height: height,
                        showlegend: false,
                        xaxis: isLog == false ? { title: {text: "epochs"}} : {type: "log", autorange: true, title: { text: "epochs" }},
                        yaxis: isLog == false ? { title: {text: "loss" }} : { type: "log", autorange: true, title: { text: "log loss" }},
                        margin: {
                            l: 60,
                            r: 20,
                            b: 60,
                            t: 10,
                            pad: 4
                        }
                    }}
                />
            }
        </div>
    );

};

export default withStyles(styles)(LossPlot);