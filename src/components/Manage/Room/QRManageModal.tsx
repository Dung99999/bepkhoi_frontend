import React from "react";
import { Modal, Button, message } from "antd";
import { DownloadOutlined, DeleteOutlined, QrcodeOutlined } from "@ant-design/icons";

interface QRManageModalProps {
    visible: boolean;
    onClose: () => void;
    qrCodeUrl?: string;
    roomName: string;
    onGenerateQR: () => Promise<void>;
    onDownloadQR: () => Promise<void>;
    onDeleteQR: () => Promise<void>;
    loading: boolean;
}

const QRManageModal: React.FC<QRManageModalProps> = ({
    visible,
    onClose,
    qrCodeUrl,
    roomName,
    onGenerateQR,
    onDownloadQR,
    onDeleteQR,
    loading,
}) => {
    const handleDownload = async () => {
        if (!qrCodeUrl) return;
      
        try {
          message.loading({ content: 'Đang tải QR code...', key: 'download' });
          
          await onDownloadQR();
          message.success({ content: 'Tải QR code thành công!', key: 'download' });
        } catch (error) {
          console.error("Download error:", error);
          message.error({ content: 'Tải QR thất bại', key: 'download' });
        }
    };

    return (
        <Modal
            title={`Quản lý QR Code - ${roomName}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            className="qr-modal"
        >
            <div className="flex flex-col md:flex-row gap-6 p-4">      
                <div className="w-full md:w-2/3 flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg">
                    {qrCodeUrl ? (
                        <div className="relative group">
                            <img
                                src={qrCodeUrl}
                                alt={`QR Code ${roomName}`}
                                className="w-64 h-64 object-contain border border-gray-300 rounded-md shadow-sm transition-all duration-300 group-hover:shadow-lg"
                            />
                        </div>
                    ) : (
                        <div className="text-gray-500 text-lg py-16 italic">Chưa có mã QR</div>
                    )}
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
                    <Button
                        type="primary"
                        icon={<QrcodeOutlined />}
                        onClick={onGenerateQR}
                        loading={loading}
                        className="w-full h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        Tạo mã QR mới
                    </Button>

                    <Button
                        type="default"
                        icon={<DownloadOutlined />}
                        onClick={handleDownload}
                        disabled={!qrCodeUrl || loading}
                        loading={loading}
                        className={`w-full h-12 flex items-center justify-center font-medium rounded-lg transition-colors duration-200 ${
                            qrCodeUrl
                                ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200'
                        }`}
                    >
                        Download QR
                    </Button>

                    <Button
                        type="default"
                        icon={<DeleteOutlined />}
                        onClick={onDeleteQR}
                        disabled={!qrCodeUrl}
                        loading={loading}
                        className={`w-full h-12 flex items-center justify-center font-medium rounded-lg transition-colors duration-200 ${
                            qrCodeUrl
                                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200'
                        }`}
                    >
                        Xóa QR hiện tại
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default QRManageModal;