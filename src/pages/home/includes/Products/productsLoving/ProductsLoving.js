import React, { useEffect, useState } from "react";
import ProductSectionSkeleton from "../../../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "../recentProduct/includes/RecentItems";
import _ from "lodash";
import { loadLovingProducts } from "../../../../../utils/Services";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const ProductsLoving = (props) => {
  const { auth } = props;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (_.isEmpty(products)) {
      loadLovingProducts(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
        let lovingProducts = response?.lovingProducts;
        if (!_.isEmpty(lovingProducts)) {
          lovingProducts = JSON.parse(response?.lovingProducts);
          setProducts(lovingProducts);
        }
        setLoading(false);
      });
    }
  }, [auth.shopAsCustomer.id, auth.isShopAsCustomer, products]);

  return (
    <div className='container deal-section'>
      <div className='row mt-2 mb-2 mb-md-3'>
        <div className='col-12'>
          <div className='more-to-love card'>
            <div className='row'>
              <div className='col-2'>
                <div className='love-left'>
                  <i className='icon-heart-o' />
                </div>
              </div>
              <div className='col-8'>
                <h3 className='title text-center'>MORE TO LOVE</h3>
              </div>
              <div className='col-2'>
                <div className='love-right'>
                  <i className='icon-heart-o' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <ProductSectionSkeleton />}
      {!loading && products.length > 0 && <RecentItems sectionCart={true} products={products} />}

      <h3 className='title mt-5' > </h3>

    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(ProductsLoving));
