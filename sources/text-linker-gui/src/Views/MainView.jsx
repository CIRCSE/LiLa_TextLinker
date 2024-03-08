import React, {Component} from 'react';
import {HelpOutline} from '@material-ui/icons'
import {Paper, Grid} from "@material-ui/core";
import './MainView.css'
import withStyles from "@material-ui/core/styles/withStyles";
import Token from "../components/Token";
import Sentence from "../components/Sentence";
import {Doughnut} from "react-chartjs-2";

import {MyButton, Copyright} from "../utils/Utils";
import TTLFormDialog from "../components/TTLFormDialog";
import LiLaKnowledge from "../components/LiLaKnowledge";
import AlertDialog from "../components/AlertDialog";

import {DragDrop} from 'styled-icons/remix-line'


// import LazyLoad from 'react-lazyload';
// eslint-disable-next-line no-unused-vars
const particlesJS = require('particles.js')
const axios = require('axios')


const styles = theme => ({
    rooter: {
        "& $notchedOutline": {
            borderColor: "#8a8a8a"
        },
        "&:hover $notchedOutline": {
            borderColor: "#75317E"
        },
        "&$focused $notchedOutline": {
            borderColor: "#75317E"
        },
    },
    cssLabel: {
        '&$cssFocused': {
            color: '#75317E',
        },
        color: '#000',
        fontSize: "14px"
    },

    cssFocused: {
        color: '#000',
        fontSize: "14px"

    },
    notchedOutline: {
        "&": {
            borderColor: "#858585"
        },
        "&:hover": {
            borderColor: "#858585"
        },
        "&$focused": {
            borderColor: "#858585"
        },
    },

});


const chartOptions = {
    legend: {
        display: true,
        position: 'right',
        labels: {
            fontColor: 'rgb(255,255,255)'
        },

    },

    maintainAspectRatio: false
}


class MainView extends Component {

    rifr = {}

    constructor(props) {
        super(props);
        const {classes} = this.props;

        this.state = {
            classes: classes,
            textValue: "",
            textResults: [],
            statsChartData: {
                labels: ["exact match", "ambiguous match", "no match"],
                datasets: [
                    {
                        label: 'linking coverage',
                        data: [0, 0, 0],
                        backgroundColor: ["rgba(142, 187, 142, 0.5)", "rgba(106, 125, 156, 0.5)", "rgba(255, 69, 0, 0.5)"],
                        borderWidth: 1,
                    }
                ],


            },
            lemmaSheets: [],
            mainWinGridSize: [12, 12],
            sideWinGridSize: [0, 0],
            chartRedraw: true,
            ttlDialogOpen: false,
            AlertDialogOpen: false,
            selectedToken: undefined,
            tokenArray: [],
            docURI: ""
        }

    }

    showSidebar = () => {
        this.setState({mainWinGridSize: [7, 8], sideWinGridSize: [5, 4]})
    }

    hideSidebar = () => {
        this.setState({mainWinGridSize: [12, 12], sideWinGridSize: [0, 0], chartRedraw: true})
    }


    refreshClick = (e) => {

        this.hideSidebar()

        this.setState({tokenArray: [], textResults: [], statsChartData: {}, lemmaSheets: []}, () => {
            document.getElementById('text_field').classList.remove('textFiled-hidden')
        })
        document.getElementById('text_field').classList.add('textFiled-hidden')
    }


    processResults = () => {


    }


    processClick = (e) => {
        let me = this
        me.setState({mainWinGridSize: [7, 8], sideWinGridSize: [5, 4]}, () => {
            axios.post(window.apiLiLaTestLinkerSiteUrlPrefix + 'processText', {
                text: me.state.textValue
            }, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).then((response) => {


                // console.log(response);
                me.setState({textResults: response.data.sentences}, () => {
                    document.getElementById('text_field').classList.add('textFiled-hidden');

                    let values = [0, 0, 0]
                    for (const [label, value] of Object.entries(response.data.stats)) {

                        switch (label) {
                            case "direct" :
                                values[0] = value
                                break;
                            case "missing" :
                                values[2] = value
                                break;
                            case "ambiguous" :
                                values[1] = value
                                break;
                            default:
                                break
                        }
                    }

                    let sc = this.state.statsChartData
                    sc.datasets[0].data = values
                    sc.labels = ["exact match", "ambiguous match", "no match"]
                    console.log(values);
                    console.log(sc);
                    me.setState({statsChartData: sc}, () => {
                        me.setState({chartRedraw: false})
                    })
                })
            }, (error) => {
                console.log(error);
            });
        })
    }


    generateCONLLU = (check) => {
        if (check) {
            console.log("generate conllu")

        }
    }

