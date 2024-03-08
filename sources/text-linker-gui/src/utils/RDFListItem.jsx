import React, {Component} from 'react';
import {getLabel, translatePrefix} from "./SparqlQueriesTemplate";

class RDFListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            object: []
        }
    }

    componentDidMount() {
        let me = this

        //console.log(this.props.object);

        this.props.object.forEach(item =>{
            getLabel(item,'lemmaBank', (label) => {
                let lbs = me.state.object
                lbs.push(label)
                me.setState({object: lbs})
            })
        })



    }
    render() {
        return (
            <li>{translatePrefix(this.props.predicate)}&nbsp;<span className={"sheet-line-value"}>{this.state.object.join(" ")}</span></li>
        )
    }

}


export default RDFListItem;