import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';

import AdminMenu from '../AdminMenu';
import DataService from "../../../services/DataService";
import styles from './styles';
import { handleAddClick, handleEditClick, handleSaveClick, handleCancelClick, handleDeleteClick } from './handlers';

const Equations = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== Equations ======================================");

    // Component States
    const [equations, setEquations] = useState([]);
    const loadEquations = () => {
        DataService.GetEquations()
            .then(function (response) {
                setEquations(response.data);
            })
    }
    const [add, setAdd] = useState(false);
    const [index, setIndex] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Setup Component
    useEffect(() => {
        loadEquations();
    }, []);

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false}>
                    <Grid container spacing={2}>
                        <Grid item sm={3}>
                            <AdminMenu page="equations" />
                        </Grid>
                        <Grid item sm={9}>
                            <div className={classes.spacer}></div>
                            <Typography variant="h6" gutterBottom>
                                Equations
                            </Typography>
                            <Divider />
                            {index &&
                                <div>
                                    <Toolbar className={classes.toolBar}>
                                        <div className={classes.grow} />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Icon>add</Icon>}
                                            onClick={() => handleAddClick(setAdd, setIndex)}
                                        >
                                            Add
                                        </Button>
                                    </Toolbar>
                                    <List>
                                        {equations && equations.map((uc, index) =>
                                            <ListItem className={classes.listItem} key={index}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <Icon>show_chart</Icon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={uc["name"]}
                                                />
                                                <IconButton edge="start" aria-label="edit" onClick={() => handleEditClick(uc, setName, setDescription, setAdd, setIndex)}>
                                                    <Icon>edit</Icon>
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(uc, setAdd, setIndex)}>
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </ListItem>
                                        )}
                                    </List>
                                </div>
                            }
                            {index && equations.length == 0 &&
                                <div className={classes.message}>
                                    <Typography gutterBottom>
                                        No data to display
                                    </Typography>
                                </div>
                            }

                            {!index &&
                                <div className={classes.formContainer}>
                                    <form noValidate autoComplete="off">
                                        <Typography gutterBottom>
                                            Add/Edit Equation
                                        </Typography>
                                        <div className={classes.inputContainer}>
                                            <TextField
                                                label="Equation"
                                                placeholder="Equation"
                                                helperText=""
                                                fullWidth
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <TextField
                                                label="Description"
                                                placeholder="Description"
                                                helperText=""
                                                fullWidth
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                        <div className={classes.buttonContainer}>
                                            <Button variant="outlined" color="primary" onClick={(event) => handleSaveClick(event, name, description, add, setName, setDescription, setAdd, setIndex, loadEquations)}>Save</Button>
                                            &nbsp;&nbsp;
                                            <Button variant="outlined" color="default" onClick={(event) => handleCancelClick(setName, setAdd, setIndex)}>Cancel</Button>
                                        </div>
                                    </form>
                                </div>
                            }
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Equations);