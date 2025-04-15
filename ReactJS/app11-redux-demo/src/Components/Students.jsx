import React, { Component } from 'react'

export default class Students extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         studentDetails:["Std1","Std2","Std3","Std4"]
      }
    }
    
  render() {
    return (
      <div>
        <ul>
            {this.state.studentDetails.map((std)=>{
                return <li>{std}</li>
            })}
        </ul>
      </div>
    )
  }
}
