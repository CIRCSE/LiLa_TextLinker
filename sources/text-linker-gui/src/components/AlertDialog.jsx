import React, {Component} from 'react';
import {ThemeProvider} from "@material-ui/core";
import {createMuiTheme} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import {dark} from "./TTLFormDialog";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class AlertDialog extends Component {

    render() {
        return (
            <ThemeProvider theme={createMuiTheme(dark)}>
                <div>
                    <Dialog
                        open={this.props.open}
                        TransitionComponent={Transition}
                        keepMounted
                        fullWidth
                        maxWidth={"md"}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title" ><span style={{fontSize:"30px"}}>{"Before you go..."}</span></DialogTitle>
                        <DialogContent style={{paddingTop: "0px"}}>
                            <p>Please <u>copy and save</u> the document URI below: </p>
                            <span style={{color:"#f50057"}}>{this.props.documentURI}</span>
                            <p style={{fontStyle:"oblique"}}>To use this application again, please reload the page.</p>
                        </DialogContent>
                    </Dialog></div>
            </ThemeProvider>
        );
    }
}


export default AlertDialog;