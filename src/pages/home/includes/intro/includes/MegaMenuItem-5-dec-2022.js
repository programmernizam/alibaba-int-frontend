import React, { useState } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import {
  filter_children_cats,
  goPageTop,
  loadAsset,
} from "../../../../../utils/Helpers";

const MegaMenuItem = (props) => {
  const [showCatLimit, setShowCatLimit] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const { parent, categories } = props;
  const [childOtcId, setChildOtcId] = useState("");

  const children_cats = filter_children_cats(categories, parent.otc_id);
  const handleMouseOver = (otc_id) => {
    setChildOtcId(otc_id);
  };

  let currSubs = filter_children_cats(categories, childOtcId);

  const handleShowLoad = () => {
    setShowLoad(false);
    setShowCatLimit(true);
  };
  const handleLessLoad = () => {
    goPageTop();
    setShowLoad(true);
    setShowCatLimit(false);
  };

  return (
    <div>
      <li className="megamenu-container">
        {/* <Link className="sf-with-ul text-dark" to={`/${parent.slug}`}>
            {
               parent.icon ?
                  <img src={loadAsset(parent.icon)}
                       style={{width: "22px", display: "inline", marginRight: "1rem"}}
                       alt={parent.name}/>
                  :
                  <i className="icon-laptop"/>
            }
            {parent.name}
         </Link> */}

        {children_cats.length > 0 &&
          !showCatLimit &&
          children_cats.slice(0, 20).map((child, index) => {
            const { otc_id } = child;

            return (
              <Link
                to={
                  child.children_count
                    ? `/${parent.slug}/${child.slug}`
                    : `/shop/${child.slug}`
                }
                className="sf-with-ul text-dark"
                key={index}
                onMouseOver={() => handleMouseOver(otc_id)}
              >
                <div className="d-flex align-items-center">
                  <div>
                    {child.icon ? (
                      <img
                        src={loadAsset(child.icon)}
                        style={{ width: "22px", display: "inline" }}
                        alt={child.name}
                        width={"22"}
                        height={"22"}
                      />
                    ) : (
                      <i className="icon-laptop" />
                    )}
                  </div>
                  <div>{child.name}</div>
                </div>
              </Link>
            );
          })}
        {children_cats.length > 0 &&
          showCatLimit &&
          children_cats.map((child, index) => {
            const { otc_id } = child;

            return (
              <Link
                to={
                  child.children_count
                    ? `/${parent.slug}/${child.slug}`
                    : `/shop/${child.slug}`
                }
                className="sf-with-ul text-dark"
                key={index}
                onMouseOver={() => handleMouseOver(otc_id)}
              >
                <div className="d-flex align-items-center">
                  <div>
                    {child.icon ? (
                      <img
                        src={loadAsset(child.icon)}
                        style={{ width: "22px", display: "inline" }}
                        alt={child.name}
                      />
                    ) : (
                      <i className="icon-laptop" />
                    )}
                  </div>
                  <div>{child.name}</div>
                </div>
              </Link>
            );
          })}

        <div className="megamenu">
          <div className="row ">
            <div className="col-md-12">
              <div className="menu-col">
                <div className="row">
                  <ul>
                    {currSubs.length > 0 &&
                      currSubs.map((subChild, index) => (
                        <li key={index}>
                          <Link to={`/shop/${subChild.slug}`}>
                            {subChild.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      {showLoad && (
        <div className="pr-4 py-2" style={{ textAlign: "end" }}>
          <button
            className="btn btn-default cat-see"
            onClick={() => handleShowLoad()}
          >
            See All
          </button>
        </div>
      )}
      {!showLoad && (
        <div className="pr-4 py-2" style={{ textAlign: "end" }}>
          <button
            className="btn btn-default cat-see "
            onClick={() => handleLessLoad()}
          >
            See Less
          </button>
        </div>
      )}
    </div>
  );
};

export default MegaMenuItem;
