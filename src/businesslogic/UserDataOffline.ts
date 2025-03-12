import Storage from "../data/LocalDataAccess";
import { LocalKeys } from "../helpers/HardcodedLocalDataKeys";
import LocalUserData from "../models/LocalUserDataModel";

export async function GetOfflineUserData():Promise<LocalUserData|null> {
    const userData:LocalUserData|null = await Storage.getData(LocalKeys.userProfile); 
    return userData;
}

export async function SaveOfflineUserData(userData:LocalUserData) {
    await Storage.saveData(LocalKeys.userProfile, userData); 
}

export async function DeleteOfflineUserData() {
    await Storage.removeData(LocalKeys.userProfile);
}

export async function GetUserToken():Promise<string|null> {
    const token:string|null = await Storage.getData(LocalKeys.localToken); 
    return token;
}

export async function SaveUserToken(token:string) {
    await Storage.saveData(LocalKeys.localToken, token); 
}

export async function DeleteUserToken() {
    await Storage.removeData(LocalKeys.localToken);
}