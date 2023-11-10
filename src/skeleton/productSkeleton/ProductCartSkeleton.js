import React from "react";
import Skeleton from "react-loading-skeleton";

const ProductCartSkeleton = (props) => {
  return (
    <div className="col-6 col-md-4 col-lg-4 col-xl-3" >
      <div className="product product-7 mb-10x object-cover">
        <figure
          className="product-media"
          style={{ backgroundColor: "#eeeeee" }}
        >
          <Skeleton variant="rect" height={190} />
        </figure>
        {/* End .product-media */}
        <div className="p-3 product-body text-left">
          <Skeleton height={18} width="60%" className="product-title" />
          <Skeleton height={18} count={2} width="70%" />
          <Skeleton height={18} width="90%" />
        </div>
        {/* End .product-body */}
      </div>
    </div>
  );
};

export default ProductCartSkeleton;
