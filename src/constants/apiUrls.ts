
const API_BASE_ADMIN = `/api/admin`;
// Auth related endpoints
export const AUTH_URLS = {
  LOGIN: `${API_BASE_ADMIN}/login`,
  LOGOUT: `${API_BASE_ADMIN}/logout`,
  FORGET_PASSWORD: `${API_BASE_ADMIN}/forget-password`,
  VERIFY_OTP: `${API_BASE_ADMIN}/verify-otp`,
  RESET_PASSWORD: `${API_BASE_ADMIN}/reset-password`,
  PROFILE: `${API_BASE_ADMIN}/profile`,
};


export const ADMIN_URLS ={
  GET_SUBSCRIPTIONS: `${API_BASE_ADMIN}/price-plan`,
  UPDATE_SUBSCRIPTION_PLAN: `${API_BASE_ADMIN}/price-plan`
}