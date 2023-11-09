import React from "react";
import { Link } from "react-router-dom";

const SuccessMessege = ({ data }) => {
  return (
    <div className='container sub-fail-box'>
      <div className='suc-fail'>
        <div className='printer-top'></div>

        <div className='paper-container'>
          <div className='printer-bottom'></div>

          <div className='paper suc-papper'>
            <div className='main-contents'>
              <div className='success-icon'>&#10004;</div>
              <div className='success-title'>Payment Complete</div>
              <div className='success-description'>
                <strong>Something went wrong!</strong> <br />
                Your order is being processed and will be completed within 3-6 hours. You will receive an
                email confirmation when your order is completed.
              </div>
              <div className='order-details'>
                <div className='order-number-label'>
                  TRX ID: <span>{data.trxID}</span>{" "}
                </div>

                <div className='action'>
                  <Link to='/' className='btn btn-default mx-2'>
                    Home
                  </Link>
                  <Link to='/dashboard/orders' className='btn btn-default mx-2'>
                    My orders
                  </Link>
                </div>
              </div>
              <div className='order-footer'>Thank you!</div>
            </div>
            <div className='jagged-edge'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessege;
