# educode-web
## Description

* UI language: Estonian or English 
* Development year: **2025**
* Languages and technologies: **TypeScript, React, Vite, Tailwind CSS**
* This is the mobile app component of my Bachelor's final thesis project, which also includes [backend](https://github.com/alaasmagi/educode-backend) and [mobile app](https://github.com/alaasmagi/educode-mobile)  
* Detailed documentation of my Bachelor's final thesis project (in Estonian):<link>

## How to run

### Prerequisites

* Node.js
* Modern web browser

The application should have .env file in the root folder `/` and it shoult have following content:
```bash
VITE_API_URL=<your-educode-backend-instance-url>/api
```

### Running the app

After meeting all prerequisites above - 
* browser client application can be run via terminal/cmd opened in the root folder `/` by command
```bash
npm i; npm run dev 
```
* The Admin UI can be viewed from the web browser on the address the application provided in the terminal/cmd

## Features
- Teachers can sign up and log in with university email addresses
- Teachers can manage courses
- Teachers can manage course attendances
- Teachers can view QR codes for each course attendance so students can register themselves
- Teachers can manually register students to course attendances
- Teachers can view the list of registered students for each course attendance
- Teachers can download the list of registered students as a PDF
- Teachers can view statistics of course attendances by course

## Design choices

### Structure
The project is divided into 6 folders:
* **assets** - contains static icons and logos
* **businesslogic** - contains all the core logic of the client application
* **layout** - contains custom-built UI components
* **locales** - contains files for UI translations (localization)
* **models** - contains DTOs used for communication between the client app and the backend API
* **screens** - contains all the views/pages of the browser client application
  
### Data Transfer Objects (DTOs)
There are 13 DTOs in `/models` folder which are responsible for communication between the client app and backend API.
* **AttendanceCheckModel**
```typescript
interface AttendanceCheckModel {
  id?: number;
  studentCode: string;
  fullName: string;
  courseAttendanceId: number;
  workplaceId?: number | null;
}

export default AttendanceCheckModel;
```
* **AttendanceType**
```typescript
interface AttendanceType {
  id: number;
  attendanceType: string;
}

export default AttendanceType;
```
* **ChangePasswordModel**
```typescript
interface ChangePasswordModel {
    uniId: string;
    newPassword: string;
}

export default ChangePasswordModel;
```
* **CourseAttendance**
```typescript
export interface CourseAttendance {
  courseId: number;
  courseCode?: string;
  courseName?: string;
  attendanceId?: number;
  attendanceTypeId: string;
  attendanceType?: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface MultipleCourseAttendances {
  attendanceId?: number;
  courseId: number;
  attendanceTypeId: string;
  dates: string[];
  startTime: string;
  endTime: string;
}
```
* **Course**
```typescript
interface Course {
  id?: number;
  courseCode: string;
  courseName: string;
  courseValidStatus: number;
}

export default Course;
```
* **CourseStatus**
```typescript
export interface CourseStatus {
  id: number;
  status: string;
}
```
* **CreateUserModel**
```typescript
interface CreateUserModel {
    uniId: string;
    fullName: string;
    password: string;
}

export default CreateUserModel;
```
* **LocalDataModel**
```typescript
interface LocalDataModel {
    uniId: string;
    token: string;
}

export default LocalDataModel;
```
* **LocalUserData**
```typescript
interface LocalUserData {
    userType: string,
    uniId?: string;
    studentCode?: string;
    offlineOnly: boolean;
    fullName?: string;
}

export default LocalUserData;
```
* **OnlineUserModel**
```typescript
interface OnlineUserModel {
    id: number;
    userType: {
        userType: string;
    };
    uniId: string;
    studentCode?: string;
    fullName: string;
}

export default OnlineUserModel;
```
* **StudentAttendanceModel**
```typescript
interface StudentAttendanceModel {
    attendaceCheckId: number,
    studentCode: string;
    workplaceId?: number;
}

export default StudentAttendanceModel;
```
* **StudentCountModel**
```typescript
interface StudentCountModel {
    attendanceDate: string;
    studentCount: number;
}

export default StudentCountModel;
```
* **VerifyOTPModel**
```typescript
interface VerifyOTPModel {
    uniId: string;
    otp: string;
}

export default VerifyOTPModel;
```

### User Interface (Admin UI)
* The Admin UI is implemented using ASP.NET MVC default pages (Views)
* Bootstrap is used for quick customisation

### Unit tests
* Unit tests cover 100% of the business logic
* Tests are written using the NUnit framework

## Screenshots (Admin UI)
* Login page:  
![Screenshot 2025-05-21 232318](https://github.com/user-attachments/assets/2ec61886-e21c-4d92-ae5e-d6c45db64b54)
* Main page:  
![Screenshot 2025-05-21 232335](https://github.com/user-attachments/assets/d093fbd4-ae64-4c50-ba93-6c3d8b6e3111)
* Entity main page:  
![Screenshot 2025-05-21 232350](https://github.com/user-attachments/assets/e3796688-dbcd-4d14-a244-89e1349437ed)



## Improvements & scaling possibilities

### Integration with more education related services
* User testing results suggested the idea of integrating this application with the existing infrastructure of the University (e.g., the TalTech app)

