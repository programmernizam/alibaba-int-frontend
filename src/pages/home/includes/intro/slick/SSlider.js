import React from "react";
import Slider from "react-slick";
import "./slick.css";

const SSlider = ({ imageArr }) => {
  const settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 1000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    speed: 300,
    arrows: false,
    adaptiveHeight: true,
    appendDots: (dots) => <ul>{dots}</ul>,
    customPaging: (i) => (
      <div className='ft-slick__dots--custom'>
        <div className='loading' />
      </div>
    ),
  };
  return (
    <Slider {...settings}>
      {imageArr.map((img, index) => (
        <div className='sl-wrapper' key={index}>
          <img className='slImg' src={img} alt='' />
        </div>
      ))}
    </Slider>
  );
};

export default SSlider;
