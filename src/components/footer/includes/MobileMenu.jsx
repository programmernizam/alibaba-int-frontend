import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {withRouter, Link} from "react-router-dom";
import MobileCategoryList from "./mobileMenuIncludes/MobileCategoryList";
import {closeMobileMenu} from "../../../utils/jQueryImplement";

const MobileMenu = props => {
   const {categories} = props;

   useEffect(() => {
      closeMobileMenu();
   }, []);

   return (
      <div className="mobileMenuSidebar">
         <div className="mobile-menu-overlay"/>
         <div className="mobile-menu-container">
            <div className="mobile-menu-wrapper">
               <div className="mobile-menu-close">
                  <i className="icon-close"/>
               </div>

               <div className="tab-content">

                  <MobileCategoryList categories={categories}/>

               </div>
               {/* End .tab-content */}
            </div>
            {/* End .mobile-menu-wrapper */}
         </div>
      </div>
   );
};

const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   categories: state.INIT.categories,
});

export default connect(mapStateToProps, {})(
   withRouter(MobileMenu)
);
