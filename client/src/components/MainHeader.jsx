import React, { useState } from "react";
import "../assets/styles/MainLayout.css";
import SemitecLogo from "../assets/images/Semitec_Logo.png";

//import header images
import { HEADER_IMAGE } from "../assets/images/header_index";

/* const department = {
  ADMIN: {
    RoleManagement: [],
    SystemSetting: [],
  },
  FINANCE: {
    Convertion: [],
  },
  MAINTENANCE: {
    TroubleReport: [],
  },
  PPC: {
    Warehouse: ["RIS", "Consumable Issuance"],
    Packing: [],
    Planning: ["OS Program"],
  },
  PRODUCTION: {
    Monitoring: [],
  },
}; */
const department = {
  ADMIN: {
    image: HEADER_IMAGE.header_admin,
    menu: {
      Sample1: [],
      Sample2: [],
    },
  },

  FINANCE: {
    image: HEADER_IMAGE.header_finance,
    menu: {
      Convertion: [],
    },
  },

  MAINTENANCE: {
    image: HEADER_IMAGE.header_maintenance,
    menu: {
      "Trouble Report": [],
    },
  },

  PPC: {
    image: HEADER_IMAGE.header_ppc,
    menu: {
      Warehouse: ["RIS", "Consumable Issuance"],
      Packing: [],
      Planning: ["OS Program"],
    },
  },
  QA: {
    image: HEADER_IMAGE.header_qaqc,
    menu: {
      QC: ["PQID"],
      QA: [],
    },
  },

  PRODUCTION: {
    image: HEADER_IMAGE.header_production,
    menu: {
      Monitoring: [],
    },
  },
};

export default function Header({ setActiveSub }) {
  const [activeDept, setActiveDept] = useState(null);
  const [activeSubmenu, setActiveSubMenu] = useState(null);

  return (
    <div className="header  ">
      {/* LOGO */}
      <div className="logo">
        <img
          className="home-semitec-logo"
          src={SemitecLogo}
          alt="Semitec Logo"
        />
      </div>

      {/* MENU */}

      {Object.entries(department).map(([dept, deptData]) => (
        <div
          key={dept}
          className="menu-wrapper"
          onMouseEnter={() => setActiveDept(dept)}
          onMouseLeave={() => {
            setActiveDept(null);
            setActiveSubMenu(null);
          }}
        >
          <button className="btn-dept">
            {" "}
            <img src={deptData.image} alt={dept} className="dept-icon" />
            {dept}
          </button>

          {/* First Dropdown */}

          {activeDept === dept && (
            <div className="dropdown">
              {Object.keys(deptData.menu).map((sub) => (
                <div
                  key={sub}
                  className="subitem-wrapper"
                  onMouseEnter={() => {
                    setActiveSubMenu(sub);
                  }}
                  onMouseLeave={() => {
                    setActiveSubMenu(null);
                  }}
                >
                  {/* SUBITEM */}
                  <div
                    className={`subitem-section ${
                      deptData.menu[sub]?.length > 0 ? "disabled" : ""
                    }`}
                    onClick={() => {
                      if (deptData.menu[sub]?.length === 0) {
                        setActiveSub(`${dept} - ${sub}`);
                      }
                    }}
                  >
                    <span>{sub}</span>
                    {deptData.menu[sub]?.length > 0 && (
                      <span className="submenu-arrow"> ▶ </span>
                    )}
                  </div>

                  {/* SECOND DROPDOWN */}
                  {deptData.menu[sub]?.length > 0 && activeSubmenu === sub && (
                    <div className="submenu-dropdown">
                      {deptData.menu[sub].map((item) => (
                        <div
                          key={item}
                          className="submenu-item"
                          onClick={() =>
                            setActiveSub(`${dept} - ${sub} - ${item}`)
                          }
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