    generateJSON = (check) => {
        const FileSaver = require('file-saver');
        let me = this
        console.log(me.state.textResults)

        let TextToBeSend = []
        this.state.textResults.forEach((sentence, i) => {
            let tokenarray = []
            sentence.forEach((token, x) => {
                tokenarray.push(me.rifr["s" + i + "-t" + x].getTokenData())
            })
            TextToBeSend.push(tokenarray)
        })

        if (check) {

            //console.log(TextToBeSend)
            axios.post(window.apiLiLaTestLinkerSiteUrlPrefix + 'generateJSON', {
                textToProcess: TextToBeSend
            }, {
                responseType: 'text',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).then((response) => {

                let blob = new Blob([JSON.stringify(response.data, null, 4)], {type: "application/json;charset=utf-8"});
                FileSaver.saveAs(blob, "Output.json");

            }, (error) => {
                console.log(error);
            });

        }
    }


    generateTTL = (ttlFormData) => {
        const FileSaver = require('file-saver');

        let TextToBeSend = []
        let me = this
        this.state.textResults.forEach((sentence, i) => {
            let tokenarray = []
            sentence.forEach((token, x) => {
                tokenarray.push(me.rifr["s" + i + "-t" + x].getTokenData())
            })
            TextToBeSend.push(tokenarray)
        })


        axios.post(window.apiLiLaTestLinkerSiteUrlPrefix + 'generateTTL', {
            textToProcess: TextToBeSend,
            formData: ttlFormData
        }, {
            responseType: 'text',
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).then((response) => {
            let blob = new Blob([response.data], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, ttlFormData.documentTitle + ".ttl");

        }, (error) => {
            console.log(error);
        });
    }

    loadToTripleStore = (ttlFormData) => {

        let TextToBeSend = []
        let me = this
        this.state.textResults.forEach((sentence, i) => {
            let tokenarray = []
            sentence.forEach((token, x) => {
                tokenarray.push(me.rifr["s" + i + "-t" + x].getTokenData())
            })
            TextToBeSend.push(tokenarray)
        })


        axios.post(window.apiLiLaTestLinkerSiteUrlPrefix + 'loadTTLToEndpoint', {
            textToProcess: TextToBeSend,
            formData: ttlFormData
        }, {
            responseType: 'text',
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).then((response) => {
            console.log(response);
            if (response.data.length > 0) {
                me.setState({AlertDialogOpen: true, docURI: response.data})
            } else {
                alert("Something went wrong. Please try again later.")
            }

        }, (error) => {
            console.log(error);
        });
    }


    refreshChart = () => {
        let sc = this.state.statsChartData
        sc.datasets[0].data =
            [
                document.querySelectorAll(".direct").length,
                document.querySelectorAll(".ambiguous").length,
                document.querySelectorAll(".missing").length
            ]
        this.setState({statsChartData: sc}, () => {
        })
    }


    clickOnToken = (tokenObject) => {
        let me = this
        // console.log(tokenObject);
        this.setState({selectedToken: undefined}, () => {
            me.setState({selectedToken: tokenObject})
        })
    }

    refreshLemmaToken = (tokenObject) => {
        let me = this
        this.setState({selectedToken: undefined}, () => {
            me.setState({selectedToken: tokenObject}, () => {
                me.refreshChart()
            })

        })
    }

    // unlinkLemmaToken = (tokenObject) =>{
    //     let me = this
    //     this.setState({selectedToken: undefined}, () => {
    //         me.setState({selectedToken: tokenObject},()=>{
    //             me.refreshChart()
    //         })
    //
    //     })
    // }


    componentDidMount() {
        let me = this
        window.particlesJS.load('particles-js', 'assets/particles.json')
        document.getElementById('text_field').addEventListener("input", function (e) {
            me.setState({textValue: e.target.value}, () => {
            })
        })


    }

    setRifr = (element, key) => {
        this.rifr[key] = element
    }


    onDragFileOver = (event) => {
        console.log("drag enter")

        event.target.style.borderWidth = "3px"
        event.target.style.borderColor = "#d5d5d5"
        event.target.style.borderStyle = "dotted"
        event.target.style.backgroundColor = "rgba(236,236,236,0.22)"
        document.getElementById("dropIcon").style.display = "block"
        //  event.target.css("border-width","10px");
        //  event.target.css.borderColor="#fff";


        let files = event.dataTransfer.files;
        console.log(files)
        console.log(event)

    }

    onDragLeave = (event) => {
        event.target.style.borderColor = "transparent";
        event.target.style.removeProperty("background-color")
        event.target.style.removeProperty("border-width")
        event.target.style.removeProperty("border-style")
        document.getElementById("dropIcon").style.display = "none"
        // event.target.style.backgroundColor = "rgba(152, 152, 152, 0.05)"

    }
    onDropFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.target.style.borderColor = "transparent";
        event.target.style.removeProperty("background-color")
        event.target.style.removeProperty("border-width")
        event.target.style.removeProperty("border-style")
        document.getElementById("dropIcon").style.display = "none"
        console.log("droppa")
        let files = event.dataTransfer.files;
        console.log(files)
    }


    render() {

        return (
            <div style={{height: "calc(100vh - 47px)"}}>
                <a href="https://lila-erc.eu" style={{position: 'absolute', top: '12px', right: '18px'}}><img src={"./elements/cropped-lila-logo.png"} alt={"LiLa logo"} style={{width: '70px'}}/></a>

                <div style={{position: 'relative', background: 'inherit', height: "100%", overflow: "hidden"}}>
                    <div style={{margin: "1.2em", marginTop: "41px", height: "calc(100vh - 150px)"}}>

                        <h1 className="noselect" style={{backgroundColor: 'transparent', fontFamily: 'moonbold', fontSize: "2em", color: "#fff", marginRight: '100px'}}>LiLa: Text Linker (&beta;)
                            {/*<HelpOutline style={{fontSize: "20px", color: '#37123C'}} onClick={() => {}}/>*/}
                        </h1>
                        <Grid container style={{height: "100%"}} spacing={2}>
                            <Grid item xs={12} sm={this.state.mainWinGridSize[0]} md={this.state.mainWinGridSize[1]}>
                                <Paper elevation={3} style={{backgroundColor: "rgba(38, 38, 38, 0.5)", height: "100%", color: "#fff", fontFamily: "monospace"}}>

                                    <div style={{padding: "8px", height: "100%"}}>
                                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                            <h3>Paste your text below</h3>
                                            <div className={"button-container"}>
                                                <MyButton size="small" variant="outlined" onClick={(e) => {
                                                    this.refreshClick(e)
                                                }} style={{marginLeft: "6px"}}>Text</MyButton>
                                                <MyButton size="small" variant="outlined" onClick={(e) => {
                                                    this.processClick(e)
                                                }}>Process</MyButton>
                                            </div>
                                        </div>


                                        <textarea id={'text_field'} className={"textField"} contentEditable={true} placeholder={"Text here..."} value={this.state.textValue} onDrop={(e) => this.onDropFile(e)}
                                                  onDragEnter={(e) => this.onDragFileOver(e)}
                                                  onDragLeave={(e) => this.onDragLeave(e)}>

                                        </textarea>
                                        <div id={"dropIcon"}>
                                            <DragDrop width={120}/>
                                        </div>
                                        <div id={"results"} className={"text-results"}>
                                            {this.state.textResults.map((sentence, i) => {
                                                let tokenarray = []
                                                sentence.forEach((token, x) => {
                                                    tokenarray.push(<Token ref={element => this.setRifr(element, "s" + i + "-t" + x)} data={token} tokenClick={(tokenObject) => this.clickOnToken(tokenObject)} refresh={(tokenObject, lemma) => this.refreshLemmaToken(tokenObject, lemma)}/>)
                                                })
                                                return <Sentence ref={"s" + i} tokens={tokenarray}/>
                                            })}

                                        </div>
                                    </div>

                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={this.state.sideWinGridSize[0]} md={this.state.sideWinGridSize[1]}>
                                {/*<Paper elevation={3} style={{backgroundColor: "rgba(255, 255, 255, 0.78)", height: "100%"}}>*/}
                                <Paper elevation={3} style={{backgroundColor: "rgba(38, 38, 38, 0.5)", height: "100%", color: "#fff", fontFamily: "monospace"}}>
                                    <div style={{padding: "8px", height: "100%"}}>
                                        <div style={{display: "flex", flexDirection: "column"}}>
                                            <div className={"sidebar-title-box"}>
                                                <h3>LILA KNOWLEDGE BASE </h3>
                                                <div className={"button-container"} style={{width: "auto"}}>
                                                    <MyButton size="small" variant="outlined" onClick={(e) => {
                                                        this.setState({ttlDialogOpen: true})
                                                    }}>Output</MyButton>
                                                </div>
                                            </div>
                                            <div>
                                                <Doughnut data={this.state.statsChartData} redraw={this.state.chartRedraw} height={150} options={chartOptions}/>
                                            </div>
                                            <div style={{marginTop: "12px"}}>
                                                Click a token to show linked data
                                                <LiLaKnowledge selectedToken={this.state.selectedToken}/>
                                                {/*<div className={"sheets-container"}>*/}
                                                {/*    {this.state.lemmaSheets.map(sheet => {*/}
                                                {/*        return <LemmaSheet data={sheet}/>*/}
                                                {/*    })}*/}
                                                {/*</div>*/}
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </div>

                <TTLFormDialog open={this.state.ttlDialogOpen} submitTTLForm={(submittedForm) => this.generateTTL(submittedForm)} generateCONLLU={(check) => this.generateCONLLU(check)} generateJSON={(check) => this.generateJSON(check)} submitToTriplesore={(submittedForm) => this.loadToTripleStore(submittedForm)} handleClose={(open) => this.setState({ttlDialogOpen: !open})}/>
                <AlertDialog open={this.state.AlertDialogOpen} documentURI={this.state.docURI}/>
                <footer className={"footer"} style={{paddingTop: '10px'}}>
                    <Copyright/>
                </footer>
            </div>

        );
    }
}


export default withStyles(styles)(MainView);
