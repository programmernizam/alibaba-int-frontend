import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { getSetting } from "../../../../../utils/Helpers";

const DealsProduct = (props) => {
  const { product, general, productClass } = props;
  const currency_icon = getSetting(general, "currency_icon");
  const product_code = product.product_code ? product.product_code : product.ItemId;
  return (
    <div className={productClass ? productClass : "col-6 col-sm-4 col-lg-4 col-xl-3"}>
      <div className=' product product-7 mb-10x hov-shadow br-1'>
        <Link to={`/product/${product_code}`}>
          <img src={product.img} className='product-image object-contain' alt={product.name} />

          <div className='px-2'>
            <div className=''>
              <span className='dealsPrice'>
                {`${currency_icon}`} {` `}
                {_.round(product.discount_price)}
              </span>
              <span className='dealsBtn'>{product.discount_percentage} %</span>
            </div>
            <p className='sold_item_text dealsSold '>{product.total_sold} Orders</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DealsProduct;
