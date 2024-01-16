import React, {useEffect, useRef, useState} from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { CopyBlock, dracula } from "react-code-blocks";

import styles from './styles';

const BuiltOnNeurodiffeq = ( props ) => {
    const {classes} = props;

    return (
        <Container maxWidth={false} className={classes.blockContainer}>
            <Grid container spacing={2}>
                <Grid item sm={4}>
                    <Typography variant="h6" gutterBottom>
                    Built on top of Neurodiffeq
                    </Typography>
                    <div>
                        Use the Neurodiffeq library to build, train, or download solutions for differential equations
                    </div>
                </Grid>
                <Grid item sm={8}>
                    <CopyBlock
                        language="python"
                        text={`# Load the pretrained solver 
             solver = Solver1D.load(name="project_name/equation_name")
                                                                
            # Train it furthers 
            solver.fit(max_epochs=1000) 

            #Save your retrained solution the Neurodiffhub 
            solver.save(name="retrained_equation", save_to_hub=True) `}
                        theme={dracula}
                        showLineNumbers={true}
                        codeBlock
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default withStyles( styles )( BuiltOnNeurodiffeq );
