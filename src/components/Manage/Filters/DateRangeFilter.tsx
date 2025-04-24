import React from "react";
import { DatePicker, Space, Alert } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
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
  const [error, setError] = React.useState<string | null>(null);

  const onChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates) {
      const [start, end] = dates;
      
      setError(null);

      if (start && end && start.isAfter(end)) {
        setError("Ngày bắt đầu không thể sau ngày kết thúc");
        return;
      }
      if (!dayjs(dateStrings[0], 'DD/MM/YYYY', true).isValid() || 
          !dayjs(dateStrings[1], 'DD/MM/YYYY', true).isValid()) {
        setError("Định dạng ngày không hợp lệ");
        return;
      }

      setDateFrom(dateStrings[0]);
      setDateTo(dateStrings[1]);
    } else {
      setDateFrom(null);
      setDateTo(null);
      setError(null);
    }
  };

  const getDisplayDates = (): [Dayjs | null, Dayjs | null] => {
    try {
      const from = dateFrom && dayjs(dateFrom, 'DD/MM/YYYY').isValid() 
        ? dayjs(dateFrom, 'DD/MM/YYYY') 
        : null;
      const to = dateTo && dayjs(dateTo, 'DD/MM/YYYY').isValid() 
        ? dayjs(dateTo, 'DD/MM/YYYY') 
        : null;
      return [from, to];
    } catch (e) {
      return [null, null];
    }
  };

  return (
    <div className="search-filter-wrapper">
      <label className="block font-semibold mb-1">Khoảng thời gian</label>
      <Space direction="vertical" className="w-full">
        <RangePicker
          format="DD/MM/YYYY"
          onChange={onChange}
          value={getDisplayDates()}
          className="w-full rounded-lg border px-3 py-2"
          placeholder={['Từ ngày', 'Đến ngày']}
          disabledDate={(current) => {
            return current && current > dayjs().endOf('day');
          }}
        />
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            closable 
            onClose={() => setError(null)}
            className="mt-2"
          />
        )}
      </Space>
    </div>
  );
};

export default DateRangeFilter;