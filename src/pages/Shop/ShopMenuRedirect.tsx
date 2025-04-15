import React from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ShopMenuRedirect() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (roomId) {
            sessionStorage.setItem('roomId', roomId);
            navigate('/guess');
        }
    }, [roomId, navigate]);

    return <div>Đang chuyển hướng...</div>;
}

export default ShopMenuRedirect;