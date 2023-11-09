import React from "react";
import PropTypes from "prop-types";
import MyAccount from "./MyAccount";
import MyOrders from "./MyOrders";
import AddressBook from "./AddressBook";
import DashboardDefault from "./DashboardDefault";
import Profile from "./Profile";
import PendingOrders from "./PendingOrders";
import CompletedOrders from "./CompletedOrders";
import CustomerList from "./CustomerList";
import ProcessingOrdersList from "./ProcessingOrdersList";
import RadyDeliverdOrdersList from "./RadyDeliverdOrdersList";
import RefundedOrders from "./RefundedOrders";
import Invoices from "../invoice/Invoices";

const SwitchSection = (props) => {
  switch (props.section) {
    case "dashboard":
      return <DashboardDefault />;

    case "orders":
      return <MyOrders />;

    case "pending-orders":
      return <PendingOrders />;

    case "processing-orders":
      return <ProcessingOrdersList />;

    case "ready-to-delivered":
      return <RadyDeliverdOrdersList />;

    case "complete-orders":
      return <CompletedOrders />;

    case "addresses":
      return <AddressBook />;

    case "account":
      return <Profile />;

    case "refunded-orders":
      return <RefundedOrders />;

    case "shop-as-customer":
      return <CustomerList />;
    case "invoices":
      return <Invoices />;

    default:
      return <MyAccount />;
  }
};

SwitchSection.propTypes = {
  section: PropTypes.string.isRequired,
};

export default SwitchSection;
