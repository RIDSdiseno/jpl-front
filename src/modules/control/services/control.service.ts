import api from "../../../shared/api/api";
import type {
  CommandResult,
  ControlDevice,
  DeviceParameterCommand,
  DeviceParameterSnapshot,
  NfcCard,
  PresetKey,
} from "../types/control.types";

export async function fetchControlDevices(): Promise<ControlDevice[]> {
  const res = await api.get<ControlDevice[]>("/control/devices");
  return res.data;
}

export async function fetchNfcCards(
  deviceId: string
): Promise<{ device: ControlDevice; cards: NfcCard[] }> {
  const res = await api.get(`/control/nfc/${deviceId}/cards`);
  return res.data;
}

export async function addNfcCard(
  deviceId: string,
  cardNumber: string
): Promise<{ created: boolean; card: NfcCard; message: string }> {
  const res = await api.post(`/control/nfc/${deviceId}/cards`, {
    cardNumber,
  });
  return res.data;
}

export async function removeNfcCard(
  deviceId: string,
  cardId: string
): Promise<{ deleted: boolean; message: string }> {
  const res = await api.delete(`/control/nfc/${deviceId}/cards/${cardId}`);
  return res.data;
}

export async function startNfcAutoBind(
  deviceId: string,
  seconds = 60
): Promise<CommandResult> {
  const res = await api.post(`/control/nfc/${deviceId}/auto-bind`, {
    seconds,
  });
  return res.data;
}

export async function setIcCardPassword(
  deviceId: string,
  password: string
): Promise<CommandResult> {
  const res = await api.post(`/control/nfc/${deviceId}/ic-password`, {
    password,
  });
  return res.data;
}

export async function clearIcCards(deviceId: string): Promise<CommandResult> {
  const res = await api.post(`/control/nfc/${deviceId}/clear`, {});
  return res.data;
}

export async function setDevicePassword(
  deviceId: string,
  password: string
): Promise<CommandResult> {
  const res = await api.post(`/control/password/${deviceId}/set`, { password });
  return res.data;
}

export async function fetchCommandLog(params?: {
  deviceId?: string;
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<{
  commands: DeviceParameterCommand[];
  total: number;
  limit: number;
  offset: number;
}> {
  const res = await api.get("/control/cmd-log", { params });
  return res.data;
}

export async function applyPreset(
  deviceId: string,
  preset: PresetKey
): Promise<CommandResult> {
  const res = await api.post(`/control/preconfig/${deviceId}/apply`, { preset });
  return res.data;
}

export async function fetchParameterSnapshots(
  deviceId: string
): Promise<{ snapshots: DeviceParameterSnapshot[] }> {
  const res = await api.get(`/control/parameters/${deviceId}/snapshots`);
  return res.data;
}