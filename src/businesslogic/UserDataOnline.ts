import CreateUserModel from "../models/CreateUserModel";
import OnlineUserModel from "../models/OnlineUserModel";
import LocalUserData from "../models/LocalUserDataModel";
import axios from "axios";
import {
  GetUserToken,
  SaveOfflineUserData,
  SaveUserToken,
} from "./UserDataOffline";

export async function TestConnection(): Promise<boolean> {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/User/TestConnection`
  );
  return response.status === 200;
}

export async function UserLogin(
  uniId: string,
  password: string
): Promise<boolean | string> {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Auth/Login`,
    {
      uniId: uniId,
      password: password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: (status) => status < 500,
    }
  );
  if (response.status === 200) {
    await SaveUserToken(response.data.token);
    return true;
  }

  return response.data.error ?? "internet-connection-error";
}

export async function CreateUserAccount(
  model: CreateUserModel
): Promise<boolean | string> {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/Auth/Register`,
    {
      fullName: model.fullName,
      uniId: model.uniId,
      studentCode: model.studentCode,
      password: model.password,
      userRole: "Student",
      creator: "educode-mobile",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: (status) => status < 500,
    }
  );
  if (response.status === 200) {
    return true;
  }

  return response.data.error ?? "internet-connection-error";
}

export async function FetchAndSaveUserDataByUniId(
  uniId: string
): Promise<boolean | string> {
  const token = await GetUserToken();
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/User/UniId/${uniId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => status < 500,
    }
  );

  if (response.status === 200) {
    const data: OnlineUserModel = response.data;
    const localData: LocalUserData = {
      userType: data.userType.userType,
      uniId: data.uniId,
      studentCode: data.studentCode,
      offlineOnly: false,
      fullName: data.fullName,
    };

    SaveOfflineUserData(localData);
    return true;
  }
  return response.data.error ?? "internet-connection-error";
}
