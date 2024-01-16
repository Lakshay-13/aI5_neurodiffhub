import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'

import styles from './styles';

const Docs = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== Docs ======================================");

    let page = props.match.params.page;
    console.log(page);

    // Component States
    const [markdown, setMarkdown] = useState('');

    // Setup Component
    useEffect(() => {
        import('./markdowns/' + page + '.md')
            .then(res => {
                fetch(res.default)
                    .then(res => res.text())
                    .then(res => setMarkdown(res))
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }, [props.match.params.page]);

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={4}>
                        <Grid item sm={3}>
                            <MenuList>
                                <MenuItem selected={page == 'introduction'} component={Link} to="/docs/introduction">Introduction</MenuItem>
                                <Divider />
                                <MenuItem selected={page == 'getting_started'} component={Link} to="/docs/getting_started">Getting Started</MenuItem>
                                <Divider />
                            </MenuList>
                        </Grid>
                        <Grid item sm={9}>
                            <ReactMarkdown>
                                {markdown}
                            </ReactMarkdown>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Docs);