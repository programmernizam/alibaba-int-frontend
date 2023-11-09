import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, withRouter } from "react-router-dom";
import _ from "lodash";
import {
  filter_children_cats,
  find_cat_by_slug,
  find_cat_parent,
  goPageTop,
  slugToKey,
} from "../../utils/Helpers";
import My404Component from "../404/My404Component";
import ParentCategories from "./includes/ParentCategories";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import CategoryProductList from "../product/productList/CategoryProductList";
import ProductListSkeleton from "../../skeleton/productSkeleton/ProductListSkeleton";
import SidebarCategorySkeleton from "../../skeleton/productSkeleton/SidebarCategorySkeleton";
import { loadCategoryProducts } from "../../utils/Services";
import Filter from "../search/includes/Filter";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LoadShopProducts = (props) => {
  const { categories, match, category_loading } = props;
  const { search } = useLocation();
  const queryString = search;

  const params = !_.isEmpty(match) ? match.params : {};
  const category_slug = !_.isEmpty(params) ? params.category_slug : "";
  const query = useQuery();
  let page = query.get("page");
  page = page ? page : 1;

  const perPage = 36;
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [slug, setSlug] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const category = find_cat_by_slug(categories, category_slug);

  useEffect(() => {
    goPageTop();
    setLoadingCats(true);
    if (page !== currentPage) {
      let selected = parseInt(page) - 1;
      setCurrentPage(page);
      let offset = Math.ceil(selected * perPage);
      loadingProduct(offset);
    } else if (slug !== category_slug) {
      setSlug(category_slug);
      loadingProduct(0);
    }
  }, [page, category_slug]);

  useEffect(() => {
    if (loadingCats) {
      if (category.length) {
        setLoadingCats(false);
      }
    }
  });

  const loadingProduct = (loadOffset = 0) => {
    setLoadingProducts(true);
    loadCategoryProducts(category_slug, loadOffset, perPage, queryString).then((response) => {
      let newProducts = JSON.parse(response.products);
      if (!_.isEmpty(newProducts)) {
        setProducts(newProducts.Content);
        setTotalCount(newProducts.TotalCount);
      }
      setLoadingProducts(false);
    });
  };

  if (category.length === 0 && !loadingCats) {
    return "";
    return <My404Component />;
  }

  const parent = find_cat_parent(categories, category.ParentId);
  const siblings = () => {
    if (!_.isEmpty(parent)) {
      return filter_children_cats(categories, parent.otc_id);
    }
    return [];
  };

  return (
    <main className='main bg-gray'>
      <Breadcrumb
        current={!_.isEmpty(category) ? category.name : ""}
        collections={[
          { name: "Shop" },
          {
            name: !_.isEmpty(parent) ? parent.name : "",
            url: !_.isEmpty(parent) ? parent.slug : "",
          },
        ]}
      />

      {/* End .breadcrumb-nav */}
      <div className='page-content'>
        <div className='container'>
          <div className='row'>
            <div className={siblings().length > 0 ? "col-lg-9" : "col-lg-12"}>
              {/* <Filter TotalCount={totalCount} slugKey={category_slug} /> */}
              {loadingProducts ? (
                <ProductListSkeleton />
              ) : (
                <CategoryProductList
                  products={products}
                  slugKey={category_slug}
                  perPage={perPage}
                  currentPage={currentPage}
                  TotalCount={totalCount}
                />
              )}
            </div>

            {category_loading ? (
              <SidebarCategorySkeleton />
            ) : (
              siblings().length > 0 && <ParentCategories parent={parent} siblings={siblings()} />
            )}
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
  category_loading: state.LOADING.category_loading,
  categories: state.INIT.categories,
});

export default connect(mapStateToProps, {})(withRouter(LoadShopProducts));
