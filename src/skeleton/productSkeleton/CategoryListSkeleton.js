import React from 'react';
// import {SkeletonTheme} from "react-loading-skeleton";
import ProductSkeleton from "./ProductSkeleton";

const CategoryListSkeleton = () => {


   return (
      <>
         {[...Array(16)].map((x, i) =>
            <div className="col-md-4 col-6" key={i}>
               <ProductSkeleton/>
            </div>
         )}
      </>
   );
};

export default CategoryListSkeleton;