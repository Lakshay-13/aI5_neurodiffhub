import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import ReactMarkdown from "react-markdown";
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { CopyBlock, dracula } from "react-code-blocks";
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useEnumContext } from "../../../services/EnumService";
import Equations from "../../Equations";
import SampleSolutionPlot from '../SampleSolutionPlot';
import LossPlot from '../LossPlot';
import styles from './styles';

const SolutionDetails = (props) => {
    const { classes } = props;
    let { solution } = props;

    const enums = useEnumContext();

    // Component States
    const [isLog, setIsLog] = useState(true);

    // Setup Component
    useEffect(() => {

    }, []);

    const getLowestLoss = () => {
        if (solution.diff_equation_details) {
            try {
                return Math.min(...solution.diff_equation_details.sample_loss).toFixed(4);
            } catch (error) {
                return "";
            }
        } else {
            return "";
        }

    }
    const getNumberEpochs = () => {
        if (solution.diff_equation_details) {
            try {
                return solution.diff_equation_details.sample_loss.length;
            } catch (error) {
                return "";
            }
        } else {
            return "";
        }

    }

    const getLayerDetails = (layer) => {
        let layer_details = "";
        if (layer.in_features) {
            layer_details += " Input:" + layer.in_features
        }
        if (layer.out_features) {
            layer_details += " Output:" + layer.out_features
        }
        return layer_details;
    }

    const getCodeBlockContent = () => {
        let solverType = solution["equation_type"] == "ode" ? 'Solver1D' : 'Solver2D';
        let text = `
        # Import Neurodiffeq
        from neurodiffeq.solvers import ${solverType}
        # Load the pretrained solver
        solver = ${solverType}.load(name="${solution.label}")
        `

        return text;
    }

    return (
        <div className={classes.root}>
            <div className={classes.spacer}></div>
            <Grid container spacing={2}>
                <Grid item md={6}>
                    <div>
                        <Typography variant="h5" color="textSecondary">{solution.equation_name}</Typography>
                        <Typography variant="caption" display="block">
                            &nbsp;&nbsp;{enums["diff_equation_types_long"][solution.equation_type]}
                        </Typography>
                        <div className={classes.spacer}></div>
                        <ReactMarkdown source={solution.description} />
                    </div>
                </Grid>
                <Grid item md={6}>
                    <Typography variant="h6" display="block">
                        Equations:
                        <IconButton aria-label="Equations Info" href="https://www.khanacademy.org/math/differential-equations">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Typography>
                    {solution.diff_equation_details &&
                        <Equations solution={solution}></Equations>
                    }
                </Grid>
            </Grid>
            <div className={classes.spacer}></div>
            <div className={classes.spacer}></div>
            <Grid container spacing={5}>

                <Grid item md={6}>
                    <div style={{ "display": "flex" }}>
                        <Typography variant="h6" display="block">
                            Sample Solutions:
                            <IconButton aria-label="Solutions Info" href="/docs/introduction">
                                <HelpOutlineIcon />
                            </IconButton>
                        </Typography>
                    </div>

                    {solution.diff_equation_details &&
                        <SampleSolutionPlot
                            solution={solution} width="500" height="400"
                        />
                    }
                </Grid>
                <Grid item md={6}>
                    <div style={{ "display": "flex" }}>
                        <Typography variant="h6" display="block">
                            Loss:
                            <IconButton aria-label="Loss Info" href="https://neurodiffeq.readthedocs.io/en/latest/">
                                <HelpOutlineIcon />
                            </IconButton>
                        </Typography>
                        <div className={classes.grow} />
                        <Typography className={classes.lossText}>
                            Lowest loss: {getLowestLoss()}, # epochs: {getNumberEpochs()}
                        </Typography>
                    </div>

                    {solution.diff_equation_details &&
                        <LossPlot solution={solution} width="500" height="400" isLog={isLog}></LossPlot>
                    }
                    <div>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isLog}
                                    onClick={() => setIsLog(!isLog)}
                                    color="primary"
                                />
                            }
                            label="Log Loss"
                        />
                    </div>
                </Grid>
            </Grid>
            <div className={classes.spacer}></div>
            <div className={classes.spacer}></div>
            <Grid container spacing={3}>
                <Grid item md={6}>
                    <div style={{ "display": "flex" }}>
                        <Typography variant="h6" display="block">
                            Network Architecture:
                            <IconButton aria-label="Architecture Info" href="https://neurodiffeq.readthedocs.io/en/latest/">
                                <HelpOutlineIcon />
                            </IconButton>
                        </Typography>
                        <div className={classes.grow} />
                        <Typography className={classes.networksText}>

                        </Typography>
                    </div>
                    {solution.diff_equation_details && solution.diff_equation_details.networks && solution.diff_equation_details.networks.map((network, index) =>
                        <TableContainer component={Paper} className={classes.networkBlock}>
                            <Table key={index}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Layer</TableCell>
                                        <TableCell>Input</TableCell>
                                        <TableCell>Output</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {network.layers && network.layers.map((layer, layer_idx) =>
                                        <TableRow key={layer_idx}>
                                            <TableCell>{layer.layer}</TableCell>
                                            <TableCell className={classes.layerDetails}>{layer.in_features}</TableCell>
                                            <TableCell className={classes.layerDetails}>{layer.out_features}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Grid>
                <Grid item md={6}>
                    <div style={{ "display": "flex" }}>
                        <Typography variant="h6" display="block">
                            Generator Details:
                            <IconButton aria-label="Generator Info" href="https://neurodiffeq.readthedocs.io/en/latest/">
                                <HelpOutlineIcon />
                            </IconButton>
                        </Typography>
                        <div className={classes.grow} />
                        <Typography className={classes.lossText}>

                        </Typography>
                    </div>
                    {solution.diff_equation_details && solution.diff_equation_details.generator &&
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Size</TableCell>
                                        <TableCell>{solution.diff_equation_details.generator.size}</TableCell>
                                    </TableRow>
                                    {solution.diff_equation_details.generator.t_min &&
                                        <TableRow>
                                            <TableCell>t min</TableCell>
                                            <TableCell>{solution.diff_equation_details.generator.t_min}</TableCell>
                                        </TableRow>
                                    }
                                    {solution.diff_equation_details.generator.t_max &&
                                        <TableRow>
                                            <TableCell>t max</TableCell>
                                            <TableCell>{solution.diff_equation_details.generator.t_max}</TableCell>
                                        </TableRow>
                                    }
                                    {solution.diff_equation_details.generator.xy_min &&
                                        <TableRow>
                                            <TableCell>xy min</TableCell>
                                            <TableCell>{solution.diff_equation_details.generator.xy_min}</TableCell>
                                        </TableRow>
                                    }
                                    {solution.diff_equation_details.generator.xy_max &&
                                        <TableRow>
                                            <TableCell>xy max</TableCell>
                                            <TableCell>{solution.diff_equation_details.generator.xy_max}</TableCell>
                                        </TableRow>
                                    }
                                    <TableRow>
                                        <TableCell>Method</TableCell>
                                        <TableCell>{solution.diff_equation_details.generator.method}</TableCell>
                                    </TableRow>
                                    {solution.diff_equation_details.generator.noise_std &&
                                        <TableRow>
                                            <TableCell>Noise (Std)</TableCell>
                                            <TableCell>{solution.diff_equation_details.generator.noise_std}</TableCell>
                                        </TableRow>
                                    }
                                    {solution.diff_equation_details.generator.noise_xstd &&
                                        <TableRow>
                                            <TableCell>Noise X,Y (Std)</TableCell>
                                            <TableCell>{solution.diff_equation_details.generator.noise_xstd}, {solution.diff_equation_details.generator.noise_ystd}</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </Grid>
            </Grid>
            <div className={classes.spacer}></div>
            <div className={classes.spacer}></div>
            <Grid container spacing={2}>
                <Grid item md={6}>
                    <Typography variant="h6" display="block">
                        Variables:
                        <IconButton aria-label="Variables Info" href="https://neurodiffeq.readthedocs.io/en/latest/">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Typography>
                    <ReactMarkdown source={solution.variable_summary} />

                    <div className={classes.spacer}></div>
                    <Typography variant="h6" display="block">
                        Use Cases:
                        <IconButton aria-label="Use Cases Info" href="https://neurodiffeq.readthedocs.io/en/latest/">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Typography>
                    <ReactMarkdown source={solution.usecase_summary} />

                    <div className={classes.spacer}></div>
                    <Typography variant="h6" display="block">
                        Training Specifics:
                        <IconButton aria-label="Training Info" href="https://neurodiffeq.readthedocs.io/en/latest/">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Typography>
                    <ReactMarkdown source={solution.training_summary} />

                    <div className={classes.spacer}></div>
                    <Typography variant="h6" display="block">
                        References:
                    </Typography>
                    <ReactMarkdown source={solution.reference_summary} />

                    <div className={classes.spacer}></div>
                    <Typography variant="h6" display="block">
                        Citation:
                    </Typography>
                    <ReactMarkdown source={solution.citation} />

                </Grid>
                <Grid item md={6}>
                    <div style={{ "display": "flex" }}>
                        <Typography variant="h6" display="block">
                            Code:
                            <IconButton aria-label="Equations Info" href="/docs/getting_started">
                                <HelpOutlineIcon />
                            </IconButton>
                        </Typography>
                        <div className={classes.grow} />
                        <Typography className={classes.lossText}>
                            How to download and use this solution.
                        </Typography>
                    </div>
                    <CopyBlock
                        language="python"
                        text={getCodeBlockContent()}
                        theme={dracula}
                        showLineNumbers={true}
                        codeBlock
                    />
                </Grid>
            </Grid>

        </div>
    );
};

export default withStyles(styles)(SolutionDetails);
