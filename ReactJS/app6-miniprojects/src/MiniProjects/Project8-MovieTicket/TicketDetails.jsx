import React, { Component } from "react";

export default class TicketDetails extends Component {
  render() {
    return (
      <div>
        <table className="table">
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
            {this.props.bookingDetails.map((booking, i) => {
              console.log(booking);
              return (
                <tr key={i}>
                  <td>{booking.userID}</td>
                  <td>{booking.seatNumber}</td>
                  <td>{booking.isBooked}</td>
                  <td>{booking.category}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        this.props.handleEdit(booking,i);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.props.handleDelete(booking);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
