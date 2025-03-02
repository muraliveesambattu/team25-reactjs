import { Component } from "react";

class Murali extends Component {
  render() {
    return (
      <div>
        <h2>Welcome to ReactJS Class Component !!!</h2>
        {/* Paragraph */}
        <p>Hello From Murali Compoent </p>
        {/* image  */}
        <img src="https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=" alt="" />
        {/* ul */}
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
          <li>Item 5</li>
        </ul>
        {/* ol */}
        <ol>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
          <li>Item 5</li>
        </ol>
        {/* table */}
        <table border={1}>
          <thead>
            <tr>
              <th>Heading 1</th>
              <th>Heading 2</th>
              <th>Heading 3</th>
            </tr>
          </thead>
          <tbody>
        <tr>
          <td>item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
        </tr>
        <tr>
          <td>item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
        </tr>
        <tr>
          <td>item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
        </tr>
        <tr>
          <td>item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
        </tr>
        <tr>
          <td>item 1</td>
          <td>Item 2</td>
          <td>Item 3</td>
        </tr>
          </tbody>
        </table>
        {/* anchor  */}
        <a href="https://www.eenadu.net/">Click Here ...</a>
        {/* forms */}
        <form action="">
          <label htmlFor="">First Name ..</label>
          <input type="text" name="" id="" /> <br />
          <button>Add User</button>
        </form>
      </div>
    );
  }
}

export default Murali;
