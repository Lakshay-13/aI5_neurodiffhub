import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Plot from 'react-plotly.js';


import styles from './styles';

const SampleSolutionPlot = (props) => {
    const { classes } = props;
    let { solution } = props;
    let { width } = props;
    let { height } = props;

    // Component States
    const [data, setData] = useState([]);
    const loadData = () => {
        console.log("====================== plot =====================");
        console.log(solution);
        let curveData = [];

        if (("diff_equation_details" in solution) && ("sample_solution" in solution["diff_equation_details"])) {
            let sample_solution = solution["diff_equation_details"]["sample_solution"];
            // if (sample_solution.length > 1) {
            //     for (var i = 0; i < sample_solution[1].length; i++) {
            //         var s = {
            //             x: sample_solution[0],
            //             y: sample_solution[1][i],
            //             type: 'line'
            //         }
            //         curveData.push(s);
            //     }
            // }
            if (solution["equation_type"] == "ode") {
                //console.log(sample_solution);
                if (("diff_equation_details" in solution) && ("sample_solution" in solution["diff_equation_details"])) {
                    if (sample_solution.length > 0) {
                        var max_points = 5000;
                        if (sample_solution[1].length < max_points) {
                            max_points = sample_solution[1].length
                        }
                        for (var i = 0; i < max_points; i++) {
                            var s = {
                                x: sample_solution[0],
                                y: sample_solution[1][i],
                                type: 'line',
                                name: solution['diff_equation_details']['variables'][i]
                            }
                            curveData.push(s);
                        }
                    }
                }
            } else if (solution["equation_type"] == "pde") {
                let xMax = solution["diff_equation_details"]["generator"]["xy_max"][0];
                let yMax = solution["diff_equation_details"]["generator"]["xy_max"][1];
                let xMin = solution["diff_equation_details"]["generator"]["xy_min"][0];
                let yMin = solution["diff_equation_details"]["generator"]["xy_min"][1];
                let xPoints = solution["diff_equation_details"]["generator"]["grid"][0];
                let yPoints = solution["diff_equation_details"]["generator"]["grid"][1];
                console.log(solution["diff_equation_details"]["generator"]["grid"]);
                if (("diff_equation_details" in solution) && ("sample_solution" in solution["diff_equation_details"])) {
                    curveData = [{
                        z: sample_solution[1],
                        x: Array.from({ length: xPoints }, (x, i) => xMin + (i / xPoints) * (xMax - xMin)),
                        // x: sample_solution[0][0].sort(),
                        y: Array.from({ length: yPoints }, (x, i) => yMin + (i / yPoints) * (yMax - yMin)),
                        type: 'contour',
                    }];
                }
            }
        }
        setData(curveData);
    }
    const [layout, setLayout] = useState({});
    const loadLayout = () => {
        let curveLayout = {};
        if (solution["equation_type"] == "ode") {
            curveLayout = {
                // title: { text: 'Solution Plot' },
                xaxis: { title: { text: solution['diff_equation_details']['variables'][solution['diff_equation_details']['variables'].length - 1] } },
                width: width,
                height: height,
                showlegend: true,
                margin: {
                    l: 50,
                    r: 50,
                    b: 40,
                    t: 10,
                    pad: 4
                }
            };
        } else if (solution["equation_type"] == "pde") {
            let dependentVariables = Object.keys(solution['diff_equation_details']['order']);
            let independentVariables = solution['diff_equation_details']['variables'];

            for (var i = 0; i < dependentVariables.length; i++) {
                independentVariables = independentVariables.filter(item => item != dependentVariables[i]);
            }

            // console.log(independentVariables);


            curveLayout = {
                // title: { text: 'Contour Plot' },
                xaxis: { title: { text: independentVariables[0] } },
                yaxis: { title: { text: independentVariables[1] } },
                width: width,
                height: height,
                showlegend: true,
                margin: {
                    l: 50,
                    r: 50,
                    b: 50,
                    t: 10,
                    pad: 4
                }
            };
        }
        setLayout(curveLayout);
    }

    // Setup Component
    useEffect(() => {
        loadLayout();
        loadData();
    }, []);

    return (
        <div>
            {data.length == 0 &&
                <Plot
                    data={[]}
                    layout={{
                        width: width,
                        height: height,
                        showlegend: false,
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
                    layout={layout}
                />
            }
        </div>
    );

};

export default withStyles(styles)(SampleSolutionPlot);