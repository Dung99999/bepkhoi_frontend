import React, { useRef, useState } from "react";

const ShopNavi: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleOpenCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsCameraOpen(true);
        } catch (err) {
            console.error("Lỗi truy cập camera:", err);
            alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                padding: "16px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "24px 20px",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    textAlign: "center",
                    width: "100%",
                    maxWidth: "400px",
                }}
            >
                <h1
                    style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#222",
                        marginBottom: "20px",
                        lineHeight: "1.4",
                    }}
                >
                    📲 Vui lòng quét QR để truy cập hệ thống
                </h1>

                <button
                    onClick={handleOpenCamera}
                    style={{
                        padding: "12px 20px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginBottom: "20px",
                    }}
                >
                    🎥 Truy cập Camera
                </button>

                {isCameraOpen && (
                    <video
                        ref={videoRef}
                        style={{
                            width: "100%",
                            borderRadius: "12px",
                            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        }}
                        autoPlay
                    />
                )}
            </div>
        </div>
    );
};

export default ShopNavi;
