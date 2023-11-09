import React from 'react';
import {Link} from "react-router-dom";
import Breadcrumb from "../breadcrumb/Breadcrumb";

const My404Component = () => {
   return (
      <main className="main">
         <Breadcrumb current="404" collections={[
            {name: "pages"}
         ]}/>
         <div className="error-content text-center">
            <div className="container">
               <h1 className="error-title">Error 404</h1>
               {/* End .error-title */}
               <p>We are sorry, the page you've requested is not available.</p>
               <Link
                  to={'/'}
                  className="btn btn-outline-primary-2 btn-minwidth-lg"
               >
                  <span>BACK TO HOMEPAGE</span>
                  <i className="icon-long-arrow-right"/>
               </Link>
            </div>
            {/* End .container */}
         </div>
         {/* End .error-content text-center */}
      </main>
   );
};

export default My404Component;