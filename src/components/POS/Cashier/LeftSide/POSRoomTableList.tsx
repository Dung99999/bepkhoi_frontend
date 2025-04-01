import React, { useState, useEffect } from "react";
import { Modal, Input, Radio } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface roomAreaOption {
  label: string;
  value: number | null ;
}
async function fetchRoomAreas(): Promise<roomAreaOption[]> {
  try {
      const response = await fetch("https://localhost:7257/api/roomarea/get-all?limit=10&offset=0");
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
interface room {
  roomId : number,
  roomName: string,
  roomAreaId: number,
  ordinalNumber: number,
  roomNote: string,
  status: boolean,
  isUse: boolean
}
async function fetchRooms(): Promise<room[]> {
  try {
    const response = await fetch("https://localhost:7257/api/rooms/get-all?limit=50&offset=0");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: room[] = await response.json();

    return data.map(item => ({
      roomId: item.roomId,
      roomName: item.roomName,
      roomAreaId: item.roomAreaId,
      ordinalNumber: item.ordinalNumber,
      roomNote: item.roomNote,
      status: item.status,
      isUse: item.isUse, 
    }));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
}

const ITEMS_PER_PAGE = 12;

interface Props {
  setActiveTab: (tab: "room" | "menu") => void;
  selectedTable: number | null;
  setSelectedTable: (tableId: number | null) => void;
}

const POSRoomTableList: React.FC<Props> = ({
  setActiveTab,
  selectedTable,
  setSelectedTable,
}) => {
  const [roomAreaOptionList, setRoomAreaOptionList] = useState<roomAreaOption[]>([]);
  const [choosedArea, setChoosedAreea] = useState<number | null>(null);
  const [room, setRoom] = useState<room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [noteTableId, setNoteTableId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTables = room.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      useEffect(() => {
        async function getRoomAreas() {
            const roomAreas = await fetchRoomAreas();
            setRoomAreaOptionList(roomAreas);
        }
        getRoomAreas();

        async function getRooms() {
          const roomList = await fetchRooms();
          setRoom(roomList);
      }
      getRooms();        
      }, []); // Chạy 1 lần khi component mount

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex gap-4">
        <Radio.Group options={roomAreaOptionList} defaultValue="all" />
      </div>

      <div className="flex-1 p-4 grid grid-cols-4 grid-rows-3 gap-4">
        {currentTables.map((room) => (
          <div
            key={room.roomId}
            className={`relative flex flex-col items-center justify-center p-4 rounded-md cursor-pointer transition 
              ${
                selectedTable === room.roomId
                  ? "bg-blue-200"
                  : hoveredId === room.roomId
                  ? "bg-gray-200"
                  : "bg-white"
              }`}
            onMouseEnter={() => setHoveredId(room.roomId)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => {
              if (selectedTable === room.roomId) {
                setActiveTab?.("menu");
              } else {
                setSelectedTable(room.roomId);
              }
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
                ${
                  hoveredId === room.roomId
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                setNoteTableId(room.roomId);
              }}
            >
              Nhập ghi chú...
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#FFFFFF] flex justify-end gap-2">
        <LeftOutlined
          className={`cursor-pointer ${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        />
        <span>
          {currentPage} / {Math.ceil(room.length / ITEMS_PER_PAGE)}
        </span>
        <RightOutlined
          className={`cursor-pointer ${
            startIndex + ITEMS_PER_PAGE >= room.length
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
        open={noteTableId !== null}
        onCancel={() => setNoteTableId(null)}
        onOk={() => {
          console.log(`Ghi chú cho bàn ${noteTableId}:`, note);
          setNoteTableId(null);
        }}
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
