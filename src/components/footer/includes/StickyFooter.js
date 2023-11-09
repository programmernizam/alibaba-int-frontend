import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSetting } from "../../../utils/Helpers";
import { toggleMobileMenu } from "../../../utils/jQueryImplement";

const StickyFooter = (props) => {
  const { general } = props;
  const office_phone = getSetting(general, "office_phone");
  const location = useLocation();

  let isShow = location.pathname.includes(`/product/abb-`);

  useEffect(() => {
    toggleMobileMenu();
  }, []);

  return (
    <nav className={`stick_footer_nav ${isShow ? "d-none" : "d-block"}`}>
      <div className='container'>
        <div className='row'>
          <div className='col text-center'>
            <a href='/category' className='nav-link toggleMobileMenu'>
              <span className=' sticky_nav_icon'>
                <i className='icon-bars' />
              </span>
              {/* <span className='mb-0'>Category</span> */}
            </a>
          </div>
          <div className='col text-center'>
            <Link className='nav-link' to='/dashboard'>
              <span className=' sticky_nav_icon'>
                <i className='icon-user' />
              </span>
              {/* <p className='mb-0'>Account</p> */}
            </Link>
          </div>
          <div className='col text-center'>
            <Link className='nav-link' to='/'>
              <span className='sticky_nav_icon'>
                <i className='icon-home' />
              </span>
              {/* <p className='mb-0'>Home</p> */}
            </Link>
          </div>

          <div className='col text-center'>
            <a className='nav-link' href={`tel:${office_phone}`}>
              <span className=' sticky_nav_icon'>
                <i className='icon-phone' />
              </span>
              {/* <p className='mb-0'>Call</p> */}
            </a>
          </div>
          <div className='col text-center'>
            <a
              className='nav-link'
              href={`https://m.me/${process.env.REACT_APP_FACEBOOK_PAGE_KEY}`}
              rel='noreferrer'
              target='_blank'
            >
              <span className=' sticky_nav_icon'>
                <i className='icon-facebook-messenger' />
              </span>
              {/* <p className='mb-0'>Chat</p> */}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyFooter;
