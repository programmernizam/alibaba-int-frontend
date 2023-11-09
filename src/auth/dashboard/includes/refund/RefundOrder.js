import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, withRouter } from "react-router-dom";
import {
  addProductIntoVirtualCart,
  removeProductIntoVirtualCart,
} from "../../../../utils/GlobalStateControl";
import { getSetting } from "../../../../utils/Helpers";
import { getOrderDetails } from "../../../../utils/Services";
import RefundModal from "./RefundModal";
import RefundTableConfigItems from "./RefundTableConfigItems";

const RefundOrder = (props) => {
  const [openModal, setOpenModal] = useState(false);

  const { general, cartConfigured } = props;
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const currency = getSetting(general, "currency_icon");
  const ShippingCharges = getSetting(general, "china_local_delivery_charge");

  useEffect(() => {
    setLoading(true);
    getOrderDetails(id).then((response) => {
      setLoading(false);
      setOrder(response.order.order_items);
    });
  }, [id]);

  useEffect(() => {
    addProductIntoVirtualCart([...cartConfigured, ...order]);
    return () => {
      removeProductIntoVirtualCart();
    };
  }, [order, cartConfigured]);

  return (
    <>
      <div>
        <div className='my-2'>
          <button className='btn btn-default' onClick={(e) => setOpenModal(true)}>
            Refund Order
          </button>
        </div>
        <div className='card'>
          <div className='checkTable table-responsive-sm '>
            <table className='table table table-cart'>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <div className='text-center'>
                    <div className='spinner-border text-secondary' role='status'>
                      <span className='sr-only'>Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {cartConfigured.map((product) => {
                      // console.log("product", product);
                      return (
                        <tr>
                          <td className='text-center mainImg'>
                            {
                              <figure className='m-0'>
                                <img src={product.image} alt={product.Title} />
                              </figure>
                            }
                          </td>
                          <td>
                            <div className='product-title mb-0 pb-0'>
                              <h6 className='dotText bold' title={product.name}>
                                {product.name}
                              </h6>
                            </div>
                            <div>
                              {product.item_variations.map((config, index2) => (
                                <div className='singleVariant'>
                                  <RefundTableConfigItems
                                    key={index2}
                                    currency={currency}
                                    product={product}
                                    config={config}
                                    cartConfigured={cartConfigured}
                                    ShippingCharges={ShippingCharges}
                                    general={general}
                                    // width={width}
                                  />
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {openModal && (
        <RefundModal openModal={openModal} setOpenModal={setOpenModal} cartConfigured={cartConfigured} />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  general: JSON.parse(state.INIT.general),
  cartConfigured: state.CART.virtualCart,
});

export default connect(mapStateToProps, {})(withRouter(RefundOrder));
