import React, {Component} from 'react';
import {getLexiconsQuery} from "../utils/SparqlQueriesTemplate";
import {executeSparql} from "../utils/Sparql";
import LiLaBrillLexicon from "./LexicalResources/LiLaBrillLexicon";
import LiLaLatinAffectusLexicon from "./LexicalResources/LiLaLatinAffectusLexicon";
import LiLaIGVLLLexicon from "./LexicalResources/LiLaIGVLLLexicon";
import LiLaLWNLexicon from "./LexicalResources/LiLaLWNLexicon";
import LiLaLewisShortLexicon from "./LexicalResources/LiLaLewisShortLexicon";

class LiLaLexicalResources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resources: []
        }
    }

    componentDidMount() {
        let lexcalRes = getLexiconsQuery(this.props.lemma)

        executeSparql(lexcalRes, "lexicalResources", (lexicalEntries) => {
            if (lexicalEntries.length > 0) {
                let res = this.state.resources
                lexicalEntries.forEach(le => {
                    if (le.lexicon === "http://lila-erc.eu/data/lexicalResources/LewisShort/Lexicon"){
                        res.push(<LiLaLewisShortLexicon data={le}/>)
                    }
                    if (le.lexicon === "http://lila-erc.eu/data/lexicalResources/BrillEDL/Lexicon"){
                        res.push(<LiLaBrillLexicon data={le}/>)
                    }
                    if (le.lexicon === "http://lila-erc.eu/data/lexicalResources/LatinAffectus/Lexicon"){
                        res.push(<LiLaLatinAffectusLexicon data={le}/>)
                    }
                    if (le.lexicon === "http://lila-erc.eu/data/lexicalResources/IGVLL/Lexicon"){
                        res.push(<LiLaIGVLLLexicon data={le}/>)
                    }
                    if (le.lexicon === "http://lila-erc.eu/data/lexicalResources/LatinWordNet/Lexicon"){
                        res.push(<LiLaLWNLexicon data={le}/>)
                    }

                })
                this.setState({resources: res})
            }
        })
    }

    render() {
        return (
            <div>
                {this.state.resources.length > 0 ? <div><p style={{fontSize:"14px",fontWeight:"bolder",marginLeft:"5px"}}>Lexical resources:</p> {this.state.resources} </div> : ""}
            </div>
        );
    }
}


export default LiLaLexicalResources;
