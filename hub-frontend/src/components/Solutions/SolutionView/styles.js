const styles = theme => ({
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1,
    },
    spacer: {
        padding: "10px",
    },
    main: {
        // marginTop: "20px",
    },
    container: {
        backgroundColor: "#ffffff",
        paddingTop: "30px",
        paddingBottom: "50px",
        paddingLeft: "20px",
        paddingRight: "20px",
    },
    toolBar: {
        paddingLeft: "0px",
        paddingRight: "0px",
        minHeight: "30px",
    },
    labelIcon: {
        color: theme.palette.primary.main,
    },
    inputContainer: {
        marginTop: "20px",
    },
    buttonContainer: {
        marginTop: "20px",
        marginBottom: "20px",
    },
    codeBlock: {
        backgroundColor: "#232323",
        color: "#ffffff",
        padding: 15,
    },
    code: {
        fontFamily: "monospace",
    },
    tabSwitchIcon: {
        marginLeft: "5px",
        fontSize: "1.2rem",
    },
    tabSwitchText: {
        fontSize: "0.8rem",
        fontWeight: 600,
        paddingRight: "25px",
        cursor: "pointer",
    },
    lossText: {
        fontSize: "0.9rem",
        fontWeight: 500,
    },

});

export default styles;