import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { getIncreaseDay, getSetting } from "../../../../../utils/Helpers";
import {
  findProductCartFromState,
  numberWithCommas,
} from "../../../../../utils/CartHelpers";
import { getProductCategoryShippingRates } from "../../../../../utils/Services";
import { addCategoryIntoVirtualCart } from "../../../../../utils/GlobalStateControl";
import swal from "sweetalert";

const ProductSummary = (props) => {
  const { product, general, cartConfigured } = props;
  const product_id = !_.isEmpty(product) ? product.Id : "";
  const activeCartProduct = findProductCartFromState(
    cartConfigured,
    product_id
  );

  const currency = getSetting(general, "currency_icon");
  const china_to_bd_bottom_message = getSetting(
    general,
    "china_to_bd_bottom_message"
  );
  const chinaLocalShippingCharges = getSetting(
    general,
    "china_local_delivery_charge"
  );
  const chinaLocalShippingChargeLimit = getSetting(
    general,
    "china_local_delivery_charge_limit"
  );
  const totalWeight = activeCartProduct.totalWeight;
  const approxWeight = activeCartProduct.ApproxWeight;
  const totalPrice = activeCartProduct.totalPrice;
  const totalQty = activeCartProduct.totalQty;
  const DeliveryCost = activeCartProduct.DeliveryCost;
  const ShippingRate = activeCartProduct.ShippingRate;

  const [priceCat, setPriceCat] = useState([]);
  const [selectedPriceCat, setSelectedPriceCat] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductCategoryShippingRates().then((response) => {
      if (!_.isEmpty(response)) {
        const data = response.data?.productCategoryShippingRates;
        if (!_.isEmpty(data)) {
          setLoading(false);
          setPriceCat(data);
        }
      }
    });
  }, []);

  const getChinaLocalShippingCost = (
    totalPrice,
    chinaLocalShippingCharges,
    chinaLocalShippingChargeLimit
  ) => {
    let localShippingCost = chinaLocalShippingCharges;

    // localShippingCost = Number(totalPrice) >= chinaLocalShippingChargeLimit ? 0 : localShippingCost;

    return Number(localShippingCost);
  };

  const productTotalCost = () => {
    return (
      Number(totalPrice) +
      getChinaLocalShippingCost(
        totalPrice,
        chinaLocalShippingCharges,
        chinaLocalShippingChargeLimit
      )
    );
  };

  const handlePriceSet = (par) => {
    const catDetails = {
      category: par.category,
      shipping_rate: par.shipping_rate,
    };
    if (cartConfigured.length > 0) {
      setSelectedPriceCat(catDetails);
      addCategoryIntoVirtualCart(catDetails);
    } else {
      swal({
        text: `Dear customer,Please add product quantity first`,
        icon: "warning",
        buttons: "Ok, Understood",
      });
      return;
    }
  };

  return (
    <div>
      <table className="table table-sm table-bordered product_summary_table ">
        <tbody>
          <tr>
            <td>Product Category:</td>
            <td style={{ padding: 0 }}>
              {/* <div className='form-group mb-0'>
                <select
                  onChange={handleCategoryChange}
                  id='Category-select'
                  className='form-control linear-primary-bg '
                >
                  <option value='0'>Select Product Category</option>
                  {!loading &&
                    priceCat.length &&
                    priceCat.map((cat) => <option value={cat}> {cat.category}</option>)}
                </select>
              </div> */}

              <div className="dropdown text-center">
                <button
                  className="btn btn-default dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{
                    display: "block",
                    width: "100%",
                  }}
                >
                  Select Product Category
                </button>
                <div
                  className="dropdown-menu header-dropdown-link"
                  aria-labelledby="dropdownMenuButton"
                  style={{
                    width: "100%",
                    maxHeight: "220px",
                    overflowY: "auto",
                  }}
                >
                  {!loading &&
                    priceCat.length &&
                    priceCat.map((cat) => (
                      <p
                        onClick={() => handlePriceSet(cat)}
                        className="cat-item dropdown-item"
                      >
                        {cat.category}
                      </p>
                    ))}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Shipping (Per KG) :</td>
            {selectedPriceCat ? (
              <td>
                {currency} {selectedPriceCat.shipping_rate}
              </td>
            ) : (
              <td>0</td>
            )}
          </tr>
          <tr>
            <td colSpan={2} className="text-center">
              <span className="text-danger ">
                আপনার পণ্য নির্বাচন সঠিক না হলে আলিবা ইন্টারন্যাশনাল তা সংশোধন
                করার অধিকার রাখে।
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="summery-delTime">
        <p className="mb-0 air">By Air (15-20 Working Days)</p>
        <p className="mb-0">
          Eas. Delivery : {getIncreaseDay(15)} To {getIncreaseDay(20)}
        </p>
      </div>
      <table className="table table-sm table-bordered product_summary_table">
        <tbody>
          {/* <tr>
          <td className='bg-gray text-center  '>
            <strong>FROM CHINA </strong>
            <img className='country-im' src='https://wholesalecart.com/static/media/cn.10077f3e.svg' alt='' />
          </td>
          <td className='bg-gray text-center '>
            <strong> TO BANGLADESH</strong>
            <img className='country-im' src='https://wholesalecart.com/static/media/bd.7b147c00.svg' alt='' />
          </td>
        </tr> */}
          <tr>
            <td>Total Quantity:</td>
            <td>{`${totalQty || 0}`}</td>
          </tr>
          <tr>
            <td>Product Price:</td>
            <td>{`${currency} ${numberWithCommas(totalPrice)}`}</td>
          </tr>
          <tr>
            <td>Approx. Weight:</td>
            <td>{totalWeight || "0.000"} kg ( আনুমানিক)</td>
          </tr>
          <tr>
            <td>China Local Shipping charge:</td>
            <td>{`${currency} ${numberWithCommas(
              getChinaLocalShippingCost(
                totalPrice,
                chinaLocalShippingCharges,
                chinaLocalShippingChargeLimit
              )
            )}`}</td>
          </tr>
          {/* <tr>
          <td>Shipping charge:</td>
          <td>{`${currency} ${numberWithCommas(ShippingRate)}`} Per Kg</td>
        </tr> */}
          <tr>
            <td>Total Products Price:</td>
            <td>{`${currency} ${numberWithCommas(productTotalCost())}`}</td>
          </tr>
          {/* <tr>
            <td colSpan={2}>{china_to_bd_bottom_message}</td>
          </tr> */}
          <tr>
            <td colSpan={2} className="text-center">
              <span className="text-danger ">
                পন্য আসার পর চায়না থেকে বাংলাদেশ এর শিপিং চার্জ ও আপনার ঠিকানার
                ডেলিভারি চার্জ যুক্ত হবে। এখনে শুধুমাত্র পণ্যের মূল্য প্রকাশিত
                হচ্ছে।
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ProductSummary.propTypes = {
  general: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  cartConfigured: state.CART.virtualCart,
});

export default connect(mapStateToProps, {})(withRouter(ProductSummary));
