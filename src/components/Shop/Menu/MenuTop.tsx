import React, { useContext } from "react";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import SearchFilter from "../../Shop/Filter/SearchFilter";
import { ModelModeContext } from "../../../context/ModelModeContext";

interface MenuTopProps {
    search: string;
    setSearch: (value: string) => void;
    toggleDrawer: () => void;
    orderIds: number[];
    selectedOrderId: number | null;
    onOrderIdChange: (id: number) => void;
}

const MenuTop: React.FC<MenuTopProps> = ({
    search,
    setSearch,
    toggleDrawer,
    orderIds,
    selectedOrderId,
    onOrderIdChange
}) => {
    const modelMode = useContext(ModelModeContext);

    const handleOrderChange = (id: number) => {
        onOrderIdChange(id);
        sessionStorage.setItem('selectedOrderId', id.toString());
    };

    return (
        <>
            {modelMode === "1" ? (
                <div className="py-3 px-3 flex flex-col gap-2">
                    <div className="flex justify-center">
                        <div className="relative w-50">
                            <select
                                value={selectedOrderId || ''}
                                onChange={(e) => handleOrderChange(Number(e.target.value))}
                                className="w-full p-1 pl-3 pr-6 text-sm border border-gray-300 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                                disabled={orderIds.length === 0}
                            >
                                {orderIds.length === 0 ? (
                                    <option value="" disabled>
                                        Chưa có phiếu đặt hàng
                                    </option>
                                ) : (
                                    orderIds.map(id => (
                                        <option
                                            key={id}
                                            value={id}
                                            className="text-xs py-1"
                                        >
                                            Phiếu đặt hàng #{id}
                                        </option>
                                    ))
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                                <DownOutlined className="text-gray-400 text-[10px]" />
                            </div>
                        </div>
                    </div>

                    <div className="py-3 px-3 flex justify-between items-center">
                    <SearchFilter search={search} setSearch={setSearch} />
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
                        onClick={toggleDrawer}
                    >
                        <MenuOutlined className="text-gray-700 text-xl" />
                    </button>
                </div>
                </div>
            ) : (
                <div className="py-3 px-3 flex items-center">
                    <div className="mr-4">
                        <div className="relative">
                            <select
                                value={selectedOrderId || ''}
                                onChange={(e) => handleOrderChange(Number(e.target.value))}
                                className="w-50 p-1 pl-3 pr-6 text-sm border border-gray-300 rounded-full shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                                disabled={orderIds.length === 0}
                            >
                                {orderIds.length === 0 ? (
                                    <option value="" disabled>
                                        Chưa có phiếu đặt hàng
                                    </option>
                                ) : (
                                    orderIds.map(id => (
                                        <option key={id} value={id}>
                                            Phiếu đặt hàng #{id}
                                        </option>
                                    ))
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <DownOutlined className="text-gray-500 text-xs" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="flex items-center max-w-lg">
                            <SearchFilter search={search} setSearch={setSearch} />
                            <button
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 ml-2"
                                onClick={toggleDrawer}
                            >
                                <MenuOutlined className="text-gray-700 text-xl" />
                            </button>
                        </div>
                    </div>
                    <div className="ml-4" style={{ width: orderIds.length > 0 ? '160px' : 0 }}></div>
                </div>
            )}
        </>
    );
};

export default MenuTop;