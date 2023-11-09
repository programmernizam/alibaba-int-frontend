import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  getSetting,
  goPageTop,
  isAvailableFor2ndPayment,
  isAvailableFor2ndPaymentItem,
  isAvailableForPayment,
  loadAsset,
  useWindowSize,
} from "../../../utils/Helpers";
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import { Link, useHistory, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { confirmCustomerOrder } from "../../../store/actions/CartAction";
import { getOrderDetails } from "../../../utils/Services";
import { numberWithCommas } from "../../../utils/CartHelpers";

import { useReactToPrint } from "react-to-print";

const OrderDetails = (props) => {
  const { match, general, auth } = props;
  const order_id = match.params.id;
  const [order, setOrder] = useState("");
  const bankId = getSetting(general, "payment_bank_details");
  const currency = getSetting(general, "currency_icon");
  const address = !_.isEmpty(order) ? JSON.parse(order.address) : {};
  const orderItems = !_.isEmpty(order) ? order.order_items : [];
  const site_name = getSetting(general, "site_name");
  const frontend_logo_menu = getSetting(general, "frontend_logo_menu", "/assets/demos/logo.png");

  const history = useHistory();

  const [loading, setLoading] = useState(false);
  let [width] = useWindowSize();

  useEffect(() => {
    goPageTop();
    setLoading(true);
    getOrderDetails(order_id, auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setLoading(false);
      setOrder(response.order);
    });
  }, [order_id, auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  width = width ? width : window.innerWidth;

  let trxIds;
  if (!loading && order) {
    trxIds = JSON.parse(order.trxId);
  }

  const handlePayment = (id) => {
    history.push(`/payment/${id}`);
  };
  const handleItemPayment = (id, itemId) => {
    history.push(`/payment/${id}/${itemId}`);
  };

  // export pdf

  // const exportPDF = async () => {
  //   const pdf = new jsPDF("portrait", "pt", "a4");
  //   const data = await html2canvas(document.querySelector("#exportOrder"));
  //   const img = data.toDataURL("image/png");
  //   const imgProperties = pdf.getImageProperties(img);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
  //   pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("shipping_label.pdf");
  // };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Order- ${order_id}.pdf`,
  });

  const getCourierBill = () => {
    let courier_bill = 0;
    orderItems.map((item, index) => {
      courier_bill += Number(item.courier_bill ? item.courier_bill : 0);
      return false;
    });
    return courier_bill;
  };
  const getShippingBill = () => {
    let shipping_charge = 0;
    orderItems.map((item, index) => {
      shipping_charge += Number(item.shipping_charge ? item.shipping_charge : 0);
      return false;
    });
    return shipping_charge;
  };

  const getTotalValue = (totalPrice) => {
    let Total = Number(totalPrice);
    Total += getCourierBill() + getShippingBill();

    return Total;
  };

  return (
    <main className='main bg-gray'>
      <Breadcrumb
        current='Order details'
        collections={[
          { name: "Dashboard", url: "dashboard" },
          { name: "Orders", url: "dashboard/orders" },
        ]}
      />

      <div className='page-content'>
        <div className='container'>
          <div className='row justify-content-center'>
            <aside className='col-md-10'>
              {loading && (
                <div className='text-center'>
                  <div className='spinner-border text-secondary' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                </div>
              )}
              {!loading && order && (
                <>
                  <div className='card bg-white'>
                    <div className='card-body'>
                      <div id='exportOrder' ref={componentRef}>
                        <div className='row'>
                          <div className='col-md-6'>
                            <p className='m-0'>
                              <b>CUSTOMER</b>
                            </p>
                            <p className='m-0'>Invoice No:#{order.order_number}</p>
                            <p className='m-0'>Name: {order.name}</p>
                            <p className='m-0'>Email: {order.email}</p>
                            <p className='m-0'>Phone: {order.phone || "NA"}</p>
                            <p className='m-0'>Address: {!_.isEmpty(address) ? address.address : ""}</p>
                          </div>
                          <div className='col-md-6 text-md-right'>
                            <p className='m-0'>
                              <b>
                                {trxIds.payment_2nd
                                  ? "Full Paid"
                                  : trxIds.payment_1st
                                  ? "Initial paid"
                                  : "UNPAID"}
                              </b>
                            </p>
                            <p className='m-0'>
                              <span className='mr-2'>Method:</span>
                              {order.pay_method === "bkash_payment" && `Bkash`}
                              {order.pay_method === "nagad_payment" && `Nagod`}
                              {order.pay_method === "bank_payment" && `Bank`}
                            </p>
                            <p className='m-0'>
                              <span className='mr-2'>Wallet:</span>
                              {order.pay_method === "bkash_payment" && `01811355678`}
                              {order.pay_method === "nagad_payment" && `01911712769`}
                              {order.pay_method === "bank_payment" && `${bankId}`}
                            </p>

                            <p className='m-0'>Transaction Num (Initial) : {trxIds.payment_1st || "NA"}</p>
                            <p className='m-0'>Transaction Num (Final) : {trxIds.payment_2nd || "NA"}</p>
                            <p className='m-0'>Reference Number : {order.refNumber}</p>
                          </div>
                        </div>
                        <hr />
                        {/* details here */}
                        <table className='table table-responsive table-bordered table-cart'>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th className='text-right minw-td'>Total</th>
                              <th className='text-right'>Pay&Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderItems.length > 0 ? (
                              <>
                                {orderItems.map((item, index) => {
                                  const item_variations = item.item_variations;
                                  return (
                                    <tr key={index}>
                                      <td>
                                        <div className='d-flex'>
                                          <div className='mr-2'>
                                            <Link to={`${item.link}`}>
                                              <span className='bold'>OrderNo:</span> <br />{" "}
                                              <span className='text-danger'>#000{item.id}</span>
                                            </Link>
                                          </div>
                                          <div className='mt-1'>
                                            <Link to={`${item.link}`}>
                                              <img src={item.image} style={{ width: "50px" }} alt='' />
                                            </Link>
                                          </div>
                                          <div className='ml-2'>
                                            <Link to={`${item.link}`}>
                                              {width >= 768 ? (
                                                <span>{item.name}</span>
                                              ) : (
                                                <span>{item.name.slice(0, 28)}...</span>
                                              )}
                                            </Link>
                                          </div>
                                        </div>
                                        <div>
                                          {item_variations.length > 0 ? (
                                            item_variations.map((config, index2) => (
                                              <div
                                                className='row'
                                                style={{ borderTop: "1px solid lightGray" }}
                                              >
                                                <div className='col-md-5 Attributes fs-13 '>
                                                  <div className='row'>
                                                    {JSON.parse(config.attributes).map(
                                                      (Attribute, index3) => (
                                                        <div
                                                          key={index3 + 1}
                                                          className='col-md-6 plain-attribute'
                                                        >
                                                          <b>{Attribute.PropertyName} :</b>
                                                          <span>{` ${Attribute.Value}`}</span>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                                <div className='col-md-2 plain-attribute'>
                                                  <b>Quantity :</b>
                                                  <span>{` ${config.quantity}`}</span>
                                                </div>

                                                <div className='col-md-2 plain-attribute'>
                                                  <b>Price :</b>
                                                  <span>{` ${config.price}`}</span>
                                                </div>
                                                <div className='col-md-3 plain-attribute'>
                                                  <b>SubTotal :</b>
                                                  <span>{` ${config.subTotal}`}</span>
                                                </div>
                                              </div>
                                            ))
                                          ) : (
                                            <div
                                              className='row'
                                              style={{ borderTop: "1px solid lightGray" }}
                                            ></div>
                                          )}
                                        </div>
                                      </td>

                                      <td className='text-right'>
                                        <div>
                                          <span className='bold'>Shipping charge:</span>
                                          {item.shipping_rate ? (
                                            <span className='d-block'>
                                              Rate(KG): {currency} {item.shipping_rate}
                                            </span>
                                          ) : null}
                                          {item.actual_weight ? (
                                            <span className='d-block'>Wight:{item.actual_weight} KG</span>
                                          ) : null}
                                          {item.shipping_charge ? (
                                            <span className='d-block'>
                                              Total: {currency} {item.shipping_charge}
                                            </span>
                                          ) : null}
                                        </div>
                                        {item.courier_bill ? (
                                          <div>
                                            <span className='bold'>Courier charge:</span>

                                            <span className='d-block'>
                                              {currency} {item.courier_bill}
                                            </span>
                                          </div>
                                        ) : null}
                                        <div style={{ borderTop: "1px solid lightGray" }}>
                                          <span className='bold'>Quantity:</span>
                                          {item.quantity}
                                        </div>
                                        <div>
                                          <span className='bold'>Amount: </span>
                                          {currency}{" "}
                                          {numberWithCommas(
                                            Number(item.product_value) + Number(item.chinaLocalDelivery)
                                          )}
                                        </div>
                                        <div>
                                          <span className='bold'>SubTotal: </span>
                                          {currency}{" "}
                                          {numberWithCommas(
                                            Number(item.product_value) +
                                              Number(item.chinaLocalDelivery) +
                                              Number(item.courier_bill) +
                                              Number(item.shipping_charge)
                                          )}
                                        </div>
                                      </td>
                                      <td>
                                        <div className='text-right '>{item.status}</div>{" "}
                                        <div>
                                          {order.status === "order-completed" ? null : item.full_payment ? (
                                            "PAID"
                                          ) : (
                                            <div className='text-right '>
                                              <button
                                                onClick={() =>
                                                  handleItemPayment(order.id, item.order_item_number)
                                                }
                                                className='btn btn-default'
                                                disabled={isAvailableFor2ndPaymentItem(item)}
                                              >
                                                Pay
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}

                                <tr>
                                  <td colSpan={3}>
                                    <h3 className='border-0 m-0 py-3 summary-title'>Cart Total Summary</h3>
                                  </td>
                                </tr>
                                <tr className='summary-total'>
                                  <td colSpan={2} className='text-md-right'>
                                    Total Product Price:
                                  </td>
                                  <td className='text-right'>{`${currency} ${numberWithCommas(
                                    order.amount
                                  )}`}</td>
                                </tr>
                                <tr className='summary-total'>
                                  <td colSpan={2} className='text-md-right'>
                                    Shipping+Courier
                                  </td>
                                  <td className='text-right'>{`${currency} ${numberWithCommas(
                                    getCourierBill() + getShippingBill()
                                  )}`}</td>
                                </tr>
                                <tr className='summary-total'>
                                  <td colSpan={2} className='text-md-right'>
                                    Subtotal:
                                  </td>
                                  <td className='text-right'>{`${currency} ${numberWithCommas(
                                    getTotalValue(order.amount)
                                  )}`}</td>
                                </tr>
                                <tr className='summary-total'>
                                  <td colSpan={2} className='text-md-right'>
                                    Initial Payment:
                                  </td>
                                  <td className='text-right'>{`${currency} ${numberWithCommas(
                                    order.needToPay
                                  )}`}</td>
                                </tr>
                                <tr className='summary-total'>
                                  <td colSpan={2} className='text-md-right'>
                                    Final Payment:
                                  </td>
                                  <td className='text-right'>{`${currency} ${numberWithCommas(
                                    getTotalValue(order.dueForProducts)
                                  )}`}</td>
                                </tr>
                                <tr className='summary-total'>
                                  <td colSpan={2} className='text-md-right'>
                                    Pay:
                                  </td>
                                  <td>
                                    <div className='text-right'>
                                      {trxIds.payment_2nd ? (
                                        "Paid"
                                      ) : trxIds.payment_1st ? (
                                        <button
                                          onClick={() => handlePayment(order.id)}
                                          className='btn btn-default'
                                          disabled={isAvailableFor2ndPayment(order)}
                                        >
                                          Full pay
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handlePayment(order.id)}
                                          className='btn btn-default'
                                          disabled={isAvailableForPayment(order)}
                                        >
                                          Pay now
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              </>
                            ) : (
                              <tr>
                                <td colSpan={3} className='text-center bg-lighter'>
                                  You have no cart!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        <div>
                          <p className='t-middle baseColor'>
                            <b>শিপিং চার্জ পণ্য আসার পর যোগ হবে।</b>
                          </p>
                        </div>
                        <div className='flexBetween align-items-center'>
                          <div className='logo'>
                            <img src={loadAsset(frontend_logo_menu)} alt={site_name} />
                          </div>
                          <div>
                            <a href='http://alibainternational.com/'>www.alibainternational.com</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flexCenter pt-2'>
                    <button
                      className='btn btn-default-outline'
                      style={{ fontWeight: "bold" }}
                      onClick={handlePrint}
                    >
                      Download/Print invoice <i className='icon-arrow-down'></i>
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </div>
    </main>
  );
};

OrderDetails.propTypes = {
  general: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  shipping_address: PropTypes.object.isRequired,
  cartConfigured: PropTypes.array.isRequired,
  confirmCustomerOrder: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  user: state.AUTH.user,
  auth: state.AUTH,
  cartConfigured: state.CART.configured,
  shipping_address: state.CART.shipping_address,
});

export default connect(mapStateToProps, { confirmCustomerOrder })(withRouter(OrderDetails));
