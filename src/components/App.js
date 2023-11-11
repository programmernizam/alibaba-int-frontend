import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import HeaderManage from "./header/HeaderManage";
import Footer from "./footer/Footer";
import ErrorHandling from "../errorHandler/ErrorHandling";
import GlobalLoading from "../loader/GlobalLoading";
import MessengerChat from "./chat/MessengerChat";
import { BiCloudDownload } from "react-icons/bi";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalLoading />
      <HeaderManage />
      <ErrorHandling />
      <div className="page-wrapper">
        <Routing />
      </div>
      <div className="messenger-chat">
        <MessengerChat />
      </div>

      {/* <button
        className="rounded-circle fixed-bottom download-button d-flex flex-column justify-content-center align-items-center"
        id="install-button"
      >
        <div>
          <BiCloudDownload
            style={{ fontSize: "medium", fontWeight: "bolder" }}
          />
        </div>{" "}
        <div>Install App</div>
      </button> */}

      <Footer />
    </BrowserRouter>
  );
};

export default App;
