import React from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import _ from "lodash";
import {loadCatImg} from '../../../../utils/Helpers';
import CategoryCardSkeleton from "../../../../skeleton/sectionSkeleton/CategoryCardSkeleton";

const PopularCategory = (props) => {
   const {categories, category_loading} = props;

   if (_.isEmpty(categories) && category_loading) {
      return <CategoryCardSkeleton/>
   }

   const topCategories = categories.filter(category => category.is_top !== null);

   return (
      <div className="container banner-group-1 d-none d-md-block">
         <div className="categories mb-3">
            <h3 className="title text-center mt-4">
               Explore Popular Categories
            </h3>
            <div className="row">
               {
                  !_.isEmpty(topCategories) && (
                     topCategories.map((category, index) =>

                        <div key={index} className="col-lg-2 col-sm-3 col-4  mb-3">
                           <div className="categories_box">
                              <Link to={`/${category.slug}`}>
                                 <img src={loadCatImg(category)}  alt={category.name}/>
                                 <span>{category.name}</span>
                              </Link>
                           </div>
                        </div>
                     )
                  )
               }
            </div>
         </div>
      </div>
   );
};

const mapStateToProps = (state) => ({
   categories: state.INIT.categories,
   category_loading: state.LOADING.category_loading,
});

export default connect(mapStateToProps, {})(
   withRouter(PopularCategory)
);