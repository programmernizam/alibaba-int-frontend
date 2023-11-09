import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {getSetting} from "../../../../../utils/Helpers";
import _ from "lodash";
import {
  getCartSelectedConfig, getProductPrice,
} from "../../../../../utils/CartHelpers";

const GetProductPrice = props => {
  const {general, SelectConfiguredItems, product} = props;
  const rate = getSetting(general, "increase_rate", 15);
  const currency_icon = getSetting(general, "currency_icon");
  const selectedConfig = getCartSelectedConfig(SelectConfiguredItems);


  const calculatePrice = () => {
    return getProductPrice(product, rate, selectedConfig);
  };


  return (
      <div className="product-price">
        {`${currency_icon} ${calculatePrice()}`}
      </div>
  );
};

GetProductPrice.propTypes = {
  general: PropTypes.object.isRequired,
  cartConfigured: PropTypes.object.isRequired,
  SelectConfiguredItems: PropTypes.array.isRequired,
  product: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  cartConfigured: state.CART.configured,
  SelectConfiguredItems: state.CART.SelectConfiguredItems,
});

export default connect(mapStateToProps, {})(
    withRouter(GetProductPrice)
);