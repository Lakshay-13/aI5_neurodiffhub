import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { useNotificationContext } from "../../../services/NotificationService";
import DataService from "../../../services/DataService";
import SolutionHistory from '../SolutionHistory';
import styles from './styles';

const SolutionSubmit = (props) => {
    const { classes } = props;
    let { solution } = props;
    let { updateRefresh } = props;

    const notifications = useNotificationContext();

    // Component States
    const [comment, setComment] = useState('');

    // Setup Component
    useEffect(() => {
    }, []);

    const handleSubmitClick = () => {
        if (comment == '') {
            notifications.dispatch({
                type: "DISPLAY_ALERT",
                payload: { "message": "Comments are required", "severity": "warning" }
            })
            return;
        }
        DataService.SubmitSolution(solution.id, comment)
            .then(function (response) {
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": "Solution submitted for approval!", "severity": "success" }
                })
                updateRefresh();
            })
    };

    return (
        <div className={classes.root}>
            <div className={classes.spacer}></div>
            <div className={classes.inputContainer}>
                <TextField
                    label="Comments"
                    placeholder="Comments"
                    helperText=""
                    fullWidth
                    multiline
                    rows={5}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
            <div className={classes.spacer}></div>
            <div className={classes.buttonContainer}>
                <Button variant="outlined" color="primary" onClick={() => handleSubmitClick()}>Submit/Publish</Button>&nbsp;&nbsp;
            </div>
            <div className={classes.spacer}></div>
            <SolutionHistory solution={solution}></SolutionHistory>
        </div>
    );
};

export default withStyles(styles)(SolutionSubmit);