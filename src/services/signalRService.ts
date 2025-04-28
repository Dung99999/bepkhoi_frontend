import * as signalR from "@microsoft/signalr";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

// Khởi tạo kết nối SignalR
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE_URL}SignalrHub`)
  .withAutomaticReconnect()
  .build();

// Quản lý danh sách callback cho mỗi eventName
type ListenerCallback = (data: any) => void;
const listeners: { [eventName: string]: ListenerCallback[] } = {};

// Quản lý số lượng tham chiếu cho mỗi group
const groupReferences: { [groupName: string]: number } = {};

// Hàm khởi tạo kết nối
export const startConnection = async (): Promise<void> => {
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      console.log("SignalR kết nối thành công");
    } catch (err) {
      console.error("Kết nối SignalR thất bại:", err);
      throw err;
    }
  }
};

// Hàm ngắt kết nối
export const stopConnection = async (): Promise<void> => {
  if (connection.state === signalR.HubConnectionState.Connected) {
    try {
      await connection.stop();
      console.log("SignalR đã ngắt kết nối");
      // Reset groupReferences khi ngắt kết nối
      Object.keys(groupReferences).forEach((key) => delete groupReferences[key]);
    } catch (err) {
      console.error("Ngắt kết nối SignalR thất bại:", err);
      throw err;
    }
  }
};

// Đăng ký listener cho eventName
export const addListener = (eventName: string, callback: ListenerCallback): void => {
  if (!listeners[eventName]) {
    listeners[eventName] = [];

    // Đăng ký listener tổng hợp với SignalR
    connection.on(eventName, (data: any) => {
      listeners[eventName].forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Lỗi khi xử lý sự kiện SignalR "${eventName}":`, err);
          console.warn("Dữ liệu nhận được:", data);
        }
      });
    });
  }

  listeners[eventName].push(callback);
};

// Xóa listener
export const removeListener = (eventName: string, callback: ListenerCallback): void => {
  if (listeners[eventName]) {
    listeners[eventName] = listeners[eventName].filter((cb) => cb !== callback);
    if (listeners[eventName].length === 0) {
      connection.off(eventName);
      delete listeners[eventName];
    }
  }
};

// Tham gia group
export const joinGroup = async (groupName: string): Promise<void> => {
  groupReferences[groupName] = (groupReferences[groupName] || 0) + 1;

  // Chỉ gọi JoinGroup nếu là lần đầu tiên
  if (groupReferences[groupName] === 1) {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await startConnection();
    }
    if (connection.state === signalR.HubConnectionState.Connected) {
      try {
        await connection.invoke("JoinGroup", groupName);
      } catch (err) {
        throw err;
      }
    }
  }
};

// Rời group
export const leaveGroup = async (groupName: string): Promise<void> => {
  if (groupReferences[groupName]) {
    groupReferences[groupName] -= 1;
    if (groupReferences[groupName] === 0) {
      if (connection.state === signalR.HubConnectionState.Connected) {
        try {
          await connection.invoke("LeaveGroup", groupName);
          delete groupReferences[groupName];
        } catch (err) {
          throw err;
        }
      }
    }
  }
};

// Xử lý kết nối lại để khôi phục group
connection.onreconnected(() => {
  console.log("SignalR đã kết nối lại");
  Object.keys(groupReferences).forEach((groupName) => {
    if (groupReferences[groupName] > 0) {
      connection.invoke("JoinGroup", groupName).catch((err) =>
        console.error(`Khôi phục group ${groupName} thất bại:`, err)
      );
    }
  });
});

// Xử lý khi kết nối bị ngắt
connection.onclose((err) => {
  console.log("SignalR kết nối bị ngắt:", err);
});

// Hàm kiểm tra trạng thái kết nối (tùy chọn)
export const getConnectionState = (): signalR.HubConnectionState => {
  return connection.state;
};