import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import { MathComponent } from 'mathjax-react'

import styles from './styles';
import { parseEquations, parseConditions } from './functions';

const Equations = (props) => {
    const { classes } = props;
    let { solution } = props;

    console.log("================================== Equations ======================================");

    //let equation = solution.diff_equation_details.equation;
    //let parameters = solution.diff_equation_details.parameters;


    // Component States
    const [equations, setEquations] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [parameters, setParameters] = useState([]);
    const parseEquation = () => {
        console.log("parseEquation...");
        //console.log(equation);

        if (solution.equation_details && solution.equation_details.equation_tex) {
            setEquations(solution.equation_details.equation_tex);
        } else {
            let eq = parseEquations(solution.diff_equation_details.equation);
            console.log(eq);
            setEquations(eq);
        }

        if (solution.equation_details && solution.equation_details.conditions_tex) {
            setConditions(solution.equation_details.conditions_tex);
        } else {
            let cond = parseConditions(solution.diff_equation_details.conditions,
                solution.diff_equation_details.dependent_variables,
                solution.diff_equation_details.independent_variables);

            setConditions(cond);
        }

        if (solution.equation_details && solution.equation_details.parameters) {
            setParameters(solution.equation_details.parameters);
        }
    }

    // Setup Component
    useEffect(() => {
        parseEquation();
    }, []);

    return (
        <div className={classes.equationContainer}>
            {/* <MathComponent tex={String.raw`\frac{du}{dt} - (alpha*u  - beta*u*v), \frac{dv}{dt} - (delta*u*v - gamma*v)`} /> */}
            {equations && equations.map((eq, index) =>
                <MathComponent tex={eq} key={index} />
            )}
            {conditions && conditions.map((cd, index) =>
                <MathComponent tex={cd} key={index} />
            )}
            {parameters && parameters.map((p, index) =>
                <MathComponent tex={p} key={index} />
            )}
        </div>
    );
};

export default withStyles(styles)(Equations);