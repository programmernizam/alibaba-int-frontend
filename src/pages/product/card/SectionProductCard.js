import React from 'react';
import PropTypes from 'prop-types';
import {getSetting, loadProductImg} from "../../../utils/Helpers";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import LazyLoad from "react-lazyload";
import {getDBProductPrice} from "../../../utils/CartHelpers";

const SectionProductCard = props => {
  const {product, general} = props;
  const Pictures = product.Pictures ? JSON.parse(product.Pictures) : [];
  const rate = getSetting(general, "increase_rate", 15);
  const currency_icon = getSetting(general, "currency_icon");

  return (
      <div className="product col-lg-12 col-md-6 col-6">
        <figure className="mb-0 product-media bg-white d-flex justify-content-center align-items-center">
          <Link to={`/product/${product.ItemId}`} className="w-100">
            <LazyLoad height={236} once>
              <img
                  src={loadProductImg(Pictures, product.MainPictureUrl)}
                  className="product-image"
                  alt={product.Title}
              />
            </LazyLoad>
          </Link>
          {/* End .product-countdown */}

        </figure>
        {/* End .product-media bg-white d-flex justify-content-center align-items-center */}
        <div className="product-body">
          <h3
              className="product-title"
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden"
              }}
              title={product.Title}>
            <Link to={`/product/${product.ItemId}`}
            >
              {product.Title}
            </Link>
          </h3>

          {/* End .product-title letter-spacing-normal font-size-normal */}
          <div className="product-price">
            <div className="new-price">{`${currency_icon} ${getDBProductPrice(product, rate)}`}</div>
          </div>
          {/* End .product-price */}

        </div>

      </div>
  );
};

SectionProductCard.propTypes = {
  product: PropTypes.object
};


const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  details: state.PRODUCTS.product_details,
});

export default connect(mapStateToProps, {})(
    withRouter(SectionProductCard)
);
