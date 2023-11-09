import React, { useEffect, useMemo, useState } from "react";

import { Link, withRouter } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";
import { getAllInvoices } from "../../../utils/Services";
import { getSetting } from "../../../utils/Helpers";
import { TbCurrencyTaka, TbListDetails } from "react-icons/tb";

const Invoices = (props) => {
  const { auth, general } = props;
  const currency = getSetting(general, "currency_icon");
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllInvoices(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setLoading(false);
      setInvoices(response.data.invoices);
    });
  }, [auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const pageCount = Math.ceil(invoices.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePaginationClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % invoices.length;
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
    let computedData = invoices;
    if (search) {
      computedData = computedData.filter(
        (invoice) =>
          invoice?.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
          invoice?.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
          invoice?.customer_phone?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (computedData.length <= 1) return computedData;
    return computedData.slice(itemOffset, endOffset);
  }, [search, itemOffset, endOffset, invoices]);

  return (
    <>
      <div className='card my-2'>
        <div className='card-header border  p-4 mb-1'>
          <div className='flexBetween'>
            <h4 className='card-title'>Invoices</h4>
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
              {allFilterData.map((invoice) => {
                return (
                  <div className='card-body px-1 py-2 my-3 shadow  border'>
                    <div className='px-4'>
                      <div className='row '>
                        <div className='col-7'>
                          <span className='bold order-title'>Invoice: {invoice.invoice_no}</span>
                        </div>
                        <div className='col-5 text-right'>
                          <span className='bold'>Date:</span>
                          {invoice.created_at.slice(0, 10)}
                        </div>
                      </div>

                      <div className='row flexBetween'>
                        <div className='col-12 col-md-6' style={{ borderTop: "1px solid lightGray" }}>
                          <p className='flexBetween m-0'>
                            <span className='bold'>Customer Name:</span>
                            <span>{invoice.customer_name}</span>
                          </p>
                        </div>
                        <div className='col-12 col-md-6' style={{ borderTop: "1px solid lightGray" }}>
                          <p className='flexBetween m-0'>
                            <span className='bold'>CustomerPhone:</span>
                            <span>{invoice.customer_phone}</span>
                          </p>
                        </div>
                        <div className='col-12 col-md-6' style={{ borderTop: "1px solid lightGray" }}>
                          <p className='flexBetween m-0'>
                            <span className='bold'>Payment Method:</span>
                            <span>{invoice.delivery_method}</span>
                          </p>
                        </div>
                        <div className='col-12 col-md-6' style={{ borderTop: "1px solid lightGray" }}>
                          <p className='flexBetween m-0'>
                            <span className='bold'>Delivery Method:</span>
                            <span>{invoice.payment_method}</span>
                          </p>
                        </div>

                        <div className='col-12 ' style={{ borderTop: "1px solid lightGray" }}>
                          <p className='flexBetween m-0'>
                            <span className='bold'>Status:</span>
                            <span>{invoice.status}</span>
                          </p>
                        </div>
                        <div className='col-12'>
                          {invoice.status === "confirm_received" ? (
                            <p className='due-Text text-right m-0'>
                              <span className='bold'>PAID</span>
                            </p>
                          ) : (
                            <p className='due-Text flexBetween m-0'>
                              <span className='bold'>Total Payable:</span>
                              <span>
                                {currency} {invoice.total_payable}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flexEnd mobileOAC text-center'>
                      {invoice.status !== "confirm_received" && (
                        <Link
                          to={`/pay-by-invoice/${invoice.invoice_no}`}
                          className='homeReg-btn invoice-disable mx-1'
                          style={{ width: "100%" }}
                        >
                          <TbCurrencyTaka size={18} className='mr-1 bold' /> Pay now
                        </Link>
                      )}

                      <Link
                        to={`/invoice/${invoice.invoice_no}`}
                        className='homeReg-btn invoice-disable mx-1'
                        style={{ width: "100%" }}
                      >
                        <TbListDetails size={18} className='mr-1 bold' /> Details
                      </Link>
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
            <div className='card-body px-1 py-2 shadow text-center border'>You have no Invoice</div>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
  general: JSON.parse(state.INIT.general),
});

export default connect(mapStateToProps, {})(withRouter(Invoices));
