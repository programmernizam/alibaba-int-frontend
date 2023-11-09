import React from 'react';
import _ from "lodash";
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ReactLoading from 'react-loading';

GlobalLoading.propTypes = {
  loading: PropTypes.object.isRequired
};

function PreLoader1() {

  return (
    <>
        <ReactLoading
          type={"bars"}
          color={"#fe6f03"}
          height={60}
          width={80}
        />
     
    </>
  );
}

function GlobalLoading(props) {
  const {loading} = props;
  const isLoading = !_.isEmpty(loading) ? loading.isLoading : false;
  return (
      <div className={isLoading ? 'preloader loaded' : 'd-none'}>
        <div className="lds-ellipsis">
          <PreLoader1/>
          {/* <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div> */}
        </div>
      </div>
  );
}


const mapStateToProps = (state) => ({
  loading: state.LOADING
});

export default connect(mapStateToProps, {})(
    withRouter(GlobalLoading)
);
