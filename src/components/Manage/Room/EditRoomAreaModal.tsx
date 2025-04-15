import React from "react";
import { Form, Input, Modal, Button } from "antd";

interface RoomAreaProps {
    roomAreaId: number;
    roomAreaName: string;
    roomAreaNote: string;
    isDelete: boolean;
}

interface EditRoomAreaModalProps {
    visible: boolean;
    onClose: () => void;
    room?: RoomAreaProps | null;
    loading: boolean;
    onSubmit: (values: { roomAreaName: string; roomAreaNote: string }) => void;
}

const EditRoomAreaModal: React.FC<EditRoomAreaModalProps> = ({
    visible,
    onClose,
    room,
    loading,
    onSubmit,
}) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (room) {
            form.setFieldsValue({
                roomAreaName: room.roomAreaName,
                roomAreaNote: room.roomAreaNote,
            });
        }
    }, [room, form]);

    return (
        <Modal
            title="Cập nhật khu vực phòng"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
            >
                <Form.Item
                    name="roomAreaName"
                    label="Tên khu vực"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khu vực' }]}
                >
                    <Input placeholder="Nhập tên khu vực" />
                </Form.Item>
                <Form.Item
                    name="roomAreaNote"
                    label="Ghi chú"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khu vực' }]}
                >
                    <Input.TextArea placeholder="Nhập ghi chú (nếu có)" rows={4} />
                </Form.Item>

                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                    >
                        Lưu
                    </Button>
                    <Button
                        onClick={() => {
                            form.resetFields();
                            onClose();
                        }}
                        disabled={loading}
                        className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-md"
                    >
                        Bỏ qua
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default EditRoomAreaModal;