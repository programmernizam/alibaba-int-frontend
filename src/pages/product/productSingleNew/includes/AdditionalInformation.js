import React from 'react';
import {getProductAttributes, getProductGroupedAttributes} from "../../../../utils/CartHelpers";
import _ from "lodash";

const AdditionalInformation = (props) => {
   const {product} = props;
   const Attributes = getProductAttributes(product);
   const groupBy = getProductGroupedAttributes(Attributes);

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


   return (
      <div className="product-desc-content">
         <h3>Information</h3>
         <p>{product.Title}</p>
         <div>
            {
               groupItems().map((PropertyName, index) =>
                  <div className="row" key={index}>
                     <div className="col-md-2"><b>{PropertyName}</b></div>
                     <div className="col-md-10">
                        {
                           getGroupAllAttributes(PropertyName).map((Atribute, index2) =>
                              <span className="mr-2" key={index2}>{Atribute.Value && Atribute.Value};</span>
                           )
                        }
                     </div>
                     <div className="col-md-12">
                        <hr/>
                     </div>
                  </div>
               )
            }
         </div>
      </div>
   );
};

export default AdditionalInformation;