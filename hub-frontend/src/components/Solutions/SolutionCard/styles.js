const styles = theme => ({
    grow: {
        flexGrow: 1,
    },
    labelIcon: {
        color: theme.palette.info.main,
    },
    labelText: {
        fontSize: "0.9rem",
        fontWeight: 500,
    },
    cardHeaderAvatar: {
        color: theme.palette.getContrastText(theme.palette.primary.main),
        backgroundColor: theme.palette.primary.light,
        fontSize: "0.9rem",
        fontWeight: 600,
        height: "25px",
        paddingLeft: "3px",
        paddingRight: "3px",
        marginLeft: "0px",
        marginRight: "5px",
    },
    cardHeader: {
        cursor: "pointer",
        paddingLeft: "0px",
        paddingRight: "0px",
        paddingTop: "0px",
        paddingBottom: "0px",
    },
    cardSubHeader: {
        cursor: "pointer",
        paddingLeft: "3px",
        paddingRight: "3px",
        paddingTop: "0px",
        paddingBottom: "5px",
    },
    cardSubHeaderIcon: {
        lineHeight: "inherit",
    },
    cardSubHeaderText: {
        fontSize: "0.8rem",
        display: "table-cell",
        verticalAlign: "middle",
    },
    cardMedia: {
        cursor: "pointer",
    },
    badge: {
        color: "#363636",
        backgroundColor: "#f5f5f5",
        display: "table",
        paddingLeft: "5px",
        paddingRight: "5px",
        paddingTop: "3px",
        paddingBottom: "3px",
        fontSize: "0.8rem",
        fontWeight: 550,
        marginRight: "5px"
    },
    likeIcon: {
        color: "#9c9c9c",
        fontSize: "1rem",
    },
    likeText: {
        color: "#9c9c9c",
        fontSize: "0.9rem",
        paddingLeft: "3px",
        paddingRight: "5px",
    },
    downloadIcon: {
        color: "#9c9c9c",
        fontSize: "1rem",
    },
    downloadText: {
        paddingLeft: "3px",
        color: "#9c9c9c",
        fontSize: "0.9rem",
    },
    mediaSwitch: {
        paddingTop: "7px",
    },
    mediaSwitchIcon: {
        marginLeft: "5px",
        fontSize: "1.1rem",
        marginRight: "5px",
    }
});

export default styles;