export type AuthUser = {
  id: string;
  username: string | null;
  email: string;
  name: string;
  status: string;
  accountStatus: string;
  roleId: string | null;
  companyId: string | null;
  forceChangePassword: boolean;
};

export type LoginPayload = {
  username: string;
  password: string;
  recaptchaToken: string;
};

export type LoginResponse = {
  ok: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};