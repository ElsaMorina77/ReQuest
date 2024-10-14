
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import HomeView from "./CustomComponents/HomeView";
import AboutView from "./CustomComponents/AboutView";
import LoginView from "./CustomComponents/LoginView";
import SignUpView from "./CustomComponents/SignUpView";
import AddPostView from "./CustomComponents/AddPostView";
import SinglePostView from "./CustomComponents/SinglePostView";
import { SIGNUP, ABOUT, LOGIN, HOME, ADDNEW, POSTDETAIL, LOGOUT } from "./Utils/Constants";
import { API_URL } from "./Utils/Configuration";
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies(); // Create an instance of Cookies

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: ABOUT, // Start with AboutView
      postId: 0,
      searchQuery: "",
      user: null
    };
  }

  /*componentDidMount() {
    // Check if there is a logged-in user in cookies when the component mounts
    try {
      const userCookie = cookies.get('user');
      if (userCookie) {
        this.setState({ user: JSON.parse(userCookie) });
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      //cookies.remove('user'); // Remove invalid cookie
      this.setState({ user: null });
    }
  }*/

    componentDidMount() {
      const userCookie = cookies.get('user');
      console.log('User cookie value:', userCookie); // Debugging line
  
      try {
        if (userCookie) {
          // If userCookie is already an object, no need to parse
          const user = typeof userCookie === "string" ? JSON.parse(userCookie) : userCookie;
          this.setState({ user });
        }
      } catch (e) {
        console.error('Error parsing user cookie:', e);
        // Handle the error or reset the user state
        this.setState({ user: null });
      }
    }

  QSetView = (obj) => {
    this.setState({ 
      CurrentPage: obj.page,
      postId: obj.id || 0
    });
  };

  handleLoginSuccess = (user) => {
    console.log("User data received on login:", user);
    this.setState({ user });
    cookies.set('user', JSON.stringify(user), { path: '/', expires: new Date(Date.now() + 86400000) }); // Set cookie with 1-day expiry
    this.QSetView({ page: ABOUT });
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  }

  handlePostDeleted = () => {
    this.QSetView({ page: HOME }); // Redirect to home page or any other logic
  };

  handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
      this.setState({ user: null });
      cookies.remove('user'); // Remove user cookie
      this.QSetView({ page: HOME }); // Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };



  QGetView = () => {
    console.log("Current user in QGetView:", this.state.user);
    const userId = this.state.user ? this.state.user.id : null;

    switch (this.state.CurrentPage) {
      case HOME:
        return <HomeView searchQuery={this.state.searchQuery} QIDFromChild={this.QSetView} />;
      case LOGIN:
        return <LoginView onLoginSuccess={this.handleLoginSuccess} />;
      case SIGNUP:
        return <SignUpView />;
      case LOGOUT:
        return <HomeView />;
      case ADDNEW: 
        return <AddPostView user={this.state.user} />;
      case ABOUT:
        return <AboutView QSetView={this.QSetView} />;
      case POSTDETAIL:
        return <SinglePostView userId= {String(userId)} postId={String(this.state.postId)} user={this.state.user} onPostDeleted={this.handlePostDeleted} />;
      default:
        return <AboutView QSetView={this.QSetView} />;
    }
  };

  render() {
    console.log("Current user in App render:", this.state.user); // Log the user state
    //const {user, CurrentPage, postId} = this.state;

    return (
      <div id="APP" className="container">
        <header className="p-3 text-bg-dark">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
              </a>

              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <button
                    onClick={() => this.QSetView({ page: HOME })}
                    className="btn nav-link px-2 text-secondary"
                    style={{ background: 'none', border: 'none' }}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => this.QSetView({ page: ABOUT })}
                    className="btn nav-link px-2 text-white"
                    style={{ background: 'none', border: 'none' }}
                  >
                    About
                  </button>
                </li>
                
                <li>
                  <button
                    onClick={() => this.QSetView({ page: ADDNEW })}
                    className="btn nav-link px-2 text-white"
                    style={{ background: 'none', border: 'none' }}
                  >
                    Add Post
                  </button>
                </li>
              </ul>

              <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                <input type="search" className="form-control form-control-dark text-bg-dark" placeholder="Search..." aria-label="Search" 
                value={this.state.searchQuery}
                onChange={this.handleSearchChange}/>
              </form>

              <div className="text-end">
                {this.state.user ? (
                  <button type="button" className="btn btn-outline-light me-2" onClick={this.handleLogout}>Logout</button>
                ) : (
                  <>
                    <button type="button" className="btn btn-outline-light me-2" onClick={() => this.QSetView({ page: LOGIN })}>Login</button>
                    <button type="button" style={{background:"#0dcaf0", color:"white", border:"none" }} className="btn btn-warning" onClick={() => this.QSetView({ page: SIGNUP })}>Sign-up</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div id="viewer" className="row container">
          {this.QGetView()}
        </div>
      </div>
    );
  }
}

export default App;






