import React from 'react'

const BrandProduct = () => {
   return (
      <div className="bg-white brand-section pt-5 pb-4">
         <div className="container">
            <div
               className="owl-carousel owl-simple brands-carousel row cols-2 cols-xs-3 cols-sm-4 cols-lg-5 cols-xxl-6"
               data-toggle="owl"
               data-owl-options='{
                      "nav": false, 
                      "dots": false,
                      "margin":  0,
                      "loop": false,
                      "responsive": {
                          "0": {
                              "items":2
                          },
                          "480": {
                              "items":3
                          },
                          "576": {
                              "items":4
                          },
                          "992": {
                              "items":5
                          },
                          "1600": {
                              "items":6
                          }
                      }
                  }'
            >
               <a href="#!" onClick={e => e.preventDefault()} className="brand">
                  <img
                     src="assets/images/brands/1.png"
                     alt="Brand Name"
                     width={85}
                     height={35}
                  />
               </a>
               <a href="#!" onClick={e => e.preventDefault()} className="brand">
                  <img
                     src="assets/images/brands/2.png"
                     alt="Brand Name"
                     width={85}
                     height={35}
                  />
               </a>
               <a href="#!" onClick={e => e.preventDefault()} className="brand">
                  <img
                     src="assets/images/brands/3.png"
                     alt="Brand Name"
                     width={85}
                     height={35}
                  />
               </a>
               <a href="#!" onClick={e => e.preventDefault()} className="brand">
                  <img
                     src="assets/images/brands/4.png"
                     alt="Brand Name"
                     width={85}
                     height={35}
                  />
               </a>
               <a href="#!" onClick={e => e.preventDefault()} className="brand">
                  <img
                     src="assets/images/brands/5.png"
                     alt="Brand Name"
                     width={85}
                     height={35}
                  />
               </a>
               <a href="#!" onClick={e => e.preventDefault()} className="brand">
                  <img
                     src="assets/images/brands/6.png"
                     alt="Brand Name"
                     width={85}
                     height={35}
                  />
               </a>
               <a href="#!" onClick={e => e.preventDefault()} className="brand">
                  <img
                     src="assets/images/brands/7.png"
                     alt="Brand Name"
                     width={85}
                     height={35}
                  />
               </a>
            </div>
            {/* End .owl-carousel */}
            <hr className="mt-5 mb-0"/>
         </div>
      </div>

   )
}

export default BrandProduct
