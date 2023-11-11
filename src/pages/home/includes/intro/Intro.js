import React, { Fragment, useEffect, useState } from "react";
import BrowseCategories from "./includes/BrowseCategories";

import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { loadBanners } from "../../../../store/actions/InitAction";
import OwlCarousel from "react-owl-carousel";
import {
  getSetting,
  useWindowSize,
} from "../../../../utils/Helpers";
import BannerSkeleton from "../../../../skeleton/BannerSkeleton";
import { getDiscountProduct } from "../../../../utils/Services";
import _ from "lodash";
import LargeCardSkelton from "../../../../skeleton/productSkeleton/LargeCardSkelton";

import IntroBanner from "./includes/IntroBanner";
import LazyImage from "../../../../components/common/LazyImage";

import productImg from "../../../../assets/images/intro/products.3b9c544b.svg";
import airImg from "../../../../assets/images/intro/air.b1de7934.svg";
import deliverisImg from "../../../../assets/images/intro/deliveries.1b4d2e74.svg";
import chinaImg from "../../../../assets/images/intro/china.d3095eef.svg";
import paymentImg from "../../../../assets/images/intro/payments.48af1724.svg"



const introItems = [
  {
    _id: 1,
    img: productImg,
    desc: "২০ কোটি পণ্য&১০ লাখ সেলার",
  },
  {
    _id: 2,
    img: airImg,
    desc: "ট্যাক্স ও শিপিংচার্জ নাই",
  },
  {
    _id: 3,
    img: chinaImg,
    desc: "১২-২৪ দিন ডেলিভারি সময়",
  },
  {
    _id: 4,
    img: paymentImg,
    desc: "৬০% পেমেন্টে অর্ডার ",
  },
  {
    _id: 5,
    img: paymentImg,
    desc: "সিকিউর পেমেন্ট গেটওয়ে",
  },
  {
    _id: 6,
    img: deliverisImg,
    desc: "রিটার্ন এবং রিফান্ড এর সুযোগ",
  },
]

