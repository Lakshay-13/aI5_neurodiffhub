import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import styles from "./styles";


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
    marginTop: "100px"
  }
}));

const cards = [
  {
    name: "Dr. Pavlos Protopapas",
    GitHublink: "https://github.com/pavlosprotopapas",
    LinkedinLink: "https://www.linkedin.com/in/pavlos-protopapas-a2156a4/"
    
  },
  {
    name: "Shivas Jayaram",
    GitHublink: "https://github.com/shivasj",
    LinkedinLink: "https://www.linkedin.com/in/shivasj/"
  },
  {
    name: "David Sondak",
    GitHublink: "https://github.com/dsondak",
    LinkedinLink: "https://www.linkedin.com/in/david-sondak"
  },
  {
    name: "Joy Parikh",
    GitHublink: "https://github.com/joyparikh",
    LinkedinLink: "https://www.linkedin.com/in/joy-parikh-ba162a149/"
  },
  {
    name: "Shuheng Liu",
    GitHublink: "https://github.com/shuheng-liu",
    LinkedinLink: "https://www.linkedin.com/in/shuhengliu"
  },
  {
    name: "Sakthisree Venkatesan",
    GitHublink: "https://github.com/sakzsee",
    LinkedinLink: "https://www.linkedin.com/in/sakthisree-venkatesan/"
  },
  {
    name: "Sathvik Bhagavan",
    GitHublink: "https://github.com/sathvikbhagavan",
    LinkedinLink: "https://www.linkedin.com/in/sathvikbhagavan/"
  },
  {
    name: "Araz Sharma",
    GitHublink: "https://github.com/Araz1103",
    LinkedinLink: "https://www.linkedin.com/in/arazsharma/"
  },
  {
    name: "Ashleigh(Lan) Bi",
    GitHublink: "https://github.com/AshleighBi",
    LinkedinLink: "https://www.linkedin.com/in/ashleigh-bi-42091221a/"
  }
];

const pics = [
  "./assets/pavlos.png",
  "./assets/shivas.png",
  "./assets/david.png",
  "./assets/joy.png",
  "./assets/shuheng.png",
  "./assets/sakthi.png",
  "./assets/sathvik.png",
  "./assets/araz.png",
  "/assets/ash.png",
];

const About = (props) => {
  const { classes } = props;

  console.log(
    "================================== About ======================================"
  );

  return (
    <Container maxWidth={false} className={classes.blockContainer}>
      <div className={classes.mainBlock}>
        <Typography variant="h1" className={classes.mainTitleText}>
          About the Team
        </Typography>
        <Typography variant="h1" className={classes.mainTitleDescription}>
          Making Neural Net Solvers accessible to all.
        </Typography>
         <Typography align="justify" color="texttextPrimary" component="p" style={{ marginBottom: "50px" }}>
              The Neurodiffhub team is a diverse group of talent from across the
              world. The NeurodiffGym, led by Dr. Pavlos Protopapas (the
              Scientific Program Director @ Harvard's Institute for Applied
              Computational Science), focuses on leveraging neural networks to
              solve differential equations of varying forms. Presently, the lab
              performs rigorous research on how different paradigms of neural
              networks - such as Recurrent Neural networks, GANs etc. - can best
              solve differential equations faster and in a more efficient way.
              The Neurodiffhub was borne out of the goal to make these models
              accessible to the academic community, and to also enable others to
              train their own models and store it using this platform.
         </Typography>

        <React.Fragment>
          <CssBaseline />
          <main>
            {/* Hero unit */}
            <Container className={classes.cardGrid} maxWidth="md">
              {/* End hero unit */}
              <Grid container spacing={4}>
                {cards.map((card, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <div style={{ height: "250px", borderRadius: "50%" }}>
                        <img alt="Hey there!" src={pics[index]} />
                      </div>
                      <CardActions>
                        <Button size="small" color="black">
                          <a href={card.GitHublink} style={{ textDecoration: "None", color: "black" }}>
                            <GitHubIcon></GitHubIcon>
                          </a>
                        </Button>
                        <Button size="small" color="black">
                          <a href={card.LinkedinLink} style={{ textDecoration: "None", color: "black" }}>
                            <LinkedInIcon></LinkedInIcon>
                          </a>
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </main>
        </React.Fragment>
      </div>
    </Container>
  );
};

export default withStyles(styles)(About);
