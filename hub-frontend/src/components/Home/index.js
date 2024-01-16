import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';

import Introduction from "./Introduction";
import FeaturedSolutions from "./FeaturedSolutions";
import TopContributors from "./TopContributors";
import BuiltOnNeurodiffeq from "./BuiltOnNeurodiffeq";
import styles from './styles';

const Home = (props) => {
    const { classes } = props;

    console.log("================================== Home ======================================");

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Introduction></Introduction>
                <FeaturedSolutions history={props.history}></FeaturedSolutions>
                <TopContributors history={props.history}></TopContributors>
                <BuiltOnNeurodiffeq></BuiltOnNeurodiffeq>
            </main>
        </div>
    );
};

export default withStyles(styles)(Home);
