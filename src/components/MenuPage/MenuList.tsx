import React, { useState } from "react";
import styles from "./../../style/MenuPage/menuList.module.css";

const MenuList = ({ items }) => {

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleRowClick = (id: number) => {
        setSelectedProductId(selectedProductId === id ? null : id);
    }

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    return (
        <>
            <div className={styles.menuList}>
                <div className={styles.title}>
                    <h2>Hàng hóa</h2>
                    <div className={styles.btnGroup}>
                        <button>Thêm mới</button>
                        <button>Xuất file</button>
                    </div>
                </div>
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
                                <>
                                    <tr
                                        className={styles.row}
                                        onClick={() => handleRowClick(item.id)}
                                    >
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

                                    {selectedProductId === item.id && (
                                        <tr className={styles.detailsRow}>
                                            <td colSpan={9}>
                                                <div className={styles.productDetails}>
                                                    <div className={styles.productContent}>
                                                        <div className={styles.imageGallery}>
                                                            {item.imageUrl && item.imageUrl.length > 0 ? (
                                                                <>
                                                                    <img
                                                                        src={selectedImage || item.imageUrl[0]}
                                                                        alt={item.name}
                                                                        className={styles.mainImage}
                                                                    />
                                                                    <div className={styles.thumbnailContainer}>
                                                                        {item.imageUrl.map((img, index) => (
                                                                            <img
                                                                                key={index}
                                                                                src={img}
                                                                                alt={`${item.name} - ${index + 1}`}
                                                                                className={`${styles.thumbnail} ${selectedImage === img ? styles.active : ""}`}
                                                                                onClick={() => handleImageClick(img)}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <p className={styles.noImage}>Không có ảnh</p>
                                                            )}
                                                        </div>

                                                        <div className={styles.productInfo}>
                                                            <p><strong>Mã hàng hóa:</strong> {item.code}</p>
                                                            <p><strong>Loại thực đơn:</strong> {item.category}</p>
                                                            <p><strong>Giá bán:</strong> {item.price.toLocaleString()}₫</p>
                                                            <p><strong>Giá vốn:</strong> {item.cost.toLocaleString()}₫</p>
                                                            <p><strong>Tồn kho:</strong> {item.stock}</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.productActions}>
                                                        <button className={styles.update}>Cập nhật</button>
                                                        <button className={styles.statusBtn}>Trạng thái kinh doanh</button>
                                                        <button className={styles.delete}>Xóa</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default MenuList;
