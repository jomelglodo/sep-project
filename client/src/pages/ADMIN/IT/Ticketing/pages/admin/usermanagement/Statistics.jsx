import React, { useState, useEffect } from "react";
import styles from "./Statistics.module.css";

import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";

export default function AdminUserStatistics() {
  const statistics = [
    {
      title: "Total Users",
      value: 48,
      color: "#3b82f6",
      icon: <HiUserGroup />,
    },
    {
      title: "Active Users",
      value: 42,
      color: "#22c55e",
      icon: <FaUsers />,
    },
    {
      title: "Inactive Users",
      value: 46,
      color: "#f59e0b",
      icon: <MdAdminPanelSettings />,
    },
    {
      title: "Administrators",
      value: 5,
      color: "#8b5cf6",
      icon: <FaUsers />,
    },
  ];
  return (
    <div className={styles.statistics_container}>
      {statistics.map((item, index) => (
        <div className={styles.statistics_card} key={index}>
          <div
            className={styles.statistics_icon}
            style={{
              background: item.color,
            }}
          >
            {item.icon}
          </div>
          <div>
            <h4>{item.title}</h4>
            <h2>{item.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
