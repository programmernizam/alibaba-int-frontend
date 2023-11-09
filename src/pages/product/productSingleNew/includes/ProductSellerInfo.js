import React, { useEffect, useState } from "react";
import _ from "lodash";
import parser from "html-react-parser";
import { getProductSellerInfo } from "../../../../utils/Services";

const ProductSellerInfo = (props) => {
  const { product } = props;
  const VendorId = product.VendorId;
  const [loading, setLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState({});

  useEffect(() => {
    loadProductSellerInformation();
  }, []);

  if (loading) {
    return (
      <div className='text-center py-5'>
        <div className='d-block mb-2'>
          <div className='spinner-border text-secondary' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
        <button type='button' onClick={(e) => loadProductSellerInformation(e)} className='btn btn-link'>
          {" "}
          Cancel
        </button>
      </div>
    );
  }

  const loadProductSellerInformation = (e) => {
    setLoading(true);
    getProductSellerInfo(VendorId).then((response) => {
      setSellerInfo(response.VendorInfo);
      setLoading(false);
    });
  };

  if (_.isEmpty(sellerInfo)) {
    return (
      <div className='text-center py-5'>
        <button type='button' onClick={(e) => loadProductSellerInformation(e)} className='btn btn-default'>
          Show Seller Info
        </button>
      </div>
    );
  }

  const GetFeaturedValues = (key) => {
    const FeaturedValues = sellerInfo.FeaturedValues;
    if (_.isArray(FeaturedValues)) {
      const findValue = FeaturedValues.find((find) => find.Name === key);
      if (!_.isEmpty(findValue)) {
        return findValue.Value;
      }
    }
    return "";
  };

  const GetScores = (key) => {
    const Scores = sellerInfo.Scores;
    if (!_.isEmpty(Scores)) {
      return Scores[key];
    }
    return "";
  };

  const GetSellerGrade = () => {
    let grade = "D";
    let ServiceScore = GetScores("ItemScore");
    if (ServiceScore >= 4 && ServiceScore <= 5) {
      grade = "A";
    } else if (ServiceScore >= 3 && ServiceScore < 4) {
      grade = "B";
    } else if (ServiceScore >= 2 && ServiceScore < 3) {
      grade = "C";
    }
    return grade;
  };

  return (
    <div className='product-desc-content'>
      <div className='table-responsive-sm'>
        <table className='table table-bordered table-striped' style={{ maxWidth: "500px", margin: "0 auto" }}>
          <thead>
            <tr>
              <td className='text-right'>Name:</td>
              <td className='text-left'>{sellerInfo.Name}</td>
            </tr>
            <tr>
              <td className='text-right'>Shop Name:</td>
              <td className='text-left'>{sellerInfo.ShopName}</td>
            </tr>
            <tr>
              <td className='text-right'>Location:</td>
              <td className='text-left'>{sellerInfo.Location.State || "Unknown"}</td>
            </tr>
            <tr>
              <td className='text-right'>Shop Grade:</td>
              <td className='text-left'>{GetSellerGrade()}</td>
            </tr>
            <tr>
              <td className='text-right'>Delivery score:</td>
              <td className='text-left'>{GetScores("DeliveryScore")}</td>
            </tr>
            <tr>
              <td className='text-right'>Item score:</td>
              <td className='text-left'>{GetScores("ItemScore")}</td>
            </tr>
            <tr>
              <td className='text-right'>Rating:</td>
              <td className='text-left'>{GetScores("ServiceScore")}</td>
            </tr>
            <tr>
              <td className='text-right'>Years on Market:</td>
              <td className='text-left'>{GetFeaturedValues("years")}</td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default ProductSellerInfo;
