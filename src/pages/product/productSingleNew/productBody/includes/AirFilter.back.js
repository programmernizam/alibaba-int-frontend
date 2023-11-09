import _ from "lodash";
import React, { useEffect, useState } from "react";
import CardSkelton from "../../../../../skeleton/productSkeleton/CardSkelton";
import { getProductPageCard } from "../../../../../utils/Services";
import parse from "html-react-parser";

const AirFilter = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("air");
  const [loading, setLoading] = useState(true);
  const [cardResponseAir, setCardResponseAir] = useState([]);
  const [cardResponseSea, setCardResponseSea] = useState([]);
  useEffect(() => {
    cardContentAir();
  }, []);

  useEffect(() => {
    cardContentSea();
  }, []);

  const cardContentAir = async () => {
    const response = await getProductPageCard("card_two");
    if (!_.isEmpty(response)) {
      setCardResponseAir(response);
    }
    setLoading(false);
  };
  const cardContentSea = async () => {
    const response = await getProductPageCard("card_three");
    if (!_.isEmpty(response)) {
      setCardResponseSea(response);
    }
    setLoading(false);
  };
  return (
    <>
      {loading && <CardSkelton />}
      {!loading && (
        <div>
          <div className='mb15'>
            <div className='shippingBoxContainer mb05'>
              <div
                className='shippingBox mr05'
                style={{
                  background: `${
                    deliveryMethod == "air"
                      ? "linear-gradient(to right, #f7b733, #fc4a1a)"
                      : "rgb(238, 238, 238)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => setDeliveryMethod("air")}
              >
                <input
                  className='airInput mr1'
                  type='radio'
                  id='air'
                  name='air'
                  value='air'
                  checked={deliveryMethod == "air"}
                ></input>
                <div>
                  <p className='p-0'>By Air ({cardResponseAir.delivery})</p>
                  <p className='p-0' style={{ fontWeight: "500", fontSize: "14px", marginTop: "0.5rem" }}>
                    {" "}
                    ৳ {cardResponseAir.weight_price} per kg
                  </p>
                </div>
              </div>
              <div
                className='shippingBox mr05'
                style={{
                  background: `${
                    deliveryMethod == "sea"
                      ? "linear-gradient(to right, #f7b733, #fc4a1a)"
                      : "rgb(238, 238, 238)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => setDeliveryMethod("sea")}
              >
                <input
                  className='airInput mr1'
                  type='radio'
                  id='sea'
                  name='sea'
                  value='sea'
                  checked={deliveryMethod == "sea"}
                ></input>
                <div>
                  <p className='p-0'>By Sea ({cardResponseSea.delivery})</p>
                  <p className='p-0' style={{ fontWeight: "500", fontSize: "14px", marginTop: "0.5rem" }}>
                    {" "}
                    ৳ {cardResponseSea.weight_price} per kg
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className='mb15'
            style={{
              border: "1px solid rgb(238, 238, 238)",
              padding: "1rem",
              borderRadius: "4px",
              display: `${deliveryMethod == "air" ? "block" : "none"}`,
            }}
          >
            {parse(`${cardResponseAir.content}`)}
            {/* <p style={{ fontSize: "14px", padding: "0.275rem 0px", marginBottom: "0.5rem" }}>
              ** পণ্যের ক্যাটাগরীর উপর নির্ভর করে শিপিং চার্জ নির্ধারণ করা হবে ৬৩০ টাকা / ৭৬০ টাকা প্রতি কেজি।
            </p>
            <div className='shippingBoxContainer mb05'>
              <div className='shippingBox mr05' style={{ background: "rgb(229, 217, 185)" }}>
                <p className='mb05'>৬৩০ টাকা প্রতি কেজি </p>
                <span>
                  জুতা, ব্যাগ, জুয়েলারি, যন্ত্রপাতি, ব্যাটারি ব্যতীত ইলেক্ট্রনিক্স, ব্যাটারি ব্যতীত খেলনা,
                  তরল ও ক্রিম ব্যতীত কসমেটিক্স, স্টিকার, সিরামিক, প্লাস্টিক, ধাতব, চামড়া, রাবার জাতীয় পণ্য
                  ইত্যাদি।
                </span>
              </div>
              <div className='shippingBox' style={{ background: "rgb(229, 217, 185)" }}>
                <p className='mb05'>৭৬০ টাকা প্রতি কেজি</p>
                <span>
                  পোশাক / বস্ত্র, ঘড়ি, সানগ্লাস, তরল এবং দাহ্য পদার্থ, ব্যাটারি জাতীয় যেকোনো পণ্য, ক্রিম এবং
                  তরল কসমেটিক্স, রাসায়নিক দ্রব্য, খাদ্য, জীবন্ত উদ্ভিদ, বীজ, ডুপ্লিকেট ব্র্যান্ডেড পণ্য
                  ইত্যাদি।
                </span>
              </div>
            </div> */}
          </div>
          <div
            className='mb05'
            style={{
              border: "1px solid rgb(238, 238, 238)",
              padding: "1rem",
              borderRadius: "4px",
              background: "rgb(229, 217, 185)",
              display: `${deliveryMethod == "sea" ? "block" : "none"}`,
            }}
          >
            <div className='shippingBoxContainer'>
              {parse(`${cardResponseSea.content}`)}
              {/* <div>
                <span style={{ fontSize: "14px" }}>
                  সম্মানিত গ্রাহক, সি-শিপমেন্ট করার জন্য সর্বনিম্ন ৫০০ কেজি পণ্য অর্ডার করতে হবে। এক্ষেত্রে
                  আপনি একাধিক পণ্য অর্ডার করতে পারবেন তবে প্রতিটি পণ্যের সর্বনিম্ন ওজন ২৫০ কেজি হতে হবে।
                  পণ্যের ক্যাটাগরীর উপর নির্ভর করে শিপিং চার্জ নির্ধারণ করা হবে। অনুগ্রহপূর্বক অর্ডার করার
                  পূর্বে আমাদের সি- শিপমেন্ট এক্সপার্টের সাথে যোগাযোগ করে চূড়ান্ত শিপিং চার্জ জেনে নিবেন।
                </span>
                <div className='d-flex'>
                  <p
                    style={{
                      marginTop: "0.75rem",
                      fontSize: "14px",
                      background: "rgb(0, 0, 0)",
                      padding: "0.275rem 0.6rem",
                      color: "rgb(255, 255, 255)",
                      borderRadius: "4px",
                    }}
                  >
                    <span style={{ marginRight: "0.325rem" }}>HOTLINE:</span>
                    <a href='tel:+8801810198717' style={{ color: "rgb(255, 255, 255)", marginRight: "8px" }}>
                      01810198717
                    </a>
                    <span>(10AM - 7PM)</span>
                  </p>
                </div>

                <table className='mt1 seaTable table table-sm table-bordered product_summary_table'>
                  <thead>
                    <tr>
                      <th>ক্যাটাগরী</th>
                      <th>শিপিং চার্জ (প্রতি কেজি)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>মেশিনারি</td>
                      <td>১৪০ - ১৭০ টাকা</td>
                    </tr>
                    <tr>
                      <td>জুয়েলারি</td>
                      <td>১৭০ - ২২০ টাকা</td>
                    </tr>
                    <tr>
                      <td>প্লাস্টিক</td>
                      <td>১৯০ - ২২০ টাকা</td>
                    </tr>
                    <tr>
                      <td>ল্যাডিস ব্যাগ</td>
                      <td>২৪০ - ২৭০ টাকা</td>
                    </tr>
                    <tr>
                      <td>জুতা (প্রতি জোড়া)</td>
                      <td>৩৬০ টাকা</td>
                    </tr>
                    <tr>
                      <td>অন্যান্য</td>
                      <td>কল করে জেনে নিন</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AirFilter;
