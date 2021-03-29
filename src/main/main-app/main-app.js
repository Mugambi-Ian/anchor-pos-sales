import React, { Component } from "react";
import Loader from "../../assets/components/loader/loader";
import { _auth, _database } from "../../config";
import CheckOut from "./check-out/check-out";
import "./main-app.css";
import MyAccount from "./my-account/my-account";

export default class MainApp extends Component {
  state = {
    products: [],
    loading: true,
    user: { userName: "", email: "" },
  };
  async componentDidMount() {
    this.db = _database.ref();
    await this.db
      .child("users/staff/data/" + _auth.currentUser.email.split("@")[0])
      .on("value", (x) => {
        const { userName, email } = x.val();
        const t = { userName, email };
        this.setState({ user: t });
      });
    await this.db.child("products/").on("value", (x) => {
      const ps = [];
      x.child("active").forEach((i) => {
        const {
          productId,
          productName,
          productType,
          productDescription,
          productDp,
          unitPrice,
          inStock = 0,
        } = x.child("data/" + i.val()).val();
        if (inStock > 1)
          ps.push({
            productId,
            productName,
            productType,
            productDescription,
            productDp,
            unitPrice,
            inStock,
          });
      });
      this.setState({ loading: false, products: ps });
    });
  }
  componentWillUnmount() {
    this.db.off();
  }
  render() {
    return (
      <div className="home-body">
        {this.state.loading === true ? (
          <Loader />
        ) : (
          <SalesScreen
            products={this.state.products}
            user={this.state.user}
            revokeAccess={this.props.revokeAccess}
            closeToast={this.props.closeToast}
            showTimedToast={this.props.showTimedToast}
            showUnTimedToast={this.props.showUnTimedToast}
          />
        )}
      </div>
    );
  }
}