const Intro = (props) => {
  const { banners, general, auth } = props;
  // console.log(banners);
  const currency_icon = getSetting(general, "currency_icon");
  const [loading, setLoading] = useState(false);
  const [discountLoading, setDiscountLoading] = useState(true);
  const [products, setProducts] = useState([]);
  let [width] = useWindowSize();

  width = width ? width : window.innerWidth;

  useEffect(() => {
    if (!loading) {
      props.loadBanners();
    }
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  useEffect(() => {
    if (_.isEmpty(products)) {
      getDiscountProduct().then((response) => {
        if (!_.isEmpty(response)) {
          const products = response.SuperDealProducts;
          if (!_.isEmpty(products)) {
            setProducts(products);
          }
        }
        setDiscountLoading(false);
      });
    }
  }, []);

  // decide what is render for home page card
  let homePageContent = null;
  if (discountLoading) {
    homePageContent = <LargeCardSkelton />;
  }
  if (!discountLoading && products.length > 0) {
    homePageContent = (
      <OwlCarousel
        className="owl-carousel owl-theme owl-nav-inside row cols-3"
        loop={true}
        margin={10}
        dots={false}
        nav={false}
        autoplay={true}
        autoplayTimeout={1000}
        responsiveclassName={true}
        responsive={{
          0: {
            items: 1,
            loop: false,
          },
          600: {
            items: 4,
          },
          1000: {
            items: 4,
            loop: true,
          },
        }}
      >
        {products.map((product, index) => {
          const product_code = product.product_code
            ? product.product_code
            : product.ItemId;
          return (
            <div key={index}>
              <Link className="homeComp" to={`/product/${product_code}`}>
                <LazyImage classes="" imageSrc={product.img} imageAlt="" />
                {/* <img className='' src={product.img} alt='' /> */}
                <button className="homeLogin-btn">
                  {" "}
                  {`${currency_icon}`} {` `}
                  {_.round(product.discount_price)}
                </button>
                <h6 className="dOprice">
                  {`${currency_icon}`} {` `}
                  {_.round(product.original_price)}
                </h6>
              </Link>
            </div>
          );
        })}
      </OwlCarousel>
    );
  }

  return (
    // <div className="intro-section">
    //   <div className="container mt-0 mt-md-1">
    //     <div className="row">
    //       <div className="col-lg-2 cols d-none d-lg-block mb-1 pr-0">
    //         <BrowseCategories />
    //       </div>
    //       <div className="col-lg-10 cols col-md-12 col-12 mb-1 pr-0">
    //         <div className="h-100 intro-center">
    //           {width >= 768 ? (
    //             <div className="intro-slider-container br-8">
    //               {banners.banners && !loading ? (
    //                 <IntroBanner banners={banners.banners} width={width} />
    //               ) : (
    //                 <BannerSkeleton />
    //               )}
    //             </div>
    //           ) : (
    //             <div className="intro-slider-container br-8 h-75">
    //               {banners.mobileBanners && !loading ? (
    //                 <IntroBanner
    //                   banners={banners.mobileBanners}
    //                   width={width}
    //                 />
    //               ) : (
    //                 <BannerSkeleton />
    //               )}
    //               {/* {banners.banners && !loading ? (
    //                 <IntroBanner banners={banners.banners} width={width} />
    //               ) : (
    //                 <BannerSkeleton />
    //               )} */}
    //             </div>
    //           )}
    //           <div className="d-flex justify-content-between align-items-center bg-white py-3" >
    //             {
    //               introItems &&
    //               introItems?.map((item) => (
    //                 <div className="h-auto d-flex justify-content-center align-items-center flex-column gap-4" key={item?._id}>
    //                   <img src={item?.img} alt="" className="w-50" />
    //                   <p style={{ fontSize: '12px', fontWeight: 600, textAlign: 'center', overflowWrap: 'break-word' }} className="pt-2">
    //                     {item?.desc}
    //                   </p>
    //                 </div>
    //               ))
    //             }
    //           </div>
    //         </div>
    //       </div>

    //     </div>
    //   </div>
    // </div>
    <Fragment>
      <div className="container mt-1  px-2">
        <div className="row" style={{ height: '52vh'}}>
          <div style={{ overflowY: 'scroll', height:'50vh'}} className="col-lg-2 cols d-none d-lg-block d-md-block col-md-2 mb-1 pr-0">
            <BrowseCategories />
          </div>
          <div className="col-lg-10 cols col-12 col-md-10 h-md-100">
            <div className="">
              {width >= 768 ? (
                <div className="br-8 w-100">
                  {banners.banners && !loading ? (
                    <IntroBanner banners={banners.banners} width={width} />
                  ) : (
                    <BannerSkeleton />
                  )}
                </div>
              ) : (
                <div className="intro-slider-container br-8">
                  {banners.mobileBanners && !loading ? (
                    <IntroBanner
                      banners={banners.mobileBanners}
                      width={width}
                    />
                  ) : (
                    <BannerSkeleton />
                  )}
                  {/* {banners.banners && !loading ? (
                    <IntroBanner banners={banners.banners} width={width} />
                  ) : (
                    <BannerSkeleton />
                  )} */}
                </div>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center bg-white py-1" >
              {
                introItems &&
                introItems?.map((item) => (
                  <div className="h-auto d-flex justify-content-center align-items-center flex-column gap-4" key={item?._id}>
                    <img src={item?.img} alt="" className="w-50" />
                    <p style={{ fontSize: '12px', fontWeight: 600, textAlign: 'center', overflowWrap: 'break-word' }} className="pt-2">
                      {item?.desc}
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  banners: state.INIT.banners,
  auth: state.AUTH,
  categories: state.INIT.categories,
  category_loading: state.LOADING.category_loading,
});

export default connect(mapStateToProps, { loadBanners })(withRouter(Intro));
