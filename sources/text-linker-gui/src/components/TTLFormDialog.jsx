import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {Box, Tab, Tabs, ThemeProvider} from '@material-ui/core'
import {createMuiTheme} from '@material-ui/core/styles'
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import ConfirmDialog from "./ConfirmDialog";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
// import FormLabel from "@material-ui/core/FormLabel";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Radio from "@material-ui/core/Radio";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const dark = {
    palette: {
        type: 'dark',
    },
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

class TTLFormDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sentenceDivision: "sentenceYes",
            documentTitle: "",
            documentDescription: "",
            documentNamespace: "",
            documentAuthor: "",
            documentPublisher: "",
            docTitleInError: false,
            docPubInError: false,
            sessionId: window.theTimeStamp,
            docTitleHelperText: "Write the title of the document",
            docPubHelperText: "Write the publisher of the LOD document",
            confirmDialogShow: false,
            tabSelected: 0
        }
    }


    handleClose = () => {
        this.props.handleClose(true)
    };


    handleSubmit = (e) => {

        if (e.includes("TTL")) {
            this.props.handleClose(true)
            this.props.submitTTLForm(
                {
                    documentTitle: this.state.documentTitle,
                    documentAuthor: this.state.documentAuthor,
                    documentPublisher: this.state.documentPublisher,
                    documentNamespace: this.state.documentNamespace,
                    sentenceDivision: this.state.sentenceDivision,
                    documentDescription: this.state.documentDescription,
                    sessionId: window.theTimeStamp,
                })
        }else if (e.includes("Conll-U")) {
            this.props.handleClose(true)
            this.props.generateCONLLU(true)

        }else if (e.includes("JSON")) {
            this.props.handleClose(true)
            this.props.generateJSON(true)
        } else{
            this.setState({confirmDialogShow: true})
        }
    };

    confirmDialogResponse = (val) => {

        if (val) {
            this.props.submitToTriplesore(
                {
                    documentTitle: this.state.documentTitle,
                    documentAuthor: this.state.documentAuthor,
                    documentPublisher: this.state.documentPublisher,
                    documentNamespace: this.state.documentNamespace,
                    sentenceDivision: this.state.sentenceDivision,
                    documentDescription: this.state.documentDescription,
                    sessionId: window.theTimeStamp,
                })
        } else {
            this.setState({confirmDialogShow: false})
        }

    }


    validateForm = (e) => {

        if (this.state.documentTitle.trim().length === 0) {
            this.setState({docTitleInError: true, docTitleHelperText: "This field is required"})
            return;
        }

        if (this.state.documentPublisher.trim().length === 0) {
            this.setState({docPubInError: true, docPubHelperText: "This field is required"})
            return;
        }
        this.handleSubmit(e.target.textContent)

    }

    handleChangeTab = (e, newValue) => {
        console.log(newValue)
        this.setState({tabSelected: newValue})
    }



    render() {

        return (
            <ThemeProvider theme={createMuiTheme(dark)}>
                <div>
                    <Dialog
                        open={this.props.open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >

                        <Tabs
                            value={this.state.tabSelected}
                            onChange={(e, value) => this.handleChangeTab(e, value)}
                            centered
                        >
                            <Tab label="TTL"/>
                            {/*<Tab label="CONLL-U"/>*/}
                            <Tab label="JSON"/>
                            {/*<Tab label="Item Three"/>*/}
                        </Tabs>
                        <TabPanel value={this.state.tabSelected} index={0}>
                            <DialogTitle id="alert-dialog-slide-title">{"Before we generate the TTL..."}</DialogTitle>
                            {/*<form noValidate autoComplete="off" action={""} onSubmit={(e) => {*/}
                            {/*    e.preventDefault();*/}
                            {/*    this.validateForm();*/}
                            {/*}}>*/}
                            <DialogContent style={{paddingTop: "0px"}}>
                                <FormControl component="fieldset" style={{width: "70%"}}>
                                    <TextField required error={this.state.docTitleInError} id="document-title" name="doc_title" fullWidth value={this.state.documentTitle} onChange={event => {
                                        this.setState({documentTitle: event.target.value})
                                    }} label="Document Title" defaultValue="" margin="dense" color="secondary" helperText={this.state.docTitleHelperText}/>
                                </FormControl>
                                <FormControl component="fieldset" style={{width: "70%"}}>
                                    <TextField id="document-author" name="doc_author" fullWidth value={this.state.documentAuthor} onChange={event => {
                                        this.setState({documentAuthor: event.target.value})
                                    }} label="Document Author" defaultValue="" margin="dense" color="secondary" helperText='Write the name of the author eg. "Marcus Tullius Cicero" or a LOD reference "http://www.wikidata.org/entity/Q1541" '/>
                                </FormControl>
                                <FormControl component="fieldset" style={{width: "100%"}}>
                                    <TextField id="document-description" multiline rows={3} fullWidth name="doc_description" value={this.state.documentDescription} onChange={event => {
                                        this.setState({documentDescription: event.target.value})
                                    }} label="Document Description" defaultValue="" margin="dense" color="secondary" helperText="Write a description for your document"/>
                                </FormControl>
                                <FormControl component="fieldset" style={{width: "70%"}}>
                                    <TextField required error={this.state.docPubInError} id="document-publisher" name="doc_publisher" fullWidth value={this.state.documentPublisher} onChange={event => {
                                        this.setState({documentPublisher: event.target.value})
                                    }} label="Your name/Organisation" defaultValue="" margin="dense" color="secondary" helperText={this.state.docPubHelperText}/>
                                </FormControl>

                                {/*<FormControl component="fieldset" style={{width:"100%"}}>*/}
                                {/*    <TextField id="document-namespace" name="doc_namespace" fullWidth value={this.state.documentNamespace} onChange={event => {*/}
                                {/*        this.setState({documentNamespace: event.target.value})*/}
                                {/*    }} label="Namespace" defaultValue="" margin="dense" color="secondary" helperText="Write the namespace for your data or leave this field blank to use the default value"/>*/}
                                {/*</FormControl>*/}
                                {/*<FormControl component="fieldset" style={{marginTop: "20px"}} margin="dense">*/}
                                {/*    <FormLabel component="legend">Would you like to use the automatic sentence division produced by our text linker ?</FormLabel>*/}
                                {/*    <RadioGroup aria-label="sentenceDivision" name="sentenceDivision" value={this.state.sentenceDivision} onChange={(e) => {*/}
                                {/*        this.setState({sentenceDivision: e.target.value})*/}
                                {/*    }}>*/}
                                {/*        <FormControlLabel value="sentenceYes" control={<Radio/>} label="Yes"/>*/}
                                {/*        <FormControlLabel value="sentenceNo" control={<Radio/>} label="No"/>*/}
                                {/*    </RadioGroup>*/}
                                {/*</FormControl>*/}
                            </DialogContent>
                            <DialogActions>

                                {/*decomment to enable upload to triplestore*/}
                                {/*<Button  name="toTripleStore" color="secondary" onClick={(e)=>{this.validateForm(e)}}>*/}
                                {/*    Send to triplestore*/}
                                {/*</Button>*/}


                                <Button name="generateTTL" color="secondary" onClick={(e) => {
                                    this.validateForm(e)
                                }}>
                                    Generate TTL
                                </Button>
                            </DialogActions>

                        </TabPanel>
                        {/*<TabPanel value={this.state.tabSelected} index={1}>*/}
                        {/*    <DialogTitle id="alert-dialog-slide-title">{"Export in CoNLL-U Format"}</DialogTitle>*/}
                        {/*    <DialogActions>*/}

                        {/*        /!*decomment to enable upload to triplestore*!/*/}
                        {/*        /!*<Button  name="toTripleStore" color="secondary" onClick={(e)=>{this.validateForm(e)}}>*!/*/}
                        {/*        /!*    Send to triplestore*!/*/}
                        {/*        /!*</Button>*!/*/}


                        {/*        <Button name="generateCONNLU" color="secondary" onClick={(e) => {*/}
                        {/*            this.handleSubmit(e.target.textContent)*/}
                        {/*        }}>*/}
                        {/*            Generate Conll-U*/}
                        {/*        </Button>*/}
                        {/*    </DialogActions>*/}
                        {/*</TabPanel>*/}
                        <TabPanel value={this.state.tabSelected} index={1}>
                            <DialogTitle id="alert-dialog-slide-title">{"Export in JSON Format"}</DialogTitle>
                            <DialogActions>

                                {/*decomment to enable upload to triplestore*/}
                                {/*<Button  name="toTripleStore" color="secondary" onClick={(e)=>{this.validateForm(e)}}>*/}
                                {/*    Send to triplestore*/}
                                {/*</Button>*/}


                                <Button name="generateJSON" color="secondary" onClick={(e) => {
                                    this.handleSubmit(e.target.textContent)
                                }}>
                                    Generate JSON
                                </Button>
                            </DialogActions>
                        </TabPanel>

                        {/*</form>*/}
                    </Dialog>
                </div>
                <ConfirmDialog open={this.state.confirmDialogShow} confirmResult={(result) => {
                    this.confirmDialogResponse(result)
                }}/>
            </ThemeProvider>
        )
    }
}

export default TTLFormDialog;
