import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ShopMenuRedirect() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkRoomValidity = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_APP_ENDPOINT}api/rooms/get-all?limit=1000&offset=0`,
                    {
                      method: "GET"
                    }
                  );
                
                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách phòng');
                }

                const rooms = await response.json();
                const isValidRoom = rooms.some((room: any) => 
                    room.roomId.toString() === roomId && 
                    !room.isDelete
                );

                if (isValidRoom) {
                    sessionStorage.setItem('roomId', roomId!);
                    navigate('/guess');
                } else {
                    navigate('/navi');
                }
            } catch (err) {
                console.error('Lỗi khi kiểm tra phòng:', err);
                setError('Có lỗi xảy ra khi kiểm tra thông tin phòng');
                navigate('/navi');
            } finally {
                setIsLoading(false);
            }
        };

        if (roomId) {
            checkRoomValidity();
        } else {
            navigate('/navi');
        }
    }, [roomId, navigate]);

    if (isLoading) {
        return <div>Đang kiểm tra thông tin phòng...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <div>Đang chuyển hướng...</div>;
}

export default ShopMenuRedirect;