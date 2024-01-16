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

const Login = (props) => {
    const { classes } = props;
    let history = useHistory();

    console.log("================================== Login ======================================");

    // Get Auth Context
    const auth = useAuthContext();
    const notifications = useNotificationContext();

    // Component States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Setup Component
    useEffect(() => {
        if (isAuthenticated) {
            history.push('/')
        }

        return () => {
            notifications.dispatch({
                type: "HIDE_ALERT"
            })
        }
    }, [isAuthenticated]);

    const handleLoginClick = () => {
        if (username=='') {
            notifications.dispatch({
                type: "DISPLAY_ALERT",
                payload: { "message": "Please enter Username", "severity": "error" }
            })
        }
        else if (password=='') {
            notifications.dispatch({
                type: "DISPLAY_ALERT",
                payload: { "message": "Please enter Password", "severity": "error" }
            })
        }

        else {
        AuthService.Login(username, password)
            .then(function (response) {
                auth.dispatch({
                    type: "LOGIN",
                    payload: response.data
                })

                // Set authenticated flag
                setIsAuthenticated(true);

                // Get User Profile
                return AuthService.GetProfile()
            })
            .then(function (response) {
                let profile = response.data;
                auth.dispatch({
                    type: "PROFILE",
                    payload: profile
                })
            })
            .catch(function (error) {
                console.log(error.response);
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": error.response.data.detail, "severity": "error" }
                })
            })
        }
    };
    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="sm">
                    <Card>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Log In
                            </Typography>
                            <Typography color="textSecondary">
                                Don't have an account?&nbsp;<Link to="/signup">Sign up</Link>
                            </Typography>
                            <div className={classes.inputContainer}>
                                <TextField
                                    label="Username or email"
                                    placeholder="Username or email"
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <TextField
                                    label="Password"
                                    placeholder="Password"
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                    type="password"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className={classes.buttonContainer}>
                                <Button variant="outlined" color="primary" onClick={() => handleLoginClick()}>Login</Button>
                            </div>
                            <div>
                                <Link to="/reset_password">Forgot your password?</Link>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Login);