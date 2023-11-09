import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from "../breadcrumb/Breadcrumb";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changesPaymentsStatusToConfirm} from "../../store/actions/CartAction";
import SuccessMessege from "./includes/SuccessMessege";
import ErrorMessege from "./includes/ErrorMessege";
import {destroyLocalCart} from "../../utils/CartHelpers";
import {configAttrToConfigured} from "../../utils/GlobalStateControl";

const PaymentSuccessFail = props => {
  const {history, match} = props;
  const status = match.params.status;
  const tran_id = match.params.tran_id;


  useEffect(() => {
    if (status === 'success') {
      props.changesPaymentsStatusToConfirm({
        status: status,
        tran_id: tran_id,
      });

      destroyLocalCart();
      configAttrToConfigured([]);

    }
  }, []);


  return (
      <main className="main">
        <Breadcrumb current="Payment" collections={[
          {'name': 'Dashboard', url: '/dashboard'},
          {'name': 'Order', url: '/orders'}
        ]}/>

        <div className="page-content">
          <div className="cart">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  {status === "success" && <SuccessMessege tran_id={tran_id}/>}
                  {status === "failed" && <ErrorMessege tran_id={tran_id}/>}
                </div>
              </div>
            </div>
            {/* End .container */}
          </div>
          {/* End .cart */}
        </div>
        {/* End .page-content */}
      </main>
  );
};

PaymentSuccessFail.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  changesPaymentsStatusToConfirm: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  history: state.CART.configured,
});

export default connect(mapStateToProps, {changesPaymentsStatusToConfirm})(
    withRouter(PaymentSuccessFail)
);
