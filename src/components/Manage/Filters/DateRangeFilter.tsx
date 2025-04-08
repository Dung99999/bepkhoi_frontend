import React from "react";
import { DatePicker, Space } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

interface Props {
  dateFrom: string | null;
  dateTo: string | null;
  setDateFrom: (value: string | null) => void;
  setDateTo: (value: string | null) => void;
}

const DateRangeFilter: React.FC<Props> = ({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo
}) => {
  const onChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates) {
      setDateFrom(dateStrings[0]);
      setDateTo(dateStrings[1]);
    } else {
      setDateFrom(null);
      setDateTo(null);
    }
  };

  return (
    <div className="search-filter-wrapper">
      <label className="block font-semibold mb-1">Khoảng thời gian</label>
      <Space direction="vertical" className="w-full">
        <RangePicker
          format="DD/MM/YYYY"
          onChange={onChange}
          value={[
            dateFrom && dayjs(dateFrom).isValid() ? dayjs(dateFrom) : null,
            dateTo && dayjs(dateTo).isValid() ? dayjs(dateTo) : null
          ]}
          className="w-full rounded-lg border px-3 py-2"
          placeholder={['Từ ngày', 'Đến ngày']}
        />
      </Space>
    </div>
  );
};

export default DateRangeFilter;