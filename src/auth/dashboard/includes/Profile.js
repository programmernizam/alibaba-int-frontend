import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";
import swal from "sweetalert";
import { useEffect } from "react";
import { getUserInfo, updateProfile } from "../../../utils/Services";

const Profile = (props) => {
  const { auth } = props;
  const [user, setUser] = useState({});
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUserInfo(auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      if (!_.isEmpty(response)) {
        const user = response.data.user;

        if (!_.isEmpty(user)) {
          setLoading(false);
          setUser(user);
        }
      }
    });
  }, [success, auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    swal({
      title: "Are you sure to update profile?",
      icon: "warning",
      buttons: ["No, cancel it!", "Yes, I am sure!"],
      dangerMode: true,
    }).then(function (isConfirm) {
      if (isConfirm) {
        updateProfile(
          data.mail,
          data.phone,
          data.refund_credentials,
          data.refund_method,
          data.fName,
          data.lName,
          auth.shopAsCustomer.id,
          auth.isShopAsCustomer
        ).then((response) => {
          if (!_.isEmpty(response)) {
            const resData = response.data;
            if (!_.isEmpty(resData)) {
              if (resData.status === "success") {
                setSuccess(true);
                swal({
                  title: `User Info updated successfully`,
                  icon: "success",
                  buttons: "Ok, Understood",
                });
                setOpenUpdateModal(false);
              } else {
                swal({
                  title: `${resData.message}`,
                  icon: "warning",
                  buttons: "Ok, Understood",
                });
              }
            }
          } else {
            swal({
              title: `Something went wrong`,
              icon: "warning",
              buttons: "Ok, Understood",
            });
          }
        });
      } else {
      }
    });
  };

  const closeModal = (e) => {
    e.preventDefault();
    setOpenUpdateModal(false);
  };
  const handleOpenUpdateModal = () => {
    setOpenUpdateModal(true);
  };

  return (
    <>
      <div className='card'>
        <div className='card-header border border-bottom-0 p-4'>
          <h4 className='card-title'>Profile Information</h4>
        </div>
        {loading ? (
          <div className='text-center'>
            <div className='spinner-border text-secondary' role='status'>
              <span className='sr-only'>Loading...</span>
            </div>
          </div>
        ) : (
          <div className='card-body border p-4 mb-3'>
            <table className='table'>
              <tbody>
                <tr>
                  <th>Name:</th>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <th>Phone:</th>
                  <td>
                    {user.phone || (
                      <a
                        style={{ cursor: "pointer", textDecoration: "underLine" }}
                        onClick={() => handleOpenUpdateModal()}
                      >
                        ADD
                      </a>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <th>Refund method :</th>
                  <td>
                    {user?.refund_method || (
                      <a
                        style={{ cursor: "pointer", textDecoration: "underLine" }}
                        onClick={() => handleOpenUpdateModal()}
                      >
                        ADD
                      </a>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Refund Credentials :</th>
                  <td>
                    {user?.refund_credentials || (
                      <a
                        style={{ cursor: "pointer", textDecoration: "underLine" }}
                        onClick={() => handleOpenUpdateModal()}
                      >
                        ADD
                      </a>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <button onClick={() => handleOpenUpdateModal()} type='button' className='btn btn-default'>
              Update information
            </button>
          </div>
        )}
      </div>
      {openUpdateModal && (
        <div
          className={`modal modal_custom fade ${openUpdateModal && "show"}`}
          style={openUpdateModal && { display: "block" }}
          tabIndex='-1'
          aria-labelledby='chooseAddressModalLabel'
          data-keyboard='true'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-sm modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header p-4'>
                <h5 className='modal-title bold' id='chooseAddressModalLabel'>
                  Update Profile
                </h5>
                <button
                  type='button'
                  onClick={(e) => closeModal(e)}
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>×</span>
                </button>
              </div>
              <div className='modal-body p-4 px-5'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <div className='form-group'>
                      <label htmlFor='fName'>
                        First Name <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='fName'
                        readOnly={user.avatar_type === "google" || user.avatar_type === "facebook"}
                        required={true}
                        defaultValue={user.first_name}
                        placeholder='Enter your First name'
                        {...register("fName", {
                          required: "First name is required",
                        })}
                        aria-invalid={errors.fName ? "true" : "false"}
                      />
                      {errors.fName && (
                        <p className='text-danger mb-0' role='alert'>
                          {errors.fName?.message}
                        </p>
                      )}
                    </div>
                    <div className='form-group'>
                      <label htmlFor='c'>
                        Last Name <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='text'
                        className='form-control'
                        id='lName'
                        required={true}
                        readOnly={user.avatar_type === "google" || user.avatar_type === "facebook"}
                        defaultValue={user.last_name}
                        placeholder='Enter your Last name'
                        {...register("lName", {
                          required: "Last name is required",
                        })}
                        aria-invalid={errors.lName ? "true" : "false"}
                      />
                      {errors.lName && (
                        <p className='text-danger mb-0' role='alert'>
                          {errors.lName?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='form-group'>
                    <label htmlFor='address'>Phone Number</label>
                    <input
                      id='phone'
                      defaultValue={user.phone}
                      placeholder='Phone Number'
                      className='form-control mb-0'
                      {...register("phone", {
                        pattern: {
                          value: /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                    />
                    {errors.phone && (
                      <p className='text-danger mb-0' role='alert'>
                        {errors.phone?.message}
                      </p>
                    )}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='address'>Email Address</label>
                    <input
                      readOnly={user.avatar_type === "google" || user.avatar_type === "facebook"}
                      id='email'
                      defaultValue={user.email}
                      placeholder='Email Address'
                      className='form-control mb-0'
                      {...register("mail", {
                        required: "Email Address is required",
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Please enter a valid email",
                        },
                      })}
                      aria-invalid={errors.mail ? "true" : "false"}
                    />
                    {errors.mail && (
                      <p className='text-danger mb-0' role='alert'>
                        {errors.mail?.message}
                      </p>
                    )}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='creadType'>Refund method</label>
                    <select id='creadType' className='form-control' {...register("refund_method")}>
                      {/* bkash */}
                      <option selected={user?.refund_method === "bkash(personal)"} value='bkash(personal)'>
                        bKash(Personal)
                      </option>
                      <option selected={user?.refund_method === "bkash(agent)"} value='bkash(agent)'>
                        bKash(Agent)
                      </option>
                      <option selected={user?.refund_method === "bkash(merchant)"} value='bkash(merchant)'>
                        bKash(Merchant)
                      </option>

                      {/* Nadad */}
                      <option selected={user?.refund_method === "nagad(personal)"} value='nagad(personal)'>
                        Nagad(Personal)
                      </option>
                      <option selected={user?.refund_method === "nagad(agent)"} value='nagad(agent)'>
                        Nagad(Agent)
                      </option>
                      <option selected={user?.refund_method === "nagad(merchant)"} value='nagad(merchant)'>
                        Nagad(Merchant)
                      </option>

                      {/* bank */}
                      <option selected={user?.refund_method === "bank"} value='bank'>
                        Bank
                      </option>
                    </select>
                  </div>

                  <div className='form-group'>
                    <label htmlFor='district'>Refund Credential</label>
                    <input
                      type='text'
                      id='refund_credentials'
                      defaultValue={user?.refund_credentials}
                      placeholder='Refund Credentials'
                      className='form-control mb-0'
                      {...register("refund_credentials")}
                    />
                  </div>

                  <hr />
                  <div className='form-group text-right'>
                    <button
                      type='button'
                      onClick={(e) => closeModal(e)}
                      className='btn btn-secondary rounded mr-2'
                    >
                      Cancel
                    </button>
                    <button type='submit' className='btn btn-default '>
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.AUTH,
});

export default connect(mapStateToProps, {})(withRouter(Profile));
