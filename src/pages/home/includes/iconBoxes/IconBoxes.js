import React from "react";
import OwlCarousel from "react-owl-carousel";

const IconBoxes = () => {
  return (
      <div className="container icon-boxes-section">
        <div className="icon-boxes-container py-4 bg-lighter mb-2 mt-2">

          <OwlCarousel
              className="owl-carousel carousel-simple owl-theme carousel-equal-height shadow-carousel row cols-1 cols-md-2 cols-lg-3 cols-xl-4"
              loop={false}
              margin={13}
              dots={true}
              nav={false}
              responsive={{
                0: {items: 1},
                575: {items: 2},
                992: {items: 3},
                1200: {items: 4},
              }}
          >
            <div className="icon-box mb-0 d-md-flex align-items-md-center text-center text-md-left mx-md-0 mx-auto">
            <span className="icon-box-icon mb-0">
              <i className="icon-truck py-2 pt-0 second-primary-color"/>
            </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title mb-0">
                  Payment &amp; Delivery
                </h3>
                <p className="font-weight-light second-primary-color">
                  Free shipping for orders over ৳500
                </p>
              </div>
            </div>
            <div className="icon-box mb-0 d-md-flex align-items-md-center text-center text-md-left mx-md-0 mx-auto">
            <span className="icon-box-icon text-dark mb-0">
              <i className="icon-rotate-left py-2 pt-0 second-primary-color"/>
            </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title mb-0">
                  Return &amp; Refund
                </h3>
                <p className="font-weight-light second-primary-color">
                  Free 100% money back guarantee
                </p>
              </div>
            </div>
            <div className="icon-box mb-0 d-md-flex align-items-md-center text-center text-md-left mx-md-0 mx-auto">
            <span className="icon-box-icon text-dark mb-0">
              <i className="icon-life-ring py-2 pt-0 second-primary-color"/>
            </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title mb-0">
                  Quality Support
                </h3>
                <p className="font-weight-light second-primary-color">
                  Always online feedback 24/7
                </p>
              </div>
            </div>
            <div className="icon-box mb-0 d-md-flex align-items-md-center text-center text-md-left mx-md-0 mx-auto">
            <span className="icon-box-icon text-dark mb-0">
              <i className="icon-envelope py-2 pt-0 second-primary-color"/>
            </span>
              <div className="icon-box-content">
                <h3 className="icon-box-title mb-0">
                  Join Our Newsletter
                </h3>
                <p className="font-weight-light second-primary-color">
                  10% off by subscribing to our newsletter
                </p>
              </div>
            </div>

          </OwlCarousel>

        </div>
        <hr className="mt-2 mb-0"/>
      </div>
  );
};

export default IconBoxes;
