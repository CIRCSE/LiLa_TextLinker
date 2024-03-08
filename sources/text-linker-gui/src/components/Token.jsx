import React, {Component} from 'react';
// import Tooltip from '@material-ui/core/Tooltip';
import './Token.css'
// import withStyles from "@material-ui/core/styles/withStyles";

// const MyTooltip = withStyles((theme) => ({
//     tooltip: {
//         backgroundColor: '#303030',
//         fontSize : '11px'
//     },
// }))(Tooltip);


class Token extends Component {
    constructor(props) {
        super(props);

        let linkingElements = this.props.data.linking
        if (this.props.data.upos === "PUNCT" && this.props.data.upos === "SYM" && this.props.data.upos === "NUM" && this.props.data.upos === "X") {
            linkingElements = []
        }

        this.state = {
            token : this.props.data.token,
            lemma : this.props.data.lemma,
            upos : this.props.data.upos,
            linking : linkingElements,
            spaceAfter : this.props.data.spaceAfter
        }
    }



    handleTokenClick = ()=>{
        this.props.tokenClick(this)
    }

    selectAmbiguousLemma = (lemma) =>{
        let me = this
        let linked = [lemma]
        this.setState({linking:linked},()=>{
            me.props.refresh(this,lemma)
        })

    }



    unlinkLemma = () =>{
        let me = this
        let linked = []
        this.setState({linking:linked},()=>{
            me.props.refresh(this)
        })
    }

    getTokenData = () =>{
        return this.state
    }


    render() {
        let linkingClass = ''
        if (this.state.upos !== "PUNCT" && this.state.upos !== "SYM" && this.state.upos !== "NUM" && this.state.upos !== "X") {
            if (this.state.linking.length === 0) {
                linkingClass = "missing"
            } else if (this.state.linking.length === 1) {
                linkingClass = "direct"
            } else if (this.state.linking.length > 1) {
                linkingClass = "ambiguous"
            }
        }else{
            if (this.state.linking.length > 0){
                if (this.state.linking.length === 1) {
                    linkingClass = "direct"
                } else if (this.state.linking.length > 1) {
                    linkingClass = "ambiguous"
                }
            }
        }

        return (

            // <MyTooltip title={"Lemma: " + this.props.data.lemma + " - Pos: "+ this.props.data.upos } >
            <span title={"Lemma: " + this.state.lemma + " - Pos: " + this.state.upos} className={'token ' + linkingClass} spaceAfter={this.state.spaceAfter} onClick={(e)=>{this.handleTokenClick(e)}}>{this.state.token}</span>
            // </MyTooltip>
        );
    }
}


export default Token;