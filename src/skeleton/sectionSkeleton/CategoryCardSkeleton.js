import React from 'react';
import OwlCarousel from "react-owl-carousel";
import _ from "lodash";
import {Link} from "react-router-dom";
import {loadCatImg} from "../../utils/Helpers";
import Skeleton from "react-loading-skeleton";
import ProductSkeleton from "../productSkeleton/ProductSkeleton";

const CategoryCardSkeleton = () => {
  return (
      <div className="container banner-group-1">
        <div className="categories mb-3">
          <h3 className="title text-center font-weight-bold mt-4">
            Explore Popular Categories
          </h3>
          <div
              className="carousel-simple carousel-with-shadow row cols-2 cols-xs-3 cols-sm-4 cols-md-5 cols-lg-6 cols-xl-8"
          >
            {[...Array(8)].map((x, i) =>
                <div key={i} className="category position-relative  mx-2">
                  <div className="category-image">
                    <Skeleton variant="rect" height={160} className="w-100 p-5"/>
                  </div>
                </div>
            )}


          </div>
        </div>
      </div>
  );
};

export default CategoryCardSkeleton;