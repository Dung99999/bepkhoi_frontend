import React from "react";
import styles from "./../../style/MenuPage/menuList.module.scss";

interface MenuItem {
    id: number;
    code: string;
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    order: number;
}

interface MenuListProps {
    items: MenuItem[];
}

const MenuList: React.FC<MenuListProps> = ({ items }) => {
    return (
        <>
            <div className={styles.menuList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>⭐</th>
                            <th>Mã hàng hóa</th>
                            <th>Tên hàng</th>
                            <th>Loại thực đơn</th>
                            <th>Giá bán</th>
                            <th>Giá vốn</th>
                            <th>Tồn kho</th>
                            <th>Đặt hàng</th>
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
                                <tr key={item.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>⭐</td>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.price.toLocaleString()}₫</td>
                                    <td>{item.cost.toLocaleString()}₫</td>
                                    <td>{item.stock}</td>
                                    <td>{item.order}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default MenuList;
