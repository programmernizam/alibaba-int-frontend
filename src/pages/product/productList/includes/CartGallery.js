import React from 'react';
import _ from "lodash";
import PropTypes from 'prop-types';

const CartGallery = props => {
   const {Pictures} = props;


   if (!_.isEmpty(Pictures) && _.isArray(Pictures)) {
      return (
         <div className="product-nav product-nav-thumbs">
            {
               Pictures.length > 0 &&
               Pictures.map(picture =>
                  <a href="/color" onClick={(e => e.preventDefault())}>
                     <img
                        src={picture.Small.Url}
                        style={{width: "2rem"}}
                        alt="Small Images"
                     />
                  </a>
               )
            }
         </div>
      );
   }

   return '';
};

CartGallery.propTypes = {
   Pictures: PropTypes.array.isRequired
};

export default CartGallery;