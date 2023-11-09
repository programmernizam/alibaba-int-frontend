import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { filter_children_cats, loadAsset } from "../../../../../utils/Helpers";

export const SubChildrenItem = (props) => {
  const { categories, children } = props;

  const subChildren = filter_children_cats(categories, children.otc_id);

  if (!_.isEmpty(subChildren) && _.isArray(subChildren)) {
    return (
      <ul className="subChildCat">
        {subChildren.map((subChild, index) => (
          <li key={index}>
            <Link className="subChildItem" to={`/shop/${subChild.slug}`}>
              {subChild.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return "";
};

const MegaMenuItem = (props) => {
  const { parent, categories } = props;

  const children_cats = filter_children_cats(categories, parent.otc_id);

  return (
    <li className="megamenu-container">
      <Link
        className="sf-with-ul text-dark border-0 px-3 py-2 icon-none"
        to={`/${parent.slug}`}
      >
        {parent.icon ? (
          <img
            src={loadAsset(parent.icon)}
            style={{ width: "20px", display: "inline", marginRight: "1rem" }}
            alt={parent.name}
            width={"25"}
            height={"25"}
          />
        ) : (
          <i className="icon-laptop" />
        )}
        {parent.name}
      </Link>
      <div className="megamenu">
        <div className="row ">
          <div className="col-md-12">
            <div className="menu-col">
              <div className="row">
                {children_cats.length > 0 &&
                  children_cats.map((child, index) => (
                    <div className="col-md-4" key={index}>
                      <Link
                        to={
                          child.children_count
                            ? `/${parent.slug}/${child.slug}`
                            : `/shop/${child.slug}`
                        }
                        className="menu-title"
                      >
                        {child.name}
                      </Link>
                      <SubChildrenItem
                        categories={categories}
                        children={child}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* End .col-md-12 */}
        </div>
      </div>
    </li>
  );
};

export default MegaMenuItem;
