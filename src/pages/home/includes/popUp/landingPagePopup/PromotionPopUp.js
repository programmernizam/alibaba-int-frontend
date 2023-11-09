import React from "react";
import { getSetting, loadAsset } from "../../../../../utils/Helpers";

const PromotionPopUp = ({ showPromotion, setShowPromotion, general }) => {
  const closeModal = (e) => {
    e.preventDefault();
    setShowPromotion(false);
  };
  const popup_banner = getSetting(general, "popup_banner");

  return (
    <div
      className={`modal modal-promo fade ${showPromotion && "show"}`}
      style={showPromotion && { display: "block" }}
      tabIndex='-1'
      aria-labelledby='chooseAddressModalLabel'
      data-keyboard='true'
      aria-hidden='true'
      onClick={(e) => closeModal(e)}
    >
      <div className='modal-dialog modal-xl modal-dialog-centered'>
        <div className='modal-content promo'>
          <div className='modal-body p-4 px-5'>
            <div className='flexCenter'>
              <img src={loadAsset(popup_banner)} alt='' />
            </div>
            <div className='flexCenter pt-2'>
              <button type='button' onClick={(e) => closeModal(e)} className='btn btn-secondary rounded'>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionPopUp;
