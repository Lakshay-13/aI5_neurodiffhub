import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


import SettingsMenu from '../SettingsMenu'
import { useAuthContext } from "../../../services/AuthService";
import { useNotificationContext } from "../../../services/NotificationService";
import DataService from "../../../services/DataService";
import styles from './styles';

import TextField from '@material-ui/core/TextField';
import { handleAddClick, handleEditClick, handleSaveClick, handleDeleteClick, handleBackClick, handleDeleteUserClick, handleAddUserClick } from './handlers';

const Projects = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== Projects ======================================");

    // Get Auth Context
    const auth = useAuthContext();
    const notifications = useNotificationContext();

    // Component States
    const [projects, setProjects] = useState([]);
    const loadProjects = () => {
        DataService.GetProjects()
            .then(function (response) {
                setProjects(response.data);
            })
    }
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const [index, setIndex] = useState(true);
    const [name, setName] = useState(null);
    const [descrip, setDescrip] = useState('');
    const [pid, setPid] = useState(0);
    const [users, setUsers] = useState([]);
    const [is_owner, setIsOwner] = useState(0);
    const [permission, setPermission] = useState("read");
    const [del_name, setDelName] = useState("");
    const [isPublic, setIsPublic] = useState(false);


    //To see the Edit Status or Not
    // Component States
    const [view, setView] = useState(true);
    const [allowEdit, setAllowEdit] = useState(false);

    const switchEditView = () => {
        setView(!view);
    }

    const loadProjectUser = (project_id) => {
        DataService.GetProject(project_id)
            .then(function (response) {
                setUsers(response.data.users);
                setIsOwner(response.data.is_owner);
                setIsPublic(response.data.is_public);
            })
    }

    const [searchusers, setSearchUsers] = useState([]);
    const [searchuser, setSearchUser] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState([false, {}]);


    const handleSearchChange = (q) => {
        setSearchUsers([]);
        setLoading(true);
        console.log(q);

        if (q == '') {
            return;
        }

        DataService.SearchUsers(q)
            .then(function (response) {
                setSearchUsers(response.data);
                setLoading(false);
            })

    };

    const handleModal = (val, proj) => {
        console.log(val);
        console.log(proj);
        setModalIsOpen([val, proj]);
        setDelName('');
        console.log('Setting');
        console.log(modalIsOpen[0]);
        console.log(modalIsOpen[1]);
    }

    const handleSelectChange = (option, value) => {
        console.log(option);
        console.log(value);
        setSearchUser(value);
    };


    // Setup Component
    useEffect(() => {
        //Should include authenticated component? if(auth.state.isAuthenticated)
        loadProjects();
        handleModal(false, {});
        setDelName('');
        return () => {
            notifications.dispatch({
                type: "HIDE_ALERT"
            })
        }

    }, []);


    const handleDeleteClick = (project) => {

        DataService.GetProject(project["id"])
            .then(function (response) {
                console.log("Project Deets");
                console.log(response.data);
                let details = {
                    "projectname": response.data.projectname,
                    "projectdescription": response.data.description,
                    "projectstatus": "Deleted Project",
                    "users": response.data.users

                }
                console.log(details);
                DataService.DeleteProject(project["id"])
                    .then(function (response) {
                        console.log('Deleted!');
                        DataService.NotifyProjectDetails(details)
                            .then(function (response) {
                                console.log(response);
                                console.log("worked!");
                            })
                            .catch(err => {
                                console.log(err.response);
                            })
                        loadProjects();
                        setDelName('');
                        handleModal(false, {});
                        notifications.dispatch({
                            type: "DISPLAY_ALERT",
                            payload: { "message": "Project Deleted", "severity": "info" }
                        })

                    })
                    .catch(err => {
                        console.log(err);
                        notifications.dispatch({
                            type: "DISPLAY_ALERT",
                            payload: { "message": err.response.data.detail, "severity": "error" }
                        })
                        setDelName('');
                        handleModal(false, {});
                        //alert("No Access to this Project");
                    })
            })
            .catch(err => {
                console.log("Error in getting project details to delete");
                console.log(err);
            })
    };


    const handleDeleteUserClick = (username) => {

        console.log(username);
        console.log(pid);
        let proj_id = {
            "projectid": pid
        }
        DataService.DeleteProjectUser(username, proj_id)
            .then(function (response) {
                console.log('Deleted!');
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": "User Deleted", "severity": "info" }
                })
                loadProjectUser(pid);
                let notify = {
                    "username": username,
                    "permission_given": "revoked all",
                    "projectid": pid,
                    "projectstatus": "removed you from their project"
                }
                console.log(notify)
                DataService.NotifyProjectChange(notify)
                    .then(function (response) {
                        console.log("Worked!!");
                        console.log(response);
                    })
                    .catch(err => {
                        console.log(err);
                        notifications.dispatch({
                            type: "DISPLAY_ALERT",
                            payload: { "message": err.response.data.detail, "severity": "error" }
                        })
                    })

            })
            .catch(err => {
                console.log(err);
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": err.response.data.detail, "severity": "error" }
                })

                //alert("No Access to this Project");
            })
    };

    const handleAddUserClick = (username) => {
        let project = {
            "projectid": pid,
            "permission_type": permission
        }
        DataService.UpdateProjectUser(username, project)
            .then(function (response) {
                console.log('User Added!');
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": "User Added", "severity": "info" }
                })
                loadProjectUser(pid);
                let notify = {
                    "username": username,
                    "permission_given": permission,
                    "projectid": pid,
                    "projectstatus": "added you to their project"
                }
                console.log(notify)
                DataService.NotifyProjectChange(notify)
                    .then(function (response) {
                        console.log("Worked!!");
                        console.log(response);
                    })
                    .catch(err => {
                        console.log(err);
                        notifications.dispatch({
                            type: "DISPLAY_ALERT",
                            payload: { "message": err.response.data.detail, "severity": "error" }
                        })
                    })

            })
            .catch(err => {
                console.log(err);
                notifications.dispatch({
                    type: "DISPLAY_ALERT",
                    payload: { "message": err.response.data.detail, "severity": "error" }
                })

            })
    };

    const handleSaveClick = (pid, add, edit, event, name, descrip, setName, setDescrip, setAdd, setIndex, setEdit, loadProjects) => {
        console.log({ name });
        let project = {
            "projectname": name,
            "description": descrip,
            "is_public": isPublic,

        }
        console.log({ project });
        console.log(pid);
        console.log(users);
        console.log({ add });
        if (add) {
            DataService.CreateProject(project)
                .then(function (response) {
                    let project = response.data;
                    console.log(project);
                    setAdd(false);
                    setIndex(true);
                    setEdit(false);
                    setName(null);
                    setDescrip('');
                    loadProjects();
                    notifications.dispatch({
                        type: "DISPLAY_ALERT",
                        payload: { "message": "Project Created", "severity": "info" }
                    })

                })
                .catch(err => {
                    console.log(err.response);
                    if (err.response.status == 422) {
                        notifications.dispatch({
                            type: "DISPLAY_ALERT",
                            payload: { "message": "Name cannot be Empty", "severity": "error" }
                        })

                    }
                    else {
                        notifications.dispatch({
                            type: "DISPLAY_ALERT",
                            payload: { "message": err.response.data.detail, "severity": "error" }
                        })
                    }

                })
        }
        console.log({ setEdit });
        console.log({ edit });

        if (edit) {
            DataService.UpdateProject(pid, project)
                .then(function (response) {
                    console.log('Hiii');
                    let project = response.data;
                    console.log(project);
                    let details = {
                        "projectname": name,
                        "projectdescription": descrip,
                        "projectstatus": "edited project",
                        "users": users

                    }
                    console.log(details);
                    DataService.NotifyProjectDetails(details)
                        .then(function (response) {
                            console.log(response);
                            console.log("worked!");
                        })
                        .catch(err => {
                            console.log(err.response);
                        })

                    setAdd(false);
                    setEdit(false);
                    setIndex(true);
                    setName(null);
                    setDescrip('');
                    switchEditView();
                    loadProjects();
                    notifications.dispatch({
                        type: "DISPLAY_ALERT",
                        payload: { "message": "Project Updated", "severity": "info" }
                    })


                })
                .catch(err => {
                    console.log(err);
                    notifications.dispatch({
                        type: "DISPLAY_ALERT",
                        payload: { "message": err.response.data.detail, "severity": "error" }
                    })

                })
        }
    };





    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="md" className={classes.container}>
                    <Grid container spacing={2}>
                        <Grid item sm={4}>
                            <SettingsMenu page="projects" />
                        </Grid>
                        <Grid item sm={8}>
                            <Typography variant="h6" gutterBottom>
                                Projects
                            </Typography>
                            <Divider />
                            {index &&
                                <div>
                                    <Toolbar className={classes.toolBar}>
                                        <Typography>
                                            User Projects
                                        </Typography>
                                        <div className={classes.grow} />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Icon>add</Icon>}
                                            onClick={() => handleAddClick(setAdd, setIndex)}
                                        >
                                            Project
                                        </Button>
                                    </Toolbar>
                                    <List>
                                        {projects && projects.map((project, index) =>
                                            <ListItem className={classes.listItem} key={index}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <Icon>folder</Icon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={project["projectname"]}
                                                    secondary={project["description"]}
                                                />
                                                <IconButton edge="end" aria-label="manage" onClick={() => handleEditClick(loadProjectUser, setAllowEdit, project, pid, setName, setDescrip, setAdd, setIndex, setEdit, setPid)}>
                                                    <Icon>settings</Icon>
                                                </IconButton>
                                                <IconButton edge="end" aria-label="manage" onClick={() => handleModal(true, project)}>
                                                    <DeleteIcon>
                                                        Delete
                                                    </DeleteIcon>
                                                </IconButton>
                                            </ListItem>
                                        )}
                                    </List>
                                    <div>
                                        <Dialog open={modalIsOpen[0]} onClose={() => handleModal(false, {})}>
                                            <DialogTitle id="form-dialog-title">Delete</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Please enter the project name exactly as shown to confirm delete:
                                                    <Typography>
                                                        <strong>{modalIsOpen[1]["projectname"]}</strong>
                                                    </Typography>
                                                </DialogContentText>
                                                <TextField
                                                    label="Project Name"
                                                    placeholder="Project Name"
                                                    helperText=""
                                                    fullWidth
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    value={del_name}
                                                    onChange={(e) => setDelName((e.target.value == '') ? null : e.target.value)}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => handleModal(false, {})} color="primary">
                                                    Cancel
                                                </Button>

                                                {modalIsOpen[1]["projectname"] == del_name &&

                                                    <button className={classes.del_button} onClick={() => handleDeleteClick(modalIsOpen[1])}>
                                                        Delete Project
                                                    </button>

                                                }
                                            </DialogActions>
                                        </Dialog>

                                    </div>
                                </div>}

                            {index && projects.length == 0 &&
                                <div className={classes.message}>
                                    <Typography gutterBottom>
                                        No Projects to display
                                    </Typography>
                                </div>
                            }

                            {!index && !view && allowEdit && !add &&
                                <div className={classes.formContainer}>
                                    <form noValidate autoComplete="off">
                                        <Typography gutterBottom>
                                            Edit Project
                                        </Typography>
                                        <div className={classes.inputContainer}>
                                            <TextField
                                                label="Project Name"
                                                placeholder="Project Name"
                                                helperText=""
                                                fullWidth
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                value={name}
                                                onChange={(e) => setName((e.target.value == '') ? null : e.target.value)}
                                            />
                                            <TextField
                                                label="Project Description"
                                                placeholder="Project Description"
                                                helperText=""
                                                fullWidth
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                value={descrip}
                                                onChange={(e) => setDescrip(e.target.value)}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isPublic}
                                                        onClick={() => setIsPublic(!isPublic)}
                                                        color="primary"
                                                    />
                                                }
                                                label="Is Public"
                                            />
                                            <br />
                                        </div>
                                        <div className={classes.buttonContainer}>
                                            <Button variant="outlined" color="primary" onClick={(event) => handleSaveClick(pid, add, edit, event, name, descrip, setName, setDescrip, setAdd, setIndex, setEdit, loadProjects)}>Click to Save</Button>
                                            &nbsp;&nbsp;
                                            <Button variant="outlined" color="default" onClick={() => switchEditView()}>Cancel</Button>
                                        </div>
                                    </form>
                                </div>
                            }

                            {!index && add &&
                                <div className={classes.formContainer}>
                                    <form noValidate autoComplete="off">
                                        <Typography gutterBottom>
                                            Add Project
                                        </Typography>
                                        <div className={classes.inputContainer}>
                                            <TextField
                                                label="Project Name"
                                                placeholder="Project Name"
                                                helperText=""
                                                fullWidth
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                value={name}
                                                onChange={(e) => setName((e.target.value == '') ? null : e.target.value)}
                                            />
                                            <TextField
                                                label="Project Description"
                                                placeholder="Project Description"
                                                helperText=""
                                                fullWidth
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                value={descrip}
                                                onChange={(e) => setDescrip(e.target.value)}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isPublic}
                                                        onClick={() => setIsPublic(!isPublic)}
                                                        color="primary"
                                                    />
                                                }
                                                label="Is Public"
                                            />
                                            <br />
                                        </div>
                                        <div className={classes.buttonContainer}>
                                            <Button variant="outlined" color="primary" onClick={(event) => handleSaveClick(pid, add, edit, event, name, descrip, setName, setDescrip, setAdd, setIndex, setEdit, loadProjects)}>Save</Button>
                                            &nbsp;&nbsp;
                                            <Button variant="outlined" color="default" onClick={() => handleBackClick(setName, setEdit, setAdd, setIndex, setDescrip, loadProjects)}>Cancel</Button>
                                        </div>
                                    </form>
                                </div>
                            }



                            {view && !add &&
                                <div>
                                    <br></br>
                                    <Typography variant="h5" color="textSecondary">{name}</Typography>
                                    <br></br>
                                    <Typography display="block">{descrip}</Typography>
                                    <br></br>
                                    <br></br>
                                </div>
                            }
                            {!index && view && !add &&
                                <div>
                                    <div className={classes.buttonContainer}>
                                        <Button variant="outlined" color="primary" onClick={() => handleBackClick(setName, setEdit, setAdd, setIndex, setDescrip, loadProjects)}>Back</Button>
                                        &nbsp;&nbsp;
                                        {allowEdit &&
                                            <Button variant="outlined" color="primary" onClick={() => switchEditView()}>Edit</Button>
                                        }
                                    </div>
                                </div>
                            }

                            {!index && !add && view &&
                                <List>
                                    <Typography variant="h6" gutterBottom>
                                        Users
                                    </Typography>
                                    <Divider />

                                    {!!is_owner &&
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
                                                    options={searchusers}
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
                                            {searchuser &&
                                                <div>
                                                    <FormControl variant="outlined" fullWidth>
                                                        <InputLabel id="user_permission">Permission</InputLabel>
                                                        <Select
                                                            labelId="user_permission"
                                                            id="permission_user"
                                                            label="Permission"
                                                            value={permission}
                                                            onChange={(e) => setPermission(e.target.value)}
                                                        >
                                                            <MenuItem value="read">
                                                                <em>Read</em>
                                                            </MenuItem>
                                                            <MenuItem value="readwrite">
                                                                <em>Read and Write</em>
                                                            </MenuItem>
                                                            <MenuItem value="owner">
                                                                <em>Owner</em>
                                                            </MenuItem>

                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            }
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            {searchuser &&

                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Icon>add</Icon>}
                                                    onClick={() => handleAddUserClick(searchuser.username)}
                                                >
                                                    Add
                                                </Button>
                                            }
                                        </Toolbar>
                                    }

                                    {users && users.map((user, index) =>
                                        <ListItem className={classes.listItem} key={index}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AccountCircleIcon>User</AccountCircleIcon>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user["username"]}
                                                secondary={user["permission_type"]}
                                            />
                                            {!!is_owner &&
                                                <div>
                                                    <IconButton edge="end" aria-label="manage" onClick={() => handleDeleteUserClick(user["username"])}>
                                                        <DeleteIcon>
                                                            Delete
                                                        </DeleteIcon>
                                                    </IconButton>
                                                </div>
                                            }

                                        </ListItem>
                                    )}
                                </List>

                            }




                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Projects);