import React from "react";



class AboutView extends React.Component {
  render() {
    return (
      <div className="card" style={{ margin: "10px" }}>
        <div className="card-body">
          <h5 className="card-title">Re<span style={{ color: "#0dcaf0" }}>Quest</span></h5>
          <p className="card-text">A site where you <b>request</b> and enter the journey of <b>questing</b>. </p>
          <p className="card-text">Here, you can make an account, log in and post the things you want other people to help you find. Whether it's a unique item you've been searching for or something you stumbled upon and want to share, our community is here to help.  </p>
          <p className="card-text">Just post what you're looking for, and let the community help you out. You can also see if other people have posted what you have been looking for without an account, just check the Home page :D  All the marked posts are displayed in light green</p>
          <p className="card-text">Now, make an account and enjoy the journey of questing and requesting. </p>
        </div>
      </div>
    );
  }
}

export default AboutView;
