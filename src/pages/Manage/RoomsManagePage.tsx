import React, { useState, useEffect } from "react";
import { Button, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RoomList from "../../components/Manage/Room/RoomList";
import Sidebar from "../../components/Manage/Room/Sidebar";
import AddRoomModal from "../../components/Manage/Room/AddRoomModal";
import RoomDetailModal from "../../components/Manage/Room/RoomDetailModal";
import EditRoomModal from "../../components/Manage/Room/EditRoomModal";

interface RoomProps {
    roomId: number;
    roomName: string;
    roomAreaId: number;
    ordinalNumber: number;
    seatNumber: number;
    roomNote: string;
    qrCodeUrl: string;
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
    const [search, setSearch] = useState("");
    const [rooms, setRooms] = useState<RoomProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [roomAreas, setRoomAreas] = useState<RoomAreaProps[]>([]);

    const [selectedRoom, setSelectedRoom] = useState<RoomProps | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            let apiUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/get-all`;

            if (search) {
                apiUrl = `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/search-by-name?name=${encodeURIComponent(search)}`;
            }

            const response = await fetch(apiUrl);

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
                roomAreaName: roomAreas.find(area => area.roomAreaId === room.roomAreaId)?.roomAreaName || 'Khu vựa đã bị xóa'
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
            const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/roomarea/get-all`);
            if (!response.ok) throw new Error('Failed to fetch room areas');
            const data = await response.json();
            setRoomAreas(data);
        } catch (error) {
            console.error('Error fetching room areas:', error);
            message.error('Không thể tải danh sách khu vực');
        }
    };

    const fetchRoomDetail = async (roomId: number) => {
        const room = rooms.find(r => r.roomId === roomId);
        if (room?.isDelete) {
            message.warning("Phòng đã bị xóa");
            return;
        }

        setDetailLoading(true);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/${roomId}`
            );

            if (!response.ok) throw new Error("Không tìm thấy thông tin phòng");

            const data = await response.json();
            if (data.isDelete) {
                message.warning("Phòng đã bị xóa");
                return;
            }
            const roomWithAreaName = {
                ...data,
                roomAreaName: roomAreas.find(area => area.roomAreaId === data.roomAreaId)?.roomAreaName || 'Khu vực đã bị xóa'
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

    const handleRowClick = (record: RoomProps) => {
        fetchRoomDetail(record.roomId);
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
            const response = await fetch(`${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "*/*"
                },
                body: JSON.stringify({
                    ...values,
                    status: true,
                    isUse: true,
                    isDelete: false
                }),
            });

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
                        "accept": "*/*"
                    },
                    body: JSON.stringify({
                        ...values,
                        qrCodeUrl: selectedRoom.qrCodeUrl,
                        isUse: selectedRoom.isUse,
                        isDelete: false
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Bàn đã ngừng kinh doanh. Vui lòng cập nhật trạng thái!");
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
                        { method: "DELETE" }
                    );

                    if (!response.ok) throw new Error("Xóa thất bại");

                    message.success("Xóa phòng thành công!");
                    setIsDetailModalOpen(false);
                    fetchRooms();
                } catch (error) {
                    message.error("Xóa phòng thất bại");
                    console.error("Error:", error);
                }
            }
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
    }, []);

    useEffect(() => {
        if (roomAreas.length > 0) {
            fetchRooms();
        }
    }, [search, roomAreas]);

    return (
        <div className="flex w-full h-full px-[8.33%] font-sans screen-menu-page">
            <div className="flex flex-1 p-4 gap-[7px]">
                <Sidebar
                    search={search}
                    onSearchChange={setSearch}
                />
                <main className="flex-1 overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Quản lý bàn</h1>
                        <div className="flex items-center font-semibold button-up-of-list">
                            <Button type="default" onClick={() => setIsAddModalOpen(true)}>
                                <PlusOutlined className="icon-of-menu-list-button" />Thêm mới
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
                </main>
            </div>
        </div>
    );
};

export default RoomsManagePage;