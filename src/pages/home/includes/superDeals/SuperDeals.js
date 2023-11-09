import _ from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import ProductSectionSkeleton from "../../../../skeleton/productSkeleton/ProductSectionSkeleton";
import { loadSameSellerProducts } from "../../../../utils/Services";
import RecentItems from "../Products/recentProduct/includes/RecentItems";

// Random component
const Completionist = () => <span>Time Over!</span>;

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
const SuperDeals = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const vendorId = "abb-wqiang102";
  useEffect(() => {
    getSameSellerProduct();
  }, [vendorId]);

  const limit = 6;
  const offset = 1;
  const getSameSellerProduct = async () => {
    const response = await loadSameSellerProducts(vendorId, offset, limit);
    if (!_.isEmpty(response)) {
      const products = JSON.parse(response.VendorProducts);
      if (!_.isEmpty(products)) {
        const Content = products.Content;
        if (!_.isEmpty(Content)) {
          setProducts(Content);
        }
      }
    }
    setLoading(false);
  };

  const expiredDate = Date.parse("23 Dec 2022 00:12:00 GMT");

  return (
    <div className='container'>
      <div className='m-card mb-1'>
        <div className='topCatContainer'>
          <div className='row pb-1'>
            <div className='col-9 d-flex'>
              <h4 className='bold topTitle'>
                SUPER <span className='hi-color'>DEALS</span>
              </h4>
              <div className='pl-4 flex'>
                <h4 className='bold topTitle text-muted'>Top Products, Incredible Price !</h4>
                <div className='pl-2'>
                  <Countdown date={expiredDate} renderer={renderer} />
                </div>
              </div>
            </div>
            <div className='col-3 text-right'>
              {" "}
              <Link to={`/seller/${vendorId}?page=2`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
                View All
              </Link>
            </div>
          </div>
          {loading && <ProductSectionSkeleton />}
          {!loading && products.length > 0 && <RecentItems products={products} />}
        </div>
      </div>
    </div>
  );
};

export default SuperDeals;
