import React, { Component } from "react";
import {
  currentTime,
  dateToday,
  idDate,
} from "../../../assets/resources/date-handler";
import {
  logEvent,
  numberWithCommas,
  validField,
  _database,
  _storage,
} from "../../../config";
import "./check-out.css";

export default class CheckOut extends Component {
  state = {
    checkOutCart: [],
    customerName: "",
    customerEmail: "",
    currentSceen: undefined,
  };
  makeSale() {
    this.setState({ currentSceen: "sale" });
  }
  componentDidMount() {
    this.db = _database.ref();
    this.setState({ checkOutCart: this.props.cart });
  }
  componentWillUnmount() {
    this.db.off();
  }
  totalPrice() {
    var t = 0;
    const c = this.state.checkOutCart;
    c.forEach((i) => {
      const x = i.orderCount * i.unitPrice;
      t = x + t;
    });
    return t;
  }

  render() {
    return this.state.currentSceen === "sale" ? (
      <div className="sale-body">
        <div
          className="reciept-box"
          style={this.state.sold ? { maxHeight: "35vh" } : {}}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginRight: "10px",
              marginTop: "20px",
              marginBottom: "20px",
              marginLeft: "20px",
            }}
          >
            <h3
              className="t1 unselectable"
              style={{
                maxWidth: "300px",
                margin: 0,
                alignSelf: "center",
                textAlign: "center",
                marginRight: "20px",
                fontSize: "25px",
                fontWeight: "bolder",
              }}
            >
              {this.state.sold
                ? this.props.procedure === "Invoice"
                  ? "Invoice Created"
                  : this.props.procedure === "Checkout"
                  ? "Sale Recorded"
                  : "Quotation Created"
                : this.props.procedure === "Invoice"
                ? "Invoice"
                : this.props.procedure === "Checkout"
                ? "Confrim Sale"
                : "Quotation"}
            </h3>
            <p
              className="link unselectable"
              style={{
                alignSelf: "center",
                marginRight: "10px",
              }}
              onClick={async () => {
                await setTimeout(() => {
                  if (this.state.sold) {
                    this.props.close();
                    this.props.clearCart();
                  } else {
                    this.setState({ currentSceen: undefined });
                  }
                }, 200);
              }}
            >
              {this.state.sold ? "Close" : "Cancel"}
            </p>
            {this.state.sold ? (
              ""
            ) : (
              <p
                onClick={async () => {
                  await this.recordSale();
                }}
                className="link unselectable"
                style={{ alignSelf: "flex-end", marginRight: "10px" }}
              >
                Proceed
              </p>
            )}
          </div>
          {this.state.sold ? (
            ""
          ) : (
            <div className="cart-list">
              {this.state.checkOutCart.map((d, i) => {
                return (
                  <div className="cart-item" key={i}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "150px",
                      }}
                    >
                      <img
                        draggable={false}
                        className="unselectable"
                        src={
                          d.productDp === ""
                            ? require("../../../assets/drawables/ic-products.png")
                                .default
                            : d.productDp
                        }
                        alt="dp"
                      />
                    </div>
                    <div className="order-info">
                      <p className="n1 unselectable">{d.productName}</p>
                      <p className="n2 unselectable">
                        Unit Price: {"£" + d.unitPrice}
                      </p>
                      <p className="n2 unselectable">
                        Order Count: {d.orderCount + " items"}
                      </p>
                      <p className="n2 unselectable">
                        Total Price:
                        {" £" + numberWithCommas(d.orderCount * d.unitPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}{" "}
          <div
            style={{
              height: "1px",
              backgrounrecieptdColor: "#5dbcd2",
              width: "400px",
              alignSelf: "center",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          />
          <p className="n2 unselectable">
            Customer Name: {this.state.customerName}
          </p>
          <p className="n2 unselectable">Date: {dateToday()}</p>
          <p className="n2 unselectable">Time: {currentTime()}</p>
          <p className="n2 unselectable">Sale By: {this.props.user.userName}</p>
        </div>
      </div>
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
          <img
            draggable={false}
            className="logo unselectable"
            src={require("../../../assets/drawables/ic-pos.png").default}
            alt=""
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderLeft: "#5dbcd2 2px solid",
              paddingLeft: "10px",
            }}
          >
            <h3 className="t1 unselectable" style={{ fontSize: "25px" }}>
              {this.props.procedure}
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
        <div style={{ display: "flex", flex: 1 }}>
          <div className="cart-list">
            {this.state.checkOutCart.map((d, i) => {
              return (
                <div className="cart-item" key={i}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "max-content",
                    }}
                  >
                    <img
                      draggable={false}
                      className="unselectable"
                      src={
                        d.productDp === ""
                          ? require("../../../assets/drawables/ic-products.png")
                              .default
                          : d.productDp
                      }
                      alt="dp"
                    />
                    <p className="n1 unselectable">{d.productName}</p>
                    <div
                      className="button"
                      onClick={async () => {
                        await setTimeout(() => {
                          const t = this.state.checkOutCart;
                          t.splice(i, 1);
                          this.props.removeCartItem(d);
                          this.props.showTimedToast(
                            d.productName + " has been removed"
                          );
                        }, 200);
                      }}
                      style={{ marginTop: "10px", marginBottom: 0 }}
                    >
                      <img
                        draggable={false}
                        alt=""
                        src={
                          require("../../../assets/drawables/ic-cart.png")
                            .default
                        }
                        className="unselectable"
                      />
                      <p className="text unselectable">Remove Item</p>
                    </div>
                  </div>
                  <div className="order-info">
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <p className="n2 unselectable">Type: {d.productType}</p>

                        <p className="n2 unselectable">
                          Description: {d.productDescription}
                        </p>
                        <p className="n2 unselectable">
                          Unit Price: {"£" + d.unitPrice}
                        </p>
                      </div>
                      <div className="field-input">
                        <p className="name unselectable">Number Of Items</p>
                        <input
                          value={d.orderCount}
                          onChange={(e) => {
                            var v = e.target.value;
                            v = v.length !== 0 ? parseInt(v) : 0;
                            v = isNaN(v) === true ? 0 : v;
                            v = v >= d.inStock ? d.inStock : v;
                            d.orderCount = v;
                            const _z = this.state.checkOutCart;
                            _z[i] = d;
                            this.setState({ checkOutCart: _z });
                          }}
                          name="orderCount"
                          placeholder="Order Count"
                        />
                      </div>
                    </div>
                    <p className="c1 unselectable">
                      Total Price:
                      {" £" + numberWithCommas(d.orderCount * d.unitPrice)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="customer-info">
            <p
              className="c2 unselectable"
              style={{ margin: 0, alignSelf: "flex-start", marginLeft: "10px" }}
            >
              Customer Info
            </p>
            <p className="field-name unselectable">Customer's Name</p>
            <div className="field-input">
              <img
                alt=""
                src={require("../../../assets/drawables/ic-user.png").default}
                className="unselectable"
              />
              <input
                value={this.state.customerName}
                onChange={(e) => {
                  this.setState({ customerName: e.target.value });
                }}
                name="customerName"
                placeholder="Customer Name"
              />
            </div>
            <p className="field-name unselectable">Customer's Email</p>
            <div className="field-input">
              <img
                alt=""
                src={require("../../../assets/drawables/ic-email.png").default}
                className="unselectable"
              />
              <input
                value={this.state.customerEmail}
                onChange={(e) => {
                  this.setState({ customerEmail: e.target.value });
                }}
                name="customerEmail"
                placeholder="Customer Email"
              />
            </div>
            <p className="c1 unselectable" style={{ marginRight: "20px" }}>
              Total Price: {" £" + numberWithCommas(this.totalPrice())}
            </p>
          </div>
        </div>
        <div className="nav-sec">
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
            <p className="unselectable">Back</p>
          </div>

          <div
            style={{ width: "180px" }}
            className="home-btn"
            onClick={async () => {
              await setTimeout(() => {
                if (
                  validField(this.state.customerName) === true &&
                  this.state.checkOutCart.length !== 0
                ) {
                  this.setState({ currentSceen: "sale" });
                } else if (this.state.checkOutCart.length === 0) {
                  this.props.showTimedToast("Add products to cart to continue");
                } else if (validField(this.state.customerName) === false) {
                  this.props.showTimedToast("Customer info is required");
                } else {
                  this.props.showTimedToast("Product Serial's Are required");
                }
              }, 200);
            }}
          >
            <img
              className="unselectable"
              alt=""
              draggable={false}
              src={
                this.props.procedure === "Invoice"
                  ? require("../../../assets/drawables/ic-invoice.png").default
                  : this.props.procedure === "Checkout"
                  ? require("../../../assets/drawables/ic-price.png").default
                  : require("../../../assets/drawables/ic-quotation.png")
                      .default
              }
            />
            <p
              className="unselectable"
              style={{ width: "max-content", padding: "5px" }}
            >
              {this.props.procedure === "Invoice"
                ? "Create Invoice"
                : this.props.procedure === "Checkout"
                ? "Make Sale"
                : "Create Quotation"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  async recordSale() {
    if (this.state.selling === undefined) {
      this.setState({ selling: true });
      await setTimeout(async () => {
        this.props.showUnTimedToast();
        const id = idDate();
        const r = {
          recieptDate: dateToday(),
          shipping: {
            name: this.state.customerName,
          },
          items: this.state.checkOutCart,
          total: this.totalPrice(),
          recieptTime: currentTime(),
          staffName: this.props.user.userName,
          reciept_Id: id,
          saleId: id,
          procedure: this.props.procedure,
        };
        await fetch(
          "https://us-central1-anchor-pos.cloudfunctions.net/generateAnchorReciept",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(r),
          }
        ).then(() => {
          _storage
            .ref(this.props.procedure + "/" + r.reciept_Id + ".pdf")
            .getDownloadURL()
            .then(async (url) => {
              const sale = {
                receiptUrl: url,
                staffId: this.props.user.email,
                customerName: this.state.customerName,
                customerEmail: this.state.customerEmail,
                ...r,
              };
              sale.shipping = null;
              sale.reciept_Id = null;
              sale.startSerial = null;
              sale.endSerial = null;
              const i = [];
              sale.items.forEach((c) => {
                i.push({
                  productId: c.productId,
                  orderCount: c.orderCount,
                  serialStart: c.startSerial,
                  serialEnd: c.endSerial,
                });
              });
              var p = sale.items;
              sale.items = i;
              p.forEach((x, i) => {
                x.inStock = x.inStock - x.orderCount;
              });
              var msg = "";
              const ds = this.db.child("products/data/");
              const s =
                this.props.procedure === "Invoice"
                  ? "invoice/"
                  : this.props.procedure === "Checkout"
                  ? "sales/"
                  : "quotation/";
              const ps = this.db.child("products/" + s);
              for (let i1 = 0; i1 < p.length; i1++) {
                const c = p[i1];
                const i2 = i1 + 1;
                msg =
                  i2 +
                  ". " +
                  c.productName +
                  ", " +
                  c.orderCount +
                  " item(s).\n" +
                  msg;
                const u = ds.child(c.productId + "/inStock");
                const z = ps.child(c.productId + "/" + r.saleId);
                await z.ref.set({
                  productId: c.productId,
                  orderCount: c.orderCount,
                  serialStart: c.startSerial,
                  serialEnd: c.endSerial,
                  saleId: r.reciept_Id,
                  recieptTime: r.recieptTime,
                  recieptDate: r.recieptDate,
                });
                if (
                  this.props.procedure === "Checkout" ||
                  this.props.procedure === "Invoice"
                ) {
                  await u.ref.set(c.inStock);
                }
              }
              const u = this.props.user;
              var _log = u.userName + " sold:\n" + msg;
              _log =
                _log +
                "To:\n" +
                "Customer Name: " +
                this.state.customerName +
                ".\n" +
                (this.state.customerEmail.length !== 0
                  ? "Customer Email: " + this.state.customerEmail + ".\n"
                  : "") +
                "On: " +
                dateToday() +
                " " +
                currentTime() +
                ".\n" +
                "Sale Id: " +
                sale.saleId;
              logEvent(_log, s + u.email.split("@")[0]);
              this.db
                .child(s + sale.saleId)
                .set(sale)
                .then(async (x) => {
                  this.props.closeToast();
                  await setTimeout(() => {
                    this.props.clearCart();
                    this.props.showTimedToast("Sale Recorded");
                    window.open(sale.receiptUrl, sale.reciept_Id);
                    this.setState({ sold: sale.receiptUrl });
                  }, 200);
                });
            });
        });
      }, 200);
    }
  }
}
