import React, { useState } from "react";
import PropTypes from "prop-types";
import { useLocation, withRouter } from "react-router-dom";
import _ from "lodash";
import ProductCart from "./ProductCart";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";

const CategoryProductList = (props) => {
  const { products, TotalCount, pageName, slugKey, currentPage, history, perPage } = props;
  const [priceRange, setPricerRang] = useState({ min_price: "", max_price: "" });
  const totalPage = Math.ceil(TotalCount / perPage);
  const { search } = useLocation();
  let qString = !_.isEmpty(search) ? search : "";
  qString = qString.slice(7);

  const handlePaginationClick = (data) => {
    if (pageName === "search") {
      history.push(`/search/${slugKey}?page=${data.selected + 1}${qString}`);
    } else if (pageName === "pictureSearch") {
      history.push(`/search/picture/${slugKey}?page=${data.selected + 1}${qString}`);
    } else if (pageName === "vendorSearch") {
      history.push(`/seller/${slugKey}?page=${data.selected + 1}${qString}`);
    } else {
      history.push(`/shop/${slugKey}?page=${data.selected + 1}${qString}`);
    }
  };
  const handleFilterMethodChange = (e) => {
    let method = e.target.value;
    if (pageName === "search") {
      history.push(`/search/${slugKey}?page=${1}&${method}`);
    } else if (pageName === "pictureSearch") {
      history.push(`/search/picture/${slugKey}?page=${1}&${method}`);
    } else if (pageName === "vendorSearch") {
      history.push(`/seller/${slugKey}?page=${1}&${method}`);
    } else {
      history.push(`/shop/${slugKey}?page=${1}&${method}`);
    }
  };

  const handleFilterPriceChange = () => {
    if (pageName === "search") {
      history.push(
        `/search/${slugKey}?page=${1}&min_price=${priceRange.min_price}&max_price=${priceRange.max_price}`
      );
    } else if (pageName === "pictureSearch") {
      history.push(
        `/search/picture/${slugKey}?page=${1}&min_price=${priceRange.min_price}&max_price=${
          priceRange.max_price
        }`
      );
    } else if (pageName === "vendorSearch") {
      history.push(
        `/seller/${slugKey}?page=${1}&min_price=${priceRange.min_price}&max_price=${priceRange.max_price}`
      );
    } else {
      history.push(
        `/shop/${slugKey}?page=${1}&min_price=${priceRange.min_price}&max_price=${priceRange.max_price}`
      );
    }
  };

  return (
    <div className='product_list_container'>
      <div className='products mb-3'>
        <div className='row justify-content-center gap'>
          {_.isArray(products) &&
            products.map((product) => <ProductCart key={product.Id} product={product} />)}
        </div>
      </div>

      <nav aria-label='Page navigation'>
        <ReactPaginate
          previousLabel={`Prev`}
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          forcePage={currentPage - 1}
          pageCount={totalPage}
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
  );
};

CategoryProductList.propTypes = {
  products: PropTypes.array.isRequired,
  TotalCount: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(withRouter(CategoryProductList));
