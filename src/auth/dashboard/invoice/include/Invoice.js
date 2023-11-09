import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Breadcrumb from "../../../../pages/breadcrumb/Breadcrumb";
import { getSetting, goPageTop, useWindowSize } from "../../../../utils/Helpers";
import { getInvoice } from "../../../../utils/Services";
import { BsPrinterFill } from "react-icons/bs";
import { TbCurrencyTaka } from "react-icons/tb";
import { numberWithCommas } from "../../../../utils/CartHelpers";
const Invoice = (props) => {
  const { match, general, auth } = props;
  const invoice_id = match.params.id;
  const history = useHistory();
  const site_name = getSetting(general, "site_name");
  const site_url = getSetting(general, "site_url");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(false);

  let [width] = useWindowSize();
  width = width ? width : window.innerWidth;

  useEffect(() => {
    goPageTop();
    setLoading(true);
    getInvoice(invoice_id, auth.shopAsCustomer.id, auth.isShopAsCustomer).then((response) => {
      setLoading(false);
      setInvoice(response.data.invoice);
    });
  }, [invoice_id, auth.shopAsCustomer.id, auth.isShopAsCustomer]);

  const invoiceItems = invoice.invoice_items;

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Order- ${1}.pdf`,
  });

  const getTotalShippingCharge = () => {
    let due = 0;
    // invoiceItems.map((item) => {
    //   due += Number(item.order_item.shipping_charge);
    //   return false;
    // });
    return numberWithCommas(due);
  };

  const getTotalProductdue = () => {
    let due = 0;
    // invoiceItems.map((item) => {
    //   const order_item = item.order_item;
    //   console.log(order_item);
    //   due += Number(item.total_due) - Number(order_item.shipping_charge);
    //   return false;
    // });

    return numberWithCommas(due);
  };

  const handlePay = () => {
    history.push(`/pay-by-invoice/${invoice.invoice_no}`);
  };
  return (
    <main className='main bg-gray'>
      <Breadcrumb
        current='Invoice'
        collections={[
          { name: "Dashboard", url: "dashboard" },
          { name: "Invoice's", url: "dashboard/invoices" },
        ]}
      />

      <div className='page-content'>
        <div className='container'>
          <div className='row justify-content-center'>
            <aside className='col-12 col-md-9'>
              {loading && (
                <div className='text-center'>
                  <div className='spinner-border text-secondary' role='status'>
                    <span className='sr-only'>Loading...</span>
                  </div>
                </div>
              )}
              {!loading && invoice && (
                <>
                  <div className='card bg-white in-Card'>
                    <div className='card-body p-0'>
                      <div id='exportOrder' ref={componentRef}>
                        <table className='invoiceTable table table-responsive'>
                          <thead>
                            <tr>
                              <td colSpan='8' style={{ backgroundColor: "#ecfcf7" }} className='text-center'>
                                <h2>
                                  <b className='t-up'>{site_name}</b>
                                </h2>
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan='8 '
                                style={{
                                  backgroundColor: "#e9872b",
                                  display: "tableCell !important",
                                  verticalAlign: "middle !important",
                                }}
                                className='text-center'
                              >
                                <h4 className='in-trust mb-0'>
                                  <b>Your Trusted Import & Wholesale Partner</b>
                                </h4>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan='8' style={{ backgroundColor: "#ecfcf7" }} className='text-center'>
                                <h5 className='in-address mb-0'>
                                  Address: Fair Plaza (4th Floor, Room No: 28 & 29), Mirpur-1, Section-1,
                                  Phone: 01999577318 (Whatsapp)
                                </h5>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>Name</b>
                              </td>
                              <td colSpan='2'>{invoice.customer_name}</td>
                              <td>
                                <b>Address</b>
                              </td>
                              <td colSpan='4'>{invoice.customer_address}</td>
                            </tr>
                            <tr>
                              <td style={{ display: "tableCell", verticalAlign: "middle" }}>
                                <b>Phone</b>
                              </td>
                              <td style={{ display: "tableCell", verticalAlign: "middle" }} colSpan='2'>
                                {invoice.customer_phone}
                              </td>
                              <td style={{ display: "tableCell", verticalAlign: "middle" }}>
                                <b>BY AIR</b>
                              </td>
                              <td style={{ display: "tableCell", verticalAlign: "middle" }}>
                                <b>LOT NO.</b>
                              </td>
                              <td style={{ display: "tableCell", verticalAlign: "middle" }}></td>
                              <td style={{ display: "tableCell", verticalAlign: "middle" }}>
                                <b>REF:</b>
                              </td>
                              <td style={{ display: "tableCell", verticalAlign: "middle" }}>
                                <b>Date:</b> {invoice.updated_at.slice(0, 10)}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan='8' className='text-center' style={{ backgroundColor: "#ecfcf7" }}>
                                <h4 className='mb-0'>
                                  <b>INVOICE / BILL</b>
                                </h4>
                              </td>
                            </tr>
                            <tr style={{ backgroundColor: "#ffa500" }}>
                              <th
                                className='text-center'
                                style={{ display: "tableCell", verticalAlign: "middle", width: "100px" }}
                              >
                                Date
                              </th>
                              <th
                                className='text-center'
                                style={{ display: "tableCell", verticalAlign: "middle" }}
                              >
                                Order No.
                              </th>
                              <th
                                className='text-center'
                                style={{ display: "tableCell", verticalAlign: "middle" }}
                              >
                                Weight
                              </th>
                              <th
                                className='text-center'
                                style={{ display: "tableCell", verticalAlign: "middle" }}
                              >
                                Rate per KG
                              </th>
                              <th
                                className='text-center'
                                style={{ display: "tableCell", verticalAlign: "middle" }}
                              >
                                Shipping Charge
                              </th>
                              <th
                                className='text-center'
                                style={{ display: "tableCell", verticalAlign: "middle" }}
                              >
                                Product Due
                              </th>
                              <th
                                className='text-center'
                                style={{ display: "tableCell", verticalAlign: "middle" }}
                              >
                                Total Payable
                              </th>
                              <th
                                className='text-center'
                                style={{ display: "tableCell", verticalAlign: "middle" }}
                              >
                                NET PAYABLE
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceItems.map((item, index) => {
                              // const order_item = item.order_item;
                              
                              return (
                                <tr>
                                  {index === 0 && <td rowSpan='0'></td>}
                                  <td className='text-center'>{item.order_item_id}</td>
                                  <td className='text-center'>{item.weight}</td>
                                  <td classrowSpan='text-center'>৳ 0</td>
                                  <td className='text-center'>৳ 0</td>
                                  {/* <td classrowSpan='text-center'>৳ {order_item.shipping_rate}</td> */}
                                  {/* <td className='text-center'>৳ {order_item.shipping_charge}</td> */}
                                  <td className='text-center'>
                                    ৳ {item.total_due}
                                  </td>
                                  {/* <td className='text-center'>
                                    ৳{" "}
                                    {numberWithCommas(
                                      Number(item.total_due) - Number(order_item.shipping_charge)
                                    )}
                                  </td> */}
                                  <td className='text-center'>৳ {item.total_due}</td>
                                  {index === 0 && (
                                    <td
                                      className='text-center align-middle'
                                      style={{ display: "tableCell", verticalAlign: "middle" }}
                                      rowSpan='0'
                                    >
                                      <h5>
                                        <b>৳ {invoice.total_payable}</b>
                                        {invoice.status === "confirm_received" && (
                                          <b className='text-danger d-block pt-2'>PAID </b>
                                        )}
                                      </h5>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}

                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className='text-center'>
                                <b>Total</b>
                              </td>
                              <td className='text-center'>
                                <b>Total</b>
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className='text-center'>
                                <h5>
                                  <b>৳ {getTotalShippingCharge()}</b>
                                </h5>
                              </td>
                              <td className='text-center'>
                                <h5>
                                  <b>৳ {getTotalProductdue()}</b>
                                </h5>
                              </td>
                              <td></td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan='8' className='text-center'>
                                <h4 className='text-danger mb-0'>
                                  Note: This invoice is automated, no need to sign
                                </h4>
                              </td>
                            </tr>
                            <tr>
                              <td
                                rowSpan='2'
                                style={{ backgroundColor: "rgb(236, 252, 247) !important" }}
                              ></td>
                              <td colSpan='3' style={{ height: "60px" }}></td>
                              <td
                                rowSpan='2'
                                style={{ backgroundColor: "rgb(236, 252, 247) !important" }}
                              ></td>
                              <td colSpan='3'></td>
                            </tr>
                            <tr>
                              <td
                                colSpan='3'
                                className='text-center'
                                style={{ backgroundColor: "rgb(236, 252, 247) !important" }}
                              >
                                <b>Customer Signature</b>
                              </td>
                              <td
                                colSpan='3'
                                className='text-center'
                                style={{ backgroundColor: "rgb(236, 252, 247) !important" }}
                              >
                                <b>Authorized Signature</b>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan='8' className='text-center'>
                                <h4 className='mb-0'>
                                  Website: {site_url}
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Facebook:
                                  {general.facebook}
                                </h4>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan='8' style={{ backgroundColor: "#ecfcf7" }}>
                                <p>
                                  * Please confirm the details before order. After order we are not
                                  responsible for any scam or damaged goods that are done by seller.
                                </p>
                                <p>* No objection will be acceptable after goods are delivered.</p>
                                <p>
                                  * {site_name} will not be liable or held responsible for any loss, damage or
                                  delay of goods conveyed by them due to hold customs, robbery, accidents or
                                  unfair circumstances beyond the control of the company.
                                </p>
                                <p>
                                  * The goods transported by us are at the owner's own risk. After the
                                  delivery of any local authority selling permission or BSTI issue we are not
                                  liable for this.
                                </p>
                                <p>
                                  * For suppliers payment on behalf of you that invoice only valid till
                                  supplier received payment. After payment supplier account this transaction
                                  will be closed & no further complain would be granted.
                                </p>
                                <p>
                                  * During shipping time any issues like customs delay, natural disaster,
                                  transport issues, government act that may cause deliverying goods delayed to
                                  our customer we are not resposible for this.
                                </p>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className='flexEnd  text-center my-2 py-2'>
                        {invoice.status !== "confirm_received" && (
                          <button className='homeReg-btn invoice-disable mx-1 ' onClick={() => handlePay()}>
                            <TbCurrencyTaka size={18} className='mr-1' /> Pay now
                          </button>
                        )}

                        <button className='homeReg-btn invoice-disable mx-1 bold' onClick={handlePrint}>
                          <BsPrinterFill size={18} className='mr-2' /> Print
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </aside>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </div>
    </main>
  );
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  user: state.AUTH.user,
  auth: state.AUTH,
  cartConfigured: state.CART.configured,
  shipping_address: state.CART.shipping_address,
});

export default connect(mapStateToProps, {})(withRouter(Invoice));
