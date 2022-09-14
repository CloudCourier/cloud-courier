export interface User {
  id: number;
  username: string;
  avatar: string;
  key: string;
  email?: string;
  phone?: string;
}
export interface UserMessage {
  appkey: string;
  appLogo: string;
  appName: string;
  avatar: string;
  clientVendor: string;
  key: string;
  lastDate: number;
  location: string;
  message: {
    content: string;
    timestamp: number;
    target: string;
  }[];
  name: string;
  preferences: {
    memberId: number;
    key: string;
    lastTime: number;
    top: boolean | number;
    unRead?: number;
  };
}
