import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { getBusinessDateCount, useWindowSize } from "../../../utils/Helpers";
import {
  BsFillCaretDownFill,
  BsFillCaretUpFill,
  BsCheckCircleFill,
  BsPrinterFill,
  BsArrowDownUp,
} from "react-icons/bs";
import { numberWithCommas } from "../../../utils/CartHelpers";
import { useReactToPrint } from "react-to-print";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import purchased from "../../../assets/images/cd/purchased.png";
import suppliers from "../../../assets/images/cd/supply.png";
import receivedchina from "../../../assets/images/cd/recived-china.png";
import shippedchina from "../../../assets/images/cd/processing .png";
import receivedBD from "../../../assets/images/cd/recieved -bd.png";
import transit from "../../../assets/images/cd/transit.png";
import outstock from "../../../assets/images/cd/out-of-stock.png";
import adjustment from "../../../assets/images/cd/adustment.png";
import refunded from "../../../assets/images/cd/refund.png";
import delivered from "../../../assets/images/cd/delivered.png";
import waitipayment from "../../../assets/images/cd/waiting.png";
import ppaid from "../../../assets/images/cd/partial-paid.png";

const OrderItem = ({ item, isOpen, toggle, index }) => {
  // console.log("item ", item);
  const {
    order_item_number,
    item_variations,
    chinaLocalDelivery,
    product_value,
    first_payment,
    actual_weight,
    shipping_rate,
  } = item;

  let [width, height] = useWindowSize();
  width = width ? width : window.innerWidth;

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Order- ${1}.pdf`,
  });

  const stausArr1 = [
    { status: "purchased", image: purchased },
    { status: "shipped-from-suppliers", image: suppliers },
    { status: "received-in-china-warehouse", image: receivedchina },
    { status: "shipped-from-china-warehouse", image: shippedchina },
    { status: "received-in-BD-warehouse", image: receivedBD },
    { status: "on-transit-to-customer", image: transit },
    { status: "out-of-stock", image: outstock },
    { status: "adjustment", image: adjustment },
    { status: "refunded", image: refunded },
    { status: "delivered", image: delivered },
    { status: "waiting-for-payment", image: waitipayment },
    { status: "partial-paid", image: ppaid },
  ];
  const stausArr = [
    "purchased",
    "shipped-from-suppliers",
    "received-in-china-warehouse",
    "shipped-from-china-warehouse",
    "received-in-BD-warehouse",
    "on-transit-to-customer",
    "out-of-stock",
    "adjustment",
    "refunded",
    "delivered",
    "waiting-for-payment",
    "partial-paid",
  ];

  var arraycontainsturtles = stausArr.findIndex(function (i) {
    return i.indexOf(item.status) !== -1;
  });

  const settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 3,
    speed: 500,
    initialSlide: arraycontainsturtles,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className='card my-4 hov-shadow' ref={componentRef}>
      <div className='card-header border border-bottom-0 px-2 py-4'>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <h4 className='bold order-title'>Order No:{order_item_number}</h4>
          </div>

          <div className='text-right'>
            <button onClick={handlePrint} className='btn btn-default-sm bold'>
              <BsPrinterFill size={18} className='mr-2' /> Print
            </button>
            <p className='m-0'>Day: {getBusinessDateCount(item.order.created_at)}</p>
          </div>
        </div>
        <div className='p-2'>
          <Slider {...settings}>
            {stausArr1.map((el) => {
              return (
                <div
                  className={`${
                    el.status === item.status && `border-image-clip-path`
                  } m-3 d-flex justify-content-center flex-column align-items-center`}
                >
                  {/* {el.status === item.status && <BsCheckCircleFill size={20} className='check-st' />} */}

                  <img src={el.image} style={{ width: "50px" }} alt='' />
                  <p className='text-center text-uppercase status-title'>{el.status}</p>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
      <div className='card-body border px-2 py-4'>
        <div className='d-flex align-items-center'>
          <div className='mt-1'>
            <Link to={`${item.link}`}>
              <img src={item.image} style={{ width: "70px" }} alt='' />
            </Link>
          </div>
          <div className='ml-2'>
            <Link to={`${item.link}`}>
              {width >= 768 ? (
                <span className='bold'>{item.name}</span>
              ) : (
                <span className='bold'>{item.name.slice(0, 45)}...</span>
              )}
            </Link>
          </div>
        </div>
        <div className='details py-3'>
          <div className='collapse' id={`collapseDetails${index}`}>
            {item_variations.length > 0 ? (
              item_variations.map((config, index2) => (
                <div className='row' style={{ borderTop: "1px solid lightGray" }}>
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
                    <span>{` ${config.price}`}</span>
                  </div>
                  <div className='col-6 col-md-3 plain-attribute text-right '>
                    <b>SubTotal :</b>
                    <span>{` ${config.subTotal}`}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className='row' style={{ borderTop: "1px solid lightGray" }}></div>
            )}
            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-6'>
                <b>China Local Delivery (+) : </b>
                <span>{numberWithCommas(chinaLocalDelivery)}</span>
              </div>
              <div className='col-6 text-right'>
                <b> SubTotal/Product Value :</b>
                <span>{numberWithCommas(Number(product_value))}</span>
              </div>
            </div>
            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-6'>
                <b>Payment Method : </b>
                <span>{item.order.pay_method}</span>
              </div>
              <div className='col-6 text-right'>
                <b>First Payment ({item.order.pay_percent}) % :</b>
                <span>{numberWithCommas(first_payment)}</span>
              </div>
            </div>
            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-4'>
                <b>Coupon : </b>
                <span>{numberWithCommas(item.coupon_contribution)} tk</span>
              </div>
              <div className='col-4 text-right'>
                <b>discount :</b>
                <span>{numberWithCommas(item.discount)} </span>
              </div>
              <div className='col-4 text-right'>
                <b>Total discount (-):</b>
                <span>{numberWithCommas(Number(item.coupon_contribution) + Number(item.discount))}</span>
              </div>
            </div>

            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-12 text-right'>
                <b>Product DUE:</b>
                <span>{numberWithCommas(Number(item.due_payment))}</span>
              </div>
            </div>

            <p className='text-center ship-Text'>
              বাংলাদেশে আসার পর পণ্যের প্রকৃত ওজন মেপে শিপিং চার্জ নির্ধারণ করা হবে।
            </p>

            <div className='row' style={{ borderTop: "1px solid lightGray" }}>
              <div className='col-12 text-right'>
                <span>
                  <b> Shipping Per KG</b> (Total Weight({actual_weight}) * Shipping Fee ({shipping_rate})){" "}
                  <b>:</b>
                </span>

                <span>{numberWithCommas(item.shipping_charge)}</span>
              </div>
              {item.adjustment && (
                <div className='col-12 text-right'>
                  <b>AdjustMent (+-) : </b>
                  <span>{numberWithCommas(item.adjustment)}</span>
                </div>
              )}
            </div>
            <p className='text-right due-Text'>
              <b> NET DUE : </b>
              <span>{numberWithCommas(Number(item.due_payment) + Number(item.shipping_charge))}</span>
            </p>
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
              {/* {isOpen ? (
                <span>
                  <BsFillCaretUpFill size={20} className='mr-2' />
                </span>
              ) : (
                <span>
                  <BsFillCaretDownFill size={20} className='mr-2' />
                </span>
              )} */}
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

export default OrderItem;
