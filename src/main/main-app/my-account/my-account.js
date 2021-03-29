import React, { Component } from "react";
import { logEvent, validField, _auth } from "../../../config";
import "./my-account.css";

export default class MyAccount extends Component {
  state = { password: "", currentPassword: "", confrimPassword: "" };
  render() {
    return (
      <div className="home-body">
        <p
          className="t2 unselectable"
          style={{
            fontWeight: "normal",
            alignSelf: "center",
            width: "300px",
            fontSize: "22px",
            marginBottom: "10px",
            marginTop: "50px",
          }}
        >
          Change Password
        </p>
        <img
          className="aci unselectable"
          src={require("../../../assets/drawables/ic-user.png").default}
          draggable={false}
          alt=""
        />

        <div className="account-body">
          <div className="field-input">
            <p className="name unselectable">Current Password</p>
            <input
              value={this.state.currentPassword}
              onChange={(e) => {
                this.setState({ currentPassword: e.target.value });
              }}
              placeholder="Current Password"
              type="password"
            />
          </div>
          <div className="field-input">
            <p className="name unselectable">New Password</p>
            <input
              value={this.state.password}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
              placeholder="New Password"
              type="password"
            />
          </div>
          <div className="field-input">
            <p className="name unselectable">Confirm Password</p>
            <input
              value={this.state.confrimPassword}
              onChange={(e) => {
                this.setState({ confrimPassword: e.target.value });
              }}
              placeholder="Confrim Password"
              type="password"
            />
          </div>
          <p
            onClick={async () => {
              const { currentPassword, confrimPassword, password } = this.state;
              if (
                validField(currentPassword) &&
                validField(confrimPassword) &&
                validField(password) &&
                password !== currentPassword &&
                password === confrimPassword
              ) {
                this.props.showUnTimedToast();
                _auth
                  .signInWithEmailAndPassword(
                    _auth.currentUser.email,
                    currentPassword
                  )
                  .then(async (e) => {
                    e.user
                      .updatePassword(password)
                      .then(async () => {
                        this.props.closeToast();
                        await setTimeout(() => {
                          this.props.showTimedToast("Update Successful!");
                          this.props.close();
                        }, 300);
                      })
                      .catch(this.catch_.bind(this));
                  })
                  .catch(this.catch_.bind(this));
              } else if (password !== confrimPassword) {
                this.props.showTimedToast("Password Does'nt Match!");
              } else if (password === currentPassword) {
                this.props.showTimedToast("Use a new password!");
              } else {
                this.props.showTimedToast("All Fields Required!");
              }
            }}
            className="link unselectable"
            style={{ alignSelf: "center", margin: "10px", width: "120px" }}
          >
            Update
          </p>
        </div>
        <div className="nav-sec">
          <div
            className="home-btn"
            onClick={async () => {
              await setTimeout(() => {
                logEvent(
                  this.props.user.userName +
                    " has signed out. Email Address: " +
                    _auth.currentUser.email.split("@")[0],
                  "staff/" + _auth.currentUser.uid + "/"
                ).then((x) => {
                  if (x === true) {
                    _auth.signOut().then(() => {
                      this.props.revokeAccess();
                      this.props.showTimedToast("Signed Out");
                    });
                  }
                });
              }, 200);
            }}
          >
            <img
              className="unselectable"
              alt=""
              draggable={false}
              src={require("../../../assets/drawables/ic-logout.png").default}
            />
            <p className="unselectable">Sign Out </p>
          </div>
          <div
            className="home-btn"
            onClick={async () => {
              await setTimeout(() => {
                this.props.close();
              }, 200);
            }}
          >
            <img
              className="unselectable"
              alt=""
              draggable={false}
              src={require("../../../assets/drawables/ic-home.png").default}
            />
            <p className="unselectable">Home</p>
          </div>
        </div>
      </div>
    );
  }
  async catch_(e) {
    this.props.closeToast();
    await setTimeout(() => {
      this.props.showTimedToast("Update Failed!");
    }, 300);
  }
}
