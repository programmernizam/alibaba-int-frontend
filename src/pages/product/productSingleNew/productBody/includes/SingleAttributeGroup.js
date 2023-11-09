import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import {configAttrToConfigured, selectedActiveAttributes, selectedActiveConfiguredItems} from "../../../../../utils/GlobalStateControl";
import {
   activeProductAllConfigurators,
   ConfiguratorAttributes,
   getCartConfiguredItems, getCartSelectedConfig, getProductAttributes,
   getProductGroupedAttributes, getProductKeyItem,
   matchAttributesConfigurator
} from "../../../../../utils/CartHelpers";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const SingleAttributeGroup = (props) => {
   const {product, ConfiguredItems, singleConfig, ConfigAttributes, cartConfigured} = props;

   const presentAttributes = ConfigAttributes.filter(filter => filter.Pid === singleConfig.Pid);

   const groupBy = getProductGroupedAttributes(presentAttributes);
   const groupItems = () => {
      let returnGroup = [];

      for (const property in groupBy) {
         returnGroup.push(property);
      }
      return returnGroup;
   };


   const getGroupAllAttributes = (PropertyName) => {
      const Property = groupBy[PropertyName];
      return !_.isEmpty(Property) && _.isArray(Property) ? Property : [];
   };

   const selectAttribute = (e, Attribute) => {
      e.preventDefault();
      selectedActiveAttributes(Attribute);
   };


   return (
      <div>
         {
            groupItems().map((PropertyName, index) =>
               <div key={index} className="details-filter-row details-row-size">
                  <label>{PropertyName}</label>
                  <div className="product-nav product-nav-thumbs">
                     {
                        getGroupAllAttributes(PropertyName).map((Attribute, index2) =>
                           <a
                              href={`/select`}
                              key={index2}
                              onClick={e => selectAttribute(e, Attribute)}
                              className={`text-center`}
                              title={Attribute.Value && Attribute.Value}
                           >
                              {Attribute.MiniImageUrl ?
                                 <img src={Attribute.MiniImageUrl} onClick={() => props.setActiveImg(Attribute.ImageUrl)}
                                      alt={Attribute.Value}
                                      style={{width: "3.5rem"}}/>
                                 : Attribute.Value
                              }
                           </a>
                        )
                     }
                  </div>
               </div>
            )
         }
      </div>
   );
};

SingleAttributeGroup.propTypes = {
   product: PropTypes.object.isRequired,
   general: PropTypes.object.isRequired,
   ConfigAttributes: PropTypes.array.isRequired,
   ConfiguredItems: PropTypes.array.isRequired,
   cartAttribute: PropTypes.array.isRequired,
   cartConfigured: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
   cartAttribute: state.CART.Attribute,
   cartConfigured: state.CART.configured
});

export default connect(mapStateToProps, {})(
   withRouter(SingleAttributeGroup)
);


