import CreateAttendanceCheckModel from "../models/CreateAttendanceCheckModel";
import Storage from "../data/LocalDataAccess";
import { LocalKeys } from "../helpers/HardcodedLocalDataKeys";
import AttendanceModel from "../models/AttendanceModel";
import { GetUserToken } from "./UserDataOffline";
import Constants from 'expo-constants';


export async function AddAttendanceCheck(model:CreateAttendanceCheckModel) : Promise<Boolean> {
    const token = await Storage.getData(LocalKeys.localToken);
    try {
        const response = await fetch(`${Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL}/Course/AttendanceCheck/Add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                studentCode: model.studentCode,
                courseAttendanceId: model.courseAttendanceId,
                workplaceId: model.workplaceId,
                creator: "educode-mobile"
            })
          });
        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

export async function GetCurrentAttendance(uniId:string) : Promise<AttendanceModel|null> {
    const token = await GetUserToken();
    try {
        const response = await fetch(`${Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL}/Course/GetCurrentAttendance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                uniId: uniId
            })
          });
        if (!response.ok) {
            console.log(response)
            return null;
        }
        const data = await response.json();
        if (data.courseName) {
            const output:AttendanceModel = {
                attendanceId: data.attendanceId,
                courseName: data.courseName,
                courseCode: data.courseCode
            }
            return output;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
