import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import SettingsMenu from '../SettingsMenu'
import AuthService, { useAuthContext } from "../../../services/AuthService";
import styles from './styles';
import { handleAddClick, handleDeleteClick } from './handlers'

const APIKeys = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== APIKeys ======================================");

    // Get Auth Context
    const auth = useAuthContext();

    // Component States
    const [apikeys, setApikeys] = useState([]);
    const loadApikeys = () => {
        AuthService.GetAPIKeys()
            .then(function (response) {
                setApikeys(response.data);
            })
    }
    const [showKeys, setShowKeys] = useState({});

    // Setup Component
    useEffect(() => {
        if (auth.state.isAuthenticated) {
            loadApikeys();
        }
    }, []);

    const showKey = (id) => {
        if (id in showKeys) {
            return showKeys[id];
        } else {
            return false;
        }
    }
    const handleClickShowKey = (event, id) => {
        var showKeysTmp = { ...showKeys };
        if (id in showKeysTmp) {
            showKeysTmp[id] = !showKeysTmp[id]
        } else {
            showKeysTmp[id] = true
        }
        setShowKeys(showKeysTmp);
    };

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="md" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item sm={4}>
                            <SettingsMenu page="apikeys" />
                        </Grid>
                        <Grid item sm={8}>
                            <Typography variant="h6" gutterBottom>
                                API Keys
                            </Typography>
                            <Divider />
                            <Toolbar className={classes.toolBar}>
                                <Typography>
                                    User API Keys
                                </Typography>
                                <div className={classes.grow} />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Icon>add</Icon>}
                                    onClick={(event) => handleAddClick(event, loadApikeys)}
                                >
                                    Key
                                </Button>
                            </Toolbar>
                            <List>
                                {apikeys && apikeys.map((apikey, index) =>
                                    <ListItem key={index}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">API Key</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type={showKey(apikey["id"]) ? 'text' : 'password'}
                                                value={apikey["key"]}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle key visibility"
                                                            onClick={(event) => handleClickShowKey(event, apikey["id"])}
                                                            onMouseDown={(event) => handleClickShowKey(event, apikey["id"])}
                                                            edge="end"
                                                        >
                                                            {showKey(apikey["id"]) ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                labelWidth={70}
                                            />
                                        </FormControl>
                                        <IconButton edge="end" aria-label="delete" onClick={(event) => handleDeleteClick(event, apikey["id"], loadApikeys)}>
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    </ListItem>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(APIKeys);