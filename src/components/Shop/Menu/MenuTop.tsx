import React, { useContext } from "react";
import { MenuOutlined } from "@ant-design/icons";
import SearchFilter from "../../Shop/Filter/SearchFilter";
import { ModelModeContext } from "../../../context/ModelModeContext";

interface MenuTopProps {
    search: string;
    setSearch: (value: string) => void;
    toggleDrawer: () => void;
}

const MenuTop: React.FC<MenuTopProps> = ({ search, setSearch, toggleDrawer }) => {
    const modelMode = useContext(ModelModeContext);

    return (
        <>
            {modelMode === "1" ? (
                <div className="py-3 px-3 flex justify-between items-center">
                    <SearchFilter search={search} setSearch={setSearch} />
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
                        onClick={toggleDrawer}
                    >
                        <MenuOutlined className="text-gray-700 text-xl" />
                    </button>
                </div>
            ) : (
                <div className="py-3 px-3 flex justify-center items-center">
                    <div className="flex items-center max-w-lg">
                        <SearchFilter search={search} setSearch={setSearch} />
                        <button
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
                            onClick={toggleDrawer}
                        >
                            <MenuOutlined className="text-gray-700 text-xl" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MenuTop;
