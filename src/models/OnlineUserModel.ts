interface OnlineUserModel {
  id: string;
  userType: {
    userType: string;
  };
  uniId: string;
  studentCode?: string;
  fullName: string;
}

export default OnlineUserModel;
