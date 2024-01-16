import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import Collapse from '@material-ui/core/Collapse';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useAuthContext } from "../../services/AuthService";
import { useNotificationContext } from "../../services/NotificationService";
import styles from './styles';

const Header = (props) => {
    const { classes } = props;

    console.log("================================== Header ======================================");

    // Get Auth Context
    const auth = useAuthContext();
    const notifications = useNotificationContext();

    // State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const [settingsMenuAnchorEl, setSettingsMenuAnchorEl] = useState(null);

    const errorTitles = {
        "error": "Error",
        "info": "Info",
        "warning": "Warning"
    }

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open)
    };
    const openSettingsMenu = (event) => {
        setSettingsMenuAnchorEl(event.currentTarget);
    };
    const closeSettingsMenu = (event) => {
        setSettingsMenuAnchorEl(null);
    };
    const closeNotificationAlert = () => {
        notifications.dispatch({
            type: "HIDE_ALERT"
        })
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" elevation={0}>
                <Toolbar variant="dense">
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Link to="/" className={classes.appLink}>
                        <Typography className={classes.appTitle} >
                            NeuroDiff
                        </Typography>
                    </Link>

                    <div className={classes.grow} />
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search diff. equations, solutions, users..."
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>

                    <div>
                        <IconButton color="inherit" component={Link} to="/solutions">
                            <Icon>model_training</Icon>
                            <Typography variant="caption">&nbsp;Solutions</Typography>
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/docs/getting_started">
                            <Icon>list</Icon>
                            <Typography variant="caption">&nbsp;Resources</Typography>
                        </IconButton>
                        <IconButton color="inherit" component={Link} to={{ pathname: "https://pypi.org/project/neurodiffeq/" }} target="_blank">
                            <Icon>insights</Icon>
                            <Typography variant="caption">&nbsp;NeurodiffEq</Typography>
                        </IconButton>
                        <IconButton aria-haspopup="true" color="inherit">
                            <Icon>more_vert</Icon>
                        </IconButton>
                        {auth.state.isAuthenticated &&
                            <>
                                <IconButton color="inherit" onClick={openSettingsMenu}>
                                    <AccountCircle fontSize="small" />
                                </IconButton>
                                <Menu
                                    anchorEl={settingsMenuAnchorEl}
                                    keepMounted
                                    open={Boolean(settingsMenuAnchorEl)}
                                    onClose={closeSettingsMenu}
                                >
                                    <MenuItem component={Link} to={{ pathname: "/user/" + auth.state.username }} onClick={closeSettingsMenu}>My Solutions</MenuItem>
                                    <Divider />
                                    <MenuItem component={Link} to="/settings/profile" onClick={closeSettingsMenu}>Settings</MenuItem>
                                    <Divider />
                                    {auth.state.account_type == "admin" &&
                                        <>
                                            <MenuItem component={Link} to="/admin/solutionsdashboard" onClick={closeSettingsMenu}>Admin</MenuItem>
                                            <Divider />
                                        </>
                                    }
                                    <MenuItem component={Link} to="/logout" onClick={closeSettingsMenu}>Logout</MenuItem>
                                </Menu>
                            </>
                        }
                        {!auth.state.isAuthenticated &&
                            <IconButton color="inherit" component={Link} to="/login">
                                <Icon>login</Icon>
                                <Typography variant="caption">&nbsp;Login</Typography>
                            </IconButton>
                        }
                        {!auth.state.isAuthenticated &&
                            <IconButton color="inherit" component={Link} to="/signup">
                                <Icon>person_add_alt</Icon>
                                <Typography variant="caption">&nbsp;Sign up</Typography>
                            </IconButton>
                        }

                    </div>
                </Toolbar>
            </AppBar>
            <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <div className={classes.list}>
                        <List>
                            <ListItem button key='home' component={Link} to="/">
                                <ListItemIcon><Icon>home</Icon></ListItemIcon>
                                <ListItemText primary='Home' />
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem button key='menuitem12' component={Link} to="/settings/profile">
                                <ListItemIcon><Icon>settings_applications</Icon></ListItemIcon>
                                <ListItemText primary='Settings' />
                            </ListItem>

                        </List>
                    </div>
                </div>
            </Drawer>
            <Collapse
                className={classes.alertContainer}
                in={notifications.state.displayAlert}
            >
                <Alert
                    onClose={closeNotificationAlert}
                    severity={notifications.state.severity}
                >
                    <AlertTitle>
                        {errorTitles[notifications.state.severity]}
                    </AlertTitle>
                    {notifications.state.message}
                </Alert>
            </Collapse>
        </div>
    );
}

export default withStyles(styles)(Header);
