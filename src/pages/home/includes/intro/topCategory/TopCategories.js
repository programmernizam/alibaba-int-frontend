import React, { useRef } from "react";
import TopCategory from "./TopCategory";
import arr1 from "../../../../../assets/images/arr1.png";
import arr2 from "../../../../../assets/images/arr2.png";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { filter_parent_cats } from "../../../../../utils/Helpers";

const TopCategories = (props) => {

  const { categories, category_loading } = props;
  console.log(categories)
  const parents = filter_parent_cats(categories);

  const ref = useRef(null);
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  return (
    <div className='container'>
      <div className='m-card mb-1 hov-shadow'>
        <div className='topCatContainer  flex flexRow flexBetween border-0'>
          <h4 className='bold topTitle'>TOP CATEGORIES</h4>
          <div className='flex'>
            <img onClick={() => scroll(-700)} className='topAr1' src={arr1} alt='' />
            <img onClick={() => scroll(700)} className='topAr2' src={arr2} alt='' />
          </div>
        </div>
        <div ref={ref} className='responsiveOverflow'>
          <div className='sellerCategoryContainer'>
            <TopCategory categories={categories} category_loading={category_loading} parents={parents} />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  categories: state.INIT.categories,
  category_loading: state.LOADING.category_loading,
});

export default connect(mapStateToProps, {})(withRouter(TopCategories));
