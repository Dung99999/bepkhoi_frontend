import React from 'react';
import { useSearchParams } from 'react-router-dom';

const VnpayTransactionResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resultParam = searchParams.get('result');
  const result = resultParam === 'true';

  return (
    <div className="text-center mt-10">
      <h1 className={`text-2xl font-bold ${result ? 'text-green-600' : 'text-red-600'}`}>
        {result ? 'Giao dịch thành công' : 'Giao dịch thất bại'}
      </h1>
    </div>
  );
};

export default VnpayTransactionResult;