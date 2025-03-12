import React, { Component } from "react";
import axios from "axios";
export default class MovieTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingDetails: [],
    };
  }

  render() {
    return (
      <div class="container text-center">
        <div class="row">
          <div class="col">Column</div>
          <div class="col">
            <table class="table">
              {/* {seatNumber: 'A1', isBooked: true, category: 'VIP', userID: 'U123'} */}
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Seat Number</th>
                  <th scope="col">Is Booked</th>
                  <th scope="col">category</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.bookingDetails.map((booking,i) => {
                  console.log(booking);
                  return (
                    <tr key={i}>
                      <td>{booking.userID}</td>
                      <td>{booking.seatNumber}</td>
                      <td>{booking.isBooked}</td>
                      <td>{booking.category}</td>
                      <td>
                        <button className="btn btn-primary">Edit</button>
                      </td>
                      <td>
                        <button className="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  getMovieTicketsDetails() {
    axios.get("http://localhost:3000/movieTickets").then(({ data }) => {
      console.log(data);
      this.setState({ bookingDetails: data });
    });
  }
  componentDidMount() {
    this.getMovieTicketsDetails();
  }
}
