import React, { Component } from "react";
import axios from "axios";
import TicketDetails from "./TicketDetails";
import MovieForm from "./MovieForm";
export default class MovieTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingDetails: [],
      booking: {
        seatNumber: "",
        isBooked: "",
        category: "",
        userID: "",
      },
      editBooking: null,
    };
  }

  handleDelete = (booking) => {
    console.log(booking);
    axios
      .delete("http://localhost:3000/movieTickets/" + booking.id)
      .then(() => {
        console.log("Booking Deleted Successfully !!!");
        this.getMovieTicketsDetails();
      });
  };

  handleSubmit = () => {
    axios
      .post("http://localhost:3000/movieTickets", this.state.booking)
      .then(() => {
        this.getMovieTicketsDetails();
        this.handleClear();
      });
  };
  handleChange = (e) => {
    console.log(e);
    const newBooking = { ...this.state.booking };
    newBooking[e.target.name] = e.target.value;
    this.setState({ booking: newBooking });
  };
  handleClear = () => {
    this.setState({
      booking: {
        seatNumber: "",
        isBooked: "",
        category: "",
        userID: "",
      },
    });
  };

  handleEdit = (booking, i) => {
    this.setState({ booking: booking, editBooking: i });
  };

  handleUpdate=()=>{
    axios.put("http://localhost:3000/movieTickets/"+this.state.bookingDetails[this.state.editBooking].id,this.state.booking).then(()=>{
      this.getMovieTicketsDetails();
      this.handleClear();
      this.setState({ editBooking: null });
    })
  }
  render() {
    return (
      <div className="container ">
        <br />

        <div className="row">
          <div className="col">
            {/* child 1 */}
            <MovieForm
              handleSubmit={this.handleSubmit}
              booking={this.state.booking}
              handleChange={this.handleChange}
              editBooking={this.state.editBooking}
              handleUpdate={this.handleUpdate}
            />
          </div>
          <div className="col">
            {/* Child 2 */}
            <TicketDetails
              bookingDetails={this.state.bookingDetails}
              handleDelete={this.handleDelete}
              handleEdit={this.handleEdit}
            />
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
