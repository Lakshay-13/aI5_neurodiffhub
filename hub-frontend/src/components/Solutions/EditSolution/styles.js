const styles = theme => ({
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1,
    },
    main: {
       marginTop: "20px",
    },
    toolBar: {
        paddingLeft : "0px",
        paddingRight : "0px",
        minHeight: "30px",
    },
    labelIcon:{
        color: theme.palette.primary.main,
    },
    inputContainer: {
        marginTop : "20px",
    },
    buttonContainer:{
        marginTop : "20px",
        marginBottom : "20px",
    },
    codeBlock:{
        backgroundColor: "#232323",
        color: "#ffffff",
        padding: 15,
    },
    code:{
        fontFamily:"monospace",
    },
});

export default styles;