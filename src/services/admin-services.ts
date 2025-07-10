import { axiosInstance, getAxiosInstance } from "@/config/axios";
import { AUTH_URLS } from "@/constants/apiUrls";

export const loginService = async (payload: any) => {
 return  await axiosInstance.post(`/api/admin/login`, {
    email: payload.email,
    password: payload.password,
  });
};
export const forgotPasswordService = async (payload: any) =>
  await axiosInstance.post(`${AUTH_URLS.FORGET_PASSWORD}`, payload);
export const sendOtpService = async (payload: any) =>
  await axiosInstance.post(`${AUTH_URLS.VERIFY_OTP}`, payload);
export const resetPassword = async (payload: any) =>
  await axiosInstance.post(`${AUTH_URLS.RESET_PASSWORD}`, payload);
export const logOutService = async (route: string) => {
  const axiosInstance = await getAxiosInstance();
  return axiosInstance.post(route);
};


//----------Subscription Page--------------------------
export const getSubscriptionDetails = async (route: string) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route);
}

export const updateSubscriptionPlan = async (route: string, payload:any) =>{
  const axiosInstance = await getAxiosInstance()
  return axiosInstance.put(route, payload);
}