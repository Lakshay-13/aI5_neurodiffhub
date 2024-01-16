import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useEnumContext } from "../../../services/EnumService";
import DataService from "../../../services/DataService";
import { epochToJsDate } from "../../../services/Common";
import styles from './styles';

const SolutionHistory = (props) => {
    const { classes } = props;
    let { solution } = props;

    const enums = useEnumContext();

    // Component States
    const [hubStatusHistory, setHubStatusHistory] = useState([]);
    const loadHubStatusHistory = () => {
        DataService.GetHubStatusHistory(solution.id)
            .then(function (response) {
                setHubStatusHistory(response.data);
            })
    }

    // Setup Component
    useEffect(() => {
        loadHubStatusHistory();
    }, []);

    return (
        <div className={classes.root}>
            <Typography variant="h6" display="block">
                History:
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hubStatusHistory && hubStatusHistory.map((history, idx) =>
                            <TableRow key={idx}>
                                <TableCell>{enums["hub_status_types"][history.hub_status]}</TableCell>
                                <TableCell>{history.comments}</TableCell>
                                <TableCell>{epochToJsDate(history.created_at)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default withStyles(styles)(SolutionHistory);