import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import SettingsMenu from '../SettingsMenu'
import DataService from "../../../services/DataService";
import styles from './styles';

const Organizations = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== Organizations ======================================");

    // Component States

    // Setup Component
    useEffect(() => {

    }, []);

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="md" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item sm={4}>
                            <SettingsMenu page="organizations" />
                        </Grid>
                        <Grid item sm={8}>
                            <Typography variant="h6" gutterBottom>
                                Organizations
                            </Typography>
                            <Divider />
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Organizations);