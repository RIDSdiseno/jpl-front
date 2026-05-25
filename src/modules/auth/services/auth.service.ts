import  api  from '../../../shared/api/api';
import type { LoginPayload, LoginResponse } from '../types/auth.types';

export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
}