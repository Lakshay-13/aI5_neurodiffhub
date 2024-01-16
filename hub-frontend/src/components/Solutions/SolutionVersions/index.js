import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DataService from "../../../services/DataService";
import { epochToJsDate, getUserName } from "../../../services/Common";
import styles from './styles';

const SolutionVersions = (props) => {
    const { classes } = props;
    let { solution } = props;

    // Component States
    const [solutionVersions, setSolutionVersions] = useState([]);
    const loadSolutionVersions = () => {
        DataService.GetSolutionVersions(solution.id)
            .then(function (response) {
                console.log("Soln Data:");
                console.log(response);
                setSolutionVersions(response.data);
            })
    }

   
    // Setup Component
    useEffect(() => {
        loadSolutionVersions();
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.spacer}></div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Updated By</TableCell>
                            <TableCell>Updated At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {solutionVersions && solutionVersions.map((version, index) =>
                            <TableRow key={index}>
                                <TableCell>{version.version}</TableCell>
                                <TableCell>{version.description}</TableCell>
                                <TableCell>{version.username}</TableCell>
                                <TableCell>{epochToJsDate(version.updated_at)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default withStyles(styles)(SolutionVersions);