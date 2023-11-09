import React, { useEffect, useMemo, useState } from "react";
import {
  createbKashPayment,
  getCustomerAllOrders,
  getUserInfo,
  getbKashToken,
  refundOrder,
} from "../../../utils/Services";
import { Link, useHistory, withRouter } from "react-router-dom";
import swal from "sweetalert";
import _ from "lodash";
import { numberWithCommas } from "../../../utils/CartHelpers";
import ReactPaginate from "react-paginate";
import OrderCancel from "./OrderCancel";
import {
  getBusinessDateCount,
  getSetting,
  goPageTop,
  isAvailableForPayment,
  useWindowSize,
} from "../../../utils/Helpers";
import { connect } from "react-redux";
import { in_loading, out_loading } from "../../../utils/LoadingState";

const PendingOrders = (props) => {
  const { auth, general } = props;
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [refund, setRefund] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [user, setUser] = useState({});
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState("");
  const currency = getSetting(general, "currency_icon");
  const history = useHistory();
  let [width] = useWindowSize();

  const role = auth.user.roles[0].name || "user";

  useEffect(() => {
    getUserInfo(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      if (!_.isEmpty(response)) {
        const user = response.data.user;
        if (!_.isEmpty(user)) {
          setUser(user);
        }
      }
    });
  }, [auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  useEffect(() => {
    setLoading(true);
    getCustomerAllOrders(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setLoading(false);
      setOrders(response.orders);
    });
  }, [cancel, refund, auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  useEffect(() => {
    goPageTop();
  }, [search, itemOffset]);

  width = width ? width : window.innerWidth;

  const handleCancelOrder = (orderId) => {
    setOrderId(orderId);
    setOpenCancelModal(true);
  };

  let ordersData;
  ordersData = orders.filter((order) => order.status === "waiting-for-payment");

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = ordersData.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(ordersData.length / itemsPerPage);

  const handlePaginationClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % ordersData.length;
    setItemOffset(newOffset);
  };

  // search

  // debouncing
  const debounceHandler = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const doSearch = (value) => {
    setSearch(value);
  };

  const handleSearch = debounceHandler(doSearch, 500);

  // search user by email or name
  const allFilterData = useMemo(() => {
    let computedData = ordersData;
    if (search) {
      computedData = computedData.filter(
        (order) =>
          order?.id == search ||
          order?.order_number.toLowerCase() == search ||
          order?.phone == search ||
          order?.name == search
      );
    }

    if (computedData.length <= 1) return computedData;
    return computedData.slice(itemOffset, endOffset);
  }, [search, itemOffset, endOffset, ordersData]);

  // const handleRefundOrder = (order) => {
  //   if (!user.refund_credentials) {
  //     swal({
  //       title: "Please add your Refund Credentials",
  //       icon: "warning",
  //       buttons: "Ok, Understood",
  //     }).then(function (isConfirm) {
  //       if (isConfirm) {
  //         history.push("/dashboard/account");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Are you to refund this order",
  //       icon: "warning",
  //       buttons: ["No, cancel it!", "Yes, I am sure!"],
  //       dangerMode: true,
  //     }).then(function (isConfirm) {
  //       if (isConfirm) {
  //         refundOrder(order.id).then((response) => {
  //           if (!_.isEmpty(response)) {
  //             const resData = response.data;
  //             if (!_.isEmpty(resData)) {
  //               if (resData.status === "success") {
  //                 setRefund(true);
  //                 swal({
  //                   title: `${resData.message}`,
  //                   icon: "success",
  //                   buttons: "Ok, Understood",
  //                 });
  //               } else {
  //                 swal({
  //                   title: `${resData.message}`,
  //                   icon: "warning",
  //                   buttons: "Ok, Understood",
  //                 });
  //               }
  //             }
  //           }
  //         });
  //       } else {
  //       }
  //     });
  //   }
  // };

  const handlePayment = (order) => {
    const payMethod = order.pay_method;
    const payerReference = order.name;
    const amount = order.needToPay;
    const invoice_number = order.order_number;
    if (payMethod === "bkash_payment") {
      in_loading();
      getbKashToken().then((response) => {
        if (!_.isEmpty(response)) {
          const auth_token = response?.token;
          if (localStorage.getItem("bkash_token") !== null) {
            localStorage.removeItem("bkash_token");
          }
          localStorage.setItem("bkash_token", auth_token);
          if (!_.isEmpty(auth_token)) {
            createbKashPayment(auth_token, payerReference, amount, invoice_number).then((response) => {
              if (!_.isEmpty(response)) {
                const paymentID = response?.paymentID;
                const bkashURL = response?.bkashURL;
                if (!_.isEmpty(bkashURL)) {
                  window.location.assign(bkashURL);
                  // window.open(bkashURL, "_blank");
                  out_loading(false);
                }
              }
            });
          }
        }
      });
    } else {
      history.push(`/payment/${order.id}`);
    }
  };

  if (width < 768)
    return (
      <>
        <div className='card my-2'>
          <div className='card-header border  p-4 mb-1'>
            <div className='flexBetween'>
              <h4 className='card-title'>Pending Orders</h4>
              <div>
                <input
                  className='form-control'
                  placeholder='Search...'
                  type='text'
                  name='search'
                  id='search'
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className=''>
            {loading && (
              <div className='text-center'>
                <div className='spinner-border text-secondary' role='status'>
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            )}

            {allFilterData.length > 0 ? (
              <div>
                {allFilterData.map((order) => {
                  const trxIds = JSON.parse(order.trxId);
                  const day = getBusinessDateCount(order.created_at);
                  return (
                    <div className='card-body px-1 py-2 my-3 shadow  border'>
                      <div className='px-4'>
                        <div className='row' style={{ borderBottom: "1px solid lightgrey" }}>
                          <div className='col-7'>
                            <h4 className='bold order-title'>Order No:{order.order_number}</h4>
                          </div>
                          <div className='col-5 text-right'>
                            <span className='bold'>Date:</span>
                            {order.created_at.slice(0, 10)}
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-12 text-right'>
                            <span className='bold'>Status:</span>
                            {order.status === "waiting-for-payment" ? "waiting-for-approval" : order.status}
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-12 text-right'>
                            <span className='bold'>Total Amount:</span>
                            {currency}
                            {numberWithCommas(order.amount)}
                          </div>
                          <div className='col-12 text-right'>
                            <span className='bold'>First Payment:</span>
                            {currency} {numberWithCommas(order.needToPay)}
                          </div>
                          <div className='col-12 text-right'>
                            <p className='text-right due-Text mb-0'>
                              <span className='bold'>Due:</span>
                              {currency}
                              {numberWithCommas(order.dueForProducts)}
                            </p>
                          </div>
                          <div className='col-6 text-right'></div>
                        </div>
                      </div>

                      <div className='flexEnd mobileOAC text-center'>
                        <Link to={`/details/${order.id}`} className='homeReg-btn order-disable mx-1'>
                          Details
                        </Link>

                        {/* <button
                          onClick={() => handleRefundOrder(order)}
                          className='btn homeReg-btn order-disable mx-1'
                          disabled={isAvailableForReturn(order)}
                        >
                          Refund
                        </button> */}

                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className='btn homeReg-btn order-disable mx-1'
                          disabled={trxIds.payment_1st}
                        >
                          Cancel
                        </button>

                        {trxIds.payment_1st ? null : (
                          <button
                            onClick={() => handlePayment(order)}
                            className='btn homeLogin-btn dobt mx-1'
                            disabled={isAvailableForPayment(order)}
                          >
                            Pay now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div>
                  <nav aria-label='Page navigation'>
                    <ReactPaginate
                      previousLabel={`Prev`}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePaginationClick}
                      containerClassName={"pagination justify-content-center flex-wrap"}
                      pageClassName={`page-item`}
                      pageLinkClassName={`page-link`}
                      previousClassName={`page-item`}
                      previousLinkClassName={`page-link page-link-prev`}
                      nextClassName={`page-item`}
                      nextLinkClassName={`page-link page-link-next`}
                      disabledClassName={"disabled"}
                      activeClassName={"active"}
                    />
                  </nav>
                </div>
              </div>
            ) : (
              <div className='card-body px-1 py-2 shadow text-center border'>You have no orders</div>
            )}
          </div>
        </div>
        {openCancelModal && (
          <OrderCancel
            openCancelModal={openCancelModal}
            setOpenCancelModal={setOpenCancelModal}
            orderId={orderId}
            setCancel={setCancel}
          />
        )}
      </>
    );

  return (
    <>
      <div className='card'>
        <div className='card-header border border-bottom-0 p-4'>
          <div className='flexBetween'>
            <h4 className='card-title'>Pending Orders</h4>
            <div>
              <input
                className='form-control'
                placeholder='Search...'
                type='text'
                name='search'
                id='search'
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='card-body border p-4'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order Number</th>
                  <th>TotalAmount</th>
                  <th>FirstPayment</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Pay</th>
                  <th>Details</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className='text-center'>
                      <div className='spinner-border text-secondary' role='status'>
                        <span className='sr-only'>Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : allFilterData.length > 0 ? (
                  allFilterData.map((order) => {
                    const trxIds = JSON.parse(order.trxId);

                    return (
                      <tr>
                        <td>{order.created_at.slice(0, 10)}</td>
                        <td>{order.order_number}</td>
                        <td>
                          {currency} {numberWithCommas(order.amount)}
                        </td>
                        <td>
                          {currency} {numberWithCommas(order.needToPay)}
                        </td>
                        <td>
                          {currency} {numberWithCommas(order.dueForProducts)}
                        </td>

                        <td>
                          {order.status === "waiting-for-payment" ? "waiting-for-approval" : order.status}
                        </td>

                        <td>
                          {trxIds.payment_1st ? null : (
                            <button
                              onClick={() => handlePayment(order)}
                              className='btn btn-default px-0'
                              disabled={isAvailableForPayment(order)}
                            >
                              Pay now
                            </button>
                          )}
                        </td>

                        <td>
                          <Link to={`/details/${order.id}`} className='btn btn-default px-0'>
                            Details
                          </Link>
                        </td>

                        {/* <td>
                          <button
                            onClick={() => handleRefundOrder(order)}
                            className='btn btn-default px-0'
                            disabled={isAvailableForReturn(order)}
                          >
                            Refund
                          </button>
                        </td> */}

                        <td>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className='btn btn-default px-0'
                            disabled={trxIds.payment_1st}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>You have no orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {allFilterData.length > 0 && (
            <div>
              <nav aria-label='Page navigation'>
                <ReactPaginate
                  previousLabel={`Prev`}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePaginationClick}
                  containerClassName={"pagination justify-content-center flex-wrap"}
                  pageClassName={`page-item`}
                  pageLinkClassName={`page-link`}
                  previousClassName={`page-item`}
                  previousLinkClassName={`page-link page-link-prev`}
                  nextClassName={`page-item`}
                  nextLinkClassName={`page-link page-link-next`}
                  disabledClassName={"disabled"}
                  activeClassName={"active"}
                />
              </nav>
            </div>
          )}
        </div>
      </div>
      {openCancelModal && (
        <OrderCancel
          openCancelModal={openCancelModal}
          setOpenCancelModal={setOpenCancelModal}
          orderId={orderId}
          setCancel={setCancel}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
  general: JSON.parse(state.INIT.general),
});

export default connect(mapStateToProps, {})(withRouter(PendingOrders));
