import React from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import placeholder from "../../assets/images/nimg.png";

const LazyImage = ({ classes, imageSrc, imageAlt }) => {
  return (
    <LazyLoadImage
      src={imageSrc}
      className={classes}
      alt={imageAlt}
      effect='blur'
      placeholderSrc={placeholder}
    />
  );
};

export default LazyImage;
