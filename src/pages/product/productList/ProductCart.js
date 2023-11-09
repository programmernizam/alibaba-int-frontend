import React from "react";
import PropTypes from "prop-types";
import { getSetting } from "../../../utils/Helpers";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadProductDetails } from "../../../store/actions/ProductAction";
import { productAddToWishlist } from "../../../store/actions/AuthAction";
import _ from "lodash";
import LazyImage from "../../../components/common/LazyImage";

const ProductCart = (props) => {
  const { product, general, productClass, auth } = props;
  const currency_icon = getSetting(general, "currency_icon");

  const addToWishlist = (e, product) => {
    e.preventDefault();
    props.productAddToWishlist(product, auth.shopAsCustomer.id, auth.isShopAsCustomer);
  };
  const product_code = product.product_code ? product.product_code : product.ItemId;

  return (
    <div className={productClass ? productClass : "col-6 col-sm-4 col-lg-4 col-xl-3 gap-item"}>
      <div className='product product-7 mb-10x hov-shadow br-1'>
        <figure className='product-media'>
          <Link to={`/product/${product_code}`} className='text-center'>
            {/* <img src={product.img} className='product-image object-contain' alt={product.name} /> */}
            <LazyImage
              classes='product-image object-contain'
              imageSrc={product.img}
              imageAlt={product.name}
            />
          </Link>
          <div className='product-action-vertical'>
            <a
              href={`/add-to-wishlist`}
              onClick={(e) => addToWishlist(e, product)}
              className='btn-product-icon btn-wishlist btn-expandable'
            >
              <span>add to wishlist</span>
            </a>
            <Link
              to={`/product/${product_code}`}
              className='btn-product-icon btn-quickview'
              title='Quick view'
            >
              <span>Quick view</span>
            </Link>
          </div>
        </figure>
        {/* End .product-media */}
        <div className='product-body'>
          {/* End .product-cat */}
          <h3
            className='product-title'
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            title={product.name}
          >
            <Link to={`/product/${product_code}`}>{product.name}</Link>
          </h3>
          {/* End .product-title */}
          <div className='clearfix d-block product-price'>
            <span className='float-left'>
              {`${currency_icon}`} <span className='price_span'>{_.round(product.sale_price)}</span>
            </span>
            <span className='sold_item_text'>SOLD: {product.total_sold}</span>
          </div>
        </div>
        {/* End .product-body */}
      </div>
    </div>
  );
};

ProductCart.propTypes = {
  general: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  productClass: PropTypes.string,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  auth: state.AUTH,
});

export default connect(mapStateToProps, { loadProductDetails, productAddToWishlist })(
  withRouter(ProductCart)
);