class SalesScreen extends Component {
  state = {
    cart: [],
    search: "",
    searchResult: undefined,
  };
  productCard(d, i) {
    return (
      <div key={i} className="product-item">
        <img
          draggable={false}
          className="unselectable"
          src={
            d.productDp === ""
              ? require("../../assets/drawables/ic-products.png").default
              : d.productDp
          }
          alt="dp"
        />
        <p className="n1 unselectable">{d.productName}</p>
        <p className="n2 unselectable">Type: {d.productType}</p>
       <p className="n2 unselectable">Description: {d.productDescription}</p>
        <div
          style={{
            display: "flex",
            flex: 2,
            marginRight: "20px",
            marginLeft: "10px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              backgroundColor: "#5dbcd2",
              padding: "10px",
              borderRadius: "10px",
              margin: "2px",
            }}
          >
            <p className="n3 unselectable">Unit Price</p>
            <p className="n3 unselectable">{"£" + d.unitPrice}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              backgroundColor: "#5dbcd2",
              padding: "10px",
              borderRadius: "10px",
              margin: "2px",
            }}
          >
            <p className="n3 unselectable">In Stock</p>
            <p className="n3 unselectable">{d.inStock}</p>
          </div>
        </div>
        <div
          className="button"
          onClick={async () => {
            await setTimeout(() => {
              const c = this.state.cart;
              if (c.includes(d)) {
                this.props.showTimedToast(
                  d.productName + " is already in cart."
                );
              } else {
                if (d.inStock > 0) {
                  d.orderCount = 1;
                  d.startSerial = "";
                  d.endSerial = "";
                  c.push(d);
                  this.props.showTimedToast(
                    d.productName + " has been added to your cart."
                  );
                } else {
                  this.props.showTimedToast(
                    d.productName + " currently unavailable."
                  );
                }
              }
            }, 100);
          }}
        >
          <img
            draggable={false}
            alt=""
            src={require("../../assets/drawables/ic-cart.png").default}
            className="unselectable"
          />
          <p className="text unselectable">Add To Cart</p>
        </div>
      </div>
    );
  }
  render() {
    return this.state.currentScreen === "account" ? (
      <MyAccount
        close={() => {
          this.setState({ currentScreen: undefined });
        }}
        closeToast={this.props.closeToast}
        showTimedToast={this.props.showTimedToast}
        showUnTimedToast={this.props.showUnTimedToast}
        revokeAccess={this.props.revokeAccess}
      />
    ) : this.state.currentScreen === "Checkout" ||
      this.state.currentScreen === "Quotation" ||
      this.state.currentScreen === "Invoice" ? (
      <CheckOut
        procedure={this.state.currentScreen}
        user={this.props.user}
        cart={this.state.cart}
        products={this.props.products}
        closeToast={this.props.closeToast}
        showTimedToast={this.props.showTimedToast}
        showUnTimedToast={this.props.showUnTimedToast}
        removeCartItem={(x) => {
          const cart = this.state.cart;
          if (cart.includes(x) === true) {
            const i = cart.indexOf(x);
            cart.splice(i, 1);
          }
          this.setState({ cart: cart });
        }}
        clearCart={() => {
          this.setState({ cart: [] });
        }}
        close={() => {
          this.setState({ currentScreen: undefined });
        }}
      />
    ) : (
      <div className="home-body">
        <div
          style={{
            display: "flex",
            marginLeft: "10px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          {this.state.currentScreen === undefined ? (
            <div
              style={{
                backgroundColor: "#5dbcd2",
                margin: 0,
                marginRight: "20px",
                marginLeft: "20px",
                borderRadius: "5px",
                boxShadow: "none",
              }}
              className="home-btn"
              onClick={async () => {
                await setTimeout(() => {
                  this.setState({ currentScreen: "account" });
                }, 100);
              }}
            >
              <img
                className="unselectable"
                alt=""
                draggable={false}
                src={require("../../assets/drawables/ic-user.png").default}
              />
              <p className="unselectable" style={{ color: "#fff" }}>
                My Account
              </p>
            </div>
          ) : (
            <img
              draggable={false}
              className="logo unselectable"
              src={require("../../assets/drawables/icon.png").default}
              alt=""
            />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderLeft: "#5dbcd2 2px solid",
              paddingLeft: "10px",
            }}
          >
            <h3 className="t1 unselectable" style={{ fontSize: "25px" }}>
              Point Of Sale
            </h3>
            <p
              className="t2 unselectable"
              style={{
                color: "#5dbcd2",
                backgroundColor: "#fff",
                border: "#5dbcd2 1px solid",
              }}
            >
              {this.props.user.userName}
            </p>
          </div>
        </div>
        <div className="product-list">
          <div className="product-container">
            {this.state.searching ? (
              this.state.searchResult ? (
                this.state.searchResult.map((d, i) => {
                  return this.productCard(d, i);
                })
              ) : (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    width: "95vw",
                    height: "70vh",
                  }}
                >
                  <Loader />
                </div>
              )
            ) : (
              this.props.products.map((d, i) => {
                return this.productCard(d, i);
              })
            )}
          </div>
        </div>
        {this.state.searching ? (
          <div className="nav-sec">
            <div className="field-input">
              <input
                value={this.state.search}
                onChange={(e) => {
                  this.setState({ search: e.target.value });
                }}
                placeholder="Product Name"
              />
            </div>
            <div
              className="home-btn"
              onClick={async () => {
                this.setState({ searchResult: undefined });
                await fetch(
                  "https://us-central1-anchor-pos.cloudfunctions.net/searchAnchorProduct",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      scope: "active",
                      search: this.state.search,
                    }),
                  }
                ).then(async (x) => {
                  const b = await x.json();
                  this.setState({ searchResult: b });
                });
              }}
            >
              <img
                className="unselectable"
                alt=""
                draggable={false}
                src={require("../../assets/drawables/ic-search.png").default}
              />
              <p className="unselectable">Search</p>
            </div>
            <div
              className="home-btn"
              onClick={async () => {
                await setTimeout(() => {
                  this.setState({
                    searching: undefined,
                    search: "",
                    searchResult: undefined,
                  });
                }, 200);
              }}
            >
              <img
                className="unselectable"
                alt=""
                draggable={false}
                src={require("../../assets/drawables/ic-close.png").default}
              />
              <p className="unselectable">Cancel </p>
            </div>
          </div>
        ) : (
          <div className="nav-sec">
            <div
              className="home-btn"
              onClick={async () => {
                await setTimeout(() => {
                  const c = this.state.cart;
                  if (c.length === 0) {
                    this.props.showTimedToast("Add products to check out");
                  } else {
                    this.setState({ currentScreen: "Checkout" });
                  }
                }, 200);
              }}
            >
              <img
                className="unselectable"
                alt=""
                draggable={false}
                src={require("../../assets/drawables/ic-check-out.png").default}
              />
              <p className="unselectable">Check Out </p>
            </div>
            <div
              className="home-btn"
              onClick={async () => {
                await setTimeout(() => {
                  const c = this.state.cart;
                  if (c.length === 0) {
                    this.props.showTimedToast("Add products for quotation");
                  } else {
                    this.setState({ currentScreen: "Invoice" });
                  }
                }, 200);
              }}
            >
              <img
                className="unselectable"
                alt=""
                draggable={false}
                src={require("../../assets/drawables/ic-invoice.png").default}
              />
              <p className="unselectable">Invoice</p>
            </div>
            <div
              className="home-btn"
              onClick={async () => {
                await setTimeout(() => {
                  const c = this.state.cart;
                  if (c.length === 0) {
                    this.props.showTimedToast("Add products for quotation");
                  } else {
                    this.setState({ currentScreen: "Quotation" });
                  }
                }, 200);
              }}
            >
              <img
                className="unselectable"
                alt=""
                draggable={false}
                src={require("../../assets/drawables/ic-quotation.png").default}
              />
              <p className="unselectable">Quotation</p>
            </div>
            <div
              style={{
                backgroundColor: "#5dbcd2",
                width: "2px",
                height: "80px",
                marginRight: "10px",
                marginLeft: "10px",
                alignSelf: "center",
              }}
            />
            <div
              className="home-btn"
              onClick={async () => {
                await setTimeout(() => {
                  this.setState({ searching: true });
                }, 200);
              }}
            >
              <img
                className="unselectable"
                alt=""
                draggable={false}
                src={require("../../assets/drawables/ic-search.png").default}
              />
              <p className="unselectable">Search</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}
