import React, { useEffect, useState } from "react";
import { getCustomerAllOrders, getUserInfo, refundOrder } from "../../../utils/Services";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import _ from "lodash";
import { numberWithCommas } from "../../../utils/CartHelpers";
import ReactPaginate from "react-paginate";
import OrderCancel from "./OrderCancel";
import {
  getOrderDifDays,
  isAvailableForPayment,
  isAvailableForReturn,
  useWindowSize,
} from "../../../utils/Helpers";

const ProcessingOrders = (props) => {
  const { status, orderText } = props;
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [refund, setRefund] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [user, setUser] = useState({});
  const [itemOffset, setItemOffset] = useState(0);

  const history = useHistory();
  let [width, height] = useWindowSize();

  useEffect(() => {
    getUserInfo().then((response) => {
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
    getCustomerAllOrders(status).then((response) => {
      setLoading(false);
      setOrders(response.orders);
    });
  }, [cancel, refund]);

  width = width ? width : window.innerWidth;

  const handleCancelOrder = (orderId) => {
    setOrderId(orderId);
    setOpenCancelModal(true);
  };

  let ordersData;
  if (status === "orders") {
    ordersData = orders;
  } else if (status === "pending-orders") {
    ordersData = orders.filter((order) => order.status === "waiting-for-payment");
  } else if (status === "processing-orders") {
    ordersData = orders.filter((order) => order.status === "full-paid" || order.status === "partial-paid");
  } else if (status === "complete-orders") {
    ordersData = orders.filter((order) => order.status === "order-completed");
  } else {
    ordersData = orders;
  }

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
            <h4 className='card-title'>{orderText}</h4>
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
                {currentItems.map((order) => (
                  <div className='card-body px-1 py-2 my-3 shadow  border'>
                    <div className='px-4'>
                      <div className='row '>
                        <div className='col-7'>
                          <span className='bold'>Date:</span>
                          {order.created_at}
                        </div>
                        <div className='col-5'>
                          <span className='bold'>Day Count:</span>
                          {getOrderDifDays(order)}
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
                          <span className='bold'>Total:</span>
                          {numberWithCommas(order.amount)}
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-6'>
                          <span className='bold'>TRX:</span>
                          {order?.trxId}
                        </div>
                        <div className='col-6 text-right'>
                          <span className='bold'>REF:</span>
                          {order.refNumber}
                        </div>
                        <div className='col-5'>
                          <span className='bold'>Order id:</span>
                          {order.order_number}
                        </div>
                        <div className='col-7 text-right'>
                          <span className='bold'>Status:</span>
                          {order.status === "waiting-for-payment" ? "waiting-for-approval" : order.status}
                        </div>
                      </div>
                    </div>

                    <div className='flexEnd mobileOAC text-center'>
                      <Link to={`/details/${order.id}`} className='homeReg-btn order-disable mx-1'>
                        Details
                      </Link>
                      {status === "pending-orders" && (
                        <button
                          onClick={() => handleRefundOrder(order)}
                          className='homeReg-btn order-disable mx-1'
                          disabled={isAvailableForReturn(order)}
                        >
                          Refund
                        </button>
                      )}
                      {status === "processing-orders" && (
                        <button
                          onClick={() => handleRefundOrder(order)}
                          className='homeReg-btn order-disable mx-1'
                          disabled={isAvailableForReturn(order)}
                        >
                          Refund
                        </button>
                      )}
                      {status === "pending-orders" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className='homeReg-btn order-disable mx-1'
                          disabled={order.trxId}
                        >
                          Cancel
                        </button>
                      )}

                      {order.status === "waiting-for-payment" ? (
                        <button
                          onClick={() => handlePayment(order.id)}
                          className='homeLogin-btn dobt mx-1'
                          disabled={isAvailableForPayment(order)}
                        >
                          Pay now
                        </button>
                      ) : (
                        <Link to={`/payment/${order.id}`} className='homeLogin-btn dobt mx-1'>
                          Pay now
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
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
                      containerClassName={"pagination justify-content-center"}
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
          <h4 className='card-title'>{orderText}</h4>
        </div>
        <div className='card-body border p-4'>
          <div className='table-responsive'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>DayCount</th>
                  <th>OrderId</th>
                  <th>Amount</th>
                  <th>1stPayment</th>
                  <th>Due</th>
                  <th>Total</th>
                  <th>TrxId</th>
                  <th>Ref.</th>
                  <th>Status</th>
                  <th>Pay</th>
                  <th>Details</th>
                  {status === "processing-orders" && <th>Refund</th>}
                  {status === "pending-orders" && <th>Refund</th>}
                  {status === "pending-orders" && <th>Cancel</th>}
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
                  currentItems.map((order) => (
                    <tr>
                      <td>{order.created_at}</td>
                      <td>{getOrderDifDays(order)}</td>
                      <td>{order.order_number}</td>
                      <td>{Math.round(order.amount)}</td>
                      <td>{Math.round(order.needToPay)}</td>
                      <td>{Math.round(order.dueForProducts)}</td>
                      <td>{Math.round(order.amount)}</td>
                      <td>{order?.trxId}</td>
                      <td>{order?.refNumber}</td>
                      <td>
                        {order.status === "waiting-for-payment" ? "waiting-for-approval" : order.status}
                      </td>

                      <td>
                        {order.status === "waiting-for-payment" ? (
                          <button
                            onClick={() => handlePayment(order.id)}
                            className='btn btn-default px-0'
                            disabled={isAvailableForPayment(order)}
                          >
                            Pay now
                          </button>
                        ) : (
                          <Link to={`/payment/${order.id}`} className='btn btn-default px-0'>
                            Pay now
                          </Link>
                        )}
                      </td>

                      <td>
                        <Link to={`/details/${order.id}`} className='btn btn-default px-0'>
                          Details
                        </Link>
                      </td>

                      {status === "processing-orders" && (
                        <td>
                          <button
                            onClick={() => handleRefundOrder(order)}
                            className='btn btn-default px-0'
                            disabled={isAvailableForReturn(order)}
                          >
                            Refund
                          </button>
                        </td>
                      )}
                      {status === "pending-orders" && (
                        <td>
                          <button
                            onClick={() => handleRefundOrder(order)}
                            className='btn btn-default px-0'
                            disabled={isAvailableForReturn(order)}
                          >
                            Refund
                          </button>
                        </td>
                      )}

                      {status === "pending-orders" && (
                        <td>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className='btn btn-default px-0'
                            disabled={order.trxId}
                          >
                            Cancel
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
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
                  containerClassName={"pagination justify-content-center"}
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

export default ProcessingOrders;
