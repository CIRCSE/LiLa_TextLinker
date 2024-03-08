import React, {Component} from 'react';
import './Sentence.css'
class Sentence extends Component {
    // constructor(props) {
    //     super(props);
    //
    // }

    render() {
        return (

            <div className={'sentence'}>{this.props.tokens}</div>
        );
    }
}


export default Sentence;