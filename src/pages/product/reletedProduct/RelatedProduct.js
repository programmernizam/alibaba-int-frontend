import React, { useEffect, useState } from "react";

import { loadRelatedProducts } from "../../../utils/Services";
import SectionProductCard from "../card/SectionProductCard";

const RelatedProduct = (props) => {
  const { item_id } = props;
  const [loading, setLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (item_id) {
      setLoading(true);
      loadRelatedProducts(item_id).then((response) => {
        setRelatedProducts(JSON.parse(response.relatedProducts));
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className='product-sidebar mb-3'>
      <div className='row'>
        {loading && ""}
        {!loading & (relatedProducts.length > 0) &&
          relatedProducts.map((product, index) => <SectionProductCard key={index} product={product} />)}
      </div>
    </div>
  );
};

export default RelatedProduct;
