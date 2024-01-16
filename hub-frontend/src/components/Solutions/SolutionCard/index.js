import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';

import styles from './styles';
import { useEnumContext } from "../../../services/EnumService";
import Equations from "../../Equations";
import SampleSolutionPlot from '../SampleSolutionPlot';

const SolutionCard = (props) => {
    const { classes } = props;
    let { solution } = props;
    let { clickHandle } = props;
    let { showStatus } = props;
    let { showEquation } = props;
    let { plotWidth } = props;
    let { plotHeight } = props;

    if (showEquation == null) {
        showEquation = true;
    }
    if (plotWidth == null) {
        plotWidth = 350;
    }
    if (plotHeight == null) {
        plotWidth = 170;
    }

    const enums = useEnumContext();

    // Component States
    const [displayEquation, setDisplayEquation] = useState(showEquation);

    // Setup Component
    useEffect(() => {
        setDisplayEquation(props.showEquation);
    }, [props.showEquation]);

    const getEquationTypeIcon = () => {
        if (solution.equation_type == "ode") {
            return <Icon fontSize="small" className={classes.cardSubHeaderIcon}>show_chart</Icon>
        } else {
            return <Icon fontSize="small" className={classes.cardSubHeaderIcon}>legend_toggle</Icon>
        }
    }
    const getConditions = () => {
        let conditions = solution.diff_equation_details.conditions;

    }
    const getConditionDomain = (condition) => {
        let condition_str = "";
        if (condition.condition_type == "IVP") {
            condition_str = "(" + condition.t_0 + "," + condition.u_0 + ")";
        }
        if (condition.condition_type == "DirichletBVP2D") {
            condition_str = "(" + condition.x0 + "," + condition.x1 + ")" + " - (" + condition.y0 + "," + condition.y1 + ")";
        }

        return condition_str;
    }
    const getEquationTypeAvatar = () => {
        if (solution.equation_type == "ode") {
            return <Avatar variant="square" className={classes.cardHeaderAvatar}>ODE</Avatar>
        } else {
            return <Avatar variant="square" className={classes.cardHeaderAvatar}>PDE</Avatar>
        }
    }
    const getStatusIcon = () => {
        if (showStatus) {
            if (solution["hub_status"] == "published") {
                return <Icon style={{ "color": "#31a354", "fontSize": "1.1rem", "marginLeft": "5px", "marginTop": "5px", "marginRight": "3px" }}>public</Icon>
            } else if (solution["hub_status"] == "submitted") {
                return <Icon style={{ "color": 'yellow', "fontSize": "1.1rem", "marginLeft": "5px", "marginTop": "5px", "marginRight": "3px" }}>vpn_lock</Icon>
            }
            else if (solution["hub_status"] == "rejected") {
                return <Icon style={{ "color": 'red', "fontSize": "1.1rem", "marginLeft": "5px", "marginTop": "5px", "marginRight": "3px" }}>block</Icon>
            }
            else {
                return <Icon style={{ "color": "orange", "fontSize": "1.1rem", "marginLeft": "5px", "marginTop": "5px", "marginRight": "3px" }}>vpn_lock</Icon>
            }
        }
    }
    const mediaIconStyle = (icon_type) => {
        let style = { color: "#9c9c9c" };
        if (displayEquation && icon_type == "equation") {
            style = { backgroundColor: "#e8e8e8" };
        }
        if (!displayEquation && icon_type == "plot") {
            style = { backgroundColor: "#e8e8e8" };
        }
        return style;
    }

    return (
        <Card>
            <CardContent
                className={classes.cardHeader}
            >
                <div style={{ "display": "flex" }}>
                    {getEquationTypeAvatar()}
                    <Typography
                        variant="h6"
                        onClick={() => clickHandle(solution)}
                    >
                        {solution.equation_name ? solution.equation_name : solution.name}
                    </Typography>
                    <div className={classes.grow} onClick={() => clickHandle(solution)} />
                    <div className={classes.mediaSwitch}>
                        <Icon className={classes.mediaSwitchIcon} style={mediaIconStyle('plot')} onClick={() => setDisplayEquation(false)}>insights</Icon>
                        <Icon className={classes.mediaSwitchIcon} style={mediaIconStyle('equation')} onClick={() => setDisplayEquation(true)}>functions</Icon>
                    </div>
                    {getStatusIcon()}
                </div>
            </CardContent>
            {/* <CardContent
                className={classes.cardSubHeader}
            >
                <div style={{ "display": "flex" }}>
                    {solution.diff_equation_details.conditions && solution.diff_equation_details.conditions.map((con, index) =>
                        <div className={classes.badge}>
                            <span className={classes.cardSubHeaderText}>
                                {enums["condition_types"][enums["condition_type_mapping"][con.condition_type]]}
                                &nbsp;
                                {getConditionDomain(con)}
                            </span>
                        </div>
                    )}


                    <div className={classes.grow} />
                </div>
            </CardContent> */}
            <CardMedia onClick={() => clickHandle(solution)} className={classes.cardMedia}>
                {displayEquation &&
                    <Equations key={solution.id} solution={solution}></Equations>
                }
                {!displayEquation &&
                    <SampleSolutionPlot solution={solution} width={plotWidth} height={plotHeight}></SampleSolutionPlot>
                }
            </CardMedia>
            <CardActions disableSpacing>
                <Icon className={classes.labelIcon}>label</Icon>
                <Typography color="textSecondary" className={classes.labelText}>
                    &nbsp;{solution.label}
                </Typography>
                <div className={classes.grow} />
                <Icon className={classes.likeIcon}>thumb_up</Icon>
                <div className={classes.likeText}>
                    {solution.like_count}
                </div>
                <Icon className={classes.downloadIcon}>download</Icon>
                <div className={classes.downloadText}>
                    {solution.download_count}
                </div>
            </CardActions>
        </Card >
    );
};

export default withStyles(styles)(SolutionCard);