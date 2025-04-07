import React from "react";
import {
  Modal,
  Select,
  Space,
  Radio,
  Typography,
  InputNumber,
  Table,
  Button,
} from "antd";

const { Text } = Typography;

interface SplitOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (note: string) => void;
  note: string;
  setNote: (note: string) => void;
}

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const ModalSplitOrder: React.FC<SplitOrderModalProps> = ({
  open,
  onCancel,
  onOk,
  note,
  setNote,
}) => {
  const [splitMode, setSplitMode] = React.useState<"split" | "merge">("split");
  const [orderType, setOrderType] = React.useState<string>("");

  // Sample data
  const [splitData, setSplitData] = React.useState([
    {
      key: "1",
      id: "SP001",
      name: "Trà Sữa Trân Châu",
      originalQty: 3,
      splitQty: 1,
    },
    {
      key: "2",
      id: "SP002",
      name: "Cà Phê Sữa",
      originalQty: 2,
      splitQty: 0,
    },
  ]);

  // Data for merge mode
  const mergeData = [
    {
      key: "1",
      customer: "Nguyễn Văn A",
      orderId: "HD001",
      totalItems: 3,
      totalAmount: 120000,
    },
    {
      key: "2",
      customer: "Trần Thị B",
      orderId: "HD002",
      totalItems: 5,
      totalAmount: 200000,
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "Tên Sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "45%",
    },
    {
      title: "SL trên đơn gốc",
      dataIndex: "originalQty",
      key: "originalQty",
      width: "30%",
    },
    {
      title: "SL tách",
      dataIndex: "splitQty",
      key: "splitQty",
      width: "20%",
      render: (value: number, record: any) => (
        <InputNumber
          min={0}
          max={record.originalQty}
          value={value}
          onChange={(val) => {
            const newData = splitData.map((item) =>
              item.key === record.key
                ? { ...item, splitQty: Math.min(val || 0, item.originalQty) }
                : item
            );
            setSplitData(newData);
          }}
        />
      ),
    },
  ];

  const mergeColumns = [
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Mã đơn",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "SL hàng",
      dataIndex: "totalItems",
      key: "totalItems",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value: number) => `${value.toLocaleString()} đ`,
    },
  ];

  const totalSplitQty = splitData.reduce((sum, item) => sum + item.splitQty, 0);

  return (
    <Modal
      className="w-[60vw] h-auto"
      title="Bàn 1/ phòng 10" // using {for call element}
      open={open}
      onCancel={onCancel}
      width="60vw"
      onOk={() => onOk(note)}
    >
      {/* Split/ Merge Order General */}
      <div className="w-full h-auto">
        {/* Tab bar */}

        {/* Radio Group để chọn chế độ */}
        <Radio.Group
          onChange={(e) => setSplitMode(e.target.value)}
          value={splitMode}
          buttonStyle="solid"
        >
          <Radio.Button value="split">Tách đơn</Radio.Button>
          <Radio.Button value="merge">Ghép đơn</Radio.Button>
        </Radio.Group>

        {splitMode === "split" ? (
          <div>
            {/* Select option */}
            <div className=" w-[100%] mt-[1vw] h-auto flex flex-row justify-between">
              <p className="font-semibold">Ghép đến</p>
              <Select
                defaultValue="tạo bàn mới"
                style={{ width: 300 }}
                onChange={handleChange}
                options={[
                  { value: "tạo bàn mới", label: "tạo bàn mới" },
                  { value: "Bàn 2", label: "Bàn 2" },
                  { value: "Bàn 3", label: "bàn 3" },
                ]}
              />
              <Select
                defaultValue="chọn phòng bàn"
                style={{ width: 300 }}
                onChange={(value) => setOrderType(value)}
                options={[
                  { value: "Mang về", label: "Mang về" },
                  { value: "Giao đi", label: "Giao đi" },
                  { value: "Bàn 1", label: "Bàn 1" },
                  { value: "Bàn 2", label: "Bàn 2" },
                ]}
              />
              {/* When select shipper */}
              {orderType === "Giao đi" && (
                <Select
                  placeholder="Chọn shipper"
                  style={{ width: 200 }}
                  onChange={(value) => console.log("Shipper được chọn:", value)}
                  options={[
                    { value: "Ahamove", label: "Ahamove" },
                    { value: "Grab", label: "Grab" },
                    { value: "Nội bộ", label: "Nội bộ" },
                  ]}
                />
              )}
            </div>
            {/* Table */}
            <Table
              className="mt-[2vw]"
              dataSource={splitData}
              columns={columns}
              pagination={false}
              bordered
              size="small"
              locale={{
                emptyText: "Bạn không có hóa đơn nào",
              }}
            />

            {/* Total of split elements */}
            {splitData.length > 0 && (
              <div className="flex justify-end mt-2">
                <Text strong>Tổng SL tách: {totalSplitQty}</Text>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Select option */}
            <div className=" w-[100%] mt-[1vw] h-auto flex flex-row justify-start">
              <p className="font-semibold">Ghép đến</p>
              <Select
                defaultValue="tạo bàn mới"
                style={{ width: 300 }}
                onChange={handleChange}
                className="ml-[8vw]"
                options={[
                  { value: "tạo bàn mới", label: "tạo bàn mới" },
                  { value: "Bàn 2", label: "Bàn 2" },
                  { value: "Bàn 3", label: "bàn 3" },
                ]}
              />
            </div>
            {/* Merge Order Table */}
            <Table
              className="mt-[2vw]"
              dataSource={mergeData}
              columns={mergeColumns}
              pagination={false}
              bordered
              size="small"
              locale={{ emptyText: "Bạn không có hóa đơn nào" }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalSplitOrder;
