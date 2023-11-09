import React from "react";
import parser from "html-react-parser";
import { loadAsset } from "../../../../../utils/Helpers";

const mobileBannerItem = ({ banner }) => {
  const content = `${banner?.post_content}`;
  return (
    <div
      key={banner.id}
      className='intro-slide bg-image d-flex align-items-center'
      style={{
        backgroundColor: "#e9e9e9",
        backgroundImage: `url(${loadAsset(banner.post_thumb)})`,
      }}
    >
      {parser(content)}
    </div>
  );
};

export default mobileBannerItem;
