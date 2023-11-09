import React from 'react';
import Skeleton from "react-loading-skeleton";

const ProductDetailsSkeleton = () => {
   return (
      <main className="main">
         <nav aria-label="breadcrumb" className="breadcrumb-nav border-0 mb-0">
            <div className="container py-0 align-items-center">
               <Skeleton height={40} width="100%"/>
            </div>
         </nav>
         <div className="page-content">
            <div className="container">
               <div className="product-details-top">
                  <div className="row">
                     <div className="col-md-6">
                        <div className="product-gallery product-gallery-vertical">
                           <div className="row">
                              <figure className="product-main-image">
                                 <Skeleton variant="rect" height={450} style={{marginBottom: 6}}/>
                              </figure>
                              <div
                                 className="product-image-gallery"
                              >
                                 <div
                                    className="product-gallery-item"
                                 >
                                    <Skeleton variant="rect" height={100}/>
                                 </div>
                                 <div
                                    className="product-gallery-item"
                                 >
                                    <Skeleton variant="rect" height={100}/>
                                 </div>
                                 <div
                                    className="product-gallery-item"
                                 >
                                    <Skeleton variant="rect" height={100}/>
                                 </div>
                                 <div
                                    className="product-gallery-item"
                                 >
                                    <Skeleton variant="rect" height={100}/>
                                 </div>

                              </div>
                           </div>
                           {/* End .row */}
                        </div>
                        {/* End .product-gallery */}
                     </div>
                     {/* End .col-md-6 */}
                     <div className="col-md-6">
                        <div className="product-details">
                           <Skeleton height={20} width="90%" style={{marginBottom: 6}}/>
                           <Skeleton height={20} width="15%"/>

                           <div className="d-block">
                              <Skeleton height={20} count={1} width="40%" className="mb-1"/>
                              <br/>
                              <Skeleton height={20} count={2} width="60%" className="mb-1"/>
                              <Skeleton height={20} count={2} width="70%" className="mb-1"/>
                              <Skeleton height={20} count={2} width="80%" className="mb-1"/>
                              <Skeleton height={20} count={3} width="100%" className="mb-1"/>
                           </div>

                           <div className="product-details-action">
                              <Skeleton height={35} width={100} className="mr-3"/>
                              <Skeleton height={35} width={100} className="mr-3"/>
                              <Skeleton height={35} width={100} className="mr-3"/>
                              <Skeleton height={35} width={100}/>
                           </div>
                        </div>
                        {/* End .product-details */}
                     </div>
                     {/* End .col-md-6 */}
                  </div>
                  {/* End .row */}
               </div>
            </div>
            {/* End .container */}
         </div>
      </main>

   );
};


export default ProductDetailsSkeleton;