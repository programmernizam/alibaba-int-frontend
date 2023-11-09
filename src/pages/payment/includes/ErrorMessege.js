import React from "react";
import { Link } from "react-router-dom";

const ErrorMessege = ({ data }) => {
  return (
    <div className='container sub-fail-box'>
      <div className='suc-fail'>
        <div className='printer-top'></div>

        <div className='paper-container'>
          <div className='printer-bottom'></div>

          <div className='paper err-papper'>
            <div className='main-contents'>
              <div className='failed-icon'>&#x2715;</div>
              <div className='failed-title'>Payment Failed!</div>
              <div className='success-description'>
                <div className='error-notice'>
                  <div className='oaerror danger'>
                    <strong>Error:</strong>
                    {data.statusMessage}
                  </div>
                </div>
              </div>
              <div className='order-details'>
                <div className='action'>
                  <Link to='/' className='btn btn-default mx-2'>
                    Home
                  </Link>
                  <Link to='/dashboard/orders' className='btn btn-default mx-2'>
                    {" "}
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

export default ErrorMessege;
