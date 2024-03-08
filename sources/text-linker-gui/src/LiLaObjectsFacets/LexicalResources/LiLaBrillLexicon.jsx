import React, {Component} from 'react';
import {getEtymonQuery, getLabel, translatePrefix} from "../../utils/SparqlQueriesTemplate";
import './LexicalResources.css'
import {executeSparql} from "../../utils/Sparql";

class LiLaBrillLexicon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lexiconName: '',
            etymons: [],
            cognate: ""
        }
    }

    componentDidMount() {
        let me = this
        getLabel(this.props.data.lexicon, 'lexicalResources', (label) => {
            me.setState({lexiconName: label})
        })
        let etymonQuery = getEtymonQuery(this.props.data.lexicalEntry)
        executeSparql(etymonQuery, "lexicalResources", (etymons) => {
            let etyms = []
            etymons.forEach(etym => {
                this.setState({cognate: etym.cognateLemma})
                etyms.push({language: etym.etymonLanguage, etymon: etym.etymon})
            })
            me.setState({etymons: etyms})
        })


    }

    render() {
        return (
            <div>
                <div className={"lexical-resource-title"}>{this.state.lexiconName}</div>
                {this.state.cognate.length > 0 ? <div style={{marginLeft: "5px", marginTop: "10px"}}>Cognate of <a href={this.state.cognate} rel="noreferrer" target={'_blank'}>{translatePrefix(this.state.cognate)}</a></div> : ""}
                <ul>
                    {this.state.etymons.map(ety => {
                        return <li>{"Language " + ety.language + ": " + ety.etymon}</li>
                    })}
                </ul>
            </div>
        );
    }
}


export default LiLaBrillLexicon;