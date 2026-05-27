export interface ControlDevice {
  id: string;
  name: string | null;
  imei: string | null;
  serialNumber: string | null;
  deviceId: string | null;
  providerId: string | null;
  onlineStatus: string | null;
  productModel: string | null;
  nfcSupported: boolean;
  remoteUnlockSupported: boolean;
  terminalId: string;
  isOnlineTcp: boolean;
  createdAt: string;
}

export interface NfcCard {
  id: string;
  deviceId: string;
  nfcCardId: string;
  cardNumber: string | null;
  blockNumber: string | null;
  status: string;
  syncedAt: string | null;
  createdAt: string;
}

export interface DeviceParameterCommand {
  id: string;
  deviceId: string;
  commandType: string;
  status: string;
  requestedPayload: unknown;
  responsePayload: unknown;
  errorMessage: string | null;
  requestedById: string | null;
  requestedAt: string;
  completedAt: string | null;
}

export interface DeviceParameterSnapshot {
  id: string;
  deviceId: string;
  category: string;
  source: string;
  parameters: unknown;
  readAt: string;
  createdAt: string;
}

export type PresetKey =
  | "tracking_fast"
  | "tracking_normal"
  | "tracking_slow"
  | "gps_force";

export interface CommandResult {
  ok: boolean;
  terminalId?: string;
  action?: string;
  sent?: boolean;
  queued?: boolean;
  message: string;
  hexSent?: string;
  seconds?: number;
  operatorName?: string;
  instruction?: string;
}