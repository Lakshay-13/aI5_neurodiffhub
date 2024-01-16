import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';

import styles from './styles';

const Footer = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== Footer ======================================");

    // Component States

    // Setup Component
    useEffect(() => {

    }, []);

    return (
        <div className={classes.root}>
            <Divider className={classes.divider} />
            <br></br>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid item sm={3}>
                        <Typography variant="h6" gutterBottom>
                            Resources
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="/docs/introduction">
                                Differential Equations 
                            </Link>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="/docs/introduction">
                                Solutions
                            </Link>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="/docs/getting_started">
                                Get Started
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item sm={3}>
                        <Typography variant="h6" gutterBottom>
                            Team
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="/about">
                                About
                            </Link>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="/privacy">
                                Privacy
                            </Link>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="https://github.com/NeuroDiffGym/neurodiffeq/blob/master/CONTRIBUTING.md">
                                Contribute
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item sm={3}>
                        <Typography variant="h6" gutterBottom>
                            Documents
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="https://github.com/NeuroDiffGym/neurodiffeq">
                                Neurodiffeq
                            </Link>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Blogs
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                        <Link href="https://www.stellardnn.org/">
                                Stellar DNN
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item sm={3}>
                        <Typography variant="h6" gutterBottom>
                            Social
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="https://github.com/shivasj">
                                GitHub
                            </Link>    
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            LinkedIn
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <Link href="https://twitter.com/pprotopapas">
                                Twitter
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default withStyles(styles)(Footer);