import React from 'react';
import Skeleton from "react-loading-skeleton";

const SectionSkeleton = () => {
   return (
      <div style={{marginBottom: 30}}>
         <Skeleton variant="rect" height={230} style={{marginBottom: 6}}/>
         <Skeleton height={15} width="50%"/>
         <Skeleton height={15} width="80%"/>
         <Skeleton height={15} width="80%"/>
         <Skeleton height={15} count={11}/>
      </div>
   );
};


export default SectionSkeleton;