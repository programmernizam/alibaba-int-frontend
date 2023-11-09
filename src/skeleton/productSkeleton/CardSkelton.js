import React from "react";
import Skeleton from "react-loading-skeleton";

const CardSkelton = () => {
  return (
    <div style={{ marginBottom: 30 }}>
      <Skeleton variant='rect' height={25} style={{ marginBottom: 6 }} />
      <Skeleton height={10} width='85%' />
      <Skeleton height={10} width='95%' />
      <Skeleton height={10} width='85%' />
    </div>
  );
};

export default CardSkelton;
