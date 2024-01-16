import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { useNotificationContext } from "../../../services/NotificationService";
import DataService from "../../../services/DataService";
import SolutionHistory from '../SolutionHistory';
import styles from './styles';

const SolutionPublish = (props) => {
    const { classes } = props;
    let { solution } = props;
    let { updateRefresh } = props;
    const { history } = props;

    const notifications = useNotificationContext();

    // Component States
    const [comment, setComment] = useState('');

    // Setup Component
    useEffect(() => {
    }, []);

    const handlePublishClick = () => {
        if (comment == '') {
            notifications.dispatch({
                type: "DISPLAY_ALERT",
                payload: { "message": "Comments are required", "severity": "warning" }
            })
            return;
        }
        DataService.PublishSolution(solution.id, comment)
            .then(function (response) {
                //history.push("/admin/solutionsdashboard");
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": "Solution published successfully!", "severity": "success" }
                })
                updateRefresh();
            })
    };
    const handleRejectClick = () => {
        if (comment == '') {
            notifications.dispatch({
                type: "DISPLAY_ALERT",
                payload: { "message": "Comments are required", "severity": "warning" }
            })
            return;
        }
        DataService.RejectSolution(solution.id, comment)
            .then(function (response) {
                //history.push("/admin/solutionsdashboard");
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": "Solution has been rejected!", "severity": "success" }
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
                <Button variant="outlined" color="primary" onClick={() => handlePublishClick()}>Publish</Button>&nbsp;&nbsp;
                <Button variant="outlined" color="primary" onClick={() => handleRejectClick()}>Reject</Button>&nbsp;&nbsp;
            </div>
            <div className={classes.spacer}></div>
            <SolutionHistory solution={solution}></SolutionHistory>
        </div>
    );
};

export default withStyles(styles)(SolutionPublish);