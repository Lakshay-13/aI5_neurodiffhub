import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

import DataService from "../../../services/DataService";
import { useAuthContext } from "../../../services/AuthService";
import { useEnumContext } from "../../../services/EnumService";
import AdminMenu from '../AdminMenu';
import SolutionCard from "../../Solutions/SolutionCard"
import styles from './styles';

const FeaturedSolutions = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== SolutionsDashboard ======================================");

    // Get Auth Context
    const auth = useAuthContext();
    const enums = useEnumContext();

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

    const editSolution = (row) => {
        history.push("/solutions/" + row.id)
    }

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false}>
                    <Grid container spacing={2}>
                        <Grid item sm={3}>
                            <AdminMenu page="featuredsolutions" />
                        </Grid>
                        <Grid item sm={9}>
                            <div className={classes.spacer}></div>
                            <Typography variant="h6" gutterBottom>
                                Featured Solutions
                            </Typography>
                            <Divider />
                            <br></br>
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                            >
                                {solutions && solutions.map((sol, index) =>
                                    <Grid item xs={12} md={4} key={index}>
                                        <SolutionCard
                                            solution={sol}
                                            clickHandle={editSolution}
                                            showStatus={false}
                                            showEquation={true}
                                            plotWidth={400}
                                            plotHeight={170}
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
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(FeaturedSolutions);