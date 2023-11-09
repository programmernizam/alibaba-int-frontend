import React, { useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import { getBusinessDateCount, getSetting, useWindowSize } from "../../../utils/Helpers";
import { BsPrinterFill, BsArrowDownUp } from "react-icons/bs";
import { numberWithCommas } from "../../../utils/CartHelpers";
import { useReactToPrint } from "react-to-print";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import refunded from "../../../assets/images/cd/refund.png";
import purchased from "../../../assets/images/cd/purchased.png";
import receivedchina from "../../../assets/images/cd/recived-china.png";
import shippedchina from "../../../assets/images/cd/processing .png";
import receivedBD from "../../../assets/images/cd/recieved.png";
import transit from "../../../assets/images/cd/transit.png";
import bdC from "../../../assets/images/cd/recieved -bd.png";

import delivered from "../../../assets/images/cd/delivered.png";
import { connect } from "react-redux";

const OrderItem = ({ item, isOpen, toggle, index, general }) => {
  // console.log("item ", item);
  const {
    order_item_number,
    item_variations,
    chinaLocalDelivery,
    product_value,
    first_payment,
    actual_weight,
    shipping_rate,
    status,
    ready_to_deliver_at,
  } = item;

  const currency = getSetting(general, "currency_icon");
  let [width] = useWindowSize();
  width = width ? width : window.innerWidth;

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Order- ${1}.pdf`,
  });

  const stausArr1 = [
    { status: "purchased", image: purchased },
    { status: "received-in-china-warehouse", image: receivedchina },
    { status: "shipped-from-china-warehouse", image: transit },
    { status: "BD-customs", image: bdC },
    { status: "received-in-BD-warehouse", image: receivedBD },
    { status: "ready-to-deliver", image: shippedchina },
    { status: "delivered", image: delivered },
  ];

  return (
    <div className='card my-2 my-md-4 hov-shadow' ref={componentRef}>
      <div className='card-header border border-bottom-0 px-2 py-0 py-md-4'>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <h4 className='bold order-title'>Order No:{order_item_number}</h4>
          </div>

          <div className='text-right'>
            <button onClick={handlePrint} className='btn btn-default-sm bold' style={{ marginTop: ".2rem" }}>
              <BsPrinterFill size={18} className='mr-2' /> Print
            </button>
            <p className='m-0'>Day: {getBusinessDateCount(item.order.created_at, ready_to_deliver_at)}</p>
          </div>
        </div>
        {item.status === "refunded" ? (
          <div className={`d-flex justify-content-center flex-column align-items-center p-0 p-md-2`}>
            <div className={`border-image-clip-path`}>
              <img className='status-img' src={refunded} alt='' />
            </div>
            <p className='text-center text-uppercase status-title'>Refunded</p>
            <p className='text-center status-update'>{item.updated_at.slice(0, 10)}</p>
          </div>
        ) : item.status === "delivered" ? (
          <div className={`d-flex justify-content-center flex-column align-items-center p-0 p-md-2`}>
            <div className={`border-image-clip-path`}>
              <img className='status-img' src={delivered} alt='' />
            </div>
            <p className='text-center text-uppercase status-title'>delivered doorstep</p>
            <p className='text-center status-update'>{item.updated_at.slice(0, 10)}</p>
          </div>
        ) : (
          <div className='p-0 p-md-2 statusBoxes'>
            {stausArr1.map((el, i) => {
              return (
                <div
                  className={`d-flex justify-content-center flex-column align-items-center p-0 p-md-2 ${
                    el.status === "delivered" && `op-50`
                  } `}
                  key={i}
                >
                  <div className={`${el.status === item.status && `border-image-clip-path`} `}>
                    <img className='status-img' src={el.image} alt='' />
                  </div>
                  <p className='text-center text-uppercase status-title'>
                    {el.status === "delivered" ? <span>delivered doorstep</span> : el.status}
                  </p>
                  {el.status === item.status && (
                    <p className='text-center status-update'>{item.updated_at.slice(0, 10)}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className='card-body border px-2 py-0 py-md-4'>
        <div className='d-flex '>
          <div style={{ marginTop: ".8rem" }}>
            <Link to={`${item.link}`}>
              <img src={item.image} style={{ width: "70px" }} alt='' />
            </Link>
          </div>
          <div className='ml-2'>
            <Link to={`${item.link}`} className='text-secondary text-uppercase'>
              {width >= 768 ? (
                <span className='bold'>{item.name}</span>
              ) : (
                <span className='bold'>{item.name.slice(0, 45)}...</span>
              )}
            </Link>
          </div>
        </div>
        <div className='details py-1 py-md-3'>
          <div className='collapse' id={`collapseDetails${index}`}>
            {item_variations.length > 0 ? (
              item_variations.map((config, index) => (
                <div key={index} className='row' style={{ borderTop: "1px solid lightGray" }}>
                  <div className='col-7 col-md-5 Attributes  '>
                    {JSON.parse(config.attributes).map((Attribute, index3) => (
                      <div key={index3 + 1} className='plain-attribute'>
                        <b>{Attribute.PropertyName} :</b>
                        <span>{` ${Attribute.Value}`}</span>
                      </div>
                    ))}
                  </div>
                  <div className='col-5 col-md-2 plain-attribute text-right text-md-left'>
                    <b>Quantity :</b>
                    <span>{` ${config.quantity}`}</span>
                  </div>

                  <div className='col-6 col-md-2 plain-attribute'>
                    <b>Price :</b>
                    <span>
                      {currency} {` ${config.price}`}
                    </span>
                  </div>
                  <div className='col-6 col-md-3 plain-attribute text-right '>
                    <b>SubTotal :</b>
                    <span>
                      {" "}
                      {currency} {` ${config.subTotal}`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className='row' style={{ borderTop: "1px solid lightGray" }}></div>
            )}
            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-6'>
                <b>China Local Delivery (+) : </b>
                <span>
                  {currency} {numberWithCommas(chinaLocalDelivery)}
                </span>
              </div>
              <div className='col-6 text-right'>
                <b> SubTotal/Product Value :</b>
                <span>
                  {currency} {numberWithCommas(Number(product_value))}
                </span>
              </div>
            </div>
            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-6'>
                <b>Payment Method : </b>
                <span>{item.order.pay_method}</span>
              </div>
              <div className='col-6 text-right'>
                <b>First Payment ({item.order.pay_percent}) % :</b>
                <span>
                  {currency} {numberWithCommas(first_payment)}
                </span>
              </div>
            </div>
            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-4'>
                <b>Coupon : </b>
                <span>
                  {currency} {numberWithCommas(item.coupon_contribution)} tk
                </span>
              </div>
              <div className='col-4 text-right'>
                <b>discount :</b>
                <span>
                  {currency} {numberWithCommas(item.discount)}{" "}
                </span>
              </div>
              <div className='col-4 text-right'>
                <b>Total discount (-):</b>
                <span>
                  {currency} {numberWithCommas(Number(item.coupon_contribution) + Number(item.discount))}
                </span>
              </div>
            </div>

            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-12 text-right'>
                <b>Product DUE:</b>
                <span>
                  {currency} {numberWithCommas(Number(item.due_payment))}
                </span>
              </div>
            </div>

            <p className='text-center ship-Text'>
              বাংলাদেশে আসার পর পণ্যের প্রকৃত ওজন মেপে শিপিং চার্জ নির্ধারণ করা হবে।
            </p>

            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-12 text-right'>
                <span>
                  <b> Shipping Per KG</b> (Total Weight({actual_weight}) * Shipping Fee ({currency}{" "}
                  {shipping_rate})) <b>:</b>
                </span>

                <span>{numberWithCommas(item.shipping_charge)}</span>
              </div>
              {item.adjustment && (
                <div className='col-12 text-right'>
                  <b>AdjustMent (+-) : </b>
                  <span>
                    {currency}
                    {numberWithCommas(item.adjustment)}
                  </span>
                </div>
              )}
            </div>
            {status === "refunded" || status === "delivered" ? (
              <p className='text-right due-Text'>
                {status === "refunded" ? <span>REFUNDED</span> : <span> FULL PAID</span>}
              </p>
            ) : (
              <p className='text-right due-Text'>
                <b> NET DUE : </b>
                <span>
                  {currency}
                  {numberWithCommas(Number(item.due_payment) + Number(item.shipping_charge))}
                </span>
              </p>
            )}
          </div>
          <div>
            <button
              className='btn expand btn-default btn-block bold'
              type='button'
              data-toggle='collapse'
              data-target={`#collapseDetails${index}`}
              aria-expanded='false'
              aria-controls={`collapseDetails${index}`}
              onClick={toggle}
            >
              <span>
                <BsArrowDownUp size={20} className='mr-2' />
              </span>
              DETAILS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
});

export default connect(mapStateToProps, {})(withRouter(OrderItem));
