import React, { useState } from "react";
import styles from "./../../style//CostConfigPage/costList.module.css";

const CostList = ({ items }) => {

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const handleRowClick = (id: number) => {
        setSelectedProductId(selectedProductId === id ? null : id);
    }

    return (
        <>
            <div className={styles.menuList}>
                <div className={styles.title}>
                    <h2>Bảng giá chung</h2>
                    <div className={styles.btnGroup}>
                        <button>Xuất file</button>
                    </div>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Mã hàng hóa</th>
                            <th>Tên hàng</th>
                            <th>Loại thực đơn</th>
                            <th>Giá bán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={9} className={styles.empty}>
                                    <div className={styles.emptyBox}></div>
                                    <p>Không tìm thấy hàng hóa nào phù hợp</p>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <>
                                    <tr
                                        className={styles.row}
                                        onClick={() => handleRowClick(item.id)}
                                    >
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.price.toLocaleString()}₫</td>
                                    </tr>
                                </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CostList;
