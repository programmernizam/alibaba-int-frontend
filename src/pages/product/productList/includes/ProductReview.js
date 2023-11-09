import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

const ProductReview = (props) => {
  const { FeaturedValues } = props;

  if (_.isArray(FeaturedValues) && !_.isEmpty(FeaturedValues)) {
    const reviews = FeaturedValues.find(
      (findItem) => findItem.Name === "reviews"
    );
    return (
      <div className="ratings-container">
        <div className="ratings">
          <div
            className="ratings-val"
            style={{ width: `${reviews ? reviews : 0}` }}
          />
        </div>
        {/* <span className="ratings-text">( 2 Reviews )</span> */}
      </div>
    );
  }

  return "";
};

ProductReview.propTypes = {
  FeaturedValues: PropTypes.array.isRequired,
};

export default ProductReview;
