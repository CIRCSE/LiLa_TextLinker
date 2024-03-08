import React, {Component} from 'react';
import LemmaSheet from "./LemmaSheet";
import LemmaSpotlight from "./LemmaSpotlight";

class LiLaKnowledge extends Component {
    // constructor(props) {
    //     super(props);
    // }

    // componentDidMount() {
    //     if (this.props.selectedToken !=)
    //     console.log(this.props.selectedToken);
    //     console.log(this.props.selectedToken);
    // }


    render() {

        return (
            <div className={"sheets-container"}>
                {this.props.selectedToken !== undefined ?
                    this.props.selectedToken.state.linking.length > 0 ?
                        this.props.selectedToken.state.linking.map(linkedLemma => {
                    return <LemmaSheet selectedToken={this.props.selectedToken} link={linkedLemma}/>
                }) : <LemmaSpotlight selectedToken={this.props.selectedToken} /> : ""}
            </div>
        );
    }
}


export default LiLaKnowledge;