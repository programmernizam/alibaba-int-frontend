import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import _ from "lodash";
import { useLocation, useParams } from "react-router-dom";
import { getSetting, goPageTop } from "../../utils/Helpers";
import { loadSameSellerProducts } from "../../utils/Services";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import ProductListSkeleton from "../../skeleton/productSkeleton/ProductListSkeleton";
import CategoryProductList from "../product/productList/CategoryProductList";
import Filter from "./includes/Filter";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VendorSearchProducts = ({ general }) => {
  const rate = getSetting(general, "increase_rate", 15);
  const { vendorId } = useParams();
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
      loadingProduct(offset);
    } else {
      loadingProduct(0);
    }
  }, [page, minPrice, maxPrice, orderBy, offer]);

  const loadingProduct = (loadOffset = 0) => {
    setLoading(true);
    loadSameSellerProducts(vendorId, loadOffset, perPage, minPrice, maxPrice, orderBy, offer).then(
      (response) => {
        let newProducts = JSON.parse(response.VendorProducts);
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
              <Filter TotalCount={totalCount} pageName={`vendorSearch`} slugKey={vendorId} />
              {loading ? (
                <ProductListSkeleton />
              ) : (
                <CategoryProductList
                  pageName={`vendorSearch`}
                  products={products}
                  slugKey={vendorId}
                  perPage={perPage}
                  currentPage={currentPage}
                  TotalCount={totalCount}
                  sellerId={vendorId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
});

export default connect(mapStateToProps, {})(withRouter(VendorSearchProducts));
