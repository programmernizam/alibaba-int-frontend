import React from "react";
import { getSetting } from "../../../utils/Helpers";
// import _ from "lodash";
// import {Link} from "react-router-dom";

const CopyRight = (props) => {
  const { general, width } = props;
  const copyright_text = getSetting(general, "copyright_text");

  return (
    <div
      className='footer-bottom font-weight-normal'
      style={width <= 751 ? { marginBottom: "60px" } : { marginBottom: "0" }}
    >
      <div className='container'>
        <p className='footer-copyright font-weight-normal ml-lg-2'>Copyright © {copyright_text}</p>
        {/* <div className="social-icons social-icons-color justify-content-center">
               <span className="social-label">Social Media</span>
               {
                  general.facebook &&
                  <a
                     href={general.facebook}
                     className="social-icon social-facebook"
                     title="Facebook"
                     target="_blank"
                     rel="noreferrer"
                  >
                     <i className="icon-facebook-f"/>
                  </a>
               }

               {
                  general.twitter &&
                  <a
                     href={general.twitter}
                     className="social-icon social-twitter"
                     title="Twitter"
                     target="_blank"
                     rel="noreferrer"
                  >
                     <i className="icon-twitter"/>
                  </a>
               }
               {
                  general.instagram &&
                  <a
                     href={general.instagram}
                     className="social-icon social-instagram"
                     title="Instagram"
                     target="_blank"
                     rel="noreferrer"
                  >
                     <i className="icon-instagram"/>
                  </a>
               }
               {
                  general.youtube &&
                  <a
                     href={general.youtube}
                     className="social-icon social-youtube"
                     title="Youtube"
                     target="_blank"
                     rel="noreferrer"
                  >
                     <i className="icon-youtube"/>
                  </a>
               }
            </div> */}
      </div>
    </div>
  );
};

export default CopyRight;
