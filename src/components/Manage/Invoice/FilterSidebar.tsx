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

interface InvoiceFilterParams {
    invoiceId?: number;
    customerKeyword?: string;
    cashierKeyword?: string;
    fromDate?: string;
    toDate?: string;
    status?: boolean;
    paymentMethod?: number;
}

enum PaymentMethod {
    CASH = 1,
    CREDIT_CARD = 9
}

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FilterSidebarProps {
    onFilterSubmit: (values: InvoiceFilterParams) => void;
    loading: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterSubmit, loading }) => {
    const [form] = Form.useForm();
    const [showStatusFilter, setShowStatusFilter] = useState(false);

    const onFinish = (values: any) => {
        const filterParams: InvoiceFilterParams = {
            invoiceId: values.invoiceId || undefined,
            customerKeyword: values.customerKeyword || undefined,
            cashierKeyword: values.cashierKeyword || undefined,
            fromDate: values.dateRange?.[0]?.toISOString(),
            toDate: values.dateRange?.[1]?.toISOString(),
            status: showStatusFilter ? values.status : undefined,
            paymentMethod: values.paymentMethod
        };
        onFilterSubmit(filterParams);
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current > dayjs().endOf('day');
    };

    return (
        <Card
            title="Bộ lọc hóa đơn"
            bordered={false}
            className="shadow-sm"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    paymentMethod: undefined,
                    status: true
                }}
            >
                <Form.Item name="invoiceId" label="Mã hóa đơn">
                    <Input type="number" placeholder="Nhập mã hóa đơn" />
                </Form.Item>

                <Form.Item name="customerKeyword" label="Tìm khách hàng">
                    <Input placeholder="Tên hoặc số điện thoại khách hàng" />
                </Form.Item>

                <Form.Item name="cashierKeyword" label="Tìm thu ngân">
                    <Input placeholder="Tên thu ngân" />
                </Form.Item>

                <Form.Item name="dateRange" label="Khoảng thời gian">
                    <RangePicker
                        format="DD/MM/YYYY"
                        className="w-full"
                        disabledDate={disabledDate}
                    />
                </Form.Item>

                <Form.Item name="paymentMethod" label="Phương thức thanh toán">
                    <Select placeholder="Tất cả phương thức">
                        <Option value={undefined}>Tất cả</Option>
                        <Option value={PaymentMethod.CASH}>Tiền mặt</Option>
                        <Option value={PaymentMethod.CREDIT_CARD}>Thẻ tín dụng</Option>
                    </Select>
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
                            <Form.Item name="status" noStyle>
                                <Select
                                    className="w-32 border-gray-300 hover:border-blue-500 focus:border-blue-500"
                                    dropdownClassName="rounded-lg shadow-md"
                                >
                                    <Option value={true}>Đã thanh toán</Option>
                                    <Option value={false}>Chưa thanh toán</Option>
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