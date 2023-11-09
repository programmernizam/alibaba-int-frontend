import { axiosFileUpload, axiosInstance } from "./AxiosDefault";
import _ from "lodash";
import { CheckAndSetErrors, setGlobalErrors } from "./GlobalStateControl";
import { in_loading, out_loading } from "./LoadingState";

export const getSinglePageBySlug = async (slug) => {
  return await axiosInstance.get(`/single-page/${slug}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const getProductDescription = async (product_id) => {
  return await axiosInstance.get(`/product-description/${product_id}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const getProductSellerInfo = async (VendorId) => {
  return await axiosInstance.get(`/product-seller-information/${VendorId}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const loadRecentProducts = async () => {
  return await axiosInstance
    .get("/recent-products")
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadLovingProducts = async (id, isShopAsCustomer) => {
  return await axiosInstance
    .get("/loving-products", {
      params: {
        id: id,
        shopAsCustomer: isShopAsCustomer,
      },
    })
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      // setGlobalErrors(error.response);
    });
};

export const loadSectionsProducts = async (section) => {
  return await axiosInstance
    .get(`/get-section-products/` + section)
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadRelatedProducts = async (item_id) => {
  return await axiosInstance
    .get(`/related-products/${item_id}`)
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const storeNewAddress = async (storeData) => {
  return await axiosInstance
    .post("/store-new-address", storeData)
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const deleteCustomerAddress = async (deleteData) => {
  return await axiosInstance
    .post("/delete-address", deleteData)
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const getAllAddress = async (id, shopAsCustomer) => {
  return await axiosInstance
    .get("/address", {
      params: {
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const getCustomerAllOrders = async (id, shopAsCustomer) => {
  return await axiosInstance
    .get("/orders", {
      params: {
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadCategoryProducts = async (slug, offset, limit, minPrice, maxPrice, orderBy) => {
  return await axiosInstance
    .post(`/category-products/${slug}`, {
      offset: offset,
      limit: limit,
      minPrice: minPrice,
      maxPrice: maxPrice,
      orderBy: orderBy,
    })
    .then((response) => {
      const responseData = response.data;

      if (!_.isEmpty(responseData)) {
        return responseData.data;
      }
      return [];
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadTextSearchProducts = async (
  searchKey,
  offset,
  limit,
  minPrice,
  maxPrice,
  orderBy,
  offer
) => {
  return await axiosInstance
    .post(`/get-search-result/${searchKey}`, {
      minPrice: minPrice,
      maxPrice: maxPrice,
      orderBy: orderBy,
      offer: offer,
      offset: offset,
      limit: limit,
    })
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        return responseData.data;
      }
      return [];
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadPictureSearchProducts = async (data) => {
  return await axiosFileUpload
    .post(`/search-picture`, data)
    .then((response) => {
      const responseData = response.data;
      if (!_.isEmpty(responseData)) {
        return responseData.data;
      }
      return [];
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const loadPictureSearchProductsData = async (
  search_id,
  offset,
  limit,
  minPrice,
  maxPrice,
  orderBy
) => {
  return await axiosInstance
    .post(`/get-picture-result/${search_id}`, {
      offset: offset,
      limit: limit,
      minPrice: minPrice,
      maxPrice: maxPrice,
      orderBy: orderBy,
    })
    .then((response) => {
      const responseData = response.data;

      if (!_.isEmpty(responseData)) {
        return responseData.data;
      }
      return [];
    })
    .catch((error) => {
      setGlobalErrors(error.response);
    });
};

export const getOrderDetails = async (order_id, id, shopAsCustomer) => {
  return await axiosInstance
    .post(`/order/${order_id}`, {
      params: {
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};

export const getProductPageCard = async (card_no) => {
  return await axiosInstance.get(`/get-products-page-cards/${card_no}`).then((res) => {
    const resData = res.data;

    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const loadBulkProductsPrice = async (itemId) => {
  return await axiosInstance.get(`/products-bulk-prices/${itemId}`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const loadSameSellerProducts = async (
  vendorId,
  loadOffset,
  perPage,
  minPrice,
  maxPrice,
  orderBy,
  offer
) => {
  return await axiosInstance
    .get(`/vendor-products/${vendorId}`, {
      params: {
        offset: loadOffset,
        limit: perPage,
        minPrice: minPrice,
        maxPrice: maxPrice,
        orderBy: orderBy,
        offer: offer,
      },
    })
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};

export const getFooterBrand = async () => {
  return await axiosInstance.get(`/footer-brands`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getHomePageCards = async () => {
  return await axiosInstance.get(`/get-homepage-cards`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getFeaturedCategories = async () => {
  return await axiosInstance.get(`/get-featured-categories`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getExclusiveOffer = async () => {
  return await axiosInstance.get(`/get-homepage-featured-items-card`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getSuperDeals = async () => {
  return await axiosInstance.get(`/get-super-deals`).then((res) => {
    const resData = res.data;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getDiscountProduct = async () => {
  return await axiosInstance
    .get(`/get-discount-section`, { params: { offset: 2, limit: 18 } })
    .then((res) => {
      const resData = res.data;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};
export const getCouponDetails = async (coupon, amount, id, shopAsCustomer) => {
  return await axiosInstance
    .get(`/validate-coupon/${coupon}`, { params: { amount: amount, id: id, shopAsCustomer: shopAsCustomer } })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};

export const cancelOrder = async (orderId, reason, id, shopAsCustomer) => {
  return await axiosInstance
    .post(`/cancel-order/${orderId}`, { reason: reason, id: id, shopAsCustomer: shopAsCustomer })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};
export const refundOrder = async (orderId) => {
  return await axiosInstance.post(`/refund-order/${orderId}`).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const confirmPayment = async (orderId, orderData) => {
  return await axiosInstance.post(`/update-order/${orderId}`, orderData).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const confirmItemPayment = async (orderId, orderData) => {
  return await axiosInstance.post(`/update-order-item/${orderId}`, orderData).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const updateProfile = async (
  email,
  phone,
  refund_credentials,
  refund_method,
  fName,
  lName,
  id,
  shopAsCustomer
) => {
  return await axiosInstance
    .post(`/me/update`, {
      params: {
        email: email,
        phone: phone,
        refund_credentials: refund_credentials,
        refund_method: refund_method,
        fName: fName,
        lName: lName,
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};
export const getUserInfo = async (id, shopAsCustomer) => {
  return await axiosInstance
    .post(`/me`, {
      id: id,
      shopAsCustomer: shopAsCustomer,
    })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};

export const signupWithEmailPassword = async (data) => {
  return await axiosInstance.post("/register", data).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getStoredCart = async () => {
  return await axiosInstance.get("/cart/get").then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const updateStoredCart = async (cart, id, shopAsCustomer) => {
  return await axiosInstance
    .put("/cart/update", {
      params: {
        cart: JSON.stringify(cart),
        id: id,
        shopAsCustomer: shopAsCustomer,
      },
    })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};

export const getAlCustomerList = async () => {
  return await axiosInstance.get("/customers").then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getAlOrderItems = async (id, shopAsCustomer) => {
  return await axiosInstance
    .get("/order-items", {
      params: { id: id, shopAsCustomer: shopAsCustomer },
    })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};
export const getAllInvoices = async (id, shopAsCustomer) => {
  return await axiosInstance
    .post("/invoices", {
      id: id,
      shopAsCustomer: shopAsCustomer,
    })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};
export const getInvoice = async (invoiceID, id, shopAsCustomer) => {
  return await axiosInstance
    .post(`/invoice/${invoiceID}`, {
      id: id,
      shopAsCustomer: shopAsCustomer,
    })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};
export const loginAsCustomer = async () => {
  return await axiosInstance.get("/login-as").then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const confirmInvoicePayment = async (invoiceId, trxData) => {
  return await axiosInstance.post(`/invoice-pay/${invoiceId}`, trxData).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const forgotPasswordRequest = async (data) => {
  return await axiosInstance.post(`/forgot-password`, data).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const resetPassword = async (token, data) => {
  return await axiosInstance.post(`/password-reset/${token}`, data).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};

export const getProductCategoryShippingRates = async () => {
  return await axiosInstance.get(`product-category-shipping-rates`).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const getbKashToken = async () => {
  return await axiosInstance.post(`bkash-get-token`).then((res) => {
    const resData = res;
    if (!_.isEmpty(resData)) {
      return resData.data;
    }
    return {};
  });
};
export const createbKashPayment = async (auth_token, payerReference, amount, invoice_number) => {
  return await axiosInstance
    .post(`/bkash-create-payment/${auth_token}`, {
      payerReference: payerReference,
      amount: amount,
      invoiceNumber: invoice_number,
    })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};
export const executebKashPayment = async (auth_token, paymentID) => {
  return await axiosInstance
    .post(`/bkash-execute-payment/${auth_token}`, {
      paymentID: paymentID,
    })
    .then((res) => {
      const resData = res;
      if (!_.isEmpty(resData)) {
        return resData.data;
      }
      return {};
    });
};
