import React from "react";
import {
  cartColorAttributes,
  cartProductQuantityUpdate,
  getCartUpdatedProductPrice,
  numberWithCommas,
  updateAddStoredCart,
} from "../../../utils/CartHelpers";
import { Link } from "react-router-dom";
import { configAttrToConfigured } from "../../../utils/GlobalStateControl";
import _ from "lodash";
import { getSetting } from "../../../utils/Helpers";
import { MdDeleteForever } from "react-icons/md";
import swal from "sweetalert";
import LazyImage from "../../../components/common/LazyImage";

const TableConfigItems = (props) => {
  const { currency, product, config, cartConfigured, ShippingCharges, general, width, auth } = props;
  const bulkPriceQuantity = product.bulkPriceQuantity;
  const rate = getSetting(general, "increase_rate", 15);
  const minOrderPrice = getSetting(general, "min_order_amount");
  const minOrderQuantity = getSetting(general, "min_order_quantity");
  const addToVirtualCart = false;
  const activeConfiguredQtyChanges = (existsConfig, product_id, type = "increment") => {
    let newQty = parseInt(existsConfig.Quantity) + 1;
    const maxQuantity = !_.isEmpty(existsConfig) ? existsConfig.MaxQuantity : 0;
    if (type === "decrement") {
      newQty = parseInt(existsConfig.Quantity) - 1;
    }
    if (Number(newQty) <= Number(maxQuantity)) {
      cartProductQuantityUpdate(
        newQty,
        getCartUpdatedProductPrice(newQty, bulkPriceQuantity, product, rate, config),
        cartConfigured,
        product_id,
        existsConfig.Id,
        ShippingCharges,
        addToVirtualCart,
        auth.shopAsCustomer.id,
        auth.isShopAsCustomer
      );
    }
  };

  const inputQtyChanges = (existsConfig, product_id, qty) => {
    const maxQuantity = !_.isEmpty(existsConfig) ? existsConfig.MaxQuantity : 0;
    if (qty < 1) qty = 1;
    if (Number(qty) <= Number(maxQuantity)) {
      cartProductQuantityUpdate(
        qty,
        getCartUpdatedProductPrice(qty, bulkPriceQuantity, product, rate, config),
        cartConfigured,
        product_id,
        existsConfig.Id,
        ShippingCharges,
        addToVirtualCart,
        auth.shopAsCustomer.id,
        auth.isShopAsCustomer
      );
    }
  };

  const unitTotalPrice = (Price, Qty) => {
    return numberWithCommas(Number(Price) * Number(Qty));
  };

  const handleDeleteItemVariation = (product, config = {}) => {
    if (product.ConfiguredItems.length <= 1) {
      swal({
        text: `Dear customer, this product should be ordered for a minimum of ${minOrderQuantity} pieces and ${minOrderPrice} taka!`,
        icon: "warning",
        buttons: "Ok, Understood",
      });
      return;
    } else {
      let ConfiguredItems = product.ConfiguredItems.map((configItem) =>
        configItem.Id === config.Id
          ? {
              ...config,
              isChecked: false,
            }
          : configItem
      );
      ConfiguredItems = ConfiguredItems.filter((config) => config.isChecked === true);

      let updatedProduct = { ...product, ConfiguredItems: ConfiguredItems };

      let modified = cartConfigured.map((mapItem) =>
        mapItem.Id === updatedProduct.Id ? updatedProduct : mapItem
      );
      configAttrToConfigured(modified);
      updateAddStoredCart(modified, auth.shopAsCustomer.id, auth.isShopAsCustomer);
    }
  };

  if (width < 768)
    return (
      <div className='row'>
        <div className='col-5'>
          <div className='flex'>
            <div className='text-center mx-2' style={{ width: "3rem" }}>
              {cartColorAttributes(config.Attributes, product).map((color, index4) => (
                <figure key={index4} className='m-0'>
                  <Link to={`/product/${product.Id}`}>
                    {/* <LazyImage
                      product={product}
                      classes=''
                      imageSrc={color.MiniImageUr}
                      imageAlt={color.Value}
                    /> */}
                    <img src={color.MiniImageUrl} alt={color.Value} />
                  </Link>
                </figure>
              ))}
            </div>
            <div className='align-middle'>
              <div className='Attributes fs-13'>
                {config.Attributes.map((Attribute, index3) => (
                  <div key={index3 + 1} className='plain-attribute'>
                    <b>{Attribute.PropertyName} :</b>
                    <span>{` ${Attribute.Value}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='col-5'>
          <div className='text-right'>
            <div className='d-inline-block manage-quantity my-2' style={{ maxWidth: "115px" }}>
              <div className='input-group input-group input-group-sm'>
                <div className='input-group-prepend'>
                  <button
                    type='button'
                    onClick={(e) => activeConfiguredQtyChanges(config, product.Id, "decrement")}
                    className='btn btn-default sh'
                    style={{ padding: "0" }}
                    disabled={config.Quantity < 2}
                  >
                    <i className='icon-minus' />
                  </button>
                </div>
                <input
                  type='text'
                  className='form-control p-2 text-center '
                  defaultValue={1}
                  value={config.Quantity}
                  onChange={(e) => inputQtyChanges(config, product.Id, e.target.value)}
                  min={1}
                  max={10}
                  step={1}
                  data-decimals={0}
                  required={true}
                />
                <div className='input-group-append'>
                  <button
                    type='button'
                    onClick={(e) => activeConfiguredQtyChanges(config, product.Id)}
                    className='btn btn-default sh'
                    style={{ padding: "0" }}
                  >
                    <i className='icon-plus' />
                  </button>
                </div>
              </div>
            </div>
            <p className='maxQuantityText'>Max Quantity: {config.MaxQuantity}</p>
          </div>
        </div>
        <div className='col-2'>
          <div className='text-center'>
            <MdDeleteForever
              onClick={() => handleDeleteItemVariation(product, config)}
              className='deleteItem'
              size={18}
            />
          </div>
        </div>
        <div className='col-6'>
          <div className='align-middle'>
            <div className='price fs-13'>
              <b>Price :</b>
              <span>{` ${currency} ${numberWithCommas(config.Price)}`}</span>
            </div>
          </div>
        </div>

        <div className='col-6'>
          <div className='align-middle text-right'>{`${currency} ${unitTotalPrice(
            config.Price,
            config.Quantity
          )}`}</div>
        </div>
      </div>
    );

  return (
    <div className='row'>
      <div className='col-9 col-md-1'>
        <div className='text-center' style={{ width: "4rem" }}>
          {cartColorAttributes(config.Attributes, product).map((color, index4) => (
            <figure key={index4} className='m-0'>
              <Link to={`/product/${product.Id}`}>
                <img src={color.MiniImageUrl} alt={color.Value} />
              </Link>
            </figure>
          ))}
        </div>
      </div>
      <div className='col-12 col-md-3'>
        <div className='align-middle'>
          <div className='Attributes fs-13'>
            {config.Attributes.map((Attribute, index3) => (
              <div key={index3 + 1} className='plain-attribute'>
                <b>{Attribute.PropertyName} :</b>
                <span>{` ${Attribute.Value}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='col-md-2'>
        <div className='align-middle'>
          <div className='price fs-13'>
            <b>Price :</b>
            <span>{` ${currency} ${numberWithCommas(config.Price)}`}</span>
          </div>
        </div>
      </div>
      <div className='col-md-3 text-center'>
        <div className='d-inline-block manage-quantity' style={{ maxWidth: "115px" }}>
          <div className='input-group input-group input-group-sm'>
            <div className='input-group-prepend'>
              <button
                type='button'
                onClick={(e) => activeConfiguredQtyChanges(config, product.Id, "decrement")}
                className='btn btn-default'
                disabled={config.Quantity < 2}
              >
                <i className='icon-minus' />
              </button>
            </div>
            <input
              type='text'
              className='form-control p-2 text-center addQ'
              defaultValue={1}
              value={config.Quantity}
              onChange={(e) => inputQtyChanges(config, product.Id, e.target.value)}
              min={1}
              max={10}
              step={1}
              data-decimals={0}
              required={true}
            />
            <div className='input-group-append'>
              <button
                type='button'
                onClick={(e) => activeConfiguredQtyChanges(config, product.Id)}
                className='btn btn-default'
              >
                <i className='icon-plus' />
              </button>
            </div>
          </div>
        </div>
        <p className='maxQuantityText'>Max Quantity: {config.MaxQuantity}</p>
      </div>
      <div className='col-md-2'>
        <div className='align-middle text-right'>{`${currency} ${unitTotalPrice(
          config.Price,
          config.Quantity
        )}`}</div>
      </div>

      <div className='col-3 col-md-1'>
        <div className='text-right'>
          <MdDeleteForever
            onClick={() => handleDeleteItemVariation(product, config)}
            className='deleteItem'
            size={22}
          />
        </div>
      </div>
    </div>
  );
};

export default TableConfigItems;
