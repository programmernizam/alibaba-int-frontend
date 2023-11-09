import React, { useEffect, useState } from "react";
import _ from "lodash";
import { getProductPageCard } from "../../../../../utils/Services";
import parse from "html-react-parser";
import CardSkelton from "../../../../../skeleton/productSkeleton/CardSkelton";

const AppOffer = () => {
  const [loading, setLoading] = useState(true);
  const [cardRespose, setCardRespose] = useState([]);
  useEffect(() => {
    cardContent();
  }, []);

  const cardContent = async () => {
    const response = await getProductPageCard("card_one");
    if (!_.isEmpty(response)) {
      setCardRespose(response.content);
    }
    setLoading(false);
  };

  let cardContents = null;

  if (loading) cardContents = <CardSkelton />;
  if (!loading && !cardRespose) cardContents = "";
  if (!loading && cardRespose)
    cardContents = (
      <div
        className='cardHighlight saleChinaOff mb05'
        style={{
          borderRadius: "8px",
          padding: "0.75rem 1rem",
        }}
      >
        <div className='app-in'>{parse(cardRespose)}</div>
      </div>
    );

  return <>{cardContents}</>;
};

export default AppOffer;
