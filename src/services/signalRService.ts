import * as signalR from "@microsoft/signalr";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

const SingnalR_Connection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE_URL}orderHub`) // URL của Hub backend
  .withAutomaticReconnect()
  .build();

export default SingnalR_Connection;
