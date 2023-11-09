import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { configAttrToConfigured } from "../../../../../utils/GlobalStateControl";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import {
  activeProductAllConfigurators,
  cartPlainProductQuantityUpdate,
  cartProductQuantityUpdate,
  cartProductTotal,
  cartProductTotalExceptConfiguredItems,
  checkExistConfiguredItem,
  findProductCartFromState,
  getProductApproxWeight,
  getProductDeliveryCost,
  getProductPrice,
  getUpdatedProductPrice,
} from "../../../../../utils/CartHelpers";
import { getSetting } from "../../../../../utils/Helpers";

const ManageQuantity = (props) => {
  const {
    product,
    general,
    ConfiguredItem,
    ConfiguredItemAttributes,
    cartConfigured,
    bulkPriceQuantity,
    totalQtyInCart,
  } = props;
  const product_id = !_.isEmpty(product) ? product.Id : 0;
  const rate = getSetting(general, "increase_rate", 15);
  // const ShippingCharges = getSetting(general, "air_shipping_charges");
  const selectConfigId = !_.isEmpty(ConfiguredItem) ? ConfiguredItem.Id : 0;
  const maxQuantity = !_.isEmpty(ConfiguredItem) ? ConfiguredItem.Quantity : product.MasterQuantity;
  const activeCartProduct = findProductCartFromState(cartConfigured, product_id);
  const existsConfig = checkExistConfiguredItem(activeCartProduct, product_id, selectConfigId);
  const chinaLocalShippingCharges = getSetting(general, "china_local_delivery_charge");
  const totalPrice = activeCartProduct.totalPrice;
  const getChinaLocalShippingCost = () => {
    let localShippingCost = chinaLocalShippingCharges;
    localShippingCost = Number(totalPrice) >= 4000 ? 0 : localShippingCost;
    return Number(localShippingCost);
  };
  const ShippingCharges = getChinaLocalShippingCost();

  const activeConfiguredQtyChanges = (type = "increment") => {
    let newQty = parseInt(existsConfig.Quantity) + 1;
    if (type === "decrement") {
      newQty = parseInt(existsConfig.Quantity) - 1;
    }
    if (Number(newQty) <= Number(maxQuantity)) {
      cartProductQuantityUpdate(
        newQty,
        getUpdatedProductPrice(newQty, bulkPriceQuantity, rate),
        cartConfigured,
        product_id,
        existsConfig.Id,
        ShippingCharges
      );
    }
  };

  const inputQtyChanges = (qty) => {
    if (Number(qty) <= Number(maxQuantity)) {
      cartProductQuantityUpdate(
        qty,
        getUpdatedProductPrice(qty, bulkPriceQuantity, rate),
        cartConfigured,
        product_id,
        existsConfig.Id,
        ShippingCharges
      );
    }
  };

  const addConfigItemToCart = (qty = 1) => {
    let activeProduct = findProductCartFromState(cartConfigured, product_id);
    if (_.isEmpty(activeProduct)) {
      activeProduct = {
        Id: product_id,
        Title: product.Title,
        MainPictureUrl: product.MainPictureUrl,
        bulkPriceQuantity: bulkPriceQuantity,
        MasterQuantity: product.MasterQuantity,
        ApproxWeight: getProductApproxWeight(product),
        DeliveryCost: getProductDeliveryCost(product, rate),
        Quantity: qty,
        Price: getUpdatedProductPrice(qty, bulkPriceQuantity, rate),
        hasConfigurators: true,
        IsCart: true,
        ConfiguredItems: [],
      };
    }

    let activeConfiguredItems = activeProductAllConfigurators(activeProduct);
    if (!_.isEmpty(activeConfiguredItems)) {
      activeConfiguredItems = activeConfiguredItems.filter((filter) => filter.Id !== ConfiguredItem.Id);
    }

    if (qty && !_.isEmpty(ConfiguredItem)) {
      let makeConfig = {
        Id: ConfiguredItem.Id,
        Quantity: qty,
        MaxQuantity: ConfiguredItem.Quantity,
        SalesCount: ConfiguredItem.SalesCount,
        Price: getUpdatedProductPrice(qty, bulkPriceQuantity, rate),
        Attributes: ConfiguredItemAttributes,
      };
      activeConfiguredItems = [...activeConfiguredItems, makeConfig];
    }

    let cartFullConfigure = cartConfigured;
    if (!_.isEmpty(cartConfigured) && _.isArray(cartConfigured)) {
      cartFullConfigure = cartConfigured.filter((filter) => filter.Id !== product_id);
    } else {
      cartFullConfigure = [];
    }

    activeProduct = { ...activeProduct, ConfiguredItems: activeConfiguredItems };
    let ProductSummary = cartProductTotal(activeProduct, ShippingCharges);

    if (!_.isEmpty(ProductSummary)) {
      activeProduct = {
        ...activeProduct,
        totalPrice: ProductSummary.totalPrice,
        totalQty: ProductSummary.totalQty,
        ShippingRate: ProductSummary.ShippingRate,
        ApproxWeight: ProductSummary.ApproxWeight,
        totalWeight: ProductSummary.totalWeight,
      };
    }
    configAttrToConfigured([...cartFullConfigure, activeProduct]);
  };

  const addPlainProductToCart = (qty = 1) => {
    let activeProduct = {
      Id: product_id,
      Title: product.Title,
      MainPictureUrl: product.MainPictureUrl,
      bulkPriceQuantity: bulkPriceQuantity,
      MasterQuantity: product.MasterQuantity,
      ApproxWeight: getProductApproxWeight(product),
      DeliveryCost: getProductDeliveryCost(product, rate),
      Quantity: qty,
      Price: getUpdatedProductPrice(qty, bulkPriceQuantity, rate),
      hasConfigurators: false,
      IsCart: true,
      ConfiguredItems: [],
    };
    let cartFullConfigure = cartConfigured.filter((filter) => filter.Id !== product_id);
    let ProductSummary = cartProductTotalExceptConfiguredItems(activeProduct, ShippingCharges);
    if (!_.isEmpty(ProductSummary)) {
      activeProduct = {
        ...activeProduct,
        totalPrice: ProductSummary.totalPrice,
        totalQty: ProductSummary.totalQty,
        ShippingRate: ProductSummary.ShippingRate,
        ApproxWeight: ProductSummary.ApproxWeight,
        totalWeight: ProductSummary.totalWeight,
      };
    }
    configAttrToConfigured([...cartFullConfigure, activeProduct]);
  };

  const addPlainProductQtyChanges = (type = "increment") => {
    let maxQuantity = product.MasterQuantity || 0;
    let newQty = parseInt(activeCartProduct.Quantity) + 1;
    if (type === "decrement") {
      newQty = parseInt(activeCartProduct.Quantity) - 1;
    }
    if (Number(newQty) <= Number(maxQuantity)) {
      cartPlainProductQuantityUpdate(
        newQty,
        getUpdatedProductPrice(newQty, bulkPriceQuantity, rate),
        cartConfigured,
        product_id,
        ShippingCharges
      );
    }
  };

  const plainItemQtyChanges = (qty) => {
    if (Number(qty) <= Number(maxQuantity)) {
      cartPlainProductQuantityUpdate(
        qty,
        getUpdatedProductPrice(qty, bulkPriceQuantity, rate),
        cartConfigured,
        product_id,
        ShippingCharges
      );
    }
  };

  if (_.isEmpty(ConfiguredItem)) {
    if (!_.isEmpty(activeCartProduct)) {
      return (
        <div className='m-0'>
          <div className='cart-product-quantity'>
            <div className='input-group input-group-sm'>
              <div className='input-group-prepend'>
                <button
                  className='btn btn-default'
                  type='button'
                  onClick={() => addPlainProductQtyChanges("decrement")}
                >
                  <i className='icon-minus' />
                </button>
              </div>
              <input
                type='text'
                className='form-control text-center addQ'
                value={activeCartProduct.Quantity}
                onChange={(e) => plainItemQtyChanges(e.target.value)}
                required=''
                placeholder=''
              />
              <div className='input-group-append'>
                <button
                  className='btn btn-default'
                  type='button'
                  onClick={() => addPlainProductQtyChanges("increment")}
                >
                  <i className='icon-plus' />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <button type='button' onClick={() => addPlainProductToCart(1)} className='btn btn-default btn_only_add'>
        <i className='icon-cart-plus' /> Add
      </button>
    );
  }

  if (!_.isEmpty(existsConfig)) {
    return (
      <div className='m-0'>
        <div className='cart-product-quantity'>
          <div className='input-group input-group-sm'>
            <div className='input-group-prepend'>
              <button
                className='btn btn-default'
                type='button'
                onClick={() => activeConfiguredQtyChanges("decrement")}
              >
                <i className='icon-minus' />
              </button>
            </div>
            <input
              type='text'
              className='form-control text-center addQ'
              value={existsConfig.Quantity}
              onChange={(e) => inputQtyChanges(e.target.value)}
              required=''
              placeholder=''
            />
            <div className='input-group-append'>
              <button
                className='btn btn-default'
                type='button'
                onClick={() => activeConfiguredQtyChanges("increment")}
              >
                <i className='icon-plus' />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type='button'
      onClick={() => addConfigItemToCart(1)}
      className='btn btn-default btn_only_add px-4'
    >
      <i className='icon-cart-plus' /> Add
    </button>
  );
};

ManageQuantity.propTypes = {
  product: PropTypes.object.isRequired,
  general: PropTypes.object.isRequired,
  cartConfigured: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, {})(withRouter(ManageQuantity));
