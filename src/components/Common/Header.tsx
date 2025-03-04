import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./../../style/Common/header.module.scss";
import config from "../../config/config";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" />
          <span>Nhà hàng Bếp Khói</span>
        </div>
        <div className={styles.topMenu}>
          <span>0xxx xxx xxx</span>
        </div>
      </div>

      <div className={styles.navBar}>
        <nav className={styles.menu}>
          {config.menuItem.map((item) => (
            <button
              key={item.id}
              className={location.pathname === item.path ? styles.active : ""}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.rightButtons}>
          {Object.values(config.menuButton).map((btn, index) => {
            const Icon = btn.icon;
            return (
              <button key={index} onClick={() => navigate(btn.path)}>
                <Icon /> {btn.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
