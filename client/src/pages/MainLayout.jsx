import React, { useEffect, useState } from "react";
import Header from "../components/MainHeader";
import "../assets/styles/MainLayout.css";
import Convertion from "./FINANCE/CONVERTION/Convertion";
import Ris from "../pages/PPC/WAREHOUSE/RIS/Ris";
import ConLogin from "../pages/PPC/WAREHOUSE/Consumable/Con_Login";
import TicketLogin from "./ADMIN/IT/Ticketing/Ticket_Login";

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
              <TicketLogin />
            </>
          ) : activeSub ? (
            <>
              <h2 className="content-title">{activeSub}</h2>
              <p>This is where your module will load</p>
            </>
          ) : (
            <div className="empty-space">
              <img src="" alt="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
