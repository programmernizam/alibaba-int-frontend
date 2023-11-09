import React from "react";
import Intro from "./includes/intro/Intro";
import ProductsLoving from "./includes/Products/productsLoving/ProductsLoving";
// import IconBoxes from './includes/iconBoxes/IconBoxes'
// import PopularCategory from "./includes/popularCategory/PopularCategory";
// import BrandProduct from './includes/brand/brandProduct/BrandProduct'
// import Blog from './includes/blog/Blog'
// import LandingPopup from './includes/Products/TodayProducts/TodayProducts'
// import LandingPopup from "./includes/popUp/landingPagePopup/LandingPopup";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { getSetting } from "../../utils/Helpers";
import SectionsOne from "./sections/SectionsOne";
import SectionsTwo from "./sections/SectionsTwo";
import SectionsThree from "./sections/SectionsThree";
import SectionsFour from "./sections/SectionsFour";
import SectionsFive from "./sections/SectionsFive";
import { useState } from "react";
import TopCategories from "./includes/intro/topCategory/TopCategories";
import FeaturedCategories from "./includes/featuredCategory/FeaturedCategories";
import SectionSuperDeals from "./sections/SectionSuperDeals";
import { useEffect } from "react";
import PromotionPopUp from "./includes/popUp/landingPagePopup/PromotionPopUp";

const Home = (props) => {
  const { general } = props;

  const section_super_deals_active = getSetting(general, "section_super_deals_active");
  const section_one_active = getSetting(general, "section_one_active");
  const section_two_active = getSetting(general, "section_two_active");
  const section_three_active = getSetting(general, "section_three_active");
  const section_four_active = getSetting(general, "section_four_active");
  const section_five_active = getSetting(general, "section_five_active");
  const popup_active = getSetting(general, "popup_banner_active");
  const [style, setStyle] = useState(true);

  const [showPromotion, setShowPromotion] = useState(false);

  let intDate = new Date();
  intDate.setHours(intDate.getHours() + 4); //four hour from now
  let visited = localStorage.getItem("promotion_popup");

  useEffect(() => {
    if (visited) {
      setShowPromotion(false);
    } else {
      //this is the first time
      localStorage.setItem("promotion_popup", intDate);
      setShowPromotion(true);
    }
  }, []);

  if (new Date(visited) < new Date()) {
    localStorage.removeItem("promotion_popup");
  }

  return (
    <>
      <main className='main' style={{ backgroundColor: "#F2F2F2" }}>
        <Intro general={general} />
        {section_super_deals_active === "enable" && <SectionSuperDeals general={general} />}
        {/* <FeaturedCategories /> */}
        {/*<IconBoxes/>*/}
        {/* <PopularCategory /> */}
        {/* {<TopCategories />} */}

        {section_one_active === "enable" && <SectionsOne general={general} />}
        {section_two_active === "enable" && <SectionsTwo general={general} />}
        {section_three_active === "enable" && <SectionsThree general={general} />}
        {section_four_active === "enable" && <SectionsFour general={general} />}
        {section_five_active === "enable" && <SectionsFive style={style} general={general} />}
        

        <ProductsLoving />
      </main>
      {popup_active === "enable" && showPromotion && (
        <PromotionPopUp general={general} showPromotion={showPromotion} setShowPromotion={setShowPromotion} />
      )}
    </>
  );
};

SectionsOne.propTypes = {
  general: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
});

export default connect(mapStateToProps, {})(withRouter(Home));
