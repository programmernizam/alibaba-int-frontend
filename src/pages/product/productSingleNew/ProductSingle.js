import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import ProductBody from "./productBody/ProductBody";
import ProductDetailsTab from "./includes/ProductDetailsTab";
import RelatedProduct from "../reletedProduct/RelatedProduct";
import Breadcrumb from "../../breadcrumb/Breadcrumb";
import { loadProductDetails } from "../../../store/actions/ProductAction";
import My404Component from "../../404/My404Component";
import { characterLimiter, goPageTop } from "../../../utils/Helpers";
import ProductDetailsSkeleton from "../../../skeleton/productSkeleton/ProductDetailsSkeleton";
import { ConfiguredItems, find_product_from_state } from "../../../utils/CartHelpers";
import SameSellerProducts from "./includes/SameSellerProducts";
import { removeProductIntoVirtualCart } from "../../../utils/GlobalStateControl";

const ProductSingle = (props) => {
  const { match, general, details_loading, details, cartConfigured } = props;
  const params = !_.isEmpty(match) ? match.params : {};
  const item_id = !_.isEmpty(params) ? params.item_id : "";

  const [id, setId] = useState("");

  useEffect(() => {
    if (item_id !== id) {
      setId(item_id);
      goPageTop();
    }
  }, [item_id, id]);

  const product = find_product_from_state(details, item_id);
  const ConfigItems = ConfiguredItems(product);

  useEffect(() => {
    if (item_id !== id) {
      if (_.isEmpty(ConfigItems)) {
        props.loadProductDetails(item_id, details);
      }
    }
  }, [item_id]);

  useEffect(() => {
    removeProductIntoVirtualCart();
  }, [item_id]);

  if (details_loading) {
    return <ProductDetailsSkeleton />;
  }

  if (_.isEmpty(product) && !details_loading) {
    return <My404Component />;
  }

  return (
    <div className='bg-gray main'>
      <div className='container-fluid'>
        <Breadcrumb current={characterLimiter(product.Title, 20)} collections={[{ name: "Product" }]} />

        <div className='row'>
          <div className='col-md-10 col-lg-9'>
            <ProductBody
              product={product}
              ConfiguredItems={ConfigItems}
              general={general}
              cartConfigured={cartConfigured}
            />
          </div>
          <div className='col-md-2 col-lg-3 d-none d-lg-block'>
            <RelatedProduct item_id={item_id} />
          </div>
        </div>

        <ProductDetailsTab product={product} />
        <SameSellerProducts vendorId={product?.VendorId} />
        <div className='col-md-12 d-block d-lg-none'>
          <RelatedProduct item_id={item_id} />
        </div>
      </div>
    </div>
  );
};

ProductSingle.propTypes = {
  match: PropTypes.object.isRequired,
  details_loading: PropTypes.bool.isRequired,
  details: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  details_loading: state.LOADING.product_details_loading,
  details: state.PRODUCTS.product_details,
});

export default connect(mapStateToProps, { loadProductDetails })(withRouter(ProductSingle));
