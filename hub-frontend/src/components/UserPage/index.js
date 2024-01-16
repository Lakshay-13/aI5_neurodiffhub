import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';



import DataService from "../../services/DataService";
import { useAuthContext } from "../../services/AuthService";
import { useEnumContext } from "../../services/EnumService";
import Equations from "../Equations";
import SolutionCard from "../Solutions/SolutionCard"
import styles from './styles';

const UserPage = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== UserPage ======================================");

    let username = props.match.params.username;
    //console.log(username);
    //console.log("HIII");

    // Get Auth Context
    const auth = useAuthContext();
    const enums = useEnumContext();

    //Searching Projects
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [searchprojects, setSearchProjects] = useState([]);
    const [searchproject, setSearchProject] = useState("All");



    const handleSearchChange = (q) => {
        setSearchProjects([]);
        setLoading(true);
        console.log(q);

        if (q == '') {
            return;
        }

        DataService.SearchProjects(q)
            .then(function (response) {
                console.log(response.data);
                const projects_got = response.data;
                let filtered_out = projects_got.filter(function (p) {
                    return project_names.some(function (name) { return name == p.projectname });
                })
                console.log("Filtered Out:");
                console.log(filtered_out);
                setSearchProjects(filtered_out);
                setLoading(false);
            })

    };

    const handleSelectChange = (option, value) => {
        console.log(option);
        console.log(value);
        setSearchProject(value);
    };



    // Component States
    const [profile, setProfile] = useState({});
    const loadProfile = () => {
        DataService.GetUserProfile(username)
            .then(function (response) {
                let user = response.data;
                let display_name = "";
                if (user.full_name) {
                    display_name = user.full_name;
                } else {
                    display_name = user.username;
                }

                let initials = display_name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);
                initials = initials.join('');
                initials = initials.toUpperCase();

                user["display_name"] = display_name;
                user["initials"] = initials;

                setProfile(user);
            })
    }


    function getProjectName(soln) {
        return soln.projectname;
    }
    const [solutions, setSolutions] = useState(null);
    const [project_names, setProjectNames] = useState(null);
    let solution_count = 0
    const loadUserSolutions = () => {
        if (auth && auth.state.username == username) {
            DataService.GetMySolutions()
                .then(function (response) {
                    console.log("Solutions Response auth");
                    const p_names = response.data.map(getProjectName);
                    const set_names = new Set(p_names);
                    const names = Array.from(set_names);
                    console.log("Names:");
                    console.log(names);
                    setProjectNames(names);
                    setSolutions(response.data);

                })
        } else {
            DataService.GetUserSolutions(username)
                .then(function (response) {
                    console.log("Solutions Response normal");
                    const p_names = response.data.map(getProjectName);
                    const set_names = new Set(p_names);
                    const names = Array.from(set_names);
                    console.log("Names:");
                    console.log(names);
                    setProjectNames(names);
                    setSolutions(response.data);
                })
        }
    }

    // Setup Component
    useEffect(() => {
        loadProfile();
        loadUserSolutions();
    }, []);

    const goToEditSolution = (row) => {
        history.push("/solutions/" + row.id)
    }

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false}>
                    <Grid container spacing={2}>
                        <Grid item sm={3}>
                            <Paper className={classes.profileBlock} variant="outlined" square>
                                <Avatar className={classes.avatar} variant="circular">{profile.initials}</Avatar>
                                <Typography variant="h4">
                                    {profile.display_name}
                                </Typography>
                                <Typography>
                                    {profile.username}
                                </Typography>

                                <br></br>
                                <Typography variant="h6">
                                    GitHub
                                </Typography>
                                <Typography>
                                    {profile.github_username}
                                </Typography>

                                <br></br>
                                <Typography variant="h6">
                                    Twitter
                                </Typography>
                                <Typography>
                                    {profile.twitter_handle}
                                </Typography>

                                <br></br>
                                <Typography variant="h6">
                                    Research Interests
                                </Typography>
                                <Typography>
                                    {profile.research_interests}
                                </Typography>

                                <br></br>
                                <Typography variant="h6">
                                    Organizations
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item sm={9}>
                            <div className={classes.solutionsBlock}>
                                <Typography variant="h5" gutterBottom>
                                    Solutions
                                </Typography>
                                <Divider />
                                <br></br>
                                <Toolbar className={classes.toolBar}>
                                    <div className={classes.grow} />
                                    <div style={{ width: 300, marginRight: 10 }}>
                                        <Autocomplete
                                            disableClearable
                                            open={open}
                                            onOpen={() => {
                                                setOpen(true);
                                            }}
                                            onClose={() => {
                                                setOpen(false);
                                            }}
                                            onChange={(event, value) => handleSelectChange(event, value.projectname)}
                                            options={searchprojects}
                                            getOptionSelected={(option, value) => option.projectname === value.projectname}
                                            getOptionLabel={(option) => option.projectname}
                                            loading={loading}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Search Project"
                                                    margin="normal"
                                                    variant="outlined"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        type: 'search',
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }}
                                                    value=' '
                                                    onChange={(e) => handleSearchChange(e.target.value)}
                                                />
                                            )}
                                        />
                                    </div>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Icon>add</Icon>}
                                        onClick={(event) => handleSelectChange(event, "All")}
                                    >
                                        Show All Projects
                                    </Button>
                                </Toolbar>

                                {searchproject == "All" && project_names && project_names.map((name, index) =>
                                    <div>
                                        <Typography variant="h5" gutterBottom>
                                            Project: {name}
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
                                                <div>
                                                    {sol.projectname == name &&
                                                        <Grid item xs={12} key={index}>
                                                            <SolutionCard
                                                                solution={sol}
                                                                clickHandle={goToEditSolution}
                                                                showStatus={true}
                                                                showEquation={true}
                                                                plotWidth={400}
                                                                plotHeight={170}
                                                                style={{ marginright: 5 }}
                                                            >
                                                            </SolutionCard>
                                                        </Grid>
                                                    }
                                                </div>
                                            )}
                                        </Grid>
                                        <br></br>
                                    </div>


                                )}
                                {project_names && project_names.map((name, index) =>

                                    <div>
                                        {name == searchproject &&
                                            <div>
                                                <Typography variant="h5" gutterBottom>
                                                    Project: {name}
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
                                                    <Grid item xs={12} sm={3} key={index}>
                                                        {solutions && solutions.map((sol, index) =>
                                                            <div>
                                                                {sol.projectname == name &&

                                                                    <SolutionCard
                                                                        solution={sol}
                                                                        clickHandle={goToEditSolution}
                                                                        showStatus={true}
                                                                        showEquation={true}
                                                                        plotWidth={400}
                                                                        plotHeight={170}
                                                                    >
                                                                    </SolutionCard>

                                                                }
                                                            </div>
                                                        )}</Grid>
                                                </Grid>
                                                <br></br>
                                            </div>
                                        }
                                    </div>
                                )}

                                {/* <Typography>
                                <strong>Project:</strong>
                            </Typography> */}

                                <Grid
                                    container
                                    spacing={2}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >

                                    {solutions && solutions.length == 0 &&
                                        <Box component="div" m={3}>
                                            <Typography>
                                                No solutions saved!
                                            </Typography>
                                        </Box>
                                    }
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(UserPage);