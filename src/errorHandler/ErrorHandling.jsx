import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {authLogout} from "../store/actions/AuthAction";
import {withRouter} from "react-router-dom";
import {goPageTop} from "../utils/Helpers";

const ErrorHandling = props => {
   const {errorsData, status} = props;

   useEffect(() => {
      goPageTop();

      if (status === 401) {
         props.authLogout(props.history);
      }

   }, [status]);


   if (Number(status) === 401 || Number(status) === 422) {
      return <div className="alert alert-danger alert-dismissible fade show text-center" role="alert">
         {errorsData.message}
         <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
         </button>
      </div>
   }

   if (Number(status) === 417) {
      return <div className="alert alert-warning alert-dismissible fade show text-center" role="alert">
         {errorsData.message}
         <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
         </button>
      </div>
   }


   return '';

   return <div className="alert alert-danger alert-dismissible fade show text-center" role="alert">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad architecto, aspernatur beatae commodi deleniti dolor, dolore
      est excepturi exercitationem expedita facilis impedit libero magni perferendis quam quod quos unde.
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
         <span aria-hidden="true">&times;</span>
      </button>
   </div>;

};

ErrorHandling.propTypes = {
   errorsData: PropTypes.object.isRequired,
   status: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
   errorsData: state.ERRORS.data,
   status: state.ERRORS.status
});

export default connect(mapStateToProps, {authLogout})(withRouter(ErrorHandling));