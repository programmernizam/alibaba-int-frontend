import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import {
  activeProductAllConfigurators, matchAttributesConfigurator,
} from "../../../../../utils/CartHelpers";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {selectedActiveAttributes, selectedActiveConfiguredItems} from "../../../../../utils/GlobalStateControl";

const CustomerSelections = (props) => {
  const {cartConfigured, ConfiguredItems, match} = props;
  const params = !_.isEmpty(match) ? match.params : {};
  const product_id = !_.isEmpty(params) ? params.item_id : "";

  const activeConfig = activeProductAllConfigurators(cartConfigured, product_id);

  const getConfigAttrValue = (Attribute) => {
    let proceedData = '';
    for (const attKey in Attribute) {
      const Item = Attribute[attKey];
      proceedData += `${Item.Value}; `;
    }
    return proceedData;
  };

  const attributesReselect = (Attributes) => {
    selectedActiveAttributes(Attributes);
    const SelectConfiguredItems = matchAttributesConfigurator(Attributes, ConfiguredItems);
    selectedActiveConfiguredItems(SelectConfiguredItems);
  };

  return (
      <div>
        <div className="details-filter-row details-row-size">
          <div className="product-nav product-nav-thumbs">
            {
              activeConfig.map((Attr, index) =>
                  <button
                      key={index}
                      onClick={() => attributesReselect(Attr.Attributes)}
                      className="btn btn-outline mb-1 mr-2 rounded"
                  >
                    {getConfigAttrValue(Attr.Attributes)}
                  </button>
              )
            }
          </div>
        </div>
      </div>
  );
};

CustomerSelections.propTypes = {
  match: PropTypes.object.isRequired,
  ConfiguredItems: PropTypes.array.isRequired,
  cartConfigured: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  cartConfigured: state.CART.configured
});

export default connect(mapStateToProps, {})(
    withRouter(CustomerSelections)
);


