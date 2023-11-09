import React from "react";

import {
  cartPlainProductQuantityUpdate,
  getUpdatedProductPrice,
  numberWithCommas,
} from "../../../utils/CartHelpers";
import { getSetting } from "../../../utils/Helpers";

const TablePlainItem = (props) => {
  const { currency, product, cartConfigured, ShippingCharges, general, auth } = props;
  const bulkPriceQuantity = product.bulkPriceQuantity;
  const rate = getSetting(general, "increase_rate", 15);
  const addToVirtualCart = false;

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
        ShippingCharges,
        addToVirtualCart,
        auth.shopAsCustomer.id,
        auth.isShopAsCustomer
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
        ShippingCharges,
        addToVirtualCart,
        auth.shopAsCustomer.id,
        auth.isShopAsCustomer
      );
    }
  };
  return (
    <div className='row py-2'>
      <div className='col-7 col-md-6'>
        <div className='text-right'>
          <div className='price fs-13'>
            <b>Price :</b>
            <span>{` ${currency} ${numberWithCommas(product.Price)}`}</span>
          </div>
        </div>
      </div>
      <div className='d-none d-md-block col-8 col-md-3 text-center'>
        <div className='d-inline-block manage-quantity' style={{ maxWidth: "115px" }}>
          <div className='input-group input-group input-group-sm'>
            <div className='input-group-prepend'>
              <button
                type='button'
                onClick={(e) => addPlainProductQtyChanges(product, "decrement")}
                className='btn btn-default'
                disabled={product.Quantity < 2}
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
        <p className='maxQuantityText'>Max Quantity: {product.MaxQuantity}</p>
      </div>
      <div className='col-5 d-block d-md-none'>
        <div className='text-right'>
          <div className='d-inline-block manage-quantity my-2' style={{ maxWidth: "115px" }}>
            <div className='input-group input-group input-group-sm'>
              <div className='input-group-prepend'>
                <button
                  type='button'
                  onClick={(e) => addPlainProductQtyChanges(product, "decrement")}
                  className='btn btn-default sh'
                  style={{ padding: "0" }}
                  disabled={product.Quantity < 2}
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
          <p className='maxQuantityText'>Max Quantity: {product.MaxQuantity}</p>
        </div>
      </div>
      <div className='col-md-3'>
        <div className='align-middle text-right'>{`${currency} ${unitTotalPrice(
          product.Price,
          product.Quantity
        )}`}</div>
      </div>
    </div>
  );
};

export default TablePlainItem;
