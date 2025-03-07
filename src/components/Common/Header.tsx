import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./../../style/Common/header.module.css";
import config from "../../config/config";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.logo}>
          <img src="https://e7.pngegg.com/pngimages/361/627/png-clipart-leaf-logo-green-leaves-green-and-teal-leaf-logo-text-maple-leaf-thumbnail.png" alt="Logo" />
          <span>Nhà hàng Bếp Khói</span>
        </div>
        <div className={styles.topMenu}>
          <span>0xxx xxx xxx</span>
        </div>
      </div>

      <div className={styles.navBar}>
        <nav className={styles.menu}>
          {config.menuItem.map((item) => (
            <div
              key={item.id}
              className={styles.menuItem}
              onMouseEnter={() => item.subMenu && setOpenDropdown(item.id)}
              onMouseLeave={() => item.subMenu && setOpenDropdown(null)}
            >
              <button
                className={`${styles.menuButton} ${
                  location.pathname === item.path ? styles.active : ""
                }`}
                onClick={() => !item.subMenu && navigate(item.path)}
              >
                {item.label} {item.subMenu && "▼"}
              </button>
              {openDropdown === item.id && item.subMenu && (
                <div className={styles.dropdownContent}>
                  {item.subMenu.map((sub, index) => (
                    <button key={index} onClick={() => navigate(sub.path)}>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
