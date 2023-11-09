import React, { useEffect, useState } from "react";
import _ from "lodash";
import parser from "html-react-parser";
import { getProductDescription } from "../../../../utils/Services";

const ProductDescription = (props) => {
  const { product } = props;
  const product_id = product.Id;
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState({});
  useEffect(() => {
    loadProductDescriptions();
  }, []);

  if (loading) {
    return (
      <div className='text-center py-5'>
        <div className='d-block mb-2'>
          <div className='spinner-border text-secondary' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
        <button type='button' onClick={(e) => loadProductDescriptions(e)} className='btn btn-link'>
          {" "}
          Cancel
        </button>
      </div>
    );
  }

  const loadProductDescriptions = async () => {
    setLoading(true);
    await getProductDescription(product_id).then((response) => {
      setDescription(response.description);
      setLoading(false);
    });
  };

  if (_.isEmpty(description)) {
    return (
      <div className='text-center py-5'>
        <button type='button' onClick={(e) => loadProductDescriptions(e)} className='btn btn-default'>
          Show Description
        </button>
      </div>
    );
  }

  return (
    <div className='product-desc-content'>
      <div className='table-responsive-sm'>{parser(description)}</div>
    </div>
  );
};

export default ProductDescription;
