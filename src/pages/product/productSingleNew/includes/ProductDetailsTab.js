import React from 'react'
import AdditionalInformation from "./AdditionalInformation";
import ShippingAndDelivery from "./ShippingAndDelivery";
import ProductDescription from "./ProductDescription";
import ProductSellerInfo from "./ProductSellerInfo";

const ProductDetailsTab = (props) => {
   const {product} = props;

   return (
      <div className="product-details-tab">
         <ul className="nav nav-pills justify-content-center" role="tablist">
            <li className="nav-item">
               <a
                  className="nav-link active"
                  id="product-shipping-link"
                  data-toggle="tab"
                  href="#product-shipping-tab"
                  role="tab"
                  aria-controls="product-shipping-tab"
                  aria-selected="false"
               >
                  Shipping &amp; Delivery
               </a>
            </li>
            <li className="nav-item">
               <a
                  className="nav-link"
                  id="product-info-link"
                  data-toggle="tab"
                  href="#product-info-tab"
                  role="tab"
                  aria-controls="product-info-tab"
                  aria-selected="true"
               >
                  Additional information
               </a>
            </li>
            <li className="nav-item">
               <a
                  className="nav-link"
                  id="product-desc-link"
                  data-toggle="tab"
                  href="#seller-info-tab"
                  role="tab"
                  aria-controls="seller-info-tab"
                  aria-selected="false"
               >
                  Seller Info
               </a>
            </li>
            <li className="nav-item">
               <a
                  className="nav-link"
                  id="product-desc-link"
                  data-toggle="tab"
                  href="#product-desc-tab"
                  role="tab"
                  aria-controls="product-desc-tab"
                  aria-selected="false"
               >
                  Description
               </a>
            </li>
         </ul>
         <div className="tab-content">
            <div
               className="tab-pane fade show active"
               id="product-shipping-tab"
               role="tabpanel"
               aria-labelledby="product-shipping-link"
            >
               <ShippingAndDelivery/>
            </div>

            <div
               className="tab-pane fade"
               id="product-info-tab"
               role="tabpanel"
               aria-labelledby="product-info-link"
            >
               <AdditionalInformation product={product}/>
            </div>

            <div
               className="tab-pane fade"
               id="seller-info-tab"
               role="tabpanel"
               aria-labelledby="seller-info-link"
            >
               <ProductSellerInfo product={product}/>
            </div>

            <div
               className="tab-pane fade"
               id="product-desc-tab"
               role="tabpanel"
               aria-labelledby="product-desc-link"
            >
               <ProductDescription product={product}/>
            </div>

         </div>
         {/* End .tab-content */}
      </div>
   )
}

export default ProductDetailsTab
