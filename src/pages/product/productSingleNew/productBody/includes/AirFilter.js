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
          <div
            className='mb15'
            style={{
              border: "1px solid rgb(238, 238, 238)",
              padding: "1rem",
              borderRadius: "4px",
            }}
          >
            {parse(`${cardResponseAir.content}`)}
          </div>
        </div>
      )}
    </>
  );
};

export default AirFilter;
