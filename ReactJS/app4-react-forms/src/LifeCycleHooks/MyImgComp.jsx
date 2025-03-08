import React, { Component } from 'react'

export default class MyImgComp extends Component {
  render() {
    return (
      <div>
        <img src="https://media.istockphoto.com/id/1403500817/photo/the-craggies-in-the-blue-ridge-mountains.jpg?s=1024x1024&w=is&k=20&c=jLBfnKZZdps-vzXClEPp0X2vwIQSehJZAhP4_OfXldU=" alt="" />
      </div>
    )
  }

  componentWillUnmount(){
    console.log("This Component is going to Unmounted ('Reamoved ')")
  }
}
