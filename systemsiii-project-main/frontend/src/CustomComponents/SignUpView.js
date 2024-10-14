import React from "react";
import axios from "axios";
import { API_URL } from "../Utils/Configuration";

class SignUpView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_input: {
        name: "",
        surname: "",
        username: "",
        email: "",
        password: ""
      },
      status: {
        success: false,
        msg: ""
      },
      errors: {
        email: ""
      }
    };
  }

  QGetTextFromField = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      user_input: {
        ...prevState.user_input,
        [name]: value
      }
    }));
  }

  validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  QPostSignup = () => {
    const { name, surname, username, email, password } = this.state.user_input;

    // Validate email
    if (!this.validateEmail(email)) {
      this.setState({ errors: { email: "Invalid email format. Must include '@' and '.com'." } });
      return;
    }

    axios.post('/users/register', {
      name,
      surname,
      username,
      email,
      password
    })
    .then(response => {
      this.setState({ status: { success: response.data.status.success, msg: response.data.status.msg }, errors: { email: "" } });
      console.log("Sent to server...");
    })
    .catch(err => {
      console.log(err);
      this.setState({ status: { success: false, msg: "An error occurred. Please try again." } });
    });
  }

  render() {
    return (
      <div className="card" style={{ width: "500px", margin: "50px auto",  }}>
        <form style={{ margin: "20px" }}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              onChange={this.QGetTextFromField}
              name="name"
              type="text"
              className="form-control"
              aria-describedby="nameHelp"
              value={this.state.user_input.name}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Surname</label>
            <input
              onChange={this.QGetTextFromField}
              name="surname"
              type="text"
              className="form-control"
              aria-describedby="surnameHelp"
              value={this.state.user_input.surname}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              onChange={this.QGetTextFromField}
              name="username"
              type="text"
              className="form-control"
              aria-describedby="usernameHelp"
              value={this.state.user_input.username}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              onChange={this.QGetTextFromField}
              name="email"
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              value={this.state.user_input.email}
            />
            <div className="form-text">
              We'll never share your email with anyone else.
            </div>
            {this.state.errors.email && (
              <div className="alert alert-danger" role="alert">{this.state.errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              onChange={this.QGetTextFromField}
              name="password"
              type="password"
              className="form-control"
              aria-describedby="passwordHelp"
              value={this.state.user_input.password}
            />
          </div>
        </form>
        <button onClick={this.QPostSignup} className="btn btn-primary" style={{ margin: "10px",background:"#0dcaf0", color:"white", border:"none" }}>
          Submit
        </button>

        {this.state.status.msg && (
          <div className={`alert ${this.state.status.success ? "alert-success" : "alert-danger"}`} role="alert">
            {this.state.status.msg}
          </div>
        )}
      </div>
    );
  }
}

export default SignUpView;
