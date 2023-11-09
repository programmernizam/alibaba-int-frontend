import React, { useEffect, useState } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { connect } from "react-redux";
import { loadGeneral } from "../../store/actions/InitAction";
import { authLogout } from "../../store/actions/AuthAction";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getSetting, goPageTop, useWindowSize } from "../../utils/Helpers";
import {
  numberWithCommas,
  cartCheckedProductTotal,
  CheckoutSummary,
  getChinaLocalShippingCost,
  updateAddStoredCart,
} from "../../utils/CartHelpers";
import { configAttrToConfigured } from "../../utils/GlobalStateControl";
import CheckoutSidebar from "./includes/CheckoutSidebar";
import swal from "sweetalert";
import TableConfigItems from "./includes/TableConfigItems";
import { MdDeleteForever } from "react-icons/md";
import TablePlainItem from "./includes/TablePlainItem";
import LazyImage from "../../components/common/LazyImage";

const Checkout = (props) => {
  const { cartConfigured, general, auth } = props;
  const [allCheck, setAllCheck] = useState(false);

  let [width] = useWindowSize();
  width = width ? width : window.innerWidth;

  const currency = getSetting(general, "currency_icon");
  const ShippingCharges = getSetting(general, "china_local_delivery_charge");
  const chinaLocalShippingChargeLimit = getSetting(general, "china_local_delivery_charge_limit");
  const summary = CheckoutSummary(cartConfigured, ShippingCharges, chinaLocalShippingChargeLimit);

  useEffect(() => {
    checkedAllItem();
  }, []);

  useEffect(() => {
    goPageTop();
  }, []);

  const checkedAllItem = () => {
    const checking = !allCheck;
    setAllCheck(checking);
    let modified = cartConfigured.map((product) => {
      let ConfiguredItems = product.ConfiguredItems.map((configMap) => {
        return { ...configMap, isChecked: checking };
      });
      return { ...product, ConfiguredItems: ConfiguredItems, isChecked: checking };
    });
    configAttrToConfigured(modified);
    // updateAddStoredCart(modified, auth.shopAsCustomer.id, auth.isShopAsCustomer);
  };

  const checkboxToggle = (product) => {
    let updatedProduct = { ...product, isChecked: !product.isChecked };

    let modified = cartConfigured.map((mapItem) =>
      mapItem.Id === updatedProduct.Id ? updatedProduct : mapItem
    );
    configAttrToConfigured(modified);
    updateAddStoredCart(modified, auth.shopAsCustomer.id, auth.isShopAsCustomer);
  };

  const removeItemFromCart = (e) => {
    e.preventDefault();
    swal({
      title: "Are you want to remove?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let modified = cartConfigured.map((mapItem) => {
          let ConfiguredItems = mapItem.ConfiguredItems.map((mapConfig) =>
            !mapConfig.isChecked ? mapConfig : { notFound: true }
          );
          ConfiguredItems = ConfiguredItems.filter((filter) => filter.notFound !== true);
          if (ConfiguredItems.length > 0) {
            return { ...mapItem, ConfiguredItems: ConfiguredItems };
          }
          return { notFound: true };
        });
        modified = modified.filter((filter) => filter.notFound !== true);
        configAttrToConfigured(modified);
        updateAddStoredCart(modified, auth.shopAsCustomer.id, auth.isShopAsCustomer);
      }
    });
  };

  // const totalShippingCost = (product, isChecked = false) => {
  //   let returnValue = 0;
  //   if (isChecked) {
  //     const checkItemSubTotal = cartCheckedProductTotal(product);
  //     const totalPrice = checkItemSubTotal.totalPrice;
  //     returnValue = getChinaLocalShippingCost(totalPrice);
  //   }
  //   return returnValue;
  // };

  const productTotalCost = (product, isChecked) => {
    const checkItemSubTotal = cartCheckedProductTotal(product);
    const totalPrice = checkItemSubTotal.totalPrice;
    const ShippingCost = getChinaLocalShippingCost(
      totalPrice,
      ShippingCharges,
      chinaLocalShippingChargeLimit,
      product.isChecked
    );
    return Number(totalPrice) + Number(ShippingCost);
  };
  // const configuredProductTotalCost = (product, config, isChecked) => {
  //   const totalPrice = config.Price * config.Quantity;
  //   const ShippingCost = totalShippingCost(product, isChecked);
  //   return Number(totalPrice) + Number(ShippingCost);
  // };

  const handleDeleteItem = (product) => {
    swal({
      title: "Are you want to remove?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let modified = cartConfigured.filter((filterItem) => filterItem.Id !== product.Id);
        configAttrToConfigured(modified);
        updateAddStoredCart(modified, auth.shopAsCustomer.id, auth.isShopAsCustomer);
      }
    });
  };

  return (
    <main className='main'>
      <Breadcrumb current='Checkout' />

      <div className='page-content'>
        <div className='cart'>
          <div className='container'>
            <div className='row'>
              <div className={`${cartConfigured.length > 0 ? "col-lg-8" : "col-lg-12"}`}>
                <div className='card bim-lr'>
                  <div className='checkTable table-responsive-sm '>
                    <table className='table table table-cart'>
                      <thead>
                        <tr>
                          <th className='text-start'>
                            <input
                              type='checkbox'
                              checked={allCheck}
                              onChange={(e) => checkedAllItem()}
                              name='checked_all'
                            />
                          </th>
                          <th colSpan={4}>
                            <div className='flexBetween'>
                              <div>
                                <div>
                                  <span>Product</span>
                                  <a
                                    href='/remove'
                                    onClick={(e) => removeItemFromCart(e)}
                                    title='Save Cart'
                                    className='cart-remove'
                                  >
                                    Remove
                                  </a>
                                  {/* <a
                                    href='/remove'
                                    onClick={(e) => removeItemFromCart(e)}
                                    title='Remove'
                                    className='cart-remove'
                                  >
                                    Remove
                                  </a> */}
                                </div>
                              </div>
                              <div className='bold'> Total</div>
                            </div>
                          </th>
                          {/* <th className='text-center totalWi'>Total</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {cartConfigured.length > 0 ? (
                          <>
                            {cartConfigured.map((product, index) => {
                              return (
                                <>
                                  {product.hasConfigurators ? (
                                    <tr>
                                      <td className='text-start' style={{ verticalAlign: "top" }}>
                                        <input
                                          type='checkbox'
                                          name='checked_item'
                                          id='checked_item'
                                          checked={product.isChecked}
                                          onChange={(event) => checkboxToggle(product)}
                                        />
                                      </td>
                                      <td className='text-center mainImg' style={{ verticalAlign: "top" }}>
                                        {
                                          <figure className='m-0'>
                                            <Link to={`/product/${product.Id}`}>
                                              {/* <LazyImage
                                                product={product}
                                                classes=''
                                                imageSrc={product.MainPictureUrl}
                                                imageAlt={product.Title}
                                              /> */}
                                              <img src={product.MainPictureUrl} alt={product.Title} />
                                            </Link>
                                          </figure>
                                        }
                                      </td>
                                      <td colSpan={3}>
                                        <div className='flexBetween'>
                                          <div className='product-title mb-0 pb-0'>
                                            <Link
                                              className='dotText bold'
                                              to={`/product/${product.Id}`}
                                              title={product.Title}
                                            >
                                              {product.Title}
                                            </Link>
                                          </div>

                                          <div>
                                            <MdDeleteForever
                                              onClick={() => handleDeleteItem(product)}
                                              className='deleteItem'
                                              size={24}
                                            />
                                          </div>
                                        </div>
                                        <div>
                                          {product.ConfiguredItems.map((config, index2) => (
                                            <div className='singleVariant'>
                                              <TableConfigItems
                                                key={index2}
                                                currency={currency}
                                                product={product}
                                                config={config}
                                                cartConfigured={cartConfigured}
                                                ShippingCharges={ShippingCharges}
                                                general={general}
                                                width={width}
                                                auth={auth}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    <>
                                      <tr>
                                        <td className='text-start'>
                                          <input
                                            type='checkbox'
                                            name='checked_all'
                                            id='checked_item'
                                            checked={product.isChecked}
                                            onChange={(event) => checkboxToggle(product)}
                                          />
                                        </td>
                                        <td className='text-center mainImg'>
                                          {
                                            <figure className='m-0'>
                                              <Link to={`/product/${product.Id}`}>
                                                {/* <LazyImage
                                                  product={product}
                                                  classes=''
                                                  imageSrc={product.MainPictureUrl}
                                                  imageAlt={product.Title}
                                                /> */}
                                                <img src={product.MainPictureUrl} alt={product.Title} />
                                              </Link>
                                            </figure>
                                          }
                                        </td>
                                        <td colSpan={3}>
                                          <div className='flexBetween'>
                                            <div className='product-title mb-0 pb-0'>
                                              <Link
                                                className='dotText bold'
                                                to={`/product/${product.Id}`}
                                                title={product.Title}
                                              >
                                                {product.Title}
                                              </Link>
                                            </div>

                                            <div>
                                              <MdDeleteForever
                                                onClick={() => handleDeleteItem(product)}
                                                className='deleteItem'
                                                size={24}
                                              />
                                            </div>
                                          </div>
                                          <div>
                                            <TablePlainItem
                                              currency={currency}
                                              product={product}
                                              cartConfigured={cartConfigured}
                                              ShippingCharges={ShippingCharges}
                                              general={general}
                                              width={width}
                                              auth={auth}
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                  <tr>
                                    <td></td>
                                    <td></td>

                                    <td colSpan={3} className='text-right bold'>
                                      China Local Shipping cost:{" "}
                                      {`${currency} ${numberWithCommas(
                                        getChinaLocalShippingCost(
                                          product.totalPrice,
                                          ShippingCharges,
                                          chinaLocalShippingChargeLimit,
                                          product.isChecked
                                        )
                                      )}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td></td>
                                    <td></td>

                                    <td colSpan={3} className='text-right bold'>
                                      SubTotal: {`${currency} ${numberWithCommas(productTotalCost(product))}`}
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                            {/* <tr>
                              <td></td>
                              <td></td>
                              <td colSpan={3} className='text-right bold'>
                                China Local Shipping cost:
                                {`${currency} ${numberWithCommas(
                                  getChinaLocalShippingCost(totalPriceWithoutShipping)
                                )}`}
                              </td>
                            </tr> */}
                            <tr>
                              <td></td>
                              <td></td>
                              <td colSpan={3} className='text-right bold'>
                                Total:
                                {`${currency} ${numberWithCommas(summary.totalPrice)}`}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan={4} className='text-center bg-lighter'>
                              You have no cart!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* End .col-lg-9 */}

              {cartConfigured.length > 0 ? (
                <CheckoutSidebar currency={currency} ShippingCharges={ShippingCharges} />
              ) : (
                ""
              )}

              {/* End .col-lg-3 */}
            </div>
            {/* End .row */}
          </div>
          {/* End .container */}
        </div>
        {/* End .cart */}
      </div>
      {/* End .page-content */}
    </main>
  );
};

Checkout.propTypes = {
  general: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  cartConfigured: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  user: state.AUTH.user,
  auth: state.AUTH,
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, { loadGeneral, authLogout })(withRouter(Checkout));
