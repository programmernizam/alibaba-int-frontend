import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadSinglePage } from "../../store/actions/PageAction";
import { Link, withRouter } from "react-router-dom";
import _ from "lodash";
import CategorySidebar from "./includes/CategorySidebar";
import { filter_children_cats, find_cat_by_slug, goPageTop } from "../../utils/Helpers";
import SubCategory from "./includes/SubCategory";
import Breadcrumb from "../breadcrumb/Breadcrumb";

const LoadCategory = (props) => {
  const { categories, match } = props;
  const params = !_.isEmpty(match) ? match.params : {};
  const category_slug = !_.isEmpty(params) ? params.category_slug : "";
  const sub_slug = !_.isEmpty(params) ? params.sub_slug : "";

  useEffect(() => {
    goPageTop();
  });

  const category = find_cat_by_slug(categories, category_slug);
  const subCategory = find_cat_by_slug(categories, sub_slug);

  const children = filter_children_cats(categories, category.otc_id);
  const subChildren = filter_children_cats(categories, subCategory.otc_id);

  return (
    <main className='main'>
      <Breadcrumb current={subCategory.name} collections={[{ name: category.name, url: category.slug }]} />

      {/* End .breadcrumb-nav */}
      <div className='page-content'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-9 col-xl-4-5 col'>
              <div className='product_list_container'>
                <div className='toolbox'>
                  <div className='toolbox-left'>
                    <div className='toolbox-info'>
                      {category.name && category.name}{" "}
                      {!_.isEmpty(subCategory) ? `/ ${subCategory.name}` : ""}
                    </div>
                  </div>
                </div>

                <div className='cat-blocks-container'>
                  <div className='row'>
                    {!_.isEmpty(subChildren)
                      ? subChildren.map((subChild) => (
                          <SubCategory key={subChild.id} parent={subCategory} child={subChild} />
                        ))
                      : !_.isEmpty(children) &&
                        children.map((child) => (
                          <SubCategory key={child.id} parent={category} child={child} />
                        ))}
                    {/* End .col-6 col-md-4 col-lg-3 */}
                  </div>
                  {/* End .row */}
                </div>
                <div className='mb-4' />
              </div>
            </div>
            {/* End .col-lg-9 */}
            <aside className='col-lg-3 d-none d-lg-block order-lg-first'>
              <CategorySidebar />
            </aside>
            {/* End .col-lg-3 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </div>
      {/* End .page-content */}
    </main>
  );
};

const mapStateToProps = (state) => ({
  categories: state.INIT.categories,
});

export default connect(mapStateToProps, { loadSinglePage })(withRouter(LoadCategory));
