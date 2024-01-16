import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';

import DataService from "../../../services/DataService";
import { useAuthContext } from "../../../services/AuthService";
import { useEnumContext } from "../../../services/EnumService";
import SolutionCard from "../../Solutions/SolutionCard"
import AdminMenu from '../AdminMenu';
import styles from './styles';

const SolutionsDashboard = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== SolutionsDashboard ======================================");

    // Get Auth Context
    const auth = useAuthContext();
    const enums = useEnumContext();

    // Component States
    const [submittedSolutions, setSubmittedSolutions] = useState([]);
    const loadSubmittedSolutions = () => {
        DataService.GetSubmittedSolutions()
            .then(function (response) {
                setSubmittedSolutions(response.data);
            })
    }
    const [publishedSolutions, setPublishedSolutions] = useState([]);
    const loadPublishedSolutions = () => {
        DataService.GetPublishedSolutions()
            .then(function (response) {
                setPublishedSolutions(response.data);
            })
    }

    // Setup Component
    useEffect(() => {
        loadSubmittedSolutions();
        loadPublishedSolutions();
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
                            <AdminMenu page="solutionsdashboard" />
                        </Grid>
                        <Grid item sm={9}>
                            <div className={classes.spacer}></div>
                            <Typography variant="h6" gutterBottom>
                                Solutions Dashboard
                            </Typography>
                            <Divider />
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <Box component="div" m={2}>
                                        <Typography>
                                            <strong>Submitted Solutions</strong>
                                        </Typography>
                                    </Box>
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                    >
                                        {submittedSolutions && submittedSolutions.map((sol, index) =>
                                            <Grid item xs={12} md={4} key={index}>
                                                <SolutionCard
                                                    solution={sol}
                                                    clickHandle={editSolution}
                                                    showStatus={true}
                                                    showEquation={true}
                                                    plotWidth={400}
                                                    plotHeight={170}
                                                >
                                                </SolutionCard>
                                            </Grid>
                                        )}
                                        {submittedSolutions && submittedSolutions.length == 0 &&
                                            <Box component="div" m={3}>
                                                <Typography>
                                                    No submitted solutions
                                                </Typography>
                                            </Box>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <Box component="div" m={3}>
                                        <Typography>
                                            <strong>Published Solutions</strong>
                                        </Typography>
                                    </Box>
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                    >
                                        {publishedSolutions && publishedSolutions.map((sol, index) =>
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
                                        {publishedSolutions && publishedSolutions.length == 0 &&
                                            <Box component="div" m={3}>
                                                <Typography>
                                                    No published solutions
                                                </Typography>
                                            </Box>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(SolutionsDashboard);