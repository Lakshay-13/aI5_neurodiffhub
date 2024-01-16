import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import styles from './styles';

const Introduction = (props) => {
    const { classes } = props;

    return (
        <Container maxWidth={false} className={classes.blockContainer}>
            <div className={classes.mainBlock}>
                <img src="logo192.png"></img>
                <Typography variant="h1" className={classes.mainTitleText}>
                    Building the future one equation at a time.
                </Typography>
                <Typography variant="subtitle1" className={classes.mainTitleDescription}>
                    Store, Access and Share Neural-net differential equation solvers across communities. Built on top of the NeurodiffEq library for solving differential equations using neural networks.
                </Typography>
            </div>
        </Container>
    );
};

export default withStyles(styles)(Introduction);
