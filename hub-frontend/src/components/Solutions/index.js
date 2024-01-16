import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import { IconButton } from "@material-ui/core";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";


import DataService from "../../services/DataService";
import { useEnumContext } from "../../services/EnumService";
import SolutionCard from "./SolutionCard"
import styles from './styles';

const Solutions = (props) => {
    const { classes } = props;
    const { history } = props;

    console.log("================================== Solutions ======================================");

    const enums = useEnumContext();
    const anchorRef = useRef(null);

    // Component States
    const [open, setOpen] = useState(false);
    const prevOpen = useRef(open);
    const [sortBy, setSortBy] = useState('created');
    const [sortByText, setSortByText] = useState('Recently Added');
    const [totalCount, setTotalCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [search, setSearch] = useState('');
    const [solutions, setSolutions] = useState(null);
    const loadSolutions = () => {
        let equation_types = null;
        for (var key in equationTypeFilter) {
            if (equation_types && equationTypeFilter[key]) {
                equation_types += "," + key
            }
            if (!equation_types && equationTypeFilter[key]) {
                equation_types = key
            }
        }
        let problem_types = null;
        for (var key in problemTypeFilter) {
            if (problem_types && problemTypeFilter[key]) {
                problem_types += "," + key
            }
            if (!problem_types && problemTypeFilter[key]) {
                problem_types = key
            }
        }
        let condition_types = null;
        for (var key in conditionTypeFilter) {
            if (condition_types && conditionTypeFilter[key]) {
                condition_types += "," + key
            }
            if (!condition_types && conditionTypeFilter[key]) {
                condition_types = key
            }
        }
        let equation_ids = null;
        for (var key in equationFilter) {
            if (equation_ids && equationFilter[key]) {
                equation_ids += "," + key
            }
            if (!equation_ids && equationFilter[key]) {
                equation_ids = key
            }
        }
        let use_case_ids = null;
        for (var key in useCaseFilter) {
            if (use_case_ids && useCaseFilter[key]) {
                use_case_ids += "," + key
            }
            if (!use_case_ids && useCaseFilter[key]) {
                use_case_ids = key
            }
        }
        DataService.GetSolutions(false, sortBy, search, equation_types, problem_types,
            condition_types, equation_ids, use_case_ids, domainTMin, domainTMax, domainXMin, domainXMax, domainYMin, domainYMax)
            .then(function (response) {
                setSolutions(response.data);
                setPageCount(1 + response.data.length / 20);
            });
        DataService.GetSolutions(true, null, search, equation_types, problem_types,
            condition_types, equation_ids, use_case_ids, domainTMin, domainTMax, domainXMin, domainXMax, domainYMin, domainYMax)
            .then(function (response) {
                setTotalCount(response.data["count"]);
            });
    }
    const [equationTypeFilter, setEquationTypeFilter] = useState({ 'ode': false, 'pde': false });
    const [problemTypeFilter, setProblemTypeFilter] = useState({ 'ivp': false, 'bvp': false });
    const [conditionTypeFilter, setConditionTypeFilter] = useState({ 'ivp': false, 'ibvp1d': false, 'dirichletbvp': false, 'dirichletbvp2d': false });
    const [domainTMin, setDomainTMin] = useState(null);
    const [domainTMax, setDomainTMax] = useState(null);
    const [domainXMin, setDomainXMin] = useState(null);
    const [domainXMax, setDomainXMax] = useState(null);
    const [domainYMin, setDomainYMin] = useState(null);
    const [domainYMax, setDomainYMax] = useState(null);
    const [equationFilter, setEquationFilter] = useState({});
    const [useCaseFilter, setUseCaseFilter] = useState({});
    const [useCases, setUseCases] = useState([]);
    const loadUseCases = () => {
        DataService.GetUseCases()
            .then(function (response) {
                setUseCases(response.data);
            })
    }
    const [equations, setEquations] = useState([]);
    const loadEquations = () => {
        DataService.GetEquations()
            .then(function (response) {
                setEquations(response.data);
            })
    }
    const [displayEquation, setDisplayEquation] = useState(true);

    // Setup Component
    useEffect(() => {
        loadSolutions();
    }, [sortBy, search, equationTypeFilter, problemTypeFilter, conditionTypeFilter, equationFilter, useCaseFilter, domainTMin, domainTMax, domainXMin, domainXMax, domainYMin, domainYMax]);
    useEffect(() => {
        setPageCount(1 + totalCount / 20);
    }, [totalCount]);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    useEffect(() => {
        loadUseCases();
        loadEquations();
    }, []);

    const handleSortToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleSortSelection = (event, sort_by, sort_by_text) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setSortBy(sort_by);
        setSortByText(sort_by_text);
        setOpen(false);
    };
    const handleSortClose = () => {
        setOpen(false);
    }

    const handleClickEquationType = (equation_type) => {
        let filter = { ...equationTypeFilter };
        filter[equation_type] = !filter[equation_type];
        setEquationTypeFilter(filter);
    };
    const equationTypeColor = (equation_type) => {
        if (equationTypeFilter[equation_type]) {
            return "primary";
        } else {
            return "default";
        }
    };
    const handleClickProblemType = (problem_type) => {
        let filter = { ...problemTypeFilter };
        filter[problem_type] = !filter[problem_type];
        setProblemTypeFilter(filter);
    };
    const problemTypeColor = (problem_type) => {
        if (problemTypeFilter[problem_type]) {
            return "primary";
        } else {
            return "default";
        }
    };
    const handleClickConditionType = (condition_type) => {
        let filter = { ...conditionTypeFilter };
        filter[condition_type] = !filter[condition_type];
        setConditionTypeFilter(filter);
    };
    const conditionTypeColor = (condition_type) => {
        if (conditionTypeFilter[condition_type]) {
            return "primary";
        } else {
            return "default";
        }
    };
    const handleClickEquation = (equation_id) => {
        let filter = { ...equationFilter };
        filter[equation_id] = !filter[equation_id];
        setEquationFilter(filter);
    };
    const equationColor = (equation_id) => {
        if (equationFilter[equation_id]) {
            return "primary";
        } else {
            return "default";
        }
    };
    const handleClickUseCase = (use_case) => {
        let filter = { ...useCaseFilter };
        filter[use_case] = !filter[use_case];
        setUseCaseFilter(filter);
    };
    const ucColor = (use_case) => {
        if (useCaseFilter[use_case]) {
            return "primary";
        } else {
            return "default";
        }
    };
    const mediaIconStyle = (icon_type) => {
        let style = { color: "#7c7c7c" };
        if (displayEquation && icon_type == "equation") {
            style = {};
        }
        if (!displayEquation && icon_type == "plot") {
            style = {};
        }
        return style;
    }

    const goToViewSolution = (sol) => {
        history.push("/solutions/" + sol.id)
    }

    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false}>
                    <Grid container spacing={2}>
                        <Grid item sm={4}>
                            <Paper className={classes.filterBlock} variant="outlined" square>
                                <Typography variant="h6" gutterBottom>
                                    Equation Type
                                </Typography>
                                <div className={classes.filters}>
                                    <Chip
                                        icon={<Icon fontSize="small">show_chart</Icon>}
                                        label="ODE"
                                        clickable
                                        color={equationTypeColor('ode')}
                                        onClick={() => handleClickEquationType('ode')}
                                        variant="outlined"
                                        size="medium"
                                    />
                                    <Chip
                                        icon={<Icon fontSize="small">legend_toggle</Icon>}
                                        label="PDE"
                                        clickable
                                        color={equationTypeColor('pde')}
                                        onClick={() => handleClickEquationType('pde')}
                                        variant="outlined"
                                        size="medium"
                                    />
                                </div>
                                <Typography variant="h6" gutterBottom>
                                    Problem Type
                                </Typography>
                                <div className={classes.filters}>
                                    <Chip
                                        icon={<Icon fontSize="small">my_location</Icon>}
                                        label="Initial Value Problem"
                                        clickable
                                        color={problemTypeColor('ivp')}
                                        onClick={() => handleClickProblemType('ivp')}
                                        variant="outlined"
                                        size="medium"
                                    />
                                    <Chip
                                        icon={<Icon fontSize="small">horizontal_distribute</Icon>}
                                        label="Boundary Value Problem"
                                        clickable
                                        color={problemTypeColor('bvp')}
                                        onClick={() => handleClickProblemType('bvp')}
                                        variant="outlined"
                                        size="medium"
                                    />
                                </div>
                                <Typography variant="h6" gutterBottom>
                                    Condition Type
                                </Typography>
                                <div className={classes.filters}>
                                    <Chip
                                        icon={<Icon fontSize="small">my_location</Icon>}
                                        label={enums["condition_types"]["ivp"]}
                                        clickable
                                        color={conditionTypeColor('ivp')}
                                        onClick={() => handleClickConditionType('ivp')}
                                        variant="outlined"
                                        size="medium"
                                    />
                                    <Chip
                                        icon={<Icon fontSize="small">horizontal_distribute</Icon>}
                                        label={enums["condition_types"]["ibvp1d"]}
                                        clickable
                                        color={conditionTypeColor('ibvp1d')}
                                        onClick={() => handleClickConditionType('ibvp1d')}
                                        variant="outlined"
                                        size="medium"
                                    />
                                    <Chip
                                        icon={<Icon fontSize="small">bar_chart</Icon>}
                                        label={enums["condition_types"]["dirichletbvp"]}
                                        clickable
                                        color={conditionTypeColor('dirichletbvp')}
                                        onClick={() => handleClickConditionType('dirichletbvp')}
                                        variant="outlined"
                                        size="medium"
                                    />
                                    <Chip
                                        icon={<Icon fontSize="small">bar_chart</Icon>}
                                        label={enums["condition_types"]["dirichletbvp2d"]}
                                        clickable
                                        color={conditionTypeColor('dirichletbvp2d')}
                                        onClick={() => handleClickConditionType('dirichletbvp2d')}
                                        variant="outlined"
                                        size="medium"
                                    />
                                </div>
                                <Typography variant="h6" gutterBottom>
                                    Domain
                                </Typography>
                                <Box display="flex" p={0}>
                                    <div style={{ "width": "35%", "display": "grid", "paddingBottom": "15px" }}>
                                        <Typography variant="caption" color="primary" gutterBottom>
                                            <strong>Time</strong>
                                        </Typography>
                                        <div style={{ "display": "flex" }}>
                                            <TextField
                                                className={classes.domainInput}
                                                label="min"
                                                InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                value={domainTMin}
                                                onChange={(event) => setDomainTMin(event.target.value)}
                                            />
                                            <TextField
                                                className={classes.domainInput}
                                                label="max"
                                                InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                value={domainTMax}
                                                onChange={(event) => setDomainTMax(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ "width": "65%", "display": "grid", "paddingBottom": "15px" }}>
                                        <Typography variant="caption" color="primary" gutterBottom>
                                            <strong>Space</strong>
                                        </Typography>
                                        <div style={{ "display": "flex" }}>
                                            <TextField
                                                className={classes.domainInput}
                                                label="x min"
                                                InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                value={domainXMin}
                                                onChange={(event) => setDomainXMin(event.target.value)}
                                            />
                                            <TextField
                                                className={classes.domainInput}
                                                label="y min"
                                                InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                value={domainXMax}
                                                onChange={(event) => setDomainXMax(event.target.value)}
                                            />
                                            &nbsp;&nbsp;
                                            <TextField
                                                className={classes.domainInput}
                                                label="x max"
                                                InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                value={domainYMin}
                                                onChange={(event) => setDomainYMin(event.target.value)}
                                            />
                                            <TextField
                                                className={classes.domainInput}
                                                label="y max"
                                                InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                value={domainYMax}
                                                onChange={(event) => setDomainYMax(event.target.value)}
                                            />
                                        </div>
                                    </div>
                                </Box>
                                <Typography variant="h6" gutterBottom>
                                    Differential Equation
                                </Typography>
                                <div className={classes.filters}>
                                    {equations && equations.map((eq, index) =>
                                        <Chip
                                            label={eq.name}
                                            clickable
                                            variant="outlined"
                                            size="small"
                                            color={equationColor(eq.id)}
                                            onClick={() => handleClickEquation(eq.id)}
                                        />
                                    )}
                                </div>

                                <Typography variant="h6" gutterBottom>
                                    Use Case
                                </Typography>
                                <div className={classes.filters}>
                                    {useCases && useCases.map((uc, index) =>
                                        <Chip
                                            label={uc.name}
                                            clickable
                                            variant="outlined"
                                            size="small"
                                            color={ucColor(uc.id)}
                                            onClick={() => handleClickUseCase(uc.id)}
                                        />
                                    )}
                                </div>

                            </Paper>
                        </Grid>
                        <Grid item sm={8}>
                            <Toolbar className={classes.toolBar}>
                                <Typography variant="h6">
                                    Solutions
                                </Typography>

                                <Typography variant="h5" color="textSecondary" className={classes.resultCount}>
                                    {totalCount.toLocaleString()}
                                </Typography>
                                <TextField
                                    placeholder="Search Solutions"
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Icon color="disabled" fontSize="small">model_training</Icon>
                                            </InputAdornment>
                                        ),

                                        endAdornment: search && (
                                            <IconButton
                                                aria-label="Clear search"
                                                onClick={() => setSearch("")}
                                            >
                                                <CancelRoundedIcon />
                                            </IconButton>
                                        )
                                    }}
                                />
                                <div className={classes.grow} />
                                <div className={classes.mediaSwitch}>
                                    <Icon
                                        className={classes.mediaSwitchIcon}
                                        style={mediaIconStyle('plot')}
                                        onClick={() => setDisplayEquation(false)}
                                    >insights</Icon>
                                    <Typography className={classes.mediaSwitchText} style={mediaIconStyle('plot')} align="justify" onClick={() => setDisplayEquation(false)}>
                                        &nbsp;Sample Solution
                                    </Typography>
                                    <Icon className={classes.mediaSwitchIcon} style={mediaIconStyle('equation')} onClick={() => setDisplayEquation(true)}>functions</Icon>
                                    <Typography className={classes.mediaSwitchText} style={mediaIconStyle('equation')} align="justify" onClick={() => setDisplayEquation(true)}>
                                        Equation
                                    </Typography>
                                </div>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Icon>sort</Icon>}
                                    ref={anchorRef}
                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleSortToggle}
                                >
                                    Sort: {sortByText}
                                </Button>
                                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                    {({ TransitionProps, placement }) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                        >
                                            <Paper>
                                                <ClickAwayListener onClickAway={handleSortClose}>
                                                    <MenuList autoFocusItem={open} id="menu-list-grow">
                                                        <MenuItem onClick={(event) => handleSortSelection(event, 'downloads', '# Downloads')}># Downloads</MenuItem>
                                                        <MenuItem onClick={(event) => handleSortSelection(event, 'created', 'Recently Added')}>Recently Added</MenuItem>
                                                        <MenuItem onClick={(event) => handleSortSelection(event, 'updated', 'Last Updated')}>Last Updated</MenuItem>
                                                        <MenuItem onClick={(event) => handleSortSelection(event, 'alphabetical', 'Alphabetical')}>Alphabetical</MenuItem>
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>

                            </Toolbar>
                            <Divider />
                            <br></br>
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                            >
                                {solutions && solutions.map((sol, index) =>
                                    <Grid item xs={12} md={4} key={index}>
                                        <SolutionCard
                                            solution={sol}
                                            clickHandle={goToViewSolution}
                                            showStatus={false}
                                            showEquation={displayEquation}
                                            plotWidth={350}
                                            plotHeight={170}
                                        >
                                        </SolutionCard>
                                    </Grid>
                                )}
                            </Grid>
                            {totalCount > 0 &&
                                <div className={classes.paginationConatiner}>
                                    <Pagination count={pageCount} variant="outlined" color="primary" />
                                </div>
                            }
                            {solutions && solutions.length == 0 &&
                                <Box component="div" m={3}>
                                    <Typography>
                                        No solutions found
                                    </Typography>
                                </Box>
                            }
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Solutions);