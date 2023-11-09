import React from 'react';
import PropTypes from 'prop-types';

const ProductList = props => {
   const {TotalCount} = props;


   return (
      <div className="toolbox">
         <div className="toolbox-left">
            <div className="toolbox-info">
               Total found <span>{TotalCount()}</span> Products
            </div>
            {/* End .toolbox-info */}
         </div>
         {/* End .toolbox-left */}
         <div className="toolbox-right">
            <div className="toolbox-sort">
               <label htmlFor="sortby">Sort by:</label>
               <div className="select-custom">
                  <select
                     name="sortby"
                     id="sortby"
                     className="form-control"
                  >
                     <option value="popularity" selected="selected">
                        Most Popular
                     </option>
                     <option value="rating">Most Rated</option>
                     <option value="date">Date</option>
                  </select>
               </div>
            </div>
            {/* End .toolbox-sort */}
         </div>
         {/* End .toolbox-right */}
      </div>
   );
};

ProductList.propTypes = {

};

export default ProductList;