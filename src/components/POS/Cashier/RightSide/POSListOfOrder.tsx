import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  note?: string;
}

const mockOrders: OrderItem[] = [
  { id: 1, name: "MILANO", quantity: 1, price: 30000 },
  { id: 2, name: "APEROL SPRITZ", quantity: 2, price: 30000 },
  { id: 3, name: "CAPPUCCINO", quantity: 1, price: 40000 },
];

const POSListOfOrder: React.FC = () => {
  const [selectedOrders, setSelectedOrders] = useState<OrderItem[]>(mockOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderItem | null>(null);

  const updateQuantity = (id: number, amount: number) => {
    setSelectedOrders((prevOrders) =>
      prevOrders.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const openNoteModal = (order: OrderItem) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, note: e.target.value });
    }
  };

  const saveNote = () => {
    if (currentOrder) {
      setSelectedOrders((prevOrders) =>
        prevOrders.map((item) =>
          item.id === currentOrder.id
            ? { ...item, note: currentOrder.note }
            : item
        )
      );
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-3 rounded-md">
      <ul className="space-y-2">
        {selectedOrders.map((item, index) => (
          <li key={item.id} className="bg-white p-2 rounded-md shadow">
            <div className="flex justify-between items-center">
              <span className="font-semibold w-1/3">
                {index + 1}. {item.name}
              </span>
              <div className="flex items-center space-x-2 w-1/3 justify-center">
                <div className="border-2" style={{ borderRadius: "15px" }}>
                  <Button
                    type="text"
                    icon={<MinusOutlined />}
                    onClick={() => updateQuantity(item.id, -1)}
                  />
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => updateQuantity(item.id, 1)}
                  />
                </div>
              </div>
              <div className="text-right w-1/3">
                <span style={{ marginRight: "30px", fontSize: "1rem" }}>
                  {item.price.toLocaleString()}đ
                </span>
                <span className="font-semibold" style={{ fontSize: "1.1rem" }}>
                  {(item.price * item.quantity).toLocaleString()}đ
                </span>
              </div>
            </div>
            <div
              className="text-sm text-gray-500 mt-1 cursor-pointer"
              onClick={() => openNoteModal(item)}
            >
              {item.note ? `Ghi chú: ${item.note}` : "Ghi chú/ món thêm"}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal nhập ghi chú */}
      <Modal
        title="Ghi chú"
        open={isModalOpen}
        onOk={saveNote}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Nhập ghi chú"
          value={currentOrder?.note || ""}
          onChange={handleNoteChange}
        />
      </Modal>
    </div>
  );
};

export default POSListOfOrder;
