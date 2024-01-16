import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

import styles from './styles';
import DataService from "../../../services/DataService";
import SolutionCard from "../../Solutions/SolutionCard";

const FeaturedSolutions = (props) => {
    const { classes } = props;
    const { history } = props;

    // Component States
    const [solutions, setSolutions] = useState(null);
    const loadSolutions = () => {
        DataService.GetFeaturedSolutions()
            .then(function (response) {
                setSolutions(response.data);
            })
    }

    // Setup Component
    useEffect(() => {
        loadSolutions();
    }, []);

    const goToViewtSolution = (row) => {
        history.push("/solutions/" + row.id)
    }

    return (
        <Container maxWidth={false} className={classes.blockContainer}>
            <Box display="flex" p={0} >
                <Typography variant="h6" gutterBottom>
                    Featured Solutions
                </Typography>
                <div className={classes.grow} />
                <div className={classes.infoText}>
                    <Link to="/solutions" className={classes.infoLink} underline="hover">Browse solutions</Link> to discover and experiment with differential equations.
                </div>
            </Box>
            <div className={classes.spacer}></div>
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {solutions && solutions.map((sol, index) =>
                    <Grid item xs={12} md={3} key={index}>
                        <SolutionCard
                            solution={sol}
                            clickHandle={goToViewtSolution}
                            showStatus={false}
                            showEquation={true}
                            plotWidth={400}
                            plotHeight={200}
                        >
                        </SolutionCard>
                    </Grid>
                )}
                {solutions && solutions.length == 0 &&
                    <Box component="div" m={3}>
                        <Typography>
                            No featured solutions
                        </Typography>
                    </Box>
                }
            </Grid>
        </Container>
    );
};

export default withStyles(styles)(FeaturedSolutions);