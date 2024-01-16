import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';

import styles from './styles';
import DataService from "../../../services/DataService";
import { GetUserDisplayName, GetUserInitials } from "../../../services/Common";

const TopContributors = (props) => {
    const { classes } = props;
    const { history } = props;

    // Component States
    const [users, setUsers] = useState(null);
    const loadUsers = () => {
        DataService.GetTopContributors()
            .then(function (response) {
                let usrs = response.data;
                usrs.map((itm) => {
                    itm["display_name"] = GetUserDisplayName(itm["username"], itm["full_name"]);
                    itm["initials"] = GetUserInitials(itm["display_name"])
                })
                setUsers(usrs);
            })
    }

    // Setup Component
    useEffect(() => {
        loadUsers();
    }, []);

    const goToViewtUser = (row) => {
        history.push("/user/" + row.username)
    }

    return (
        <Container maxWidth={false} className={classes.blockContainer}>
            <Grid container spacing={2}>
                <Grid item sm={4}>
                    <Typography variant="h6" gutterBottom>
                        Top Contributors
                    </Typography>
                    <div>
                        What to share your solutions built on Neurodiffeq library? Signup and start sharing your solutions to the community.
                    </div>
                </Grid>
                <Grid item sm={8}>
                    {users && users.map((user, index) =>
                        <Grid item xs={12} md={3} key={index}>
                            <Card >
                                <CardHeader
                                    onClick={() => goToViewtUser(user)}
                                    avatar={
                                        <Avatar aria-label="user" className={classes.avatar}>
                                            {user.initials}
                                        </Avatar>
                                    }
                                    title={user.display_name}
                                    className={classes.cardHeader}
                                />
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default withStyles(styles)(TopContributors);