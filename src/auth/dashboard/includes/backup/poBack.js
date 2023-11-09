import React, { useEffect, useMemo, useState } from "react";
import { getCustomerAllOrders, getUserInfo, refundOrder } from "../../../utils/Services";
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
import sImg from "../../../assets/images/cd/waiting.png";
import { BsArrowDownUp } from "react-icons/bs";

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

  const history = useHistory();
  const currency = getSetting(general, "currency_icon");
  let [width] = useWindowSize();
  width = width ? width : window.innerWidth;

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

  const handlePayment = (id) => {
    history.push(`/payment/${id}`);
  };

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
          {loading ? (
            <div className='text-center'>
              <div className='spinner-border text-secondary' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          ) : allFilterData.length > 0 ? (
            allFilterData.map((order, index) => {
              const trxIds = JSON.parse(order.trxId);
              const day = getBusinessDateCount(order.created_at);
              return (
                <div className='card my-2 my-md-4 hov-shadow'>
                  <div className='card-header border border-bottom-0 px-2 py-0 py-md-2'>
                    <div c>
                      <h4 className='bold order-title d-inline-block'>Invoice No: #{order.order_number}</h4>
                    </div>

                    <div
                      className={`d-flex justify-content-center flex-column align-items-center p-1 p-md-2`}
                    >
                      <div className={`border-image-clip-path`}>
                        <img className='status-img' src={sImg} alt='' />
                      </div>
                      <p className='text-center text-uppercase status-title animate-charcter bold'>
                        waiting for approval
                      </p>
                      <p className='text-center status-update'>{order.updated_at.slice(0, 10)}</p>
                    </div>
                  </div>
                  <div className='card-body border'>
                    <div className='collapse' id={`collapseDetails${index}`}>
                      <div>
                        <div className='row'>
                          <div className='col-6'>
                            <b>Order Date : </b>
                            <span>{order.created_at.slice(0, 10)}</span>
                          </div>
                          <div className='col-6 text-right'>
                            <b>Total Amount:</b>
                            <span>
                              {currency} {numberWithCommas(order.amount)}
                            </span>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-4'>
                            <span className='bold'>TRX:</span>
                            {trxIds.payment_1st || "no pay"}
                          </div>
                          <div className='col-4 text-right'>
                            <span className='bold'>REF:</span>
                            {order.refNumber}
                          </div>
                          <div className='col-4 text-right'>
                            <span className='bold'>First Payment(-):</span>
                            {currency} {numberWithCommas(order.needToPay)}
                          </div>
                        </div>

                        <p className='text-right due-Text'>
                          <b> NET DUE : </b>
                          <span>
                            {currency}
                            {numberWithCommas(order.dueForProducts)}
                          </span>
                        </p>

                        <div className='flexEnd mobileOAC text-center'>
                          <Link to={`/details/${order.id}`} className='homeReg-btn order-disable mx-1'>
                            See more
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
                              onClick={() => handlePayment(order.id)}
                              className='btn homeLogin-btn dobt mx-1'
                              disabled={isAvailableForPayment(order)}
                            >
                              Pay now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        className='btn expand btn-default btn-block bold'
                        type='button'
                        data-toggle='collapse'
                        data-target={`#collapseDetails${index}`}
                        aria-expanded='false'
                        aria-controls={`collapseDetails${index}`}
                      >
                        <span>
                          <BsArrowDownUp size={20} className='mr-2' />
                        </span>
                        DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p colSpan={9}>You have no orders</p>
          )}

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
