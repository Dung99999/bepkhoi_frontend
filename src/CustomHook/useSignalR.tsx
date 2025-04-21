import { useEffect } from "react";
import { addListener, removeListener, joinGroup, leaveGroup } from "../services/signalRService";

interface SignalRConfig {
  eventName: string;
  groupName: string;
  callback: (data: any) => void;
}

const useSignalR = ({ eventName, groupName, callback }: SignalRConfig, dependencies: any[]) => {
  useEffect(() => {
    // Đăng ký listener và tham gia group
    addListener(eventName, callback);
    joinGroup(groupName).catch((err) => {
      console.error(`Lỗi khi tham gia group ${groupName}:`, err);
    });

    // Cleanup khi component unmount hoặc dependencies thay đổi
    return () => {
      removeListener(eventName, callback);
      leaveGroup(groupName).catch((err) => {
        console.error(`Lỗi khi rời group ${groupName}:`, err);
      });
    };
  }, [eventName, groupName, callback, ...dependencies]);
};

export default useSignalR;