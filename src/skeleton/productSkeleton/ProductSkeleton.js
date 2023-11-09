import React from 'react';
import Skeleton from "react-loading-skeleton";

const ProductSkeleton = () => {
   return (
      <div style={{marginBottom: 30}}>
         <Skeleton variant="rect" height={230} style={{marginBottom: 6}}/>
         <Skeleton height={10}  width="50%"/>
         <Skeleton height={10}  width="80%"/>
         <Skeleton height={10} count={2}/>
      </div>
   );
};

export default ProductSkeleton;