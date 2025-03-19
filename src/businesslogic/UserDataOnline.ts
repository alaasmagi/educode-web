import OnlineUserModel from "../models/OnlineUserModel";
import Storage from "../data/LocalDataAccess";
import { LocalKeys } from "../helpers/HardcodedLocalDataKeys";
import CreateUserModel from "../models/CreateUserModel";
import VerifyOTPModel from "../models/VerifyOTPModel";
import ChangePasswordModel from "../models/ChangePasswordModel";
import LocalUserData from "../models/LocalUserDataModel";
import {
  GetUserToken,
  SaveOfflineUserData,
  SaveUserToken,
} from "./UserDataOffline";

export async function UserLogin(
  uniId: string,
  password: string
): Promise<boolean> {
  console.log("LOGIN");
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/User/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uniId: uniId,
        password: password,
      }),
    });
    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    Storage.saveData(LocalKeys.localToken, data.token);
    return true;
  } catch (error) {
    return false;
  }
}

export async function CreateUserAccount(
  model: CreateUserModel
): Promise<Boolean> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/User/Register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: model.fullName,
          uniId: model.uniId,
          studentCode: model.studentCode,
          password: model.password,
          userRole: "Student",
          creator: "educode-mobile",
        }),
      }
    );
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

export async function FetchAndSaveUserDataByUniId(
  uniId: string
): Promise<boolean> {
  const token = await GetUserToken();
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/User/UniId/${uniId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data: OnlineUserModel = await response.json();
    const localData: LocalUserData = {
      userType: data.userType.userType,
      uniId: data.uniId,
      studentCode: data.studentCode,
      offlineOnly: false,
      fullName: data.fullName,
    };
    SaveOfflineUserData(localData);
    return true;
  } catch (error) {
    return false;
  }
}

export async function RequestOTP(uniId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/User/RequestOTP`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniId: uniId,
        }),
      }
    );
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

export async function VerifyOTP(model: VerifyOTPModel): Promise<boolean> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/User/VerifyOTP`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniId: model.uniId,
          otp: model.otp,
        }),
      }
    );
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    SaveUserToken(data.token);
    return true;
  } catch (error) {
    return false;
  }
}

export async function ChangeUserPassword(
  model: ChangePasswordModel
): Promise<boolean> {
  const token = await GetUserToken();
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/User/ChangePassword`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniId: model.uniId,
          newPassword: model.newPassword,
        }),
      }
    );
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

export async function DeleteUser(uniId: string): Promise<boolean> {
  const token = await GetUserToken();
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/User/Delete/${uniId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}
