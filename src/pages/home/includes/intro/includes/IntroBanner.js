import React from "react";
import OwlCarousel from "react-owl-carousel";
import BannerItem from "./BannerItem";
const IntroBanner = ({ banners, width }) => {
  return (
    <OwlCarousel
      className='intro-slider owl-carousel owl-theme owl-nav-inside row cols-1'
      loop={false}
      margin={0}
      dots={false}
      nav={false}
      autoplay={true}
      autoplayTimeout={10000}
      responsive={{
        0: { items: 1 },
        480: { items: 1 },
        576: { items: 1 },
        768: { items: 1 },
        992: { items: 1 },
        1200: { items: 1 },
      }}
    >
      {banners.map((banner, index) => (
        <BannerItem banner={banner} key={index} />
      ))}
    </OwlCarousel>
  );
};

export default IntroBanner;
