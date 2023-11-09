import React from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import {NavLink} from "react-router-dom";

const ParentCategories = props => {
  const {parent, siblings} = props;


  if(_.isEmpty(parent)){
    return (
        <h2>loading...</h2>
    )
  }

  return (
      <aside className="col-lg-3 order-lg-first">
        <div className="sidebar sidebar-shop">
          <div className="widget widget-categories">
            <h3 className="widget-title">{parent.name}</h3>
            <hr className="mb-1 mt-0"/>
            <div className="widget-body">
              <ul className="custom_widget_list">
                {
                  !_.isEmpty(siblings) &&
                  siblings.map((category, key) =>
                      <li key={category.id}>
                        <NavLink to={`/shop/${category.slug}`}>{category.name}</NavLink>
                      </li>
                  )
                }
              </ul>

            </div>
            {/* End .widget-body */}
          </div>
        </div>
        {/* End .sidebar sidebar-shop */}
      </aside>
  );
};

ParentCategories.propTypes = {
  parent: PropTypes.object.isRequired,
  siblings: PropTypes.array.isRequired
};

export default ParentCategories;