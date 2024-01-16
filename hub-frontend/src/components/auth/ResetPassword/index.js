import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from "react-router-dom";
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import AuthService, { useAuthContext } from "../../../services/AuthService";
import { useNotificationContext } from "../../../services/NotificationService";
import styles from './styles';

const ResetPassword = (props) => {
    const { classes } = props;
    let history = useHistory();

    console.log("================================== ResetPassword ======================================");

    // Get Auth Context
    const auth = useAuthContext();
    const notifications = useNotificationContext();

    // Component States
    const [email, setEmail] = useState('');

    // Setup Component
    useEffect(() => {
        return () => {
            notifications.dispatch({
                type: "HIDE_ALERT"
            })
        }
    }, []);

    const handleResetPasswordClick = () => {
        AuthService.ResetPassword(email)
            .then(function (response) {
                console.log(response.data);
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": "Check your email for new password", "severity": "info" }
                })
            })
            .catch(function (error) {
                console.log(error.response);
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": error.response.data.detail, "severity": "error" }
                })
            })
    };
    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="sm">
                    <Card>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Reset Password
                            </Typography>
                            <Typography color="textSecondary">
                                Enter your account email to reset your password
                            </Typography>
                            <div className={classes.inputContainer}>
                                <TextField
                                    label="Email"
                                    placeholder="Email"
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={classes.buttonContainer}>
                                <Button variant="outlined" color="primary" onClick={() => handleResetPasswordClick()}>Reset Password</Button>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(ResetPassword);