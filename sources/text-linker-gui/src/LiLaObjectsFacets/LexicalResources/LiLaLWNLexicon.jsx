import React, {Component} from 'react';
import { getLabel, getLatinWordnetQuery} from "../../utils/SparqlQueriesTemplate";
import './LexicalResources.css'
import {executeSparql} from "../../utils/Sparql";
import * as _ from "underscore";

class LiLaLWNLexicon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lexiconName: '',
            senses: []
        }
    }

    componentDidMount() {
        let me = this
        getLabel(this.props.data.lexicon, 'lexicalResources', (label) => {
            me.setState({lexiconName: label})
        })
        //console.log(this.props.data.lexicalEntry);
        let lwnQuery = getLatinWordnetQuery(this.props.data.lexicalEntry)
        executeSparql(lwnQuery, "lexicalResources", (WNsenses) => {
            let senses = []
            WNsenses.forEach(sensesItem => {

                let collectedSenses = _.findWhere(senses,{id: sensesItem.sense});
                let sense = {id : sensesItem.sense, definition : sensesItem.def , princetonLink: sensesItem.synLink , relations: []}
                if (collectedSenses != undefined) {
                    sense = collectedSenses
                }else{
                    senses.push(sense);
                }
                sense.relations.push({ relType: sensesItem.pTLabel, princetonLink: sensesItem.relSyn , definition:sensesItem.defRel})

            })
            // console.log(senses);
            // let polars = []
            // polarities.forEach(polarityItem =>{
            //     polars.push({polarityValue : parseInt(polarityItem.polarityValue),polarity : polarityItem.polarity})
            // })
            me.setState({senses:senses})
        })

    }

    render() {
        return (
            <div>
                <div className={"lexical-resource-title"}>{this.state.lexiconName}</div>
                <p style={{marginLeft:"10px"}}>Senses:</p>
                <ol>
                {this.state.senses.map(sense => {
                    return <li><a href={sense.princetonLink} target={"_blank"}>{sense.definition}</a><ul>{sense.relations.map(rel =>{
                        //    return <li>{rel.relType} - <a style={{color:"orange"}} href={rel.princetonLink} target={"_black"}>{rel.definition}</a> </li>
                    })}</ul></li>
                })}
                </ol>
            </div>
        );
    }
}


export default LiLaLWNLexicon;