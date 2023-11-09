import React, {useEffect} from 'react'
import {connect} from "react-redux";
import {loadContactPage} from "../../store/actions/PageAction";
import {Link, withRouter} from "react-router-dom";
import parser from 'html-react-parser';
import {goPageTop} from "../../utils/Helpers";
import _ from "lodash";

const Contact = (props) => {
   const {general, contact} = props;

   useEffect(() => {
      goPageTop();
      if (_.isEmpty(contact)) {
         props.loadContactPage();
      }

   }, []);


   const submitContactForm = (event) => {
      event.preventDefault();
      alert("development progress");
   };

   return (
      <main className="main">
         <nav aria-label="breadcrumb" className="breadcrumb-nav border-0">
            <div className="container">
               <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                     <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                     <span>Pages</span>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                     Contact us
                  </li>
               </ol>
            </div>
         </nav>
         <div className="page-content pb-0">
            <div className="container">
               <div className="row">
                  <div className="col-lg-6 mb-2 mb-lg-0">
                     <h2 className="title mb-1">Contact Information</h2>
                     <div className="mb-3">
                        {contact.post_content && parser(contact.post_content)}
                     </div>
                     <div className="row">
                        <div className="col-sm-12">
                           <div className="contact-info">
                              <h3>The Office</h3>
                              <ul className="contact-list">
                                 <li>
                                    <i className="icon-map-marker"/>
                                    {general.office_address}
                                 </li>
                                 <li>
                                    <i className="icon-phone"/>
                                    <a href={`tel:${general.office_phone}`}>{general.office_phone}</a>
                                 </li>
                                 <li>
                                    <i className="icon-envelope"/>
                                    <a href={`mailto:${general.office_email}`}>{general.office_email}</a>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                     <div className="row">
                        <div className="col-sm-12">
                           <h2 className="title mb-1">Got Any Questions?</h2>
                           {/* End .title mb-2 */}
                           <p className="mb-2">
                              Use the form below to get in touch with the sales team
                           </p>
                           <form onSubmit={event => submitContactForm(event)} className="contact-form mb-3">
                              <div className="row">
                                 <div className="col-sm-6">
                                    <label htmlFor="cname" className="sr-only">
                                       Name
                                    </label>
                                    <input
                                       type="text"
                                       className="form-control"
                                       id="cname"
                                       placeholder="Name *"
                                       required
                                    />
                                 </div>
                                 {/* End .col-sm-6 */}
                                 <div className="col-sm-6">
                                    <label htmlFor="cemail" className="sr-only">
                                       Email
                                    </label>
                                    <input
                                       type="email"
                                       className="form-control"
                                       id="cemail"
                                       placeholder="Email *"
                                       required
                                    />
                                 </div>
                                 {/* End .col-sm-6 */}
                              </div>
                              {/* End .row */}
                              <div className="row">
                                 <div className="col-sm-6">
                                    <label htmlFor="cphone" className="sr-only">
                                       Phone
                                    </label>
                                    <input
                                       type="tel"
                                       className="form-control"
                                       id="cphone"
                                       placeholder="Phone"
                                    />
                                 </div>
                                 {/* End .col-sm-6 */}
                                 <div className="col-sm-6">
                                    <label htmlFor="csubject" className="sr-only">
                                       Subject
                                    </label>
                                    <input
                                       type="text"
                                       className="form-control"
                                       id="csubject"
                                       placeholder="Subject"
                                    />
                                 </div>
                                 {/* End .col-sm-6 */}
                              </div>
                              {/* End .row */}
                              <label htmlFor="cmessage" className="sr-only">
                                 Message
                              </label>
                              <textarea
                                 className="form-control"
                                 cols={30}
                                 rows={4}
                                 id="cmessage"
                                 required
                                 placeholder="Message *"
                                 defaultValue={""}
                              />
                              <button
                                 type="submit"
                                 className="btn btn-outline-primary-2 btn-minwidth-sm"
                              >
                                 <span>SUBMIT</span>
                                 <i className="icon-long-arrow-right"/>
                              </button>
                           </form>
                        </div>
                     </div>
                     {/* End .row */}
                  </div>
                  {/* End .col-lg-6 */}
                  <div className="col-lg-6">
                     {
                        general.g_map_iframe_url &&
                        <div className="embed-responsive embed-responsive-1by1">
                           <iframe className="embed-responsive-item" src={general.g_map_iframe_url} title='general-item'></iframe>
                        </div>
                     }
                  </div>
               </div>
               <hr className="mt-4 mb-5"/>
            </div>
         </div>
      </main>
   )
};

const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   contact: state.PAGE.contact,
});

export default connect(mapStateToProps, {loadContactPage})(
   withRouter(Contact)
);

