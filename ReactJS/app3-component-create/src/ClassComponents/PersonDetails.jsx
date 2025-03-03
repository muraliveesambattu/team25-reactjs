import { Component } from "react"

export default class PersonDetails extends Component{
    constructor(){
        super()
    }
    render(){
        console.log(this.props.allDetails)
        return <div>
            <h2>{this.props.allDetails.myName}</h2>
            <p>{this.props.allDetails.desription}</p>
            <img src={this.props.allDetails.imgAddress} alt="" />
        </div>
    }
}