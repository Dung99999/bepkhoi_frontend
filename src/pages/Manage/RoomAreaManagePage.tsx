import React, { useState, useEffect } from "react";
import { Button, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RoomAreaList from "../../components/Manage/Room/RoomAreaList";
import Sidebar from "../../components/Manage/Room/Sidebar";
import AddRoomAreaModal from "../../components/Manage/Room/AddRoomAreaModal";
import RoomAreaDetailModal from "../../components/Manage/Room/RoomAreaDetailModal";
import EditRoomAreaModal from "../../components/Manage/Room/EditRoomAreaModal";
import { useAuth } from "../../context/AuthContext";
import "./MenuPage.css";

interface RoomAreaProps {
  roomAreaId: number;
  roomAreaName: string;
  roomAreaNote: string;
  isDelete: boolean;
}

const RoomAreaManagePage: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [roomAreas, setRoomAreas] = useState<RoomAreaProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomAreaProps | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchRoomAreas = async () => {
    setLoading(true);
    try {
      let apiUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/get-all?limit=1000`;

      if (search) {
        apiUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/search-by-name-id?name=${encodeURIComponent(search)}`;
      } else if (status !== "all") {
        const isDelete = status === "0";
        apiUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/filter?isDelete=${isDelete}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${authInfo?.token}`,
        },
      });

      if (response.status === 401) {
        clearAuthInfo();
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
        setRoomAreas([]);
        return;
      }

      if (!response.ok) {
        if (response.status === 404) {
          setRoomAreas([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const resultData = Array.isArray(data) ? data : data.items || [];

      setRoomAreas(resultData);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu khu vực phòng");
      console.error("Error:", error);
      setRoomAreas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomDetail = async (roomAreaId: number) => {
    const room = roomAreas.find((r) => r.roomAreaId === roomAreaId);
    if (room?.isDelete) {
      message.warning("Phòng đã bị xóa");
      return;
    }

    setDetailLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/${roomAreaId}`,
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

      setSelectedRoom(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết phòng");
      console.error("Error:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRowClick = (record: RoomAreaProps) => {
    fetchRoomDetail(record.roomAreaId);
  };

  const handleAddRoomArea = async (values: {
    roomAreaName: string;
    roomAreaNote: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          body: JSON.stringify({
            ...values,
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
        throw new Error(errorData.message || "Lỗi khi thêm khu vực phòng");
      }

      const result = await response.json();
      message.success(result.message || "Thêm khu vực phòng thành công!");
      setIsAddModalOpen(false);
      fetchRoomAreas();
    } catch (error: any) {
      message.error(error.message || "Thêm khu vực phòng thất bại");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoomArea = async (values: {
    roomAreaName: string;
    roomAreaNote: string;
  }) => {
    if (!selectedRoom) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/update/${selectedRoom.roomAreaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          body: JSON.stringify({
            ...values,
            roomAreaId: selectedRoom.roomAreaId,
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
        throw new Error(errorData.message || "Lỗi khi cập nhật khu vực phòng");
      }

      const result = await response.json();
      message.success(result.message || "Cập nhật khu vực phòng thành công!");
      setIsEditModalOpen(false);
      fetchRoomAreas();
    } catch (error: any) {
      message.error(error.message || "Cập nhật khu vực phòng thất bại");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn chắc chắn muốn xóa khu vực "${selectedRoom.roomAreaName}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/delete/${selectedRoom.roomAreaId}`,
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

          message.success("Xóa khu vực phòng thành công!");
          setIsDetailModalOpen(false);
          fetchRoomAreas();
        } catch (error) {
          message.error("Xóa khu vực phòng thất bại");
          console.error("Error:", error);
        }
      },
    });
  };

  const handleEditRoom = () => {
    if (selectedRoom) {
      setIsDetailModalOpen(false);
      setIsEditModalOpen(true);
    }
  };

  useEffect(() => {
    fetchRoomAreas();
  }, [search, status]);

  return (
    <div className="flex w-full h-full px-[8.33%] relative font-sans screen-menu-page justify-center">
      <div className="flex flex-row  justify-center">
        <Sidebar search={search} onSearchChange={setSearch} />
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Quản lý khu vực phòng</h1>
            <div className="flex items-center font-semibold button-up-of-list">
              <Button type="default" onClick={() => setIsAddModalOpen(true)}>
                <PlusOutlined className="icon-of-menu-list-button" />
                Thêm mới
              </Button>
            </div>
          </div>
          <RoomAreaList
            data={roomAreas}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
      <AddRoomAreaModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRoomArea}
        loading={loading}
      />
      <RoomAreaDetailModal
        visible={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        room={selectedRoom}
        loading={detailLoading}
        onDelete={handleDeleteRoom}
        onEdit={handleEditRoom}
      />
      <EditRoomAreaModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        room={selectedRoom}
        loading={loading}
        onSubmit={handleUpdateRoomArea}
      />
    </div>
  );
};

export default RoomAreaManagePage;