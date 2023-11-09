import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import {
  configAttrToConfigured,
  selectedActiveAttributes,
  selectedActiveConfiguredItems,
} from "../../../../../utils/GlobalStateControl";
import {
  activeProductAllConfigurators,
  checkExistConfiguredItem,
  colorAttributes,
  ConfiguratorAttributes,
  findProductCartFromState,
  getCartConfiguredItems,
  getCartSelectedConfig,
  getProductAttributes,
  getProductGroupedAttributes,
  getProductKeyItem,
  matchAttributesConfigurator,
} from "../../../../../utils/CartHelpers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const LoadAttributes = (props) => {
  const { product, ConfiguredItems, colorAttributes, cartAttribute, cartConfigured } = props;
  // console.log("sizeAttributes", colorAttributes);
  if (_.isEmpty(colorAttributes)) {
    return false;
  }

  const groupBy = getProductGroupedAttributes(colorAttributes);

  const groupItems = () => {
    let returnGroup = [];
    for (const property in groupBy) {
      returnGroup.push(property);
    }
    return returnGroup;
  };

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  const getGroupAllAttributes = (PropertyName) => {
    let Property = groupBy[PropertyName];
    Property = getUniqueListBy(Property, "Value");

    return !_.isEmpty(Property) && _.isArray(Property) ? Property : [];
  };

  const selectAttribute = (e, Attribute) => {
    e.preventDefault();
    selectedActiveAttributes(Attribute);
  };

  const isSelect = (Attribute) => {
    if (!_.isEmpty(cartAttribute)) {
      return cartAttribute.Pid === Attribute.Pid && cartAttribute.Vid === Attribute.Vid;
    }
    return false;
  };

  const setFirstAttributes = (index2, Attribute) => {
    if (index2 === 0) {
      if (_.isEmpty(cartAttribute)) {
        selectedActiveAttributes(Attribute);
      }
    }
  };

  const selectedColor = (PropertyName) => {
    const color = getGroupAllAttributes(PropertyName).find((Attribute) => isSelect(Attribute));
    return color;
  };

  const getIndividualColorQuantity = (Value) => {
    let individualColorQuantity = 0;
    let fullCart = [];
    if (cartConfigured.length > 0) {
      if (cartConfigured[0]) {
        if (cartConfigured[0].ConfiguredItems.length > 0) {
          fullCart = cartConfigured[0].ConfiguredItems.filter(
            (product) => product.Attributes[0].Value === Value
          );
        }
      }
    }

    if (fullCart.length > 0) {
      fullCart.map((item) => {
        individualColorQuantity += item.Quantity;
        return false;
      });
    }
    return individualColorQuantity;
  };

  return (
    <div>
      {groupItems().map((PropertyName, index) => (
        <div key={index} className='details-filter-row details-row-size'>
          <label style={{ fontWeight: "bold" }}>
            {PropertyName}:{selectedColor(PropertyName)?.Value || ""}
          </label>
          <div className='product-nav product-nav-thumbs'>
            {getGroupAllAttributes(PropertyName).map((Attribute, index2) => {
              return (
                <a
                  href={`/select`}
                  key={index2}
                  onClick={(e) => selectAttribute(e, Attribute)}
                  className={`subImages text-center ${isSelect(Attribute) ? "isSelect" : ""} ${
                    Attribute.MiniImageUrl ? "hasImage" : "noImage"
                  }`}
                  title={Attribute.Value && Attribute.Value}
                >
                  {setFirstAttributes(index2, Attribute)}
                  {Attribute.MiniImageUrl ? (
                    <img
                      src={Attribute.MiniImageUrl}
                      onClick={() => props.setActiveImg(Attribute.ImageUrl)}
                      alt={Attribute.Value}
                      style={{ width: "4rem" }}
                    />
                  ) : (
                    Attribute.Value
                  )}
                  {getIndividualColorQuantity(Attribute.Value) > 0 && (
                    <span className='count'>{getIndividualColorQuantity(Attribute.Value)}</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

LoadAttributes.propTypes = {
  product: PropTypes.object.isRequired,
  general: PropTypes.object.isRequired,
  ConfigAttributes: PropTypes.array.isRequired,
  ConfiguredItems: PropTypes.array.isRequired,
  cartAttribute: PropTypes.array.isRequired,
  cartConfigured: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  cartAttribute: state.CART.Attribute,
  cartConfigured: state.CART.virtualCart,
});

export default connect(mapStateToProps, {})(withRouter(LoadAttributes));
