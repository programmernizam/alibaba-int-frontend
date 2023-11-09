import _ from "lodash";
import React, { useEffect } from "react";
import { GetOriginalPriceFromPrice } from "../../../../../utils/CartHelpers";
import { getSetting, goPageTop } from "../../../../../utils/Helpers";
const PriceRange = (props) => {
  const { totalQty, bulkPriceQuantity, general } = props;
  const currency = getSetting(general, "currency_icon");

  // quantity box active deactive
  const addActiveClassThree = () => {
    let first = bulkPriceQuantity[0]?.MinQuantity;
    let second = bulkPriceQuantity[1]?.MinQuantity;
    let third = bulkPriceQuantity[2]?.MinQuantity;

    let a = totalQty;
    let b = document.querySelectorAll(".range");
    let i;
    for (i = 0; i < b.length; i++) {
      if (a < first) {
        b[1].classList.remove("rangeActive");
        b[2].classList.remove("rangeActive");
        b[0].classList.add("rangeActive");
      } else if (a == first || a < second) {
        b[1].classList.remove("rangeActive");
        b[2].classList.remove("rangeActive");
        b[0].classList.add("rangeActive");
      } else if (a == second || a < third) {
        b[0].classList.remove("rangeActive");
        b[2].classList.remove("rangeActive");
        b[1].classList.add("rangeActive");
      } else if (a >= third) {
        b[0].classList.remove("rangeActive");
        b[1].classList.remove("rangeActive");
        b[2].classList.add("rangeActive");
      }
    }
  };
  const addActiveClassTow = () => {
    let firstMax = bulkPriceQuantity[0]?.MaxQuantity;
    let second = bulkPriceQuantity[1]?.MaxQuantity;
    let secondMin = bulkPriceQuantity[1]?.MinQuantity;
    let totalQTYCart = totalQty;
    let b = document.querySelectorAll(".range");
    let i;
    for (i = 0; i < b.length; i++) {
      if (totalQTYCart <= firstMax || totalQTYCart < secondMin) {
        b[0].classList.add("rangeActive");
        b[1].classList.remove("rangeActive");
      } else if (totalQTYCart > firstMax || totalQTYCart > secondMin) {
        b[0].classList.remove("rangeActive");
        b[1].classList.add("rangeActive");
      }
    }
  };

  return (
    <div className='ranges'>
      {bulkPriceQuantity.map((pqR, index) => {
        const {
          MaxQuantity,
          MinQuantity,
          Price: { Base },
        } = pqR;
        if (bulkPriceQuantity.length == 2) addActiveClassTow(MinQuantity, MaxQuantity);
        if (bulkPriceQuantity.length == 3) addActiveClassThree(MinQuantity, MaxQuantity);

        return (
          <div className='range' key={index}>
            <span className='amount'> {`${currency} ${_.round(Base)}`}</span>
            <span className='piece mb-0'>{MinQuantity} or more</span>
          </div>
        );
      })}
    </div>
  );
};
export default PriceRange;
