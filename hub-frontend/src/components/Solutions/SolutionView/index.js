import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';

import DataService from "../../../services/DataService";
import { useAuthContext } from "../../../services/AuthService";
import { useEnumContext } from "../../../services/EnumService";
import { useNotificationContext } from "../../../services/NotificationService";
import SolutionDetails from '../SolutionDetails';
import SolutionVersions from '../SolutionVersions';
import SolutionEdit from '../SolutionEdit';
import SolutionSubmit from '../SolutionSubmit';
import SolutionPublish from '../SolutionPublish';
import SolutionFeatured from '../SolutionFeatured';
import styles from './styles';
import './index.css';

const SolutionView = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== SolutionView ======================================");

    let id = props.match.params.id;
    console.log(id);

    // Get Auth Context
    const auth = useAuthContext();
    const enums = useEnumContext();
    const notifications = useNotificationContext();

    // Component States
    const [refresh, setRefresh] = useState(0);
    const [allowEdit, setAllowEdit] = useState(false);
    const loadMode = () => {
        DataService.CheckSolutionAccess(id)
            .then(function (response) {
                //let access = response.data;
                let permission_type = response.data["permission_type"];
                if ((permission_type == "owner") || (permission_type == "readwrite")) {
                    setAllowEdit(true);
                }
            })
    }
    const [solution, setSolution] = useState({});
    const loadSolution = () => {
        DataService.GetSolution(id)
            .then(function (response) {
                setSolution(response.data);
                selectTab('details');
            })
    }
    const [tabs, setTabs] = useState({
        'details': true,
        'versions': false,
        'edit': false,
        'submit': false,
        'publish': false,
        'featured': false
    });

    // Setup Component
    useEffect(() => {
        loadMode();
        return () => {
            notifications.dispatch({
                type: "HIDE_ALERT"
            })
        }
    }, []);
    useEffect(() => {
        loadSolution();
    }, [refresh]);

    const updateRefresh = () => {
        setRefresh(refresh + 1);
        //selectTab('details');
    }
    const goBack = () => {
        history.goBack();
    }

    const getStatusIcon = () => {
        if (solution["hub_status"] == "published") {
            return <Icon style={{ "color": "#31a354" }}>public</Icon>
        } else if(solution["hub_status"] == "submitted"){
            return <Icon style={{ "color": "yellow" }}>vpn_lock</Icon>
        } else if(solution["hub_status"] == "rejected"){
            return <Icon style={{ "color": "#de2d26" }}>block</Icon>
        }
        else {
            return <Icon style={{ "color": "orange" }}>vpn_lock</Icon>
        }
    }
    const tabStyle = (tab) => {
        let style = { color: "#7c7c7c" };

        if (tabs[tab] == true) {
            style = { color: "#3E3E3E" };
        }

        return style;
    }
    const selectTab = (tab) => {
        let tabsCopy = { ...tabs };
        for (var t in tabsCopy) {
            tabsCopy[t] = false;
        }

        tabsCopy[tab] = true;
        setTabs(tabsCopy);
    }


    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="lg">
                    <div className={classes.container}>
                        <Toolbar className={classes.toolBar}>
                            <Icon className={classes.labelIcon}>label</Icon>
                            <Typography variant="h5" color="textSecondary">
                                &nbsp;{solution.label}
                            </Typography>
                            <div className={classes.grow} />
                            {getStatusIcon()}
                            <Typography display="block" variant="caption" align="justify">
                                &nbsp;{enums["hub_status_types"][solution.hub_status]}
                            </Typography>
                        </Toolbar>
                        <Toolbar className={classes.toolBar}>
                            <Typography className={classes.tabSwitchText} style={tabStyle('details')} onClick={() => selectTab('details')}>
                                Solution Details
                            </Typography>
                            <Typography className={classes.tabSwitchText} style={tabStyle('versions')} onClick={() => selectTab('versions')}>
                                Versions
                            </Typography>
                            {allowEdit &&
                                <Typography className={classes.tabSwitchText} style={tabStyle('edit')} onClick={() => selectTab('edit')}>
                                    Edit
                                </Typography>
                            }
                            {allowEdit && solution["hub_status"] != "submitted" &&
                                <Typography className={classes.tabSwitchText} style={tabStyle('submit')} onClick={() => selectTab('submit')}>
                                    Submit
                                </Typography>
                            }
                            {auth.state.account_type == "admin" && solution["hub_status"] == "submitted" &&
                                <Typography className={classes.tabSwitchText} style={tabStyle('publish')} onClick={() => selectTab('publish')}>
                                    Publish
                                </Typography>
                            }
                            {auth.state.account_type == "admin" && solution["hub_status"] == "published" &&
                                <Typography className={classes.tabSwitchText} style={tabStyle('featured')} onClick={() => selectTab('featured')}>
                                    Featured
                                </Typography>
                            }

                            <div className={classes.grow} />
                        </Toolbar>
                        <Divider />
                        {tabs && tabs.details && solution &&
                            <SolutionDetails solution={solution}></SolutionDetails>
                        }
                        {tabs && tabs.versions && solution &&
                            <SolutionVersions solution={solution}></SolutionVersions>
                        }
                        {tabs && tabs.edit && solution &&
                            <SolutionEdit solution={solution} updateRefresh={updateRefresh} goBack={goBack}></SolutionEdit>
                        }
                        {tabs && tabs.submit && solution &&
                            <SolutionSubmit solution={solution} updateRefresh={updateRefresh} history={history}></SolutionSubmit>
                        }
                        {tabs && tabs.publish && solution &&
                            <SolutionPublish solution={solution} updateRefresh={updateRefresh} history={history}></SolutionPublish>
                        }
                        {tabs && tabs.featured && solution &&
                            <SolutionFeatured solution={solution} updateRefresh={updateRefresh} history={history}></SolutionFeatured>
                        }
                    </div>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(SolutionView);