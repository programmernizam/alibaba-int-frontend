import React from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';

const SpinnerButtonLoader = props => {
   const defaultClass = props.defaultClass;

   return (
      <button type="button" className={`btn px-5 ${defaultClass ? defaultClass : 'btn-block btn-primary'} disabled`}>
         <span className="spinner-border text-secondary"/>
      </button>
   );
};

SpinnerButtonLoader.propTypes = {
   defaultClass: PropTypes.string
};

export default SpinnerButtonLoader;