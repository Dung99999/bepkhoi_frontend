import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ModelLeftSide from "../components/POS/Cashier/LeftSide/ModelLeftSide";
import ModelRightSide from "../components/POS/Cashier/RightSide/ModelRightSide";

const POSLayout: React.FC = () => {
    const location = useLocation();
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [selectedShipper, setSelectedShipper] = useState<number | null>(null);
    const [orderType, setOrderType] = useState<number | null>(3);    

    const handleSelectTable = (tableId: number | null) => {
        setSelectedTable(tableId);
    }

    return (
        <div className="min-h-screen w-full bg-[#faedd7] flex">
            {location.pathname === "/pos/cashier" ? (

                <div className="flex w-full gap-2.5 p-4">
                    <div className="w-1/2">
                        <ModelLeftSide 
                            selectedTable={selectedTable} 
                            setSelectedTable={handleSelectTable} 
                        />
                    </div>
                    <div className="w-1/2">
                        <ModelRightSide selectedTable={selectedTable} selectedShipper={selectedShipper} orderType={orderType}/>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-auto p-4">
                    <Outlet />
                </div>
            )}
        </div>
    );
};

export default POSLayout;
