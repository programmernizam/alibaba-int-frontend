import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import ProductCart from "../../pages/product/productList/ProductCart";
import Skeleton from "react-loading-skeleton";
import ProductCartSkeleton from "./ProductCartSkeleton";
import ProductSkeleton from "./ProductSkeleton";

const ProductListSkeleton = (props) => {
  return (
    <div>
      <div className="toolbox">
        <div className="toolbox-left">
          <div className="toolbox-info">
            <Skeleton height={15} width={100} />{" "}
            <span>
              <Skeleton height={16} width={100} />
            </span>{" "}
            <Skeleton height={15} width={100} />
          </div>
          {/* End .toolbox-info */}
        </div>
      </div>

      <div className="products mb-3">
        <div className="row justify-content-center">
          {[...Array(16)].map((x, index) => (
            <ProductCartSkeleton key={index} />
          ))}
        </div>
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className="page-item disabled">
            <Skeleton height={35} width={30} />
          </li>
          <li className="page-item active" aria-current="page">
            <Skeleton height={35} width={30} />
          </li>
          <li className="page-item">
            <Skeleton height={35} width={30} />
          </li>
          <li className="page-item">
            <Skeleton height={35} width={30} />
          </li>
          <li className="page-item">
            <Skeleton height={35} width={30} />
          </li>
        </ul>
      </nav>
    </div>
  );
};

ProductListSkeleton.propTypes = {};

export default ProductListSkeleton;
