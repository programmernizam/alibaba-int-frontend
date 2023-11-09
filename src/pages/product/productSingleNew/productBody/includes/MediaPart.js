import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import ImgGallery from "./ImgGallery";
import ReactPlayer from "react-player";
import { SideBySideMagnifier, MOUSE_ACTIVATION, TOUCH_ACTIVATION, Magnifier } from "react-image-magnifiers";

const MediaPart = (props) => {
  const { product, activeImg } = props;
  let Videos = product.Videos;
  Videos = _.isArray(Videos) ? Videos[0] : {};
  const PreviewUrl = !_.isEmpty(Videos) ? Videos.PreviewUrl : "";
  const Url = !_.isEmpty(Videos) ? Videos.Url : "";

  return (
    <div className='product-gallery product-gallery-vertical'>
      <div className='row'>
        <figure className='product-main-image'>
          {activeImg === Url && Url ? (
            <ReactPlayer
              muted={true}
              playing={true}
              controls={true}
              loop={true}
              width='100%'
              height='auto'
              url={Url}
            />
          ) : (
            <Magnifier
              imageSrc={activeImg ? activeImg : product.MainPictureUrl}
              imageAlt={product.Title}
              onImageLoad={true}
              mouseActivation={MOUSE_ACTIVATION.click} // Optional
              touchActivation={TOUCH_ACTIVATION.TAP} // Optional
              fillAvailableSpace={false} // if false fillGapLeft not working
            />
          )}
        </figure>

        <ImgGallery
          PreviewUrl={PreviewUrl}
          Url={Url}
          setActiveImg={props.setActiveImg}
          activeImg={activeImg}
          Pictures={product.Pictures}
        />
      </div>
    </div>
  );
};

MediaPart.propTypes = {
  product: PropTypes.object.isRequired,
};

export default MediaPart;
