import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { loadCatImg } from "../../../utils/Helpers";

const SubCategory = (props) => {
  const { parent, child } = props;

  return (
    <div key={child.id} className='col-6 col-md-4 col-lg-3'>
      <Link
        to={child.children_count > 0 ? `/${parent.slug}/${child.slug}` : `/shop/${child.slug}`}
        className='cat-block'
      >
        <figure>
          <span>
            <img src={loadCatImg(child)} alt={child.name} />
          </span>
        </figure>
        <h3 className='cat-block-title'>{child.name}</h3>
      </Link>
    </div>
  );
};

SubCategory.propTypes = {
  parent: PropTypes.object.isRequired,
  child: PropTypes.object.isRequired,
};

export default SubCategory;
