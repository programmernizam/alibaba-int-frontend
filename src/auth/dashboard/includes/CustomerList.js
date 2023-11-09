import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { customerWishlist } from "../../../store/actions/AuthAction";
import { loadCustomerCart } from "../../../store/actions/CartAction";
import { setShopAsCustomer } from "../../../utils/GlobalStateControl";
import { goPageTop } from "../../../utils/Helpers";
import { getAlCustomerList } from "../../../utils/Services";

const CustomerList = (props) => {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState("");

  const history = useHistory();

  useEffect(() => {
    loadAllCustomers();
  }, []);

  useEffect(() => {
    goPageTop();
  }, [search, itemOffset]);

  const loadAllCustomers = async () => {
    const response = await getAlCustomerList();
    if (!_.isEmpty(response)) {
      const resData = response.data;
      if (!_.isEmpty(resData)) {
        const customers = resData.customers;
        if (!_.isEmpty(customers)) {
          setCustomerList(customers);
        }
      }
    }
    setLoading(false);
  };

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const pageCount = Math.ceil(customerList.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePaginationClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % customerList.length;
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
  const allUsersData = useMemo(() => {
    let computedUsers = customerList;
    if (search) {
      computedUsers = computedUsers.filter(
        (user) =>
          user?.email.toLowerCase().includes(search.toLowerCase()) ||
          user?.phone?.toLowerCase().includes(search.toLowerCase()) ||
          user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          user?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (computedUsers.length <= 1) return computedUsers;
    return computedUsers.slice(itemOffset, endOffset);
  }, [search, itemOffset, endOffset, customerList]);

  // search

  const handleShopAsCustomer = async (user) => {
    setShopAsCustomer(
      { isShopAsCustomer: true, shopAsCustomer: user },
      history,
      props.loadCustomerCart,
      props.customerWishlist
    );
  };

  return (
    <>
      <div className='card'>
        <div className='card-header border border-bottom-0 p-4'>
          <div className='flexBetween'>
            <h4 className='card-title'>Customer List</h4>
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
                  <th>User Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Action</th>
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
                ) : allUsersData.length > 0 ? (
                  allUsersData.map((customer) => {
                    return (
                      <tr>
                        <td>{customer.id}</td>
                        <td>{customer.full_name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>
                          <button onClick={() => handleShopAsCustomer(customer)} className='btn btn-default'>
                            Shop as customer
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <p className='text-center bold'>No user found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {allUsersData.length > 0 && (
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
  general: JSON.parse(state.INIT.general),
  isAuthenticated: state.AUTH.isAuthenticated,
  OTPResponse: state.AUTH.OTP_response,
  cartConfigured: state.CART.configured,
  authError: state.ERRORS,
});

export default connect(mapStateToProps, {
  loadCustomerCart,
  customerWishlist,
})(withRouter(CustomerList));
