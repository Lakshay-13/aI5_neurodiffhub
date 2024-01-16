const styles = theme => ({
    blockContainer:{
        minHeight: "250px",
        backgroundColor: "#ffffff",
    },
    mainBlock:{
        textAlign: "center",
        backgroundImage: "url('home.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
        marginLeft: "50px",
        marginRight: "50px",
    },
    mainTitleText:{
        fontSize: "3.5rem",
        lineHeight: "1",
        fontWeight: "700",
        maxWidth: "37rem",
        marginLeft: "auto",
        marginRight: "auto",
    },
    mainTitleDescription:{
        fontSize: "1.125rem",
        lineHeight: "1.75rem",
        fontWeight: "500",
        maxWidth: "40rem",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        marginLeft: "auto",
        marginRight: "auto",
        color: "#6b7280",
    },
});

export default styles;