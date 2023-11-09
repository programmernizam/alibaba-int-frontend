import React from "react";
import { useWindowSize } from "../../../../../../utils/Helpers";

import ProductCart from "../../../../../product/productList/ProductCart";

const RecentItems = (props) => {
  let { products } = props;
  let [width, height] = useWindowSize();
  width = width ? width : window.innerWidth;

  if (width < 768) products = products.slice(0, 8);

  return (
    <div className='row gap'>
      {products.map((product, index) => {
        return (
          <ProductCart key={index} productclassName={`col-6 col-md-4 col-lg-2 gap-item`} product={product} />
        );
      })}
    </div>
  );
};

RecentItems.propTypes = {};

export default RecentItems;
