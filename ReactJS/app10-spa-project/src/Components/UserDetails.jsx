import axios from 'axios';
import React, { Component } from 'react'

import { useParams } from 'react-router-dom';

export function withRouter(Component) {
  return function Wrapper(props) {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}
class UserDetails extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       userInfo:{}
    }
  }
  
  componentDidMount(){
    console.log(this.props.params.id)
    axios.get("http://localhost:3000/users/"+this.props.params.id).then(({data})=>{
      console.log(data)
      this.setState({userInfo:data})
    })
  }
  render() {
    return (
      <div>
        <h2>Welcome to User Details Page !!</h2>
        <ul>
          <li>
            User First Name : {this.state.userInfo.fname}
          </li>
          <li>
            User Last Name : {this.state.userInfo.lname}
          </li>
          <li>
            User Email  : {this.state.userInfo.email}
          </li>

        </ul>
      </div>
    )
  }
}

export default withRouter(UserDetails);
