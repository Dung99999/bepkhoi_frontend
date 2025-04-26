import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    DatePicker,
    Select,
    Space,
    Card,
    Switch
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

interface OrderFilterParams {
    orderId?: number;
    customerKeyword?: string;
    fromDate?: string;
    toDate?: string;
    orderStatus?: number;
    orderType?: number;
}

enum OrderStatus {
    ALL = 0,
    PENDING = 1,
    COMPLETED = 2,
    CANCELLED = 3
}

enum OrderType {
    ALL = 0,
    TAKE_AWAY = 1,
    DELIVERY = 2,
    DINE_IN = 3
}

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FilterSidebarProps {
    onFilterSubmit: (values: OrderFilterParams) => void;
    loading: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterSubmit, loading }) => {
    const [form] = Form.useForm();
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [showTypeFilter, setShowTypeFilter] = useState(false);

    const onFinish = (values: any) => {
        const filterParams: OrderFilterParams = {
            orderId: values.orderId || undefined,
            customerKeyword: values.customerKeyword || undefined,
            fromDate: values.dateRange?.[0]?.toISOString(),
            toDate: values.dateRange?.[1]?.toISOString(),
        };
        if (showStatusFilter && values.orderStatus !== OrderStatus.ALL) {
            filterParams.orderStatus = values.orderStatus;
        }
        if (showTypeFilter && values.orderType !== OrderType.ALL) {
            filterParams.orderType = values.orderType;
        }

        onFilterSubmit(filterParams);
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current > dayjs().endOf('day');
    };

    return (
        <Card
            title="Bộ lọc đơn hàng"
            bordered={false}
            className="shadow-sm"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    orderStatus: OrderStatus.ALL,
                    orderType: OrderType.ALL
                }}
            >
                <Form.Item name="orderId" label="Mã đơn hàng">
                    <Input type="number" placeholder="Nhập mã đơn hàng" />
                </Form.Item>

                <Form.Item name="customerKeyword" label="Tìm khách hàng">
                    <Input placeholder="Tên hoặc số điện thoại khách hàng" />
                </Form.Item>

                <Form.Item name="dateRange" label="Khoảng thời gian">
                    <RangePicker
                        format="DD/MM/YYYY"
                        className="w-full"
                        disabledDate={disabledDate}
                    />
                </Form.Item>

                <Form.Item label="Lọc theo trạng thái">
                    <Space className="items-center">
                        <Switch
                            checked={showStatusFilter}
                            onChange={setShowStatusFilter}
                            className={`${showStatusFilter ? 'bg-blue-500' : 'bg-gray-300'}`}
                        />
                        <span className="text-gray-800 font-medium">Trạng thái:</span>
                        {showStatusFilter && (
                            <Form.Item name="orderStatus" noStyle>
                                <Select
                                    className="w-32 border-gray-300 hover:border-blue-500 focus:border-blue-500"
                                    dropdownClassName="rounded-lg shadow-md"
                                >
                                    <Option value={OrderStatus.ALL}>Tất cả</Option>
                                    <Option value={OrderStatus.PENDING}>Đang xử lý</Option>
                                    <Option value={OrderStatus.COMPLETED}>Hoàn thành</Option>
                                    <Option value={OrderStatus.CANCELLED}>Đã hủy</Option>
                                </Select>
                            </Form.Item>
                        )}
                    </Space>
                </Form.Item>

                <Form.Item label="Lọc theo loại đơn">
                    <Space className="items-center">
                        <Switch
                            checked={showTypeFilter}
                            onChange={setShowTypeFilter}
                            className={`${showTypeFilter ? 'bg-blue-500' : 'bg-gray-300'}`}
                        />
                        <span className="text-gray-800 font-medium">Loại đơn:</span>
                        {showTypeFilter && (
                            <Form.Item name="orderType" noStyle>
                                <Select
                                    className="w-32 border-gray-300 hover:border-blue-500 focus:border-blue-500"
                                    dropdownClassName="rounded-lg shadow-md"
                                >
                                    <Option value={OrderType.ALL}>Tất cả</Option>
                                    <Option value={OrderType.DINE_IN}>Tại chỗ</Option>
                                    <Option value={OrderType.DELIVERY}>Giao hàng</Option>
                                    <Option value={OrderType.TAKE_AWAY}>Mang đi</Option>
                                </Select>
                            </Form.Item>
                        )}
                    </Space>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 font-medium"
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        className="mt-2 font-medium"
                        onClick={() => {
                            form.resetFields();
                            setShowStatusFilter(false);
                            setShowTypeFilter(false);
                        }}
                        block
                    >
                        Đặt lại
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default FilterSidebar;