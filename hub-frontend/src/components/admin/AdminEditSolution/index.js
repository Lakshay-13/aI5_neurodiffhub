import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Plot from 'react-plotly.js';
import { CopyBlock, dracula } from "react-code-blocks";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


import DataService from "../../../services/DataService";
import { useAuthContext } from "../../../services/AuthService";
import { useEnumContext } from "../../../services/EnumService";
import Equations from "../../Equations";
import styles from './styles';
import { handleSaveClick, handlePublishClick, handleRejectClick } from './handlers';
import './index.css';

const AdminEditSolution = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== AdminEditSolution ======================================");

    let id = props.match.params.id;
    console.log(id);

    // Get Auth Context
    const auth = useAuthContext();
    const enums = useEnumContext();

    // Component States
    const [solution, setSolution] = useState({});
    const loadSolution = (id) => {
        DataService.GetSolution(id)
            .then(function (response) {
                setSolution(response.data);
                setDescription(response.data.description);
                setEquation(response.data.equation_id);
                setFeatured(response.data.featured)
            })
    }
    const getSampleSolution = () => {
        let data = [];
        console.log(solution["sample_solution"]);
        if (("diff_equation_details" in solution) && ("sample_solution" in solution["diff_equation_details"])) {
            let sample_solution = solution["diff_equation_details"]["sample_solution"];
            if (sample_solution.length > 1) {
                for (var i = 0; i < sample_solution[1].length; i++) {
                    var s = {
                        x: sample_solution[0],
                        y: sample_solution[1][i],
                        type: 'line'
                    }
                    data.push(s);
                }
            }
        }
        return data;
    }
    const [equations, setEquations] = useState([]);
    const loadEquations = () => {
        DataService.GetEquations()
            .then(function (response) {
                setEquations(response.data);
            })
    }

    const [description, setDescription] = useState('');
    const [equation, setEquation] = useState('');
    const [featured, setFeatured] = useState(false);

    // Setup Component
    useEffect(() => {
        loadEquations();
        loadSolution(id);
    }, []);

    const cancelEditSolution = () => {
        history.push("/admin/solutionsdashboard");
    }
    const getCodeBlockContent = () => {
        let solverType = solution["equation_type"] == "ode" ? 'Solver1D' : 'Solver2D';
        let text = `
        # Import Neurodiffeq
        from neurodiffeq.solvers import ${solverType}
        # Load the pretrained solver
        solver = ${solverType}.load("${solution.label}")
        `

        return text;
    }

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="lg">
                    <div className={classes.container}>
                        <Toolbar className={classes.toolBar}>
                            <Icon className={classes.labelIcon}>label</Icon>
                            <Typography variant="h5" color="textSecondary">
                                &nbsp;{solution.label}
                            </Typography>
                            <div className={classes.grow} />
                            <Icon style={{ "color": "#de2d26" }}>vpn_lock</Icon>
                            <Typography display="block" variant="caption" align="justify">
                                &nbsp;{enums["hub_status_types"][solution.hub_status]}
                            </Typography>
                        </Toolbar>
                        <Toolbar className={classes.toolBar}>
                            <Typography variant="caption" display="block">
                                &nbsp;&nbsp;{enums["diff_equation_types"][solution.equation_type]}
                            </Typography>
                        </Toolbar>
                        <Divider />
                        <Grid container spacing={2}>
                            <Grid item md={7}>
                                <div className={classes.inputContainer}>
                                    <FormControl variant="outlined" fullWidth>
                                        <InputLabel id="equation-label">Equation</InputLabel>
                                        <Select
                                            labelId="equation-label"
                                            id="equation"
                                            label="Equation"
                                            value={equation}
                                            onChange={(e) => setEquation(e.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>- Select -</em>
                                            </MenuItem>
                                            {equations && equations.map((eq, index) =>
                                                <MenuItem value={eq.id} key={index}>{eq.name}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Description"
                                        placeholder="Description"
                                        helperText=""
                                        fullWidth
                                        multiline
                                        rows={4}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={featured}
                                                onClick={(e) => setFeatured(!featured)}
                                                color="primary"
                                            />
                                        }
                                        label="Featured Solution"
                                    />
                                </div>
                                <div className={classes.buttonContainer}>
                                    <Button variant="outlined" color="primary" onClick={() => handleSaveClick(id, equation, description, featured)}>Save</Button>&nbsp;&nbsp;
                                    <Button variant="outlined" color="primary" onClick={() => handlePublishClick(id, history)}>Publish</Button>&nbsp;&nbsp;
                                    <Button variant="outlined" color="primary" onClick={() => handleRejectClick(id, history)}>Reject</Button>&nbsp;&nbsp;
                                    <Button variant="outlined" color="primary" onClick={cancelEditSolution}>Cancel</Button>
                                </div>
                            </Grid>
                            <Grid item md={5}>
                                <br></br>
                                <Typography variant="caption" display="block">
                                    Equations:
                                </Typography>
                                {solution.diff_equation_details &&
                                    <Equations solution={solution}></Equations>
                                }
                                <br></br>
                                <Divider />
                                <br></br>
                                <Typography variant="caption" display="block">
                                    Sample Solutions:
                                </Typography>
                                <br></br>
                                {solution.diff_equation_details &&
                                    <Plot
                                        data={getSampleSolution()}
                                        layout={{ width: 500, height: 300, showlegend: false }}
                                    />
                                }
                                <br></br>
                                <Divider />

                                <br></br>
                                <Typography variant="caption" display="block">
                                    Code:
                                </Typography>
                                <CopyBlock
                                    language="python"
                                    text={getCodeBlockContent()}
                                    theme={dracula}
                                    showLineNumbers={true}
                                    codeBlock
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(AdminEditSolution);