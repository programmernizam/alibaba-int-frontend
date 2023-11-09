import React from "react";
import {
  cartColorAttributes,
  cartProductQuantityUpdate,
  getUpdatedProductPrice,
  numberWithCommas,
} from "../../../utils/CartHelpers";
import { Link } from "react-router-dom";
import { configAttrToConfigured } from "../../../utils/GlobalStateControl";
import _ from "lodash";
import { getSetting } from "../../../utils/Helpers";

const TableConfigItems = (props) => {
  const { currency, product, config, cartConfigured, ShippingCharges, general, width } = props;
  const bulkPriceQuantity = product.bulkPriceQuantity;
  const rate = getSetting(general, "increase_rate", 15);

  const activeConfiguredQtyChanges = (existsConfig, product_id, type = "increment") => {
    let newQty = parseInt(existsConfig.Quantity) + 1;
    const maxQuantity = !_.isEmpty(existsConfig) ? existsConfig.MaxQuantity : 0;
    if (type === "decrement") {
      newQty = parseInt(existsConfig.Quantity) - 1;
    }
    if (Number(newQty) <= Number(maxQuantity)) {
      cartProductQuantityUpdate(
        newQty,
        getUpdatedProductPrice(newQty, bulkPriceQuantity, rate),
        cartConfigured,
        product_id,
        existsConfig.Id,
        ShippingCharges
      );
    }
  };

  const inputQtyChanges = (existsConfig, product_id, qty) => {
    const maxQuantity = !_.isEmpty(existsConfig) ? existsConfig.MaxQuantity : 0;
    if (Number(qty) <= Number(maxQuantity)) {
      cartProductQuantityUpdate(
        qty,
        getUpdatedProductPrice(qty, bulkPriceQuantity, rate),
        cartConfigured,
        product_id,
        existsConfig.Id,
        ShippingCharges
      );
    }
  };

  const unitTotalPrice = (Price, Qty) => {
    return numberWithCommas(Number(Price) * Number(Qty));
  };

  const checkboxToggle = (product, config = {}) => {
    let ConfiguredItems = product.ConfiguredItems.map((configItem) =>
      configItem.Id === config.Id
        ? {
            ...config,
            isChecked: !config.isChecked,
          }
        : configItem
    );

    let updatedProduct = { ...product, ConfiguredItems: ConfiguredItems };

    let modified = cartConfigured.map((mapItem) =>
      mapItem.Id === updatedProduct.Id ? updatedProduct : mapItem
    );
    configAttrToConfigured(modified);
  };

  if (width < 768)
    return (
      <tr className='sm-td'>
        <td className='text-center'>
          <input
            type='checkbox'
            name='checked_all'
            checked={config.isChecked}
            onChange={(event) => checkboxToggle(product, config)}
            id='checked_item'
          />
        </td>
        <td className='text-center' style={{ width: "7rem" }}>
          {cartColorAttributes(config.Attributes, product).map((color, index4) => (
            <figure key={index4} className='m-0'>
              <Link to={`/product/${product.Id}`}>
                <img src={color.MiniImageUrl} alt={color.Value} />
              </Link>
            </figure>
          ))}
        </td>
        <td className=''>
          <div className='product-title mb-0 bb-0'>
            <Link className='dotText bold' to={`/product/${product.Id}`} title={product.Title}>
              {/*{characterLimiter(product.Title)}*/}
              {product.Title}
            </Link>
          </div>
          <div className='Attributes'>
            {config.Attributes.map((Attribute, index3) => (
              <div key={index3 + 1} className='plain-attribute'>
                <b>{Attribute.PropertyName} :</b>
                <span>{` ${Attribute.Value}`}</span>
              </div>
            ))}
          </div>
          <div className='price'>
            <b>Price :</b>
            <span>{` ${currency} ${numberWithCommas(config.Price)}`}</span>
          </div>
        </td>
        <td className='text-center'>
          <div className='product-title bb-0'>{`${currency} ${unitTotalPrice(
            config.Price,
            config.Quantity
          )}`}</div>
          <div>
            <div className='d-inline-block manage-quantity mr-3 my-2' style={{ maxWidth: "115px" }}>
              <div className='input-group input-group input-group-sm'>
                <div className='input-group-prepend'>
                  <button
                    type='button'
                    onClick={(e) => activeConfiguredQtyChanges(config, product.Id, "decrement")}
                    className='btn btn-default sh'
                    style={{ padding: "0" }}
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
            <span className='maxQuantityText'>Max Quantity: {config.MaxQuantity}</span>
          </div>
        </td>
      </tr>
    );

  return (
    <tr>
      <td className='text-center'>
        <input
          type='checkbox'
          name='checked_all'
          checked={config.isChecked}
          onChange={(event) => checkboxToggle(product, config)}
          id='checked_item'
        />
      </td>
      <td className='text-center' style={{ width: "7rem" }}>
        {cartColorAttributes(config.Attributes, product).map((color, index4) => (
          <figure key={index4} className='m-0'>
            <Link to={`/product/${product.Id}`}>
              <img src={color.MiniImageUrl} alt={color.Value} />
            </Link>
          </figure>
        ))}
      </td>
      <td className='align-middle'>
        <div className='product-title mb-0'>
          <Link className='dotText' to={`/product/${product.Id}`} title={product.Title}>
            {/*{characterLimiter(product.Title)}*/}
            {product.Title}
          </Link>
        </div>
        <div className='Attributes'>
          {config.Attributes.map((Attribute, index3) => (
            <div key={index3 + 1} className='plain-attribute'>
              <b>{Attribute.PropertyName} :</b>
              <span>{` ${Attribute.Value}`}</span>
            </div>
          ))}
        </div>
        <div className='price'>
          <b>Price :</b>
          <span>{` ${currency} ${numberWithCommas(config.Price)}`}</span>
        </div>
        <div className='d-inline-block manage-quantity mr-3 my-2' style={{ maxWidth: "115px" }}>
          <div className='input-group input-group input-group-sm'>
            <div className='input-group-prepend'>
              <button
                type='button'
                onClick={(e) => activeConfiguredQtyChanges(config, product.Id, "decrement")}
                className='btn btn-default'
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
        <span className='maxQuantityText'>Max Quantity: {config.MaxQuantity}</span>
      </td>
      <td className='align-middle text-center'>{`${currency} ${unitTotalPrice(
        config.Price,
        config.Quantity
      )}`}</td>
    </tr>
  );
};

export default TableConfigItems;
