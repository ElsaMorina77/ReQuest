import React from "react";
import axios from "axios";
import { API_URL } from "../Utils/Configuration";
import Cookies from "universal-cookie";

const cookies = new Cookies(); // Create an instance of Cookies

class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_input: {
        email: "",
        password: "",
        remember_me: false
      },
      status: {
        success: null,
        msg: ""
      }
    };
  }

  QGetTextFromField = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState((prevState) => ({
      user_input: {
        ...prevState.user_input,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  }

  QPostLogin = () => {
    const { email, password, remember_me } = this.state.user_input;

    if (email === "" || password === "") {
      this.setState({ status: { success: false, msg: "Missing input field" } });
      return;
    }

    axios.post('/users/login', {
      email,
      password
    }, { withCredentials: true }) // Ensure credentials are sent with request
    .then(response => {
      if (response.status === 200) {
        // Determine the cookie expiry based on remember_me
        const cookieOptions = {
          path: '/',
          expires: remember_me ? new Date(Date.now() + 86400000) : undefined // Expires in 1 day if remember me is checked
        };

        // Store user data in cookies
        cookies.set('user', JSON.stringify(response.data.user), cookieOptions);

        this.setState({
          status: {
            success: true,
            msg: "Login successful" // Set the success message
          }
        });

        // Call parent callback to update auth state
        this.props.onLoginSuccess(response.data.user);
      } else {
        console.log("Unexpected response status:", response.status);
      }
    })
    .catch(err => {
      if (err.response) {
        this.setState({ status: { success: false, msg:  "Invalid data. Check email or password. "} }); //err.response.data.message 
      } else {
        this.setState({ status: { success: false, msg: "An error occurred" } });
      }
    });
  };

  render() {
    return (
      <div className="container mt-4">
        <h2>Login</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              value={this.state.user_input.email}
              onChange={this.QGetTextFromField}
              type="email"
              className="form-control"
              placeholder="example@example.com"
              aria-label="Email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              value={this.state.user_input.password}
              onChange={this.QGetTextFromField}
              type="password"
              className="form-control"
              aria-label="Password"
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              name="remember_me"
              checked={this.state.user_input.remember_me}
              onChange={this.QGetTextFromField}
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
            />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.QPostLogin}
          >
            Login
          </button>
          <div className="mt-2">
            {this.state.status.success !== null && (
              <div className={`alert ${this.state.status.success ? 'alert-success' : 'alert-danger'}`}>
                {this.state.status.msg}
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default LoginView;

