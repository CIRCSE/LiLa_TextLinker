import React, {Component} from 'react';
import {getIGVLLQuery, getLabel} from "../../utils/SparqlQueriesTemplate";
import {executeSparql} from "../../utils/Sparql";

class LiLaIGVLLLexicon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lexiconName: '',
            entries: []
        }
    }

    componentDidMount() {
        let me = this
        getLabel(this.props.data.lexicon, 'lexicalResources', (label) => {
            me.setState({lexiconName: label})
        })
        let IGVLLQuery = getIGVLLQuery(this.props.data.lexicalEntry)
        executeSparql(IGVLLQuery, "lexicalResources", (entries) => {
            let etrs = []
            entries.forEach(entry => {
                etrs.push({etymon: entry.etymo, belief: entry.belief, cognate: entry.cognate, subterms: entry.subterms})
            })
            me.setState({entries: etrs})
        })
    }

    render() {
        return (
            <div>
                <div className={"lexical-resource-title"}>{this.state.lexiconName}</div>
                {this.state.entries.map(entry => {
                    return <ul>
                        {entry.belief.length > 0 ? <li>{entry.belief}</li> :""}
                        <li>{"etymon "+entry.etymon}</li>
                        {entry.cognate.length > 0 ? <li>{"cognate " + entry.cognate}</li> :""}
                        {entry.subterms.length > 0 ? <li>{"subterms " + entry.subterms}</li> :""}
                    </ul>
                })}
            </div>
        );
    }
}


export default LiLaIGVLLLexicon;