import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { MathComponent } from 'mathjax-react'
import marked from 'marked';

import { useNotificationContext } from "../../../services/NotificationService";
import DataService from "../../../services/DataService";
import styles from './styles';

const SolutionEdit = (props) => {
    const { classes } = props;
    let { solution } = props;
    let { updateRefresh } = props;
    let { goBack } = props;

    const notifications = useNotificationContext();

    // Component States
    const [equations, setEquations] = useState([]);
    const loadEquations = () => {
        DataService.GetEquations()
            .then(function (response) {
                setEquations(response.data);
            })
    }
    const [description, setDescription] = useState('');
    const [variableSummary, setVariableSummary] = useState('');
    const [usecaseSummary, setUsecaseSummary] = useState('');
    const [referenceSummary, setReferenceSummary] = useState('');
    const [trainingSummary, setTrainingSummary] = useState('');
    const [otherSummary, setOtherSummary] = useState('');
    const [citation, setCitation] = useState('');

    const [equation, setEquation] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [solutionName, setSolutionName] = useState('');
    const [equationTex, setEquationTex] = useState('');
    const [conditionTex, setConditionTex] = useState('');

    // Setup Component
    useEffect(() => {
        loadEquations();
        setDescription(solution.description);
        setEquation(solution.equation_id);

        setVariableSummary(solution.variable_summary);
        setUsecaseSummary(solution.usecase_summary);
        setReferenceSummary(solution.reference_summary);
        setTrainingSummary(solution.training_summary);
        setOtherSummary(solution.other_summary);
        setCitation(solution.citation);
        //setEquationTex(solution.equation_details.equation_tex);
        if(solution.equation_details.equation_tex.length == 1) {
            //Check if 1 string with ';'
            let display = String(solution.equation_details.equation_tex[0]);
            let eqns = display.split(";");
            console.log("eqns:",eqns);
            setEquationTex(eqns);
            if (eqns.length > 1) { //Means actually more than one equations were there!
                //setEquationTex(eqns);
                console.log(" > 1 eqns:",eqns);
            } else { //Means only 1 equation was there
                console.log("1 eqns:",eqns);
            }

        } else { //Has the updated format already
            setEquationTex(solution.equation_details.equation_tex);
        }
        setConditionTex(solution.equation_details.conditions_tex);
    }, []);

    const handleSaveClick = () => {
        let sol = {
            "equation_id": equation,
            "description": description,
            "variable_summary": variableSummary,
            "usecase_summary": usecaseSummary,
            "reference_summary": referenceSummary,
            "training_summary": trainingSummary,
            "other_summary": otherSummary,
            "citation": citation,
            "equation_details": {
                "equation_tex": equationTex,
                "conditions_tex": conditionTex
            }
        }
        DataService.UpdateSolution(solution.id, sol)
            .then(function (response) {
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": "Solution saved successfully!", "severity": "info" }
                })
                updateRefresh();
            })
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };
    const handleDeleteConfirm = () => {
        notifications.dispatch({
            type: "HIDE_ALERT"
        });

        if (solution.name == solutionName) {
            DataService.DeleteSolution(solution.id)
                .then(function (response) {
                    setDeleteDialogOpen(false);
                    goBack();
                    notifications.dispatch({
                        type: "DISPLAY_ALERT",
                        payload: { "message": "Solution deleted successfully!", "severity": "info" }
                    })
                })
                .catch(function (error) {
                    console.log(error.response);
                    notifications.dispatch({
                        type: "DISPLAY_ALERT",
                        payload: { "message": "Could not delete solution", "severity": "error" }
                    })
                })

        } else {
            notifications.dispatch({
                type: "DISPLAY_ALERT",
                payload: { "message": "Solution name entered does not match original name", "severity": "error" }
            })
        }

    };
    const handleEquationTexChange = (val, index) => {
        var eqsTex = [...equationTex];
        console.log(eqsTex);
        eqsTex[index] = val;
        setEquationTex(eqsTex);
    }
    const handleConditionTexChange = (val, index) => {
        var eqsTex = [...conditionTex];
        eqsTex[index] = val;
        setConditionTex(eqsTex);
    }

    return (
        <div className={classes.root}>
            <div className={classes.spacer}></div>
            <Grid container spacing={2}>
                <Grid item md={12}>
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
                    </div>
                </Grid>
                <Grid item md={6}>
                    <div className={classes.inputContainer}>
                        {equationTex && equationTex.map((eq, index) =>
                            <TextField
                                label="Edit Equation"
                                placeholder="Equation"
                                helperText=""
                                fullWidth
                                multiline = {true}
                                rows={6}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                value={equationTex[index]}
                                onChange={(e) => handleEquationTexChange(e.target.value, index)}
                            />
                        )}
                    </div>
                </Grid>
                <Grid item md={6}>
                    <div className={classes.equationContainer}>
                        {equationTex && equationTex.map((eq, index) =>
                            <MathComponent tex={eq} key={index} />
                        )}
                    </div>
                </Grid>
                <Grid item md={6}>
                    <div className={classes.inputContainer}>
                        {conditionTex && conditionTex.map((eq, index) =>
                            <TextField
                                label="Edit Condition"
                                placeholder="Condition"
                                helperText=""
                                fullWidth
                                multiline = {true}
                                rows={2}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                value={conditionTex[index]}
                                onChange={(e) => handleConditionTexChange(e.target.value, index)}
                            />
                        )}
                    </div>
                </Grid>
                <Grid item md={6}>
                    <div className={classes.equationContainer}>
                        {conditionTex && conditionTex.map((eq, index) =>
                            <MathComponent tex={eq} key={index} />
                        )}
                    </div>
                </Grid>
                <Grid item md={6}>
                    <div className={classes.inputContainer}>

                        <TextField
                            label="Description"
                            placeholder="Description"
                            helperText=""
                            fullWidth
                            multiline = {true}
                            rows={4}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            label="References"
                            placeholder=""
                            helperText="Provide any links to any reference materials used. Note that you can also use markdown format."
                            fullWidth
                            multiline= {true}
                            rows={4}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={referenceSummary}
                            onChange={(e) => setReferenceSummary(e.target.value)}
                        />
                        <TextField
                            label="Citation"
                            placeholder=""
                            helperText="Enter citation details that others can use if referencing your work. Note that you can also use markdown format."
                            fullWidth
                            multiline= {true}
                            rows={4}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={citation}
                            onChange={(e) => setCitation(e.target.value)}
                        />
                    </div>
                </Grid>
                <Grid item md={6}>
                    <div className={classes.inputContainer}>

                        <TextField
                            label="Variables"
                            placeholder=""
                            helperText="Explain physical relevance of the variables used. Mention any non-dimensionalisation performed. Note that you can also use markdown format."
                            fullWidth
                            multiline= {true}
                            rows={4}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={variableSummary}
                            onChange={(e) => setVariableSummary(e.target.value)}
                        />
                        <TextField
                            label="Use Cases"
                            placeholder=""
                            helperText="What relevance does the equation hold. Describe the problem you are trying to solve. Note that you can also use markdown format."
                            fullWidth
                            multiline={true}
                            rows={4}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={usecaseSummary}
                            onChange={(e) => setUsecaseSummary(e.target.value)}
                        />
                        <TextField
                            label="Training Specifics"
                            placeholder=""
                            helperText="Give a general overview of your training procedure. Mention any hurdles faced, corresponding solution and it's effect on the overall solution. Note that you can also use markdown format."
                            fullWidth
                            multiline= {true}
                            rows={4}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={trainingSummary}
                            onChange={(e) => setTrainingSummary(e.target.value)}
                        />
                    </div>
                </Grid>
            </Grid>

            <div className={classes.spacer}></div>
            <div className={classes.buttonContainer}>
                <Button variant="outlined" color="primary" onClick={() => handleSaveClick()}>Save</Button>&nbsp;&nbsp;
                <Button variant="outlined" color="primary" onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
            </div>
            <div>
                <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                    <DialogTitle id="form-dialog-title">Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the solution name exactly as shown to confirm delete:
                            <Typography>
                                <strong>{solution.name}</strong>
                            </Typography>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Solution Name"
                            fullWidth
                            multiline = {true}
                            variant="outlined"
                            value={solutionName}
                            onChange={(e) => setSolutionName(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default withStyles(styles)(SolutionEdit);
