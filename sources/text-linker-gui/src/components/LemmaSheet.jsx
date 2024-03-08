import React, {Component} from 'react';
import './LemmaSheet.css'
import LiLaLemma from "../LiLaObjectsFacets/LiLaLemma";

class LemmaSheet extends Component {

    render() {
        return (
            <div className={'lemma-sheet'}>
                <div className={'lemma-sheet-header'}>
                    Form: {this.props.selectedToken.props.data.token}
                </div>
                <div className={'lemma-sheet-content'}>
                    <LiLaLemma selectedToken={this.props.selectedToken} link={this.props.link}/>
                </div>
            </div>
        );
    }
}


export default LemmaSheet;