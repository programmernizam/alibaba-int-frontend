import React from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Link, withRouter } from "react-router-dom";
import MegaMenuItem from "./MegaMenuItem";
import BrowseCategorySkeleton from "../../../../../skeleton/sectionSkeleton/BrowseCategorySkeleton";
import { filter_parent_cats, loadAsset } from "../../../../../utils/Helpers";

const BrowseCategories = (props) => {
  const { categories, category_loading } = props;
  const parents = filter_parent_cats(categories);

  if (categories.length < 1) {
    return <BrowseCategorySkeleton />;
  }

  return (
    <nav className='side-nav h-100 bg-white'>
      <div className='sidenav-title letter-spacing-normal font-size-normal d-flex bg-white align-items-center text-dark text-truncate px-3'>
        <i className='icon-bars float-right h5 text-dark m-0 mr-3 d-none d-xl-block' />
        Categorie
      </div>
      <ul className='menu-vertical sf-arrows sf-js-enabled p-0 shadow-0' style={{ touchAction: "pan-y" }}>
        {parents.length > 0 &&
          parents.map((parent, index) => {
            if (parent.children_count) {
              return <MegaMenuItem key={index} parent={parent} categories={categories} />;
            } else {
              return (
                <li key={index}>
                  <Link to={`/shop/${parent.slug}`} className='text-dark'>
                    {parent.icon ? (
                      <img
                        src={loadAsset(parent.icon)}
                        style={{ width: "22px", display: "inline", marginRight: "1rem" }}
                        alt={parent.name}
                      />
                    ) : (
                      <i className='icon-laptop' />
                    )}
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
  categories: state.INIT.categories,
  category_loading: state.LOADING.category_loading,
});

export default connect(mapStateToProps, {})(withRouter(BrowseCategories));
