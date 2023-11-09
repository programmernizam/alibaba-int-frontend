import React, { useEffect, useMemo, useState } from "react";
import { getAlOrderItems } from "../../../utils/Services";
import { withRouter } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";
import OrderItem from "./OrderItem";
import { goPageTop } from "../../../utils/Helpers";

const CompletedOrders = (props) => {
  const { auth } = props;

  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAlOrderItems(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setLoading(false);
      setOrderItems(response.data.items);
    });
  }, [auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  useEffect(() => {
    goPageTop();
  }, [search, itemOffset]);

  const completeOrders = orderItems.filter((order) => order.status === "delivered");
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const pageCount = Math.ceil(completeOrders.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePaginationClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % completeOrders.length;
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
    let computedData = completeOrders;
    if (search) {
      computedData = computedData.filter(
        (user) =>
          user?.order_id.toLowerCase().includes(search.toLowerCase()) ||
          user?.order_item_number?.toLowerCase().includes(search.toLowerCase()) ||
          user?.status?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (computedData.length <= 1) return computedData;
    return computedData.slice(itemOffset, endOffset);
  }, [search, itemOffset, endOffset, completeOrders]);

  const onClick = (i) => {
    setOpen(open === i ? null : i);
  };

  return (
    <>
      <div className='card'>
        <div className='card-header border border-bottom-0 p-4'>
          <div className='flexBetween'>
            <h4 className='card-title'>Delivered Doorstep</h4>
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
          <div>
            {loading && (
              <div className='text-center'>
                <div className='spinner-border text-secondary' role='status'>
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            )}

            {!loading && allFilterData.length > 0 ? (
              allFilterData.map((item, index) => {
                return (
                  <OrderItem
                    item={item}
                    isOpen={open === index}
                    toggle={() => onClick(index)}
                    index={index}
                  />
                );
              })
            ) : (
              <p className='text-center bold'> {!loading && "No Order found!"}</p>
            )}
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
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(CompletedOrders));
