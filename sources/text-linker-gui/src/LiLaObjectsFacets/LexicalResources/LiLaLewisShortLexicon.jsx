import React, {Component} from 'react';
import { getLabel, getLewisShortQuery} from "../../utils/SparqlQueriesTemplate";
import './LexicalResources.css'
import {executeSparql} from "../../utils/Sparql";


class LiLaLewisShortLexicon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lexiconName: '',
            definitions : []
        }
    }

    componentDidMount() {
        let me = this
        getLabel(this.props.data.lexicon,'lexicalResources', (label) => {
            me.setState({lexiconName:label})
        })
        let lewisShortQuery = getLewisShortQuery(this.props.data.lexicalEntry)


        executeSparql(lewisShortQuery, "lexicalResources", (definitions) => {
            let defs = []
            definitions.forEach(definitionItem =>{
                defs.push(definitionItem.defsString)
            })

            me.setState({definitions:defs})
        })


    }

    render() {
        return (
            this.state.definitions.length > 0 ?
            <div>
                <div className={"lexical-resource-title"}>{this.state.lexiconName}</div>

                <ul style={{listStyle:"disc"}}>
                    {this.state.definitions.map(polar => {
                        return <li style={{marginLeft:"-5px"}}>{polar}</li>
                    })}
                </ul>
            </div>
                :""
        );
    }
}



export default LiLaLewisShortLexicon;
