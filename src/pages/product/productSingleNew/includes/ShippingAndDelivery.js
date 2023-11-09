import React, {useEffect, useState} from 'react';
import {getSinglePageBySlug} from "../../../../utils/Services";
import parser from "html-react-parser";
import _ from "lodash";

const ShippingAndDelivery = () => {
   const [page, setPage] = useState({});

   useEffect(() => {

      getSinglePageBySlug('shipping-and-delivery')
         .then(response => {
            const singles = !_.isEmpty(response) ? response.singles : {};
            if (!_.isEmpty(singles)) {
               setPage(singles)
            }
         });

   }, []);


   return (
      <div className="product-desc-content">
         {
            !_.isEmpty(page) &&
            <div className="post-content">
               {parser(page.post_content)}
            </div>
         }
      </div>
   );
};

export default ShippingAndDelivery;