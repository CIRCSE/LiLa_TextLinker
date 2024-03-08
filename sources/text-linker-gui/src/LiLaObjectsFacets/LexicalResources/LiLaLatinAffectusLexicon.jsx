import React, {Component} from 'react';
import { getLabel, getLatinAffectusPolarity} from "../../utils/SparqlQueriesTemplate";
import './LexicalResources.css'
import {executeSparql} from "../../utils/Sparql";


class LiLaLatinAffectusLexicon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lexiconName: '',
            polarity : []
        }
    }

    componentDidMount() {
        let me = this
        getLabel(this.props.data.lexicon,'lexicalResources', (label) => {
            me.setState({lexiconName:label})
        })
        let affectusQuery = getLatinAffectusPolarity(this.props.data.lexicalEntry)



        executeSparql(affectusQuery, "lexicalResources", (polarities) => {
            let polars = []
            polarities.forEach(polarityItem =>{
                polars.push({polarityValue : parseFloat(polarityItem.polarityValue),polarity : polarityItem.polarity})
            })
            me.setState({polarity:polars})
        })


    }

    render() {
        return (
            <div>
                <div className={"lexical-resource-title"}>{this.state.lexiconName}</div>


                    {this.state.polarity.map(polar => {
                        return <ul><li>{"Polarity "+polar.polarity }</li><li>{"Polarity Value "+polar.polarityValue }</li></ul>
                    })}

            </div>
        );
    }
}



export default LiLaLatinAffectusLexicon;