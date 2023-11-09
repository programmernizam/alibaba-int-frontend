import React from "react";
import Skeleton from "react-loading-skeleton";

import "../skeleton.css";

const BrowseCategorySkeleton = (props) => {
  return (
    <nav className='side-nav'>
      {/* <div
            className="sidenav-title letter-spacing-normal font-size-normal d-flex justify-content-xl-between align-items-center bg-primary justify-content-center text-truncate">
          Browse Categories
          <i className="icon-bars float-right h5 text-white m-0 d-none d-xl-block"/>
        </div> */}
      <ul className='menu-vertical text-center'>
        <Skeleton height={30} count={13} width={`100%`} className='px-2 mx-auto' />
      </ul>
    </nav>
  );
};

export default BrowseCategorySkeleton;
