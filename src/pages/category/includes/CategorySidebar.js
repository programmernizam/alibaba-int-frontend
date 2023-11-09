import React from 'react';
// import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import _ from "lodash";

const CategorySidebar = props => {
  const {categories} = props;
  const mainCategories = categories.filter(filterCategory => filterCategory.ParentId === null);

  return (
      <div className="sidebar sidebar-shop">
        <div className="widget widget-categories">
          <h3 className="widget-title">Categories</h3>
          <hr className="mb-1 mt-0"/>
          <div className="widget-body">
            <ul className="custom_widget_list">
              {
                !_.isEmpty(mainCategories) &&
                mainCategories.map((category, key) =>
                    <li key={category.id}>
                      <NavLink to={category.children_count ? `/${category.slug}` : `/shop/${category.slug}`} >{category.name}</NavLink>
                    </li>
                )
              }
            </ul>

          </div>
          {/* End .widget-body */}
        </div>
      </div>
  );
};

CategorySidebar.propTypes = {};

const mapStateToProps = (state) => ({
  categories: state.INIT.categories,
});

export default connect(mapStateToProps, {})(
    withRouter(CategorySidebar)
);
