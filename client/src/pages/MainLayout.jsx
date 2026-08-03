import React, { useEffect, useState } from "react";
import "../assets/styles/MainLayout.css";
import { ToastContainer, Bounce, Slide, Zoom, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/MainHeader";
import Convertion from "./FINANCE/CONVERTION/Convertion";
import Ris from "../pages/PPC/WAREHOUSE/RIS/Ris";
import ConLogin from "../pages/PPC/WAREHOUSE/Consumable/Con_Login";
import TicketLogin from "./ADMIN/IT/Ticketing/Ticket_Login";

import sepLogo from "../assets/images/SEP.png";

export default function MainLayout() {
  const [activeSub, setActiveSub] = useState(null);

  useEffect(() => {
    if (activeSub === "FINANCE - Convertion") {
      document.title = "Finance - Convertion";
    } else if (activeSub === "PPC - Warehouse - RIS") {
      document.title = "Warehouse - RIS";
    } else if (activeSub === "PPC - Warehouse - Consumable Issuance") {
      document.title = "Warehouse - Consumable Issuance";
    } else if (activeSub === "ADMIN - IT - Ticketing")
      document.title = "IT - Ticketing System";
  }, [activeSub]);

  return (
    <div className="app-container">
      <Header setActiveSub={setActiveSub} />
      <div className="main-container">
        <div className="content-box" key={activeSub}>
          {activeSub === "FINANCE - Convertion" ? (
            <>
              <h2 className="content-title">{activeSub}</h2>
              <Convertion />
            </>
          ) : activeSub === "PPC - Warehouse - RIS" ? (
            <>
              <Ris />
            </>
          ) : activeSub === "PPC - Warehouse - Consumable Issuance" ? (
            <>
              <ConLogin />
            </>
          ) : activeSub === "ADMIN - IT - Ticketing" ? (
            <>
              <ToastContainer
                transition={Slide}
                position="top-right"
                autoClose={2000}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
                /*  hideProgressBar={true} */
                limit={5} //3 toast will be visible at a time
                style={{ zIndex: 99999, fontSize: "0.8rem" }}
              />

              <TicketLogin />
            </>
          ) : activeSub ? (
            <>
              <h2 className="content-title">{activeSub}</h2>
              <p>This is where your module will load</p>
            </>
          ) : (
            <div className="empty-space">
              <div className="empty-image-container">
                <div
                  className="empty-space-card empty-space-pic1"
                  style={{
                    backgroundImage: `url(${sepLogo})`,
                  }}
                ></div>
                <div
                  className="empty-space-card empty-space-pic2"
                  style={{ backgroundImage: `url(${sepLogo})` }}
                ></div>
                <div
                  className="empty-space-card empty-space-pic3"
                  style={{ backgroundImage: `url(${sepLogo})` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
