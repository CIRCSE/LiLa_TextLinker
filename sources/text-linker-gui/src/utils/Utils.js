import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button, Tooltip} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

export function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://lila-erc.eu">
                LiLa ERC
            </Link>{' '}
            {new Date().getFullYear()}
            {''}
        </Typography>
    );
}


export const MyButton = withStyles((theme) => ({
    root: {
        color: "#fff",
        borderColor: "#fff",
        '&:hover': {
            backgroundColor: "rgba(77, 77, 77, 0.56)",
        },
    },
}))(Button);

export const MyTextField = withStyles((theme) => ({
    root: {
        '& label': {
            fontFamily: 'monospace',
            color: "rgba(255, 69, 0, 0.83)"
        },
        '& .MuiInputBase-root': {
            fontFamily: 'monospace',

        },
    },

}))(TextField);

export const MyTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: "rgba(25, 25, 25, 0.9)",
    },

}))(Tooltip);