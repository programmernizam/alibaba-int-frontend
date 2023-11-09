import React, {useEffect, useState} from 'react'
import ProductSectionSkeleton from "../../../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "./includes/RecentItems";
import {loadRecentProducts} from "../../../../../utils/Services";
import _ from "lodash";

const RecentProduct = (props) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {

    if (_.isEmpty(products)) {
      loadRecentProducts()
          .then(response => {
            const recentProducts = JSON.parse(response.recentProducts);
            if (!_.isEmpty(recentProducts)) {
              setProducts(recentProducts);
            }
            setLoading(false);
          });
    }

  }, []);


  return (
      <div className="container deal-section">
        <h3 className="title mt-5">Uniqaz Recent Viewed</h3>

        {loading && <ProductSectionSkeleton/>}
        {!loading && products.length > 0 && <RecentItems products={products}/>}

        <h3 className="title mt-5"> </h3>

      </div>
  )
};


export default RecentProduct;



