import React from "react";
import ManageQuantity from "./includes/ManageQuantity";
import { getProductAttributes, getUpdatedProductPrice, is_size } from "../../../../utils/CartHelpers";
import { getSetting } from "../../../../utils/Helpers";
import _ from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const ProductConfiguredItems = (props) => {
  const {
    product,
    ConfiguredItems,
    colorAttributes,
    cartAttribute,
    general,
    totalQtyInCart,
    bulkPriceQuantity,
  } = props;

  // console.log(colorAttributes)

  const Attributes = getProductAttributes(product);
  const rate = getSetting(general, "increase_rate", 15);
  const currency = getSetting(general, "currency_icon");

  const notColoured = (configAttr) => {
    return colorAttributes.find((colorAttr) => {
      const compare = { Pid: colorAttr.Pid, Vid: colorAttr.Vid };
      return JSON.stringify(compare) === JSON.stringify(configAttr);
    });
  };

  const getConfigAttributes = (Configurators) => {
    const Attribute = Attributes.find((attribute) => {
      const compare = { Pid: attribute.Pid, Vid: attribute.Vid };
      if (!notColoured(compare) && is_size(attribute.PropertyName)) {
        return Configurators.find((find) => JSON.stringify(find) === JSON.stringify(compare));
      }
      return false;
    });
    return _.isObject(Attribute) ? Attribute : {};
  };

  const activeConfiguredItems = () => {
    let returnValues = [];
    if (!_.isEmpty(cartAttribute)) {
      returnValues = ConfiguredItems.filter((filter) => {
        let Configurators = filter.Configurators;
        Configurators = Configurators.find(
          (configAttr) => configAttr.Pid === cartAttribute.Pid && configAttr.Vid === cartAttribute.Vid
        );
        return !_.isEmpty(Configurators);
      });
    }
    return _.isEmpty(returnValues) ? ConfiguredItems : returnValues;
  };

  const ConfiguredItemAttributes = (config) => {
    let configAttr = [];
    let Configurators = config.Configurators;
    if (_.isArray(Attributes) && _.isArray(Configurators)) {
      configAttr = Attributes.filter((filter) => {
        let findConfg = Configurators.find((find) => find.Pid === filter.Pid && find.Vid === filter.Vid);
        return !_.isEmpty(findConfg);
      });
    }

    return configAttr;
  };

  const ProductConfiguredItems = activeConfiguredItems();

  if (ProductConfiguredItems.length <= 0) {
    return (
      <div className='tableFixHead table-responsive-sm'>
        <table className='table table-sm text-center table-bordered product_summary_table'>
          <thead>
            <tr>
              <th>Price</th>
              <th style={{ width: "140px" }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='align-middle'>
                {`${currency} ${getUpdatedProductPrice(totalQtyInCart, bulkPriceQuantity, product, rate)}`}
              </td>
              <td className='align-middle'>
                <ManageQuantity
                  product={product}
                  totalQtyInCart={totalQtyInCart}
                  bulkPriceQuantity={bulkPriceQuantity}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className='tableFixHead table-responsive-sm'>
      <table className='table table-sm text-center table-bordered product_summary_table'>
        <thead>
          <tr>
            <th>Size/Weight(g)</th>
            <th style={{ width: "90px" }}>Price</th>
            <th style={{ width: "130px" }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {ProductConfiguredItems.map((config, index) => {
            ConfiguredItemAttributes(config);
            return (
              <tr key={index}>
                <td className='align-middle'>
                  {getConfigAttributes(config.Configurators).Value ||
                    ConfiguredItemAttributes(config)[1]?.Value ||
                    ConfiguredItemAttributes(config)[0].Value ||
                    "N/A"}
                </td>

                <td className='align-middle'>{`${currency} ${getUpdatedProductPrice(
                  totalQtyInCart,
                  bulkPriceQuantity,
                  product,
                  rate,
                  config
                )}`}</td>

                {/* <td className='align-middle'>{`${currency} ${getProductPrice(product, rate, config)}`}</td> */}
                {Number(config.Quantity) <= 0 ? (
                  <td className='text-center align-middle pb-0'>Out of Stock</td>
                ) : (
                  <td className='text-center align-middle pb-0'>
                    <ManageQuantity
                      product={product}
                      ConfiguredItem={config}
                      ConfiguredItemAttributes={ConfiguredItemAttributes(config)}
                      totalQtyInCart={totalQtyInCart}
                      bulkPriceQuantity={bulkPriceQuantity}
                    />
                    <p className='maxQuantityText'>{config.Quantity}</p>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cartAttribute: state.CART.Attribute,
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, {})(withRouter(ProductConfiguredItems));
