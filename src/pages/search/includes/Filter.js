import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import arr1 from "../../../assets/images/arr1.png";
import arr2 from "../../../assets/images/arr2.png";
import { useQuery } from "../../../utils/Helpers";

const Filter = (props) => {
  const { TotalCount, pageName, slugKey } = props;
  const { search } = useLocation();
  const filterString = search.slice(8);
  const query = useQuery();
  let page = query.get("page");
  page = page ? page : 1;

  let minPrice = Number(query.get("min_price"));
  let maxPrice = Number(query.get("max_price"));
  minPrice = minPrice ? minPrice : null;
  maxPrice = maxPrice ? maxPrice : null;

  const sortValue = query.get("direction");
  const [priceRange, setPricerRang] = useState({ min_price: minPrice, max_price: maxPrice });
  const history = useHistory();

  const ref = useRef(null);
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  const handleSugCatFilter = (slugKey) => {
    if (pageName === "search") {
      history.push(`/search/${slugKey}`);
    } else if (pageName === "pictureSearch") {
      history.push(`/search/picture/${slugKey}`);
    } else if (pageName === "vendorSearch") {
      history.push(`/seller/${slugKey}`);
    } else {
      history.push(`/shop/${slugKey}`);
    }
  };

  const handleFilterMethodChange = (e) => {
    setPricerRang({ min_price: "", max_price: "" });
    let method = e.target.value;
    if (pageName === "search") {
      history.push(`/search/${slugKey}?page=${1}&${method}`);
    } else if (pageName === "pictureSearch") {
      history.push(`/search/picture/${slugKey}?page=${1}&${method}`);
    } else if (pageName === "vendorSearch") {
      history.push(`/seller/${slugKey}?page=${1}&${method}`);
    } else {
      history.push(`/shop/${slugKey}?page=${1}&${method}`);
    }
  };

  const handleFilterPriceChange = () => {
    if (pageName === "search") {
      history.push(
        `/search/${slugKey}?page=${1}&min_price=${priceRange.min_price}&max_price=${priceRange.max_price}`
      );
    } else if (pageName === "pictureSearch") {
      history.push(
        `/search/picture/${slugKey}?page=${1}&min_price=${priceRange.min_price}&max_price=${
          priceRange.max_price
        }`
      );
    } else if (pageName === "vendorSearch") {
      history.push(
        `/seller/${slugKey}?page=${1}&min_price=${priceRange.min_price}&max_price=${priceRange.max_price}`
      );
    } else {
      history.push(
        `/shop/${slugKey}?page=${1}&min_price=${priceRange.min_price}&max_price=${priceRange.max_price}`
      );
    }
  };

  const sugCat = [
    "lip liner",
    "oil free makeup remover",
    "men shoes",
    "lip sticks",
    "face moisturize",
    "pet accessories",
    "T-SHIRTS",
    "SHIRTS",
    "JACKETS",
    "Toys",
    "Kids ",
    "Babies",
    "Camera ",
    "Tools",
  ];

  return (
    <div className='card p1 '>
      <div className='sortProductsContainer '>
        <div
          className='flexRow align-center toolbox-info flexWrap bold t-up'
          style={{
            wordBreak: "break-word",
            whiteSpace: "wrap",
          }}
        >
          {props?.sellerId ? (
            <span className='ow'>
              SELLER: <span>{props?.sellerId}</span>
            </span>
          ) : (
            <span className='ow'>
              SHOWING <span style={{ textDecoration: "underLine" }}>{TotalCount}</span> RESULTS FROM
              <span className='text-orange ml-2'>{slugKey}</span>
            </span>
          )}
        </div>
        <div className='filters'>
          <select
            onChange={handleFilterMethodChange}
            className='form-control mb-0'
            name='platform'
            style={{ marginRight: "0.5rem" }}
          >
            <option value='' selected={filterString === ""}>
              Default
            </option>
            <option value='sort=Price&direction=Desc' selected={filterString === "sort=Price&direction=Desc"}>
              Price High To Low
            </option>
            <option value='sort=Price&direction=Asc' selected={filterString === "sort=Price&direction=Asc"}>
              Price Low To High
            </option>
            <option value='sort=offer&direction=true' selected={filterString === "sort=offer&direction=true"}>
              Offer
            </option>
            <option
              value='sort=VendorRating&direction=Desc'
              selected={filterString === "sort=VendorRating&direction=Desc"}
            >
              Seller Rating
            </option>
            <option
              value='sort=Volume&direction=Desc'
              selected={filterString === "sort=Volume&direction=Desc"}
            >
              Most Sold
            </option>
          </select>

          <div className='priceFilter mt-1 mt-md-0'>
            <input
              onChange={(e) => setPricerRang({ ...priceRange, min_price: e.target.value })}
              className='form-control mb-0'
              placeholder='Min Price'
              value={priceRange.min_price}
              // defaultValue={sortValue ? null : minPrice}
            />
            <span
              style={{
                height: "35px",
                padding: "0.85rem .6rem",
                lineHeight: 1.5,
              }}
            >
              {" "}
              -{" "}
            </span>
            <input
              onChange={(e) => setPricerRang({ ...priceRange, max_price: e.target.value })}
              className='form-control mb-0'
              placeholder='Max Price'
              value={priceRange.max_price}
              // defaultValue={sortValue ? null : maxPrice}
            />
            <button onClick={() => handleFilterPriceChange()} className='btn btn-secondary rounded ml-2'>
              Filter
            </button>
          </div>
        </div>
      </div>
      <div className='p1 sugCat'>
        <div className='flexBetween align-items-center'>
          <img onClick={() => scroll(-700)} className='topAr1' src={arr1} alt='' />
          <div ref={ref} className='responsiveOverflow'>
            <div className='sellerCategoryContainer'>
              {sugCat.map((el) => (
                <div onClick={() => handleSugCatFilter(el)} className='bold btn sug-btn'>
                  <span>{el}</span>
                </div>
              ))}
            </div>
          </div>
          <img onClick={() => scroll(700)} className='topAr2' src={arr2} alt='' />
        </div>
      </div>
    </div>
  );
};

export default Filter;
