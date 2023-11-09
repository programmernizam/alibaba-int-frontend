import React from "react";
import { Link } from "react-router-dom";
import {
  cartColorAttributes,
  cartRefundProductQuantityUpdate,
  numberWithCommas,
} from "../../../../utils/CartHelpers";

const RefundTableConfigItems = (props) => {
  const { currency, product, config, cartConfigured, ShippingCharges } = props;

  const activeConfiguredQtyChanges = (existsConfig, product_id, type = "increment") => {
    let newQty = parseInt(existsConfig.refund_quantity) + 1;

    if (type === "decrement") {
      newQty = parseInt(existsConfig.refund_quantity) - 1;
    }
    let existsConfigId = Number(existsConfig.id);

    cartRefundProductQuantityUpdate(newQty, cartConfigured, product_id, existsConfigId, ShippingCharges);
  };

  const inputQtyChanges = (existsConfig, product_id, qty) => {
    const maxQuantity = existsConfig.quantity;
    if (Number(qty) <= Number(maxQuantity)) {
      cartRefundProductQuantityUpdate(qty, cartConfigured, product_id, existsConfig.Id, ShippingCharges);
    }
  };

  const unitTotalPrice = (Price, Qty) => {
    return numberWithCommas(Number(Price) * Number(Qty));
  };

  //   return "";
  return (
    <>
      <div className='row'>
        <div className='col-9 col-md-1'>
          <div className='text-center' style={{ width: "4rem" }}>
            {cartColorAttributes(JSON.parse(config.attributes), product).map((color, index4) => (
              <figure key={index4} className='m-0'>
                <Link to={`/product/${product.Id}`}>
                  <img src={color.MiniImageUrl} alt={color.Value} />
                </Link>
              </figure>
            ))}
          </div>
        </div>
        <div className='col-12 col-md-2'>
          <div className='align-middle'>
            <div className='Attributes fs-13'>
              {JSON.parse(config.attributes).map((Attribute, index3) => (
                <div key={index3 + 1} className='plain-attribute'>
                  <b>{Attribute.PropertyName} :</b>
                  <span>{` ${Attribute.Value}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='col-md-1'>
          <div className='align-middle'>
            <div className='price fs-13'>
              <b>Orderd :</b>
              <span>{config.quantity}</span>
            </div>
          </div>
        </div>
        <div className='col-md-2'>
          <div className='align-middle'>
            <div className='price fs-13'>
              <b>Price :</b>
              <span>{` ${currency} ${numberWithCommas(config.price)}`}</span>
            </div>
          </div>
        </div>

        <div className='col-md-4 text-center'>
          <div className='d-inline-block manage-quantity'>
            <div className='input-group input-group input-group-sm'>
              <div className='input-group-prepend'>
                <button
                  type='button'
                  onClick={(e) => activeConfiguredQtyChanges(config, product.id, "decrement")}
                  className='btn btn-default btn-refund'
                  disabled={config.refund_quantity <= 0}
                >
                  <i className='icon-minus' />
                </button>
              </div>
              <input
                type='text'
                className='form-control p-2 text-center addQ'
                value={config.refund_quantity}
                onChange={(e) => inputQtyChanges(config, product.id, e.target.value)}
                required={true}
              />
              <div className='input-group-append'>
                <button
                  type='button'
                  onClick={(e) => activeConfiguredQtyChanges(config, product.id)}
                  className='btn btn-default btn-refund'
                  // disabled={config.refund_quantity >= config.quantity}
                >
                  <i className='icon-plus' />
                </button>
              </div>
            </div>
          </div>
          {/* <p className='maxQuantityText'>Max Quantity: {config.MaxQuantity}</p> */}
        </div>
        <div className='col-md-2'>
          <div className='align-middle text-md-right text-start'>{`${currency} ${unitTotalPrice(
            config.price,
            config.refund_quantity
          )}`}</div>
        </div>
      </div>
    </>
  );
};

export default RefundTableConfigItems;
