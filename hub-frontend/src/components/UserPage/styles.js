const styles = theme => ({
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1,
    },
    main: {
        // marginTop: "25px"
    },
    avatar: {
        color: theme.palette.getContrastText(theme.palette.primary.main),
        backgroundColor: theme.palette.primary.main,
        height: "150px",
        width: "150px",
        fontSize: "4.5rem",
        marginLeft: "55px",
        marginBottom: "15px",
    },
    profileBlock: {
        // marginTop : "10px",
        padding: "25px",
        paddingBottom: "50px",
    },
    solutionsBlock: {
        paddingTop: "10px",
    }
});

export default styles;