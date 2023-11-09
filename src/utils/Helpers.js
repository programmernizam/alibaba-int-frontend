import _ from "lodash";
import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";

/**
 *
 * @param categories
 * @returns {*[]|*}
 */
export const filter_parent_cats = (categories) => {
  if (!_.isEmpty(categories) && _.isArray(categories)) {
    return categories.filter((category) => category.ParentId === null);
  }
  return [];
};

/**
 *
 * @param categories
 * @param otc_id
 * @returns {*[]|*}
 */
export const filter_children_cats = (categories, otc_id) => {
  if (_.isArray(categories) && otc_id) {
    return categories.filter((filter) => filter.ParentId === otc_id);
  }
  return [];
};

/**
 *
 * @param categories
 * @param slug
 * @returns {{}|*}
 */
export const find_cat_by_slug = (categories, slug) => {
  if (!_.isEmpty(categories) && _.isArray(categories) && slug) {
    return categories.find((find) => find.slug === slug);
  }
  return {};
};
/**
 *
 * @param categories
 * @param parentId
 * @returns {{}|*}
 */
export const find_cat_parent = (categories, ParentId) => {
  if (!_.isEmpty(categories) && _.isArray(categories) && !_.isNaN(ParentId)) {
    return categories.find((find) => find.otc_id === ParentId);
  }
  return {};
};

/**
 *
 * @param asset
 * @returns {string|*}
 */
export const loadAsset = (asset) => {
  const asset_base_url = process.env.REACT_APP_ASSET_BASE_URL;
  if (asset_base_url) {
    return asset_base_url + "/" + asset;
  }
  return asset;
};

/**
 *
 * @param category
 * @returns {string|*}
 */
export const loadCatImg = (category) => {
  const asset_base_url = process.env.REACT_APP_ASSET_BASE_URL;
  if (!_.isEmpty(category)) {
    const picture = category.picture;
    if (picture) {
      return asset_base_url + "/" + picture;
    }
    const IconImageUrl = category.IconImageUrl;
    if (IconImageUrl) {
      return IconImageUrl;
    }
  }
  return asset_base_url + "/img/backend/no-image-300x300.png";
};

/**
 *
 * @param Pictures
 * @param mainPicture
 * @param size
 * @returns {string|*}
 */
export const loadProductImg = (
  Pictures,
  mainPicture = "/img/backend/no-image-300x300.png",
  size = "Medium"
) => {
  if (!_.isEmpty(Pictures) && _.isArray(Pictures)) {
    if (Pictures.length > 0) {
      const firstPicture = Pictures[0];
      if (!_.isEmpty(firstPicture)) {
        return firstPicture[size].Url;
      }
    }
  }
  return mainPicture;
};

/**
 *
 * @param slug
 * @returns {*}
 */
export const slugToKey = (slug) => {
  return _.camelCase(slug);
};

/**
 * @description go to page top
 */
export const goPageTop = () => {
  try {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  } catch (error) {
    window.scrollTo(0, 0);
  }
};

export const getSetting = (general, key, common = null) => {
  if (_.isObject(general) && !_.isEmpty(general)) {
    const returnKey = general[key];
    return !_.isNaN(returnKey) ? returnKey : common;
  }
  return common;
};

export const characterLimiter = (string, length = 42, separator = "...") => {
  return _.truncate(string, {
    length: length,
    separator: separator,
  });
};

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export const getOrderDifTime = (order) => {
  const currentDate = new Date();
  const orderDate = new Date(order.created_at);
  const diffTime = Math.abs(orderDate - currentDate);
  return diffTime;
};

export const getOrderDifDays = (order) => {
  const diffTime = getOrderDifTime(order);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function getBusinessDateCount(order_approved_at, end_Date) {
  const startDate = new Date(order_approved_at); // March 1, 2023
  const endDate = end_Date ? new Date(end_Date) : new Date();
  let currentYear = new Date().getFullYear();
  const holidays = [
    new Date(currentYear, 2, 21),
    new Date(currentYear, 3, 8),
    new Date(currentYear, 3, 26),
    new Date(currentYear, 4, 19),
    new Date(currentYear, 4, 23),
    new Date(currentYear, 5, 1),
    new Date(currentYear, 5, 4),
    new Date(currentYear, 6, 28),
    new Date(currentYear, 6, 29),
    new Date(currentYear, 8, 15),
    new Date(currentYear, 9, 6),
    new Date(currentYear, 9, 28),
    new Date(currentYear, 10, 24),
    new Date(currentYear, 12, 16),
    new Date(currentYear, 12, 25),
  ]; // March 17, 2023

  // Convert the dates to UTC to avoid timezone issues
  const start = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  // Calculate the difference in milliseconds between the dates
  const diff = end - start;

  // Calculate the number of days between the dates
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Count the number of weekends (Friday and Saturday) between the dates
  let weekends = 0;
  for (let i = 0; i < days; i++) {
    const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).getDay();
    if (day === 5 || day === 6) {
      weekends++;
    }
  }

  // Count the number of holidays between the dates
  let holidaysBetween = 0;
  for (let i = 0; i < holidays.length; i++) {
    const holiday = Date.UTC(holidays[i].getFullYear(), holidays[i].getMonth(), holidays[i].getDate());
    if (holiday >= start && holiday <= end) {
      holidaysBetween++;
    }
  }

  // Subtract the weekends and holidays from the total number of days
  const businessDays = days - weekends - holidaysBetween;

  return businessDays >= 0 ? businessDays : 0;
}
// export function getBusinessDateCount(created_at) {
//   let startDate = new Date(created_at);
//   let endDate = new Date();
//   var elapsed, daysBeforeFirstSunday, daysAfterLastSunday;
//   var ifThen = function (a, b, c) {
//     return a == b ? c : a;
//   };

//   elapsed = endDate - startDate;
//   elapsed /= 86400000;

//   daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
//   daysAfterLastSunday = endDate.getDay();

//   elapsed -= daysBeforeFirstSunday + daysAfterLastSunday;
//   elapsed = (elapsed / 7) * 5;
//   elapsed += ifThen(daysBeforeFirstSunday - 1, -1, 0) + ifThen(daysAfterLastSunday, 6, 5);

//   return Math.ceil(elapsed);
// }

export function calculateBusinessDays(created_at) {
  const startDate = new Date(created_at); // March 1, 2023

  let currentYear = new Date().getFullYear();
  const endDate = new Date(); // March 31, 2023
  const holidays = [
    new Date(currentYear, 2, 21),
    new Date(currentYear, 3, 8),
    new Date(currentYear, 3, 26),
    new Date(currentYear, 4, 19),
    new Date(currentYear, 4, 23),
    new Date(currentYear, 5, 1),
    new Date(currentYear, 5, 4),
    new Date(currentYear, 6, 28),
    new Date(currentYear, 6, 29),
    new Date(currentYear, 8, 15),
    new Date(currentYear, 9, 6),
    new Date(currentYear, 9, 28),
    new Date(currentYear, 10, 24),
    new Date(currentYear, 12, 16),
    new Date(currentYear, 12, 25),
  ]; // March 17, 2023

  // Convert the dates to UTC to avoid timezone issues
  const start = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  // Calculate the difference in milliseconds between the dates
  const diff = end - start;

  // Calculate the number of days between the dates
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Count the number of weekends (Friday and Saturday) between the dates
  let weekends = 0;
  for (let i = 0; i < days; i++) {
    const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).getDay();
    if (day === 5 || day === 6) {
      weekends++;
    }
  }

  // Count the number of holidays between the dates
  let holidaysBetween = 0;
  for (let i = 0; i < holidays.length; i++) {
    const holiday = Date.UTC(holidays[i].getFullYear(), holidays[i].getMonth(), holidays[i].getDate());
    if (holiday >= start && holiday <= end) {
      holidaysBetween++;
    }
  }

  // Subtract the weekends and holidays from the total number of days
  const businessDays = days - weekends - holidaysBetween;

  return businessDays >= 0 ? businessDays : 0;
}

export const isAvailableForReturn = (order) => {
  const diffDays = getBusinessDateCount(order.created_at);
  if (Number(diffDays) >= 45) {
    return false;
  } else {
    return true;
  }
};
export const isAvailableForPayment = (order) => {
  const diffTime = getOrderDifTime(order);
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  if (Number(diffHours) >= 24) {
    return true;
  } else {
    return false;
  }
};

export const isAvailableFor2ndPayment = (order) => {
  const availArr = order.order_items.filter((order) => order.status !== "received-in-BD-warehouse");
  if (availArr.length > 0) {
    return true;
  } else {
    return false;
  }
};
export const isAvailableFor2ndPaymentItem = (item) => {
  let isAvailableFor2nPay;
  if (item.status === "received-in-BD-warehouse") {
    isAvailableFor2nPay = false;
  } else {
    isAvailableFor2nPay = true;
  }
  return isAvailableFor2nPay;
};

export const getTotalValue = (totalPrice) => {
  let Total = 0;
  Total += totalPrice;
  return Total;
};

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function getIncreaseDay(payload) {
  const increaseDay = new Date();
  increaseDay.setDate(new Date().getDate() + payload);
  const date = increaseDay.getDate();
  const month = increaseDay.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  const year = increaseDay.getFullYear();

  const dateStr = date + "/" + month + "/" + year;
  return dateStr;
}

export function showAlert(message, type, btnText) {
  swal({
    title: message,
    icon: type,
    button: btnText,
  });
}
