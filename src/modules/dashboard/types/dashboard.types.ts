export interface DevicesByType {
  type: string;
  total: number;
}

export interface OperationRatio {
  online: number;
  offline: number;
  total: number;
}

export interface SystemMessage {
  id: string | number;
  title?: string;
  message?: string;
  type?: string;
  createdAt?: string;
}

export interface PushEvent {
  id: string | number;
  deviceId?: string;
  deviceName?: string;
  eventType?: string;
  message?: string;
  createdAt?: string;
}

export interface AlarmEvent {
  id: string | number;
  deviceId?: string;
  deviceName?: string;
  alarmType?: string;
  message?: string;
  createdAt?: string;
}

export interface DashboardSummary {
  devicesByType: DevicesByType[];
  operationRatio: OperationRatio;
  systemMessages: SystemMessage[];
  pushEvents: PushEvent[];
  alarmEvents: AlarmEvent[];
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}