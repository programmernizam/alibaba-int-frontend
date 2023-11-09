import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import OwlCarousel from "react-owl-carousel";

const ImgGallery = (props) => {
   const {Pictures, activeImg, PreviewUrl, Url} = props;


   return (
      <OwlCarousel
         className="owl-carousel owl-simple carousel-equal-height "
         loop={false}
         margin={5}
         nav={true}
         dots={false}
         responsive={{
            0: {items: 5},
         }}
      >
         {
            PreviewUrl && Url &&
            <a
               className={activeImg === Url ? "active video_thumb" : " video_thumb"}
               href={"/view"}
               onClick={(e) => (e.preventDefault(), props.setActiveImg(Url))}
            >
               <img
                  src={PreviewUrl}
                  alt="product side"
               />
               <span className="videoPlayerIcon">
               <i className="icon-play"/>
            </span>
            </a>
         }
         {!_.isEmpty(Pictures) &&
         _.isArray(Pictures) &&
         Pictures.map((picture, key) => (
            <a
               key={key}
               className={activeImg === picture.Large.Url ? " active" : ""}
               href="/view"
               onClick={(e) => (e.preventDefault(), props.setActiveImg(picture.Large.Url))}
            >
               <img
                  src={picture.Medium.Url}
                  alt="product side"
               />
            </a>
         ))}

      </OwlCarousel>
   )


   return (


      <div id="product-zoom-gallery" className="product-image-gallery">
         {
            PreviewUrl && Url &&
            <a
               className={activeImg === Url ? "product-gallery-item active video_thumb" : "product-gallery-item video_thumb"}
               href={"/view"}
               onClick={(e) => (e.preventDefault(), props.setActiveImg(Url))}
            >
               <img
                  src={PreviewUrl}
                  alt="product side"
               />
               <span className="videoPlayerIcon">
               <i className="icon-play"/>
            </span>
            </a>
         }
         {!_.isEmpty(Pictures) &&
         _.isArray(Pictures) &&
         Pictures.map((picture, key) => (
            <a
               key={key}
               className={activeImg === picture.Large.Url ? "product-gallery-item active" : "product-gallery-item"}
               href="/view"
               onClick={(e) => (e.preventDefault(), props.setActiveImg(picture.Large.Url))}
            >
               <img
                  src={picture.Medium.Url}
                  alt="product side"
               />
            </a>
         ))}
      </div>
   );
};

ImgGallery.propTypes = {
   Pictures: PropTypes.array.isRequired,
};

export default ImgGallery;