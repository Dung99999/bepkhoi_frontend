import React, { useRef, useState } from "react";
import { Tabs } from "antd";
import POSTableAndCustomerBar from "./POSTableAndCustomerBar";
import POSListOfOrder from "./POSListOfOrder";
import POSPayment from "./POSPayment";
import styles from "../../../../styles/POS/main.module.css";
import ModalCreateCustomer from "./ModalCreateCustomer";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const ModelRightSide: React.FC<{
  selectedTable: number | null;
  selectedOrders: any[];
}> = ({ selectedTable, selectedOrders }) => {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const openCustomerModal = () => {
    console.log("Setting isCustomerModalOpen to true");
    setIsCustomerModalOpen(true);
  };
  const closeCustomerModal = () => setIsCustomerModalOpen(false);

  const [tabs, setTabs] = useState([{ label: "Đơn 1", key: "1" }]);
  const [activeKey, setActiveKey] = useState("1");
  const tabCounter = useRef(2);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const addTab = () => {
    const newTabKey = tabCounter.current.toString();
    const newTabs = [
      ...tabs,
      { label: `Đơn ${tabCounter.current}`, key: newTabKey },
    ];
    tabCounter.current++;
    setTabs(newTabs);
    setActiveKey(newTabKey);
  };

  const removeTab = (targetKey: TargetKey) => {
    const newTabs = tabs.filter((tab) => tab.key !== targetKey);
    let newActiveKey = activeKey;

    if (newActiveKey === targetKey) {
      const lastTab = newTabs[newTabs.length - 1];
      newActiveKey = lastTab ? lastTab.key : "1";
    }

    setTabs(newTabs.length > 0 ? newTabs : [{ label: "Đơn 1", key: "1" }]);
    setActiveKey(newActiveKey);

    //reset counter if not exist any tabs
    if (newTabs.length === 0) {
      tabCounter.current = 2;
    }
  };

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "add") {
      addTab();
    } else {
      removeTab(targetKey);
    }
  };

  return (
    <div className="p-3 bg-[#FFFFFF] w-full rounded-lg h-[calc(100vh-2rem)] flex flex-col">
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        className={`flex-1 flex flex-col h-full ${styles.customTabs}`}
        items={tabs.map((tab) => ({
          label: (
            <span className={`${styles.customTabLabel}`}>{tab.label}</span>
          ),
          key: tab.key,
          children: (
            <div className="flex flex-col gap-1 h-full">
              <div className="flex-none">
                <POSTableAndCustomerBar
                  selectedTable={selectedTable}
                  onCreateCustomer={openCustomerModal}
                />
              </div>
              <div className="flex-1 overflow-y-auto min-h-[100px]">
                <POSListOfOrder />
              </div>
            </div>
          ),
        }))}
      />
      <div className="flex-none border-none min-w-full rounded-mdflex-grow-0">
        <POSPayment />
      </div>

      <ModalCreateCustomer
        open={isCustomerModalOpen}
        onClose={closeCustomerModal}
      />
    </div>
  );
};

export default ModelRightSide;
