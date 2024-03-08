import React, {Component} from 'react';
import {createMuiTheme} from "@material-ui/core/styles";
import {dark} from "./TTLFormDialog";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DialogContentText, ThemeProvider} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


class ConfirmDialog extends Component {


    sendResponse = (val) =>{
        this.props.confirmResult(val)
    }


    render() {
        return (
            <ThemeProvider theme={createMuiTheme(dark)}>
                <div>
                    <Dialog
                        open={this.props.open}
                        TransitionComponent={Transition}
                        onClose={() =>{this.sendResponse(false)}}
                        keepMounted
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title" >Warning</DialogTitle>
                        <DialogContent style={{paddingTop: "0px"}}>
                            <DialogContentText>
                            <p>Do you wish to continue?</p>
                            <p>If you proceed, you'll no longer be able to make changes to your document.</p>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button   color="secondary" onClick={(e)=>{this.sendResponse(true)}}>
                           Yes
                        </Button>
                        <Button   color="secondary" onClick={(e)=>{this.sendResponse(false)}} autoFocus>
                            No
                        </Button>
                        </DialogActions>
                    </Dialog></div>
            </ThemeProvider>
        );
    }
}


export default ConfirmDialog;