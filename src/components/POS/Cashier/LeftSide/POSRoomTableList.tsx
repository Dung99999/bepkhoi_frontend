import React, { useState, useEffect } from "react";
import { Modal, Input, Radio } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;
const token = localStorage.getItem("Token");

const ITEMS_PER_PAGE = 12;
interface roomAreaOption {
  label: string;
  value: number | null;
}
interface isUseOption {
  label: string;
  value: boolean | null;
}
interface room {
  roomId: number,
  roomName: string,
  roomAreaId: number,
  ordinalNumber: number,
  seatNumber: number,
  roomNote: string,
  isUse: boolean | null
}
interface Props {
  setActiveTab: (tab: "room" | "menu") => void;
  selectedTable: number | null;
  setSelectedTable: (tableId: number | null) => void;
  selectedShipper: number | null;
  setSelectedShipper: (shipperId: number | null) => void;
  orderType: number | null;
  setOrderType: (shipperId: number | null) => void;
}
async function fetchRoomAreas(): Promise<roomAreaOption[]> {
  try {
    const response = await fetch(`${API_BASE_URL}api/roomarea/get-all?limit=20&offset=0`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: { roomAreaId: number | null; roomAreaName: string }[] = await response.json();

    let options = data.map(item => ({
      label: item.roomAreaName,
      value: item.roomAreaId
    }));

    // Thêm option {label: "Tất Cả", value: null} vào vị trí index 1
    options.splice(0, 0, { label: "Tất Cả", value: null });

    return options;
  } catch (error) {
    console.error("Error fetching room areas:", error);
    return [];
  }
}
async function fetchRooms(): Promise<room[]> {
  try {
    const response = await fetch(`${API_BASE_URL}api/rooms/get-all-room-for-pos`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: room[] = await response.json();

    return data.map(item => ({
      roomId: item.roomId,
      roomName: item.roomName,
      roomAreaId: item.roomAreaId,
      ordinalNumber: item.ordinalNumber,
      seatNumber: item.seatNumber,
      roomNote: item.roomNote,
      isUse: item.isUse,
    }));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
}
async function fetchRoomFilter(choosedArea: number | null, choosedIsUse: boolean | null): Promise<room[]> {
  try {
    // Tạo chuỗi query string từ các tham số
    const query = new URLSearchParams();

    // Chỉ thêm query parameter nếu giá trị không phải null
    if (choosedArea !== null) {
      query.append("roomAreaId", choosedArea.toString());
    }
    if (choosedIsUse !== null) {
      query.append("isUse", choosedIsUse.toString());
    }

    // Gửi request với query parameters
    const response = await fetch(`${API_BASE_URL}api/rooms/filter-room-pos?${query.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: room[] = await response.json();

    return data.map(item => ({
      roomId: item.roomId,
      roomName: item.roomName,
      roomAreaId: item.roomAreaId,
      ordinalNumber: item.ordinalNumber,
      seatNumber: item.seatNumber,
      roomNote: item.roomNote,
      isUse: item.isUse,
    }));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
}

async function updateRoomNote(roomId: number | null, roomNote: string): Promise<boolean> {
  try {
    if (roomId === null) { return false }
    const response = await fetch(`${API_BASE_URL}api/rooms/update-room-note`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,

      },
      body: JSON.stringify({ roomId: roomId, roomNote: roomNote }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Lỗi cập nhật ghi chú:", data.message);
      return false;
    }
    console.log("Ghi chú cập nhật thành công:", data.message);
    return true;
  } catch (error) {
    console.error("Lỗi kết nối API:", error);
    return false;
  }
};



const POSRoomTableList: React.FC<Props> = ({
  setActiveTab,
  selectedTable,
  setSelectedTable,
  selectedShipper,
  setSelectedShipper,
  orderType,
  setOrderType,
}) => {
  const [roomAreaOptionList, setRoomAreaOptionList] = useState<roomAreaOption[]>([]);
  const [choosedArea, setChoosedArea] = useState<number | null>(null);
  const [choosedIsUse, setChoosedIsUse] = useState<boolean | null>(null);
  const [room, setRoom] = useState<room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [selectedRoomToNote, setSelectedRoomToNote] = useState<number | null>(null);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTables = room.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isUseFilterList: isUseOption[] =
    [
      { label: "Tất cả", value: null },
      { label: "Đang sử dụng", value: true },
      { label: "Đang trống", value: false }
    ]
  async function getRoomAreas() {
    const roomAreas = await fetchRoomAreas();
    setRoomAreaOptionList(roomAreas);
  }
  async function getRooms() {
    const roomList = await fetchRooms();
    setRoom(roomList);
  }
  async function getRoomFilter() {
    const rooms = await fetchRoomFilter(choosedArea, choosedIsUse);
    setRoom(rooms);
  }
  useEffect(() => {
    getRoomAreas();
    getRooms();
  }, []); // Chạy 1 lần khi component mount

  useEffect(() => {
    getRoomFilter();
  }, [choosedArea, choosedIsUse]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex gap-4">
        <Radio.Group options={roomAreaOptionList} defaultValue={choosedArea} onChange={(e) => setChoosedArea(e.target.value)} />
      </div>
      <div className="p-4 flex gap-4">
        <Radio.Group options={isUseFilterList} defaultValue={choosedIsUse} onChange={(e) => setChoosedIsUse(e.target.value)} />
      </div>
      <div className="flex-1 p-4 grid grid-cols-4 grid-rows-3 gap-4 overflow-y-auto">
        {currentTables.map((room) => (
          <div
            key={room.roomId}
            className={`relative flex flex-col items-center justify-center p-4 rounded-md cursor-pointer transition 
              ${(() => {
                if (room.roomId === selectedTable) {
                  return "bg-blue-300"; // If the room is selected
                } else if (room.roomId === hoveredId) {
                  return "bg-gray-300"; // If the room is hovered
                } else if (room.isUse === true) {
                  return "bg-gray-200"; // If the room is in use
                } else {
                  return "bg-white"; // Default background color
                }
              })()}
            `}
            onMouseEnter={() => setHoveredId(room.roomId)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => {
              setSelectedTable(room.roomId);
              setSelectedShipper(null)
              setOrderType(3); 
            }}
          >
            <img
              src={require("../../../../styles/POS/images/6937721.png")}
              alt="Table thumbnail"
              className="w-12 h-12"
            />
            <span className="mt-1 text-sm">{room.roomName}</span>

            <span
              className={`mt-1 text-xs text-gray-500 cursor-pointer transition-opacity duration-200
              ${(() => {
                  if (room.roomNote !== null && room.roomNote !== "") {
                    return "opacity-100 visible"
                  } else if (room.roomId == hoveredId) {
                    return "opacity-100 visible"
                  } else {
                    return "opacity-0 invisible"
                  }
                })()}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRoomToNote(room.roomId);
                if(room.roomNote!==null&&room.roomNote!=""){
                  setNote(room.roomNote);
                }
              }}
            >
              {
                (room.roomNote !== null && room.roomNote != "") ? room.roomNote : "Nhập ghi chú..."
              }
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#FFFFFF] flex justify-end gap-2">
        <LeftOutlined
          className={`cursor-pointer ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""
            }`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        />
        <span>
          {currentPage} / {Math.ceil(room.length / ITEMS_PER_PAGE)}
        </span>
        <RightOutlined
          className={`cursor-pointer ${startIndex + ITEMS_PER_PAGE >= room.length
              ? "opacity-50 pointer-events-none"
              : ""
            }`}
          onClick={() =>
            startIndex + ITEMS_PER_PAGE < room.length &&
            setCurrentPage(currentPage + 1)
          }
        />
      </div>

      <Modal
        title="Nhập ghi chú"
        open={selectedRoomToNote !== null}
        onCancel={() => { setNote(""); setSelectedRoomToNote(null) }}
        onOk={async () => {
          const success = await updateRoomNote(selectedRoomToNote, note);
          if (success) {
            await getRooms(); 
          }
          updateRoomNote(selectedRoomToNote, note);
          setNote("");
          setSelectedRoomToNote(null);
        }}
        okButtonProps={{ className: "bg-blue-400 hover:bg-blue-700 border-none text-white" }}
      >
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú..."
        />
      </Modal>
    </div>
  );
};

export default POSRoomTableList;
