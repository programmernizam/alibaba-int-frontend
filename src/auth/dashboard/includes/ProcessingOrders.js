import React, { useEffect, useState } from "react";
import { getCustomerAllOrders, getUserInfo, refundOrder } from "../../../utils/Services";
import { Link, useHistory, withRouter } from "react-router-dom";
import swal from "sweetalert";
import _ from "lodash";
import { numberWithCommas } from "../../../utils/CartHelpers";
import ReactPaginate from "react-paginate";
import {
  getBusinessDateCount,
  isAvailableFor2ndPayment,
  isAvailableForPayment,
  isAvailableForReturn,
  useWindowSize,
} from "../../../utils/Helpers";
import { connect } from "react-redux";

const ProcessingOrders = (props) => {
  const { auth } = props;
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const [refund, setRefund] = useState(false);

  const [user, setUser] = useState({});
  const [itemOffset, setItemOffset] = useState(0);

  const history = useHistory();
  let [width] = useWindowSize();

  useEffect(() => {
    getUserInfo(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      if (!_.isEmpty(response)) {
        const user = response.data.user;
        if (!_.isEmpty(user)) {
          setUser(user);
        }
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getCustomerAllOrders(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setLoading(false);
      setOrders(response.orders);
    });
  }, [refund]);

  width = width ? width : window.innerWidth;

  let ordersData;

  ordersData = orders.filter((order) => order.status === "full-paid" || order.status === "partial-paid");

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = ordersData.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(ordersData.length / itemsPerPage);

  const handlePaginationClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % ordersData.length;
    setItemOffset(newOffset);
  };

  const handleRefundOrder = (order) => {
    if (!user.refund_credentials) {
      swal({
        title: "Please add your Refund Credentials",
        icon: "warning",
        buttons: "Ok, Understood",
      }).then(function (isConfirm) {
        if (isConfirm) {
          history.push("/dashboard/account");
        }
      });
    } else {
      swal({
        title: "Are you to refund this order",
        icon: "warning",
        buttons: ["No, cancel it!", "Yes, I am sure!"],
        dangerMode: true,
      }).then(function (isConfirm) {
        if (isConfirm) {
          refundOrder(order.id).then((response) => {
            if (!_.isEmpty(response)) {
              const resData = response.data;
              if (!_.isEmpty(resData)) {
                if (resData.status === "success") {
                  setRefund(true);
                  swal({
                    title: `${resData.message}`,
                    icon: "success",
                    buttons: "Ok, Understood",
                  });
                } else {
                  swal({
                    title: `${resData.message}`,
                    icon: "warning",
                    buttons: "Ok, Understood",
                  });
                }
              }
            }
          });
        } else {
        }
      });
    }
  };

  const handlePayment = (id) => {
    history.push(`/payment/${id}`);
  };

  if (width < 768)
    return (
      <>
        <div className='card my-2'>
          <div className='card-header border  p-4 mb-1'>
            <h4 className='card-title'>Processing Orders</h4>
          </div>
          <div className=''>
            {loading && (
              <div className='text-center'>
                <div className='spinner-border text-secondary' role='status'>
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            )}

            {ordersData.length > 0 ? (
              <div>
                {currentItems.map((order) => {
                  const trxIds = JSON.parse(order.trxId);
                  return (
                    <div className='card-body px-1 py-2 my-3 shadow  border'>
                      <div className='px-4'>
                        <div className='row '>
                          <div className='col-7'>
                            <span className='bold'>Date:</span>
                            {order.created_at}
                          </div>
                          <div className='col-5 text-right'>
                            <span className='bold'>Day Count:</span>
                            {getBusinessDateCount(order.created_at)}
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-6'>
                            <span className='bold'>Amount:</span>
                            {numberWithCommas(order.amount)}
                          </div>
                          <div className='col-6 text-right'>
                            <span className='bold'>1stPayment:</span>
                            {numberWithCommas(order.needToPay)}
                          </div>
                          <div className='col-6'>
                            <span className='bold'>Due:</span>
                            {numberWithCommas(order.dueForProducts)}
                          </div>
                          <div className='col-6 text-right'>
                            <span className='bold'>Invoice:</span>#{order.order_number}
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-6 '>
                            <span className='bold'>Status:</span>
                            {order.status === "waiting-for-payment" ? "waiting-for-approval" : order.status}
                          </div>
                          <div className='col-6 text-right'>
                            <span className='bold'>TRX(init):</span>
                            {trxIds.payment_1st || "no pay"}
                          </div>
                          <div className='col-6 '>
                            <span className='bold'>TRX(final):</span>
                            {trxIds.payment_2nd || "no pay"}
                          </div>
                          <div className='col-6 text-right'>
                            <span className='bold'>REF:</span>
                            {order.refNumber}
                          </div>
                        </div>
                      </div>

                      <div className='flexEnd mobileOAC text-center'>
                        <Link to={`/details/${order.id}`} className='homeReg-btn order-disable mx-1'>
                          Details
                        </Link>

                        <button
                          onClick={() => handleRefundOrder(order)}
                          className='btn homeReg-btn order-disable mx-1'
                          disabled={isAvailableForReturn(order)}
                        >
                          Refund
                        </button>

                        {trxIds.payment_2nd ? (
                          <button className='btn homeLogin-btn dobt mx-1' disabled={true}>
                            Paid
                          </button>
                        ) : trxIds.payment_1st ? (
                          <button
                            onClick={() => handlePayment(order.id)}
                            className='btn homeLogin-btn dobt mx-1'
                            disabled={isAvailableFor2ndPayment(order)}
                          >
                            Full Pay
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePayment(order.id)}
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
      </>
    );

  return (
    <>
      <div className='card'>
        <div className='card-header border border-bottom-0 p-4'>
          <h4 className='card-title'>Processing Orders</h4>
        </div>
        <div className='card-body border p-4'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>DayCount</th>
                  <th>Invoice</th>
                  <th>TotalAmount</th>
                  <th>1stPayment</th>
                  <th>Due</th>

                  <th>TrxId</th>
                  <th>Ref.</th>
                  <th>Status</th>
                  <th>Pay</th>
                  <th>Details</th>
                  <th>Refund</th>
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
                ) : ordersData.length > 0 ? (
                  currentItems.map((order) => {
                    const trxIds = JSON.parse(order.trxId);
                    return (
                      <tr>
                        <td>{order.created_at}</td>
                        <td>{getBusinessDateCount(order.created_at)}</td>
                        <td>#{order.order_number}</td>
                        <td>{Math.round(order.amount)}</td>
                        <td>{Math.round(order.needToPay)}</td>
                        <td>{Math.round(order.dueForProducts)}</td>

                        <td>
                          <span className='d-block'>Initial:{trxIds.payment_1st || "no pay"}</span>
                          <span className='d-block'>Final:{trxIds.payment_2nd || "no pay"}</span>
                        </td>
                        <td>{order?.refNumber}</td>
                        <td>
                          {order.status === "waiting-for-payment" ? "waiting-for-approval" : order.status}
                        </td>

                        <td>
                          {trxIds.payment_2nd ? (
                            "Paid"
                          ) : trxIds.payment_1st ? (
                            <button
                              onClick={() => handlePayment(order.id)}
                              className='btn btn-default px-0'
                              disabled={isAvailableFor2ndPayment(order)}
                            >
                              Full pay
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePayment(order.id)}
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

                        <td>
                          <button
                            onClick={() => handleRefundOrder(order)}
                            className='btn btn-default px-0'
                            disabled={isAvailableForReturn(order)}
                          >
                            Refund
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
          {ordersData.length > 0 && (
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
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(ProcessingOrders));
