import React, {Component} from 'react';
import {getLemmaBankQuery, translatePrefix} from "../utils/SparqlQueriesTemplate";
import {executeSparql} from "../utils/Sparql";
import RDFListItem from "../utils/RDFListItem";
import LiLaLexicalResources from "./LiLaLexicalResources";
import {MyButton} from "../utils/Utils";
import {LinkOff} from "@material-ui/icons";
import {Tooltip} from "@material-ui/core";

class LiLaLemma extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sheetLemmaContent: ""
        }

    }

    componentDidMount() {
        let lemma = this.props.link
        let theQuery = getLemmaBankQuery(lemma)
        //console.log(theQuery);
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

            let results = <ul>
                {elementLines.map(elementLines => {
                    return <RDFListItem predicate={elementLines.predicate} object={elementLines.object}/>
                })}
            </ul>
            //console.log(result);
            this.setState({sheetLemmaContent: results})
        })
    }


    render() {

        return (
            <div>
                <div style={{padding: '5px'}}>

                    <div style={{display: "flex", justifyContent: "space-between"}}><p>Lemma: {this.props.selectedToken.props.data.lemma} - UPOS: {this.props.selectedToken.props.data.upos}</p>
                        <div style={{display:"flex",alignItems:"center"}}>{this.props.selectedToken.state.linking.length > 1 ? <MyButton size="small" variant="outlined" onClick={(e) => {this.props.selectedToken.selectAmbiguousLemma(this.props.link)}} style={{height: "28px", fontSize: "12px"}}>Choose</MyButton> : ""}
                            <Tooltip title={"Unlink lemma"}><LinkOff style={{cursor:"pointer",marginLeft:"8px"}} onClick={(e) => {this.props.selectedToken.unlinkLemma()}}/></Tooltip>
                        </div>
                    </div>
                    <p style={{fontSize: "14px", fontWeight: "bolder"}}>Data from LemmaBank:</p>
                    Linked to LiLa <a href={translatePrefix(this.props.link)} rel="noreferrer" target={'_blank'}>{this.props.link}</a> <br/>
                    {this.state.sheetLemmaContent}

                </div>
                <LiLaLexicalResources lemma={this.props.link}/>
            </div>
        );
    }
}


export default LiLaLemma;