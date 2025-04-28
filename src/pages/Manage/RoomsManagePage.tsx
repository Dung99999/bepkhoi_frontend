import React, { useState, useEffect } from "react";
import { Button, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RoomList from "../../components/Manage/Room/RoomList";
import Sidebar from "../../components/Manage/Room/Sidebar";
import AddRoomModal from "../../components/Manage/Room/AddRoomModal";
import RoomDetailModal from "../../components/Manage/Room/RoomDetailModal";
import EditRoomModal from "../../components/Manage/Room/EditRoomModal";
import QRManageModal from "../../components/Manage/Room/QRManageModal";
import { useAuth } from "../../context/AuthContext";

interface RoomProps {
  roomId: number;
  roomName: string;
  roomAreaId: number;
  ordinalNumber: number;
  seatNumber: number;
  roomNote: string;
  qrCodeUrl: string | undefined;
  status: boolean;
  isUse: boolean;
  isDelete: boolean;
  roomAreaName?: string;
}

interface RoomAreaProps {
  roomAreaId: number;
  roomAreaName: string;
  roomAreaNote: string;
  isDelete: boolean;
}

const RoomsManagePage: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roomAreas, setRoomAreas] = useState<RoomAreaProps[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomProps | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      let apiUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/get-all?limit=100000`;

      if (search) {
        apiUrl = `${
          process.env.REACT_APP_API_APP_ENDPOINT
        }api/rooms/search-by-name?limit=1000&name=${encodeURIComponent(search)}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${authInfo?.token}`,
        },
      });

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        setRooms([]);
        return;
      }

      if (!response.ok) {
        if (response.status === 404) {
          setRooms([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const resultData = Array.isArray(data) ? data : data.items || [];

      const roomsWithAreaNames = resultData.map((room: RoomProps) => ({
        ...room,
        roomAreaName:
          roomAreas.find((area) => area.roomAreaId === room.roomAreaId)
            ?.roomAreaName || "Khu vực đã bị xóa",
      }));

      setRooms(roomsWithAreaNames);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu phòng");
      console.error("Error:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomAreas = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/get-all?limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${authInfo?.token}`,
          },
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch room areas");
      const data = await response.json();
      setRoomAreas(data);
    } catch (error) {
      console.error("Error fetching room areas:", error);
      message.error("Không thể tải danh sách khu vực");
    }
  };

  const fetchRoomDetail = async (roomId: number) => {
    const room = rooms.find((r) => r.roomId === roomId);
    if (room?.isDelete) {
      message.warning("Phòng đã bị xóa");
      return;
    }

    setDetailLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${authInfo?.token}`,
          },
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!response.ok) throw new Error("Không tìm thấy thông tin phòng");

      const data = await response.json();
      if (data.isDelete) {
        message.warning("Phòng đã bị xóa");
        return;
      }
      const roomWithAreaName = {
        ...data,
        roomAreaName:
          roomAreas.find((area) => area.roomAreaId === data.roomAreaId)
            ?.roomAreaName || "Khu vực đã bị xóa",
      };

      setSelectedRoom(roomWithAreaName);
      setIsDetailModalOpen(true);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết phòng");
      console.error("Error:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRowClick = (record: RoomProps, action?: string) => {
    if (action === "qr") {
      setSelectedRoom(record);
      setIsQRModalOpen(true);
    } else {
      fetchRoomDetail(record.roomId);
    }
  };

  const handleAddRoom = async (values: {
    roomName: string;
    roomAreaId: number;
    ordinalNumber: number;
    seatNumber: number;
    roomNote: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          body: JSON.stringify({
            ...values,
            status: true,
            isUse: true,
            isDelete: false,
          }),
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi thêm phòng");
      }

      const result = await response.json();
      message.success(result.message || "Thêm phòng thành công!");
      setIsAddModalOpen(false);
      fetchRooms();
    } catch (error: any) {
      message.error(error.message || "Thêm phòng thất bại");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoom = async (values: {
    roomName: string;
    roomAreaId: number;
    ordinalNumber: number;
    seatNumber: number;
    roomNote: string;
    status: boolean;
  }) => {
    if (!selectedRoom) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/update/${selectedRoom.roomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          body: JSON.stringify({
            ...values,
            isUse: selectedRoom.isUse,
            isDelete: false,
          }),
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Bàn đã ngừng kinh doanh. Vui lòng cập nhật trạng thái!"
        );
      }

      const result = await response.json();
      message.success(result.message || "Cập nhật phòng thành công!");
      setIsEditModalOpen(false);
      fetchRooms();
    } catch (error: any) {
      message.error(error.message || "Cập nhật phòng thất bại");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn chắc chắn muốn xóa phòng "${selectedRoom.roomName}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/delete/${selectedRoom.roomId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${authInfo?.token}`,
              },
            }
          );

          if (response.status === 401) {
            clearAuthInfo();
            message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
            return;
          }

          if (!response.ok) throw new Error("Xóa thất bại");

          message.success("Xóa phòng thành công!");
          setIsDetailModalOpen(false);
          fetchRooms();
        } catch (error) {
          message.error("Xóa phòng thất bại");
          console.error("Error:", error);
        }
      },
    });
  };

  const handleGenerateQR = async () => {
    if (!selectedRoom) return;
    const path = `${window.location.origin}/shopRedirect/`;
    setQrLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/generate-qr/${selectedRoom.roomId}?UrlBase=${encodeURIComponent(path)}`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authInfo?.token}`,
          },
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!response.ok) throw new Error("Tạo QR thất bại");

      const result = await response.json();
      message.success(result.message || "Tạo QR thành công!");

      const updatedRoom = {
        ...selectedRoom,
        qrCodeUrl: result.qrCodeUrl,
      };

      setSelectedRoom(updatedRoom);
      setRooms(
        rooms.map((room) =>
          room.roomId === selectedRoom.roomId ? updatedRoom : room
        )
      );
    } catch (error) {
      message.error("Tạo QR thất bại");
      console.error("Error:", error);
    } finally {
      setQrLoading(false);
    }
  };

  const handleDeleteQR = async () => {
    if (!selectedRoom) return;

    setQrLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/delete-qr/${selectedRoom.roomId}`,
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${authInfo?.token}`,
          },
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!response.ok) throw new Error("Xóa QR thất bại");

      const result = await response.json();
      message.success(result.message || "Xóa QR thành công!");
      const updatedRoom = {
        ...selectedRoom,
        qrCodeUrl: undefined,
      };

      setSelectedRoom(updatedRoom);
      setRooms(
        rooms.map((room) =>
          room.roomId === selectedRoom.roomId ? updatedRoom : room
        )
      );
    } catch (error) {
      message.error("Xóa QR thất bại");
      console.error("Error:", error);
    } finally {
      setQrLoading(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!selectedRoom?.qrCodeUrl) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/download-qr/${selectedRoom.roomId}`,
        {
          method: "GET",
          headers: {
            accept: "image/*",
            Authorization: `Bearer ${authInfo?.token}`,
          },
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (!response.ok) throw new Error("Không thể tải QR code");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_${selectedRoom.roomName.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Lỗi khi tải QR:", error);
      message.error("Tải QR thất bại");
      if (selectedRoom.qrCodeUrl) {
        const link = document.createElement("a");
        link.href = selectedRoom.qrCodeUrl;
        link.download = `QR_${selectedRoom.roomName.replace(/\s+/g, "_")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleEditRoom = () => {
    if (selectedRoom) {
      setIsDetailModalOpen(false);
      setIsEditModalOpen(true);
    }
  };

  useEffect(() => {
    fetchRoomAreas();
  }, []);

  useEffect(() => {
    if (roomAreas.length > 0) {
      fetchRooms();
    }
  }, [search, roomAreas]);

  return (
    <div className="flex w-full font-sans justify-center">
      <div className="flex gap-[0.75vw]">
        <Sidebar search={search} onSearchChange={setSearch} />
        <div className="flex-1 p-[1vw]">
          <div className="flex justify-between items-center mb-[1vw]">
            <h1 className="text-[1.5vw] font-bold">Quản lý bàn</h1>
            <div className="flex items-center">
              <Button
                type="default"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center bg-green-600 text-white hover:bg-green-700 text-[0.9vw] h-[2.5vw] px-[1vw]"
              >
                <PlusOutlined className="text-[0.9vw] mr-[0.5vw]" />
                Thêm mới
              </Button>
            </div>
          </div>

          <RoomList
            data={rooms}
            loading={loading}
            onRowClick={handleRowClick}
          />

          <AddRoomModal
            visible={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            roomAreas={roomAreas}
            onSubmit={handleAddRoom}
            loading={loading}
          />

          <RoomDetailModal
            visible={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            room={selectedRoom}
            loading={detailLoading}
            onDelete={handleDeleteRoom}
            onEdit={handleEditRoom}
          />

          <EditRoomModal
            visible={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            room={selectedRoom}
            roomAreas={roomAreas}
            loading={loading}
            onSubmit={handleUpdateRoom}
          />

          <QRManageModal
            visible={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            qrCodeUrl={selectedRoom?.qrCodeUrl}
            roomName={selectedRoom?.roomName || ""}
            onGenerateQR={handleGenerateQR}
            onDownloadQR={handleDownloadQR}
            onDeleteQR={handleDeleteQR}
            loading={qrLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomsManagePage;