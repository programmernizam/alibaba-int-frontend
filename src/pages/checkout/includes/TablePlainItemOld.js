import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  cartPlainProductQuantityUpdate,
  getUpdatedProductPrice,
  numberWithCommas,
} from "../../../utils/CartHelpers";
import { configAttrToConfigured } from "../../../utils/GlobalStateControl";
import { getSetting } from "../../../utils/Helpers";

const TablePlainItem = (props) => {
  const { currency, product, cartConfigured, ShippingCharges, general, width } = props;
  const bulkPriceQuantity = product.bulkPriceQuantity;
  const rate = getSetting(general, "increase_rate", 15);

  const unitTotalPrice = (Price, Qty) => {
    return numberWithCommas(Number(Price) * Number(Qty));
  };

  const addPlainProductQtyChanges = (product, type = "increment") => {
    let maxQuantity = product.MasterQuantity || 0;
    let newQty = parseInt(product.Quantity) + 1;
    if (type === "decrement") {
      newQty = parseInt(product.Quantity) - 1;
    }
    if (Number(newQty) <= Number(maxQuantity)) {
      cartPlainProductQuantityUpdate(
        newQty,
        getUpdatedProductPrice(newQty, bulkPriceQuantity, rate),
        cartConfigured,
        product.Id,
        ShippingCharges
      );
    }
  };

  const plainItemQtyChanges = (product, qty) => {
    if (Number(qty) <= Number(product.MasterQuantity)) {
      cartPlainProductQuantityUpdate(
        qty,
        getUpdatedProductPrice(qty, bulkPriceQuantity, rate),
        cartConfigured,
        product.Id,
        ShippingCharges
      );
    }
  };

  const checkboxToggle = (product, config = {}) => {
    let updatedProduct = { ...product, isChecked: !product.isChecked };
    let modified = cartConfigured.map((mapItem) =>
      mapItem.Id === updatedProduct.Id ? updatedProduct : mapItem
    );
    configAttrToConfigured(modified);
  };

  if (width < 768)
    return (
      <tr className='sm-td td'>
        <td className='text-center'>
          <input
            type='checkbox'
            name='checked_all'
            checked={product.isChecked}
            onChange={(event) => checkboxToggle(product, {})}
            id='checked_item'
          />
        </td>
        <td className='text-center' style={{ width: "7rem" }}>
          {
            <figure className='m-0'>
              <Link to={`/product/${product.Id}`}>
                <img src={product.MainPictureUrl} alt={product.Title} />
              </Link>
            </figure>
          }
        </td>
        <td className=''>
          <div className='product-title mb-0 bb-0 '>
            <Link className='dotText' to={`/product/${product.Id}`} title={product.Title}>
              {product.Title}
            </Link>
          </div>
          <div className='price'>
            <b>Price :</b>
            <span>{` ${currency} ${numberWithCommas(product.Price)}`}</span>
          </div>
        </td>
        <td className=' text-center'>
          <div className='product-title bb-0'>{`${currency} ${unitTotalPrice(
            product.Price,
            product.Quantity
          )}`}</div>
          <div>
            <div className='d-inline-block manage-quantity mr-3 my-2' style={{ maxWidth: "115px" }}>
              <div className='input-group input-group input-group-sm'>
                <div className='input-group-prepend-check'>
                  <button
                    type='button'
                    onClick={(e) => addPlainProductQtyChanges(product, "decrement")}
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
                  value={product.Quantity}
                  onChange={(e) => plainItemQtyChanges(product, e.target.value)}
                  min={1}
                  max={10}
                  step={1}
                  data-decimals={0}
                  required={true}
                />
                <div className='input-group-append'>
                  <button
                    type='button'
                    onClick={(e) => addPlainProductQtyChanges(product)}
                    className='btn btn-default sh'
                    style={{ padding: "0" }}
                  >
                    <i className='icon-plus' />
                  </button>
                </div>
              </div>
            </div>
            <span className='maxQuantityText'>Max Quantity: {product.MasterQuantity}</span>
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
          checked={product.isChecked}
          onChange={(event) => checkboxToggle(product, {})}
          id='checked_item'
        />
      </td>
      <td className='text-center' style={{ width: "7rem" }}>
        {
          <figure className='m-0'>
            <Link to={`/product/${product.Id}`}>
              <img src={product.MainPictureUrl} alt={product.Title} />
            </Link>
          </figure>
        }
      </td>
      <td className='align-middle'>
        <div className='product-title mb-0'>
          <Link className='dotText' to={`/product/${product.Id}`} title={product.Title}>
            {product.Title}
          </Link>
        </div>
        <div className='price'>
          <b>Price :</b>
          <span>{` ${currency} ${numberWithCommas(product.Price)}`}</span>
        </div>
        <div className='d-inline-block manage-quantity mr-3 my-2' style={{ maxWidth: "115px" }}>
          <div className='input-group input-group input-group-sm'>
            <div className='input-group-prepend'>
              <button
                type='button'
                onClick={(e) => addPlainProductQtyChanges(product, "decrement")}
                className='btn btn-default'
              >
                <i className='icon-minus' />
              </button>
            </div>
            <input
              type='text'
              className='form-control p-2 text-center addQ'
              defaultValue={1}
              value={product.Quantity}
              onChange={(e) => plainItemQtyChanges(product, e.target.value)}
              min={1}
              max={10}
              step={1}
              data-decimals={0}
              required={true}
            />
            <div className='input-group-append'>
              <button
                type='button'
                onClick={(e) => addPlainProductQtyChanges(product)}
                className='btn btn-default'
              >
                <i className='icon-plus' />
              </button>
            </div>
          </div>
        </div>
        <span className='maxQuantityText'>Max Quantity: {product.MasterQuantity}</span>
      </td>
      <td className='align-middle text-center'>{`${currency} ${unitTotalPrice(
        product.Price,
        product.Quantity
      )}`}</td>
    </tr>
  );
};

TablePlainItem.propTypes = {
  currency: PropTypes.string.isRequired,
  product: PropTypes.object.isRequired,
  cartConfigured: PropTypes.array.isRequired,
  ShippingCharges: PropTypes.array.isRequired,
};

export default TablePlainItem;
