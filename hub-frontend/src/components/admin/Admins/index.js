import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import AdminMenu from '../AdminMenu';
import DataService from "../../../services/DataService";
import { useNotificationContext } from "../../../services/NotificationService";
import styles from './styles';

const Admins = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== Admins ======================================");

    // Get Auth Context
    const notifications = useNotificationContext();

    // Component States
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const loadAdmins = () => {
        DataService.GetUsersByType('admin')
            .then(function (response) {
                setAdmins(response.data);
            })
    }

    // Setup Component
    useEffect(() => {
        loadAdmins();
    }, []);

    const handleDelete = (event, user_name) => {
        console.log(user_name);
        DataService.RemoveAdmin(user_name)
        .then(function (response) {
            loadAdmins();
        })
        .catch(err => {
            console.log(err);
            notifications.dispatch({
                type: "DISPLAY_ALERT",
                payload: { "message": err.response.data.detail, "severity": "error" }
            })
        })      
    };
    const handleSearchChange = (q) => {
        setUsers([]);
        setLoading(true);
        console.log(q);

        if (q == '') {
            return;
        }

        DataService.SearchUsers(q)
            .then(function (response) {
                setUsers(response.data);
                setLoading(false);
            })

    };
    const handleSelectChange = (option, value) => {
        console.log(option);
        console.log(value);
        setUser(value);
    };
    const handleAddClick = () => {  
        if (user) {
            DataService.AddAdmin(user.username)
                .then(function (response) {
                    setUser(null);
                    loadAdmins();
                })

        }
    };

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false}>
                    <Grid container spacing={2}>
                        <Grid item sm={3}>
                            <AdminMenu page="admins" />
                        </Grid>
                        <Grid item sm={9}>
                            <div className={classes.spacer}></div>
                            <Typography variant="h6" gutterBottom>
                                Manage Admins
                            </Typography>
                            <Divider />
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
                                        onChange={(event, value) => handleSelectChange(event, value)}
                                        options={users}
                                        getOptionSelected={(option, value) => option.username === value.username}
                                        getOptionLabel={(option) => option.username}
                                        loading={loading}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search user"
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
                                                value={search}
                                                onChange={(e) => handleSearchChange(e.target.value)}
                                            />
                                        )}
                                    />
                                </div>
                                {user &&
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Icon>add</Icon>}
                                        onClick={() => handleAddClick()}
                                    >
                                        Add
                                    </Button>
                                }
                            </Toolbar>
                            <div className={classes.listContainer}>
                                {admins && admins.map((user, index) =>
                                    <Chip
                                        icon={<Icon>face</Icon>}
                                        label={user.username}
                                        clickable
                                        onDelete={(event) => handleDelete(event, user.username)}
                                        deleteIcon={<Icon>cancel</Icon>}
                                    />
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Admins);