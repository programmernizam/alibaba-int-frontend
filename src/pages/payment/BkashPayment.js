import React, { useEffect, useState } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { useLocation, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import { executebKashPayment } from "../../utils/Services";
import { in_loading, out_loading } from "../../utils/LoadingState";
import SuccessMessege from "./includes/SuccessMessege";
import ErrorMessege from "./includes/ErrorMessege";
import Loading from "../../components/common/Loading";

const BkashPayment = ({ match }) => {
  let search = new URLSearchParams(window.location.search);
  const paymentID = search.get("paymentID");
  const status = search.get("status");
  const auth_token = localStorage.getItem("bkash_token");

  const [loading, setLoading] = useState(true);
  const [payResponse, setPayResponse] = useState("");

  useEffect(() => {
    setLoading(true);
    if (!_.isEmpty(paymentID) && !_.isEmpty(auth_token) && status === "success") {
      executebKashPayment(auth_token, paymentID).then((response) => {
        setPayResponse(response.data);
        setLoading(false);
      });
    } else {
      const data = { statusCode: status, statusMessage: "Payment Cancelled !" };
      setPayResponse(data);
      setLoading(false);
    }
  }, [paymentID, auth_token, status]);

  let message = null;
  if (loading) {
    message = <Loading />;
  } else if (!loading && payResponse.statusCode === "0000") {
    message = <SuccessMessege data={payResponse} />;
  } else if (!loading && payResponse.statusCode !== "0000") {
    message = <ErrorMessege data={payResponse} />;
  } else {
    message = <ErrorMessege data={payResponse} />;
  }
  return (
    <main className='main'>
      <Breadcrumb current='bkash-pay' />
      <div
        className='page-content d-flex justify-content-center align-items-center'
        style={{ minHeight: "70vh" }}
      >
        {message}
      </div>
    </main>
  );
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(BkashPayment));
