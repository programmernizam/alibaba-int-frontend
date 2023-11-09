import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getSetting } from "../../../utils/Helpers";
import _ from "lodash";
import { getSuperDeals } from "../../../utils/Services";
import ProductSectionSkeleton from "../../../skeleton/productSkeleton/ProductSectionSkeleton";
import Countdown from "react-countdown";
import DealsProduct from "../includes/superDeals/includes/DealsProduct";
import { Link } from "react-router-dom";

// Random component
const Completionist = () => (
  <span className='pt-3 text-danger bold'>
    {" "}
    Deals closed <i className='icon-close'></i>
  </span>
);

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span className='bold'>
        <span className='timeBox'>{hours}</span>: <span className='timeBox'>{minutes}</span>:
        <span className='timeBox'>{seconds}</span>
      </span>
    );
  }
};

const SectionSuperDeals = (props) => {
  const { general } = props;
  const query_string = getSetting(general, "section_super_deals_search");

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [expiredDate, setExpiredDate] = useState("");
  const acceptedDate = `${expiredDate + ":00"}`;

  let isShow = new Date(acceptedDate) < new Date();

  useEffect(() => {
    if (_.isEmpty(products)) {
      getSuperDeals().then((response) => {
        if (!_.isEmpty(response)) {
          const products = response.SuperDealProducts;
          const timer = response.timer;
          if (!_.isEmpty(products)) {
            setProducts(products);
          }
          if (!_.isEmpty(timer)) {
            setExpiredDate(timer);
          }
        }
        setLoading(false);
      });
    }
  }, []);

  // Decide what is render
  let content;
  if (loading) content = <ProductSectionSkeleton />;
  if (!loading && products.length == 0) content = "";

  if (!loading && products)
    content = (
      <div className='row gap'>
        {products.map((product, index) => {
          return (
            <DealsProduct
              key={index}
              productclassName={`col-6 col-md-4 col-lg-2 gap-item`}
              product={product}
              general={general}
            />
          );
        })}
      </div>
    );

  if (loading)
    return (
      <div className='container'>
        <ProductSectionSkeleton />
      </div>
    );

  if (!expiredDate || isShow) return "";

  return (
    <div className='container '>
      <div className='m-card '>
        <div className='topCatContainer'>
          <div className='row mt-1  pb-1 '>
            <div className='col-6 col-md-9 d-flex'>
              <h4 className='bold topTitle'>
                SUPER <span className='hi-color'>DEALS</span>
              </h4>
              <div className='pl-4 flex timerBox'>
                <h4 className='bold topTitle text-muted'>Top Products, Incredible Price !</h4>
                <div className='pl-2'>
                  {!loading && expiredDate ? <Countdown date={acceptedDate} renderer={renderer} /> : ""}
                </div>
              </div>
            </div>
            <div className='col-6 col-md-3 text-right'>
              {" "}
              <Link
                to={`/search/${query_string}?page=2`}
                className='btn btn-default px-4 py-2 py-md-3 rounded'
              >
                View All
              </Link>
            </div>
          </div>

          {content}
        </div>
      </div>
    </div>
  );
};

SectionSuperDeals.propTypes = {
  general: PropTypes.object.isRequired,
};

export default SectionSuperDeals;
