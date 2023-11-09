import React from 'react';
import {cartColorAttributes, CartSizeAttributes, numberWithCommas} from "../../../utils/CartHelpers";
import {Link} from "react-router-dom";

const ConfigItem = (props) => {
   const {product, config, currency} = props;


   const unitTotalPrice = (Price, Qty) => {
      return numberWithCommas(Number(Price) * Number(Qty))
   };

   return (
      <tr>
         <td className="text-center" style={{width: "7rem"}}>
            {
               cartColorAttributes(config.Attributes, product).map((color, index4) =>
                  <figure key={index4} className="m-0">
                     <Link to={`/product/${product.Id}`}>
                        <img
                           src={color.MiniImageUrl}
                           alt={color.Value}
                        />
                     </Link>
                  </figure>
               )
            }
         </td>
         <td className="align-middle">
            <div className="product-title">
               <Link
                  to={`/product/${product.Id}`}
                  title={product.Title}>
                  {/*{characterLimiter(product.Title)}*/}
                  {product.Title}
               </Link>
            </div>
            <div className="Attributes">
               {
                  CartSizeAttributes(config.Attributes).map((size, index3) =>
                     <div key={index3 + 1} className="plain-attribute">
                        <b>{size.PropertyName} :</b>
                        <span>{` ${size.Value}`}</span>
                     </div>
                  )
               }
            </div>
            <div className="price">
               <b>Price :</b>
               <span>{` ${currency} ${numberWithCommas(config.Price)}`}</span>
            </div>
            <div className="price">
               <b>Quantity :</b>
               <span>{` ${config.Quantity}`}</span>
            </div>
         </td>
         <td
            className="align-middle text-center">{`${currency} ${unitTotalPrice(config.Price, config.Quantity)}`}</td>
      </tr>
   );
};

export default ConfigItem;