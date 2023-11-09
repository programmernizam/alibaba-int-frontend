import React from 'react';
import SectionSkeleton from "./SectionSkeleton";

const SectionSkeletonItems = () => {
   return (
      <>
         {[...Array(4)].map((x, i) =>
            <div className="col-md-3 col-2" key={i}>
               <SectionSkeleton/>
            </div>
         )}
      </>
   );
};


export default SectionSkeletonItems;