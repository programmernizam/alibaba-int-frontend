import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getSetting, loadAsset } from "../../../utils/Helpers";
import _ from "lodash";
import { loadSectionsProducts } from "../../../utils/Services";
import ProductSectionSkeleton from "../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "../includes/Products/recentProduct/includes/RecentItems";
import sportsImg from "../../..//assets/images/Home/sports.jpg";
import { Link } from "react-router-dom";

{/* <div className='col-6 text-right'>
          {query_type === "search_query" ? (
            <Link to={`/search${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
              View All
            </Link>
          ) : (
            <Link to={`/shop${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
              View All
            </Link>
          )}
        </div> */}

const SectionsOne = (props) => {
  const { general } = props;

  const section_one_title = getSetting(general, "section_one_title");
  const section_one_title_image = getSetting(general, "section_one_title_image");
  const section_one_visible_title = getSetting(general, "section_one_visible_title");
  const query_url = getSetting(general, "section_one_query_url");
  const query_type = getSetting(general, "section_one_query_type");

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (_.isEmpty(products)) {
      loadSectionsProducts("section_one").then((response) => {
        if (!_.isEmpty(response)) {
          const products = JSON.parse(response.products);
          if (!_.isEmpty(products)) {
            const Content = products.Content;
            if (!_.isEmpty(Content)) {
              const limitedProduct = Content.slice(0, 4)
              setProducts(limitedProduct);
            }
          }
        }
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className='container mt-2'>
      <div className="row">
        <div className="col-12 col-md-12 col-lg-2 d-lg-flex align-items-lg-center flex-lg-column justify-content-lg-center mb-1" style={{ backgroundImage: `url(${sportsImg})`, backgroundSize: 'cover', backgroundPosition: 'center', }}>
          
            <div className="d-flex justify-content-between align-items-center flex-lg-column justify-content-lg-center">
              <h1 className="text-dark font-weight-bold"> Sports </h1>
              <div>
                {query_type === "search_query" ? (
                  <Link to={`/search${query_url}`} className='btn btn-danger w-100 h-100 px-4 py-2 py-md-3 rounded'>
                    View All
                  </Link>
                ) : (
                  <Link to={`/shop${query_url}`} className='btn btn-default px-4 py-2 py-md-3 rounded'>
                    View All
                  </Link>
                )}
              </div>
            </div>
         
        </div>

        <div className="col-12 col-md-10 col-lg-10 mt-3 mt-lg-0">
          {loading && <ProductSectionSkeleton />}
          {!loading && products.length > 0 && <RecentItems products={products} />}
        </div>

      </div>

    </div >
  );
};

SectionsOne.propTypes = {
  general: PropTypes.object.isRequired,
};

export default SectionsOne;


