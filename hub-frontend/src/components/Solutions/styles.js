const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: "100vh"
    },
    grow: {
        flexGrow: 1,
    },
    main: {
        // marginTop: "25px"
    },
    filters: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    filterBlock: {
        // marginTop: "10px",
        padding: "15px",
    },
    toolBar: {
        marginTop: "10px",
        paddingLeft: "0px",
        paddingRight: "0px",
        fontWeight: 700,
    },
    paginationConatiner: {
        padding: "20px",
    },
    resultCount: {
        paddingLeft: "20px",
        paddingRight: "20px",
    },
    domainInput: {
        width: "75px",
    },
    mediaSwitch: {
        cursor: "pointer",
        display: "inherit",
        marginRight: "10px",
    },
    mediaSwitchIcon: {
        marginLeft: "5px",
        fontSize: "1.2rem",
    },
    mediaSwitchText: {
        fontSize: "0.8rem",
        fontWeight: 600,
    }
});

export default styles;