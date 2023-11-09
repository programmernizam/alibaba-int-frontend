import React from 'react';
import {Link} from "react-router-dom";
import _ from 'lodash';
import PropTypes from 'prop-types';

const WishlistPage = (props) => {
   const {wishlist} = props;
   const currency = "৳";

   return (
      <div className="card mb-3">
         <div className="card-header p-4">
            <h2 className="card-title">Wishlist</h2>
         </div>
         <div className="card-body">
            <table className="table table-wishlist table-mobile">
               <thead>
               <tr>
                  <th colSpan={2}>Product</th>
                  <th>Price</th>
                  <th>Remove</th>
               </tr>
               </thead>
               <tbody>
               {
                  _.isArray(wishlist) ?
                     wishlist.map((wishlist, index) =>
                        <tr key={index}>
                           <td style={{width: '15%'}}>
                              <Link to={`/product/${wishlist.ItemId}`}>
                                 <img
                                    className="w-100"
                                    src={wishlist.img}
                                    alt="Product image"
                                 />
                              </Link>
                           </td>
                           <td className="product-col">
                              <Link to={`/product/${wishlist.ItemId}`}>
                                 {wishlist.name}
                              </Link>
                           </td>
                           <td className="text-center">{`${currency + wishlist.sale_price}`}</td>
                           <td className="text-center">
                              <button type="button"
                                      onClick={() => props.removeFromWishlist(wishlist.ItemId)}
                                      className="btn-remove">
                                 <i className="icon-close"/>
                              </button>
                           </td>
                        </tr>
                     )
                     :
                     <tr>
                        <td colSpan={4} className="text-center">No wishlist</td>
                     </tr>
               }
               </tbody>
            </table>
         </div>
      </div>
   )
};

WishlistPage.propTypes = {
   wishlist: PropTypes.array.isRequired,
   removeFromWishlist: PropTypes.func.isRequired,
};


export default WishlistPage
