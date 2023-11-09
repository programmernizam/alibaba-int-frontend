import React from 'react';
import {Link} from "react-router-dom";
import {numberWithCommas} from "../../../utils/CartHelpers";

const PlainItem = (props) => {
   const {product, currency} = props;


   const unitTotalPrice = (Price, Qty) => {
      return numberWithCommas(Number(Price) * Number(Qty))
   };

   return (
      <tr>
         <td className="text-center" style={{width: "7rem"}}>
            {
               <figure className="m-0">
                  <Link to={`/product/${product.Id}`}>
                     <img
                        src={product.MainPictureUrl}
                        alt={product.Title}
                     />
                  </Link>
               </figure>
            }
         </td>
         <td className="align-middle">
            <div className="product-title mb-0">
               <Link
                  to={`/product/${product.Id}`}
                  title={product.Title}>
                  {product.Title}
               </Link>
            </div>
            <div className="price">
               <b>Price :</b>
               <span>{` ${currency} ${numberWithCommas(product.Price)}`}</span>
            </div>
            <div className="price">
               <b>Quantity :</b>
               <span>{` ${product.Quantity}`}</span>
            </div>
         </td>
         <td
            className="align-middle text-center">{`${currency} ${unitTotalPrice(product.Price, product.Quantity)}`}</td>
      </tr>
   );
};

export default PlainItem;