import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import _, { set } from "lodash";
import { getSearchProducts } from "../../store/actions/ProductAction";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import ProductListSkeleton from "../../skeleton/productSkeleton/ProductListSkeleton";
import { getSetting, goPageTop } from "../../utils/Helpers";
import CategoryProductList from "../product/productList/CategoryProductList";
import { loadTextSearchProducts } from "../../utils/Services";
import { useLocation } from "react-router-dom";
import Filter from "./includes/Filter";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LoadSearchProducts = (props) => {
  const { match, general } = props;
  const rate = getSetting(general, "increase_rate", 15);
  const params = !_.isEmpty(match) ? match.params : {};
  const searchKey = !_.isEmpty(params) ? params.searchKey : "";
  const [searchKeyword, setSearchKeyword] = useState("");
  const { search } = useLocation();
  const qString = !_.isEmpty(search) ? search : "";

  const query = useQuery();
  let page = query.get("page");
  page = page ? page : 1;

  let minPrice = Number(query.get("min_price"));
  let maxPrice = Number(query.get("max_price"));
  minPrice = minPrice ? minPrice / rate : null;

  maxPrice = maxPrice ? maxPrice / rate : null;

  const sortValue = query.get("direction");
  const sortBy = query.get("sort");
  let orderBy;
  let offer;

  if (sortBy === "offer") {
    orderBy = null;
    offer = true;
  } else if (!sortBy) {
    orderBy = null;
  } else {
    orderBy = `${sortBy}:${sortValue}`;
    offer = null;
  }

  const perPage = 36;
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    goPageTop();
    if (page !== currentPage) {
      let selected = parseInt(page) - 1;
      setCurrentPage(page);
      let offset = Math.ceil(selected * perPage);
      loadingProduct(qString, offset);
    } else if (searchKey !== searchKeyword) {
      setSearchKeyword(searchKey);
      loadingProduct(qString, 0);
    } else {
      loadingProduct(qString, 0);
    }
  }, [page, searchKey, minPrice, maxPrice, orderBy, offer]);

  const loadingProduct = (qString, loadOffset = 0) => {
    setLoading(true);
    loadTextSearchProducts(searchKey, loadOffset, perPage, minPrice, maxPrice, orderBy, offer).then(
      (response) => {
        let newProducts = JSON.parse(response.products);
        if (!_.isEmpty(newProducts)) {
          setProducts(newProducts.Content);
          setTotalCount(newProducts.TotalCount);
        }
        setLoading(false);
      }
    );
  };

  return (
    <main className='main'>
      <Breadcrumb current={"searching for"} collections={[{ name: "Search" }]} />
      <div className='page-content'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <Filter TotalCount={totalCount} pageName={`search`} slugKey={searchKey} />
              {loading ? (
                <ProductListSkeleton />
              ) : (
                <CategoryProductList
                  pageName={`search`}
                  products={products}
                  slugKey={searchKey}
                  perPage={perPage}
                  currentPage={currentPage}
                  TotalCount={totalCount}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

LoadSearchProducts.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  getSearchProducts: PropTypes.func.isRequired,
  search_product_loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  searchData: state.PRODUCTS.search_products,
  search_product_loading: state.LOADING.search_product_loading,
});

export default connect(mapStateToProps, { getSearchProducts })(withRouter(LoadSearchProducts));
