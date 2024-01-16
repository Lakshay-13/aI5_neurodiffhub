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

const UseCases = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== UseCases ======================================");

    // Component States
    const [useCases, setUseCases] = useState([]);
    const loadUseCases = () => {
        DataService.GetUseCases()
            .then(function (response) {
                setUseCases(response.data);
            })
    }
    const [add, setAdd] = useState(false);
    const [index, setIndex] = useState(true);
    const [name, setName] = useState('');

    // Setup Component
    useEffect(() => {
        loadUseCases();
    }, []);

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false}>
                    <Grid container spacing={2}>
                        <Grid item sm={3}>
                            <AdminMenu page="usecases" />
                        </Grid>
                        <Grid item sm={9}>
                            <div className={classes.spacer}></div>
                            <Typography variant="h6" gutterBottom>
                                Use Cases
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
                                        {useCases && useCases.map((uc, index) =>
                                            <ListItem className={classes.listItem} key={index}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <Icon>view_day</Icon>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={uc["name"]}
                                                />
                                                <IconButton edge="start" aria-label="edit" onClick={() => handleEditClick(uc, setName, setAdd, setIndex)}>
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
                            {index && useCases.length == 0 &&
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
                                            Add/Edit Use Case
                                        </Typography>
                                        <div className={classes.inputContainer}>
                                            <TextField
                                                label="Use case"
                                                placeholder="Use case"
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
                                        </div>
                                        <div className={classes.buttonContainer}>
                                            <Button variant="outlined" color="primary" onClick={(event) => handleSaveClick(event, name, add, setName, setAdd, setIndex, loadUseCases)}>Save</Button>
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

export default withStyles(styles)(UseCases);