import React, { Component } from "react";

export default class MovieForm extends Component {
  render() {
    return (
      <div>
        <form>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              User ID
            </label>
            <input
              type="text"
              class="form-control"
              name="userID"
              value={this.props.booking.userID}
              onChange={this.props.handleChange}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Seat Number
            </label>
            <input
              type="text"
              class="form-control"
              name="seatNumber"
              value={this.props.booking.seatNumber}
              onChange={this.props.handleChange}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Is Booked{" "}
            </label>
            <input
              type="text"
              class="form-control"
              name="isBooked"
              value={this.props.booking.isBooked}
              onChange={this.props.handleChange}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Category
            </label>
            <input
              type="text"
              class="form-control"
              name="category"
              value={this.props.booking.category}
              onChange={this.props.handleChange}
            />
          </div>
          {this.props.editBooking === null ? (
            <button
              type="button"
              class="btn btn-primary"
              onClick={this.props.handleSubmit}
            >
              Add Ticket Details
            </button>
          ) : (
            <button
              type="button"
              class="btn btn-primary"
              onClick={this.props.handleUpdate}
            >
              Update Ticket Details
            </button>
          )}
        </form>
      </div>
    );
  }
}
