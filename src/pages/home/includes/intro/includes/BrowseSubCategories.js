import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Link, withRouter } from "react-router-dom";
import MegaMenuItem from "./MegaMenuItem";

const BrowseSubCategories = (props) => {
  const { INIT } = props;
  const categories = !_.isEmpty(INIT) ? INIT.categories : [];

  if (_.isEmpty(categories)) {
    return <h3>loading...</h3>;
  }

  const mainCategories = categories.filter((category) => category.ParentId === null);

  return (
    <nav className='side-nav'>
      <div className='sidenav-title letter-spacing-normal font-size-normal d-flex justify-content-xl-between align-items-center bg-primary justify-content-center text-truncate'>
        Browse Categories
        <i className='icon-bars float-right h5 text-white m-0 d-none d-xl-block' />
      </div>
      <ul className='menu-vertical sf-arrows sf-js-enabled' style={{ touchAction: "pan-y" }}>
        {mainCategories.map((category) => {
          if (category.children_count || category.children1_count) {
            return <MegaMenuItem key={category.id} category={category} />;
          } else {
            return (
              <li key={category.id}>
                <Link to={`/${category.slug}`} className='text-dark'>
                  <i className='icon-blender' />
                  {category.name}
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  INIT: state.INIT,
});

export default connect(mapStateToProps, {})(withRouter(BrowseSubCategories));
