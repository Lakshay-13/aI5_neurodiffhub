import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { useNotificationContext } from "../../../services/NotificationService";
import DataService from "../../../services/DataService";
import styles from './styles';

const SolutionFeatured = (props) => {
    const { classes } = props;
    let { solution } = props;
    let { updateRefresh } = props;

    const notifications = useNotificationContext();

    // Component States
    const [featured, setFeatured] = useState(false);

    // Setup Component
    useEffect(() => {
        setFeatured(solution.featured)
    }, []);

    const handleSaveClick = () => {
        let sol = {
            "featured": featured
        }
        DataService.UpdateSolution(solution.id, sol)
            .then(function (response) {
                if (featured) {
                    notifications.dispatch({
                        type: "DISPLAY_ALERT",
                        payload: { "message": "Solution has been featured!", "severity": "success" }
                    })
                } else {
                    notifications.dispatch({
                        type: "DISPLAY_ALERT",
                        payload: { "message": "Solution has been removed from being featured!", "severity": "success" }
                    })
                }

                updateRefresh();
            })
    };

    return (
        <div className={classes.root}>
            <div className={classes.spacer}></div>
            <div className={classes.inputContainer}>
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
            <div className={classes.spacer}></div>
            <div className={classes.buttonContainer}>
                <Button variant="outlined" color="primary" onClick={() => handleSaveClick()}>Save</Button>&nbsp;&nbsp;
            </div>
        </div>
    );
};

export default withStyles(styles)(SolutionFeatured);