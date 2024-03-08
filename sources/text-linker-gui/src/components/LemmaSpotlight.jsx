import React, {Component} from 'react';
import {MyTextField, MyTooltip} from "../utils/Utils";
import {getLemmaBankQuery, getLemmaStartingWith, translatePrefix} from "../utils/SparqlQueriesTemplate";
import {executeSparql} from "../utils/Sparql";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./LemmaSpotlight.css"
import RDFListItem from "../utils/RDFListItem";

class LemmaSpotlight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lemmasearch: "",
            runningQuery: "none",
            results: [],
            tooltipContent: "",
            tooltipOpen: false,
            overLemma: ""
        }
    }


    getLemmas = (string, callback) => {

        let theQuery = getLemmaStartingWith(string)
        //console.log(theQuery);
        executeSparql(theQuery, 'lemmaBank', (result) => {
            // console.log(result);
            callback(result)
        })
    }


    lemmaSearchChange = (e) => {
        let me = this
        this.setState({lemmasearch: e.target.value.replace(/v/g,"u")}, () => {

            if (me.timeout) clearTimeout(me.timeout);
            me.timeout = setTimeout(function () {
                //me.reloadControlData()
                //  me.getResults()
                if (me.state.lemmasearch.length > 0) {
                    me.setState({runningQuery: 'block'}, () => {

                        me.getLemmas(me.state.lemmasearch, (results) => {
                            me.setState({runningQuery: 'none', results: results})

                        })

                    })
                }
            }, 1500)
        })
    }

    handleToolTipOpen = (id) => {
        let me = this
        if (id.length > 0) {
            let ttcontent = ""
            let translatedID = id.startsWith("http") ? translatePrefix(id) : id
            let theQuery = getLemmaBankQuery(translatedID)
            if (me.timeout) clearTimeout(me.timeout);
            me.timeout = setTimeout(function () {
                executeSparql(theQuery, 'lemmaBank', (result) => {
                    let elements = {}
                    result.forEach(item => {
                        if (elements.hasOwnProperty(item.predicate)) {
                            elements[item.predicate].push(item.object)
                        } else {
                            elements[item.predicate] = [item.object]
                        }
                    })
                    let elementLines = []
                    Object.keys(elements).forEach(pred => {
                        elementLines.push({predicate: pred, object: elements[pred]})
                    })

                    let results = <div className={"lemma-sheet-content"} style={{backgroundColor: "transparent"}}>
                        <ul style={{fontSize: "12px"}}>
                            {elementLines.map(elementLines => {
                                return <RDFListItem predicate={elementLines.predicate} object={elementLines.object}/>
                            })}
                        </ul>
                    </div>

                    ttcontent = <React.Fragment> {results} </React.Fragment>
                    this.setState({tooltipOpen: true, tooltipContent: ttcontent})
                })
            }.bind(this), 500)
        }


    }

    handleToolTipClose = () => {
        let me = this
        if (me.timeout) clearTimeout(me.timeout);
        this.setState({tooltipOpen: false, tooltipContent: ""})
    }
    handleRowClick = (lemma) => {
        let translatedlemma = lemma.startsWith("http") ? translatePrefix(lemma) : lemma
        this.props.selectedToken.selectAmbiguousLemma(translatedlemma)

    }

    render() {
        return (
            <div className={'lemma-sheet'}>
                <div className={'lemma-sheet-header'}>
                    Unmatched Lemma
                </div>
                <div className={'lemma-sheet-content'}>
                    <div style={{margin: "5px"}}>
                        <p>Lemma: {this.props.selectedToken.props.data.lemma} - UPOS: {this.props.selectedToken.props.data.upos}</p>
                        <MyTextField fullWidth id="lemma-search" name="lemma-search" value={this.state.lemmasearch} onChange={event => this.lemmaSearchChange(event)} label="Search Lemma" defaultValue="" margin="dense" color="secondary"/>
                        <MyTooltip placement="top" open={this.state.tooltipOpen} title={this.state.tooltipContent}>
                            <div id={"results"}>
                                <CircularProgress
                                    style={{
                                        color: '#686868',
                                        animationDuration: '1200ms',
                                        display: this.state.runningQuery
                                    }}
                                    size={24}
                                    thickness={4}
                                />

                                <div className={"results-container"}>
                                    {this.state.results.map((row, i) => {
                                        return <div className={"result-line"} onMouseLeave={() => this.handleToolTipClose()} onMouseEnter={() => this.handleToolTipOpen(row.subject)} onClick={() => this.handleRowClick(row.subject)}><span style={{color: "orange"}}>{row.wrs}</span><span> - {row.pos}</span></div>
                                    })}
                                </div>

                            </div>
                        </MyTooltip>
                    </div>
                </div>
            </div>
        );
    }
}


export default LemmaSpotlight;