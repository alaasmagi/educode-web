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
* **AttendanceTypeEntity**
```csharp
public class AttendanceTypeEntity : BaseEntity
{
    [Required]
    [MaxLength(128)]
    public string AttendanceType { get; set; } = default!;
}
```
* **CourseAttendanceEntity**
```csharp
public class CourseAttendanceEntity : BaseEntity
{
    [Required]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public CourseEntity? Course { get; set; }
    [Required]
    [ForeignKey("AttendanceType")]
    public int AttendanceTypeId { get; set; }
    public AttendanceTypeEntity? AttendanceType { get; set; }
    [Required]
    public DateTime StartTime { get; set; }
    [Required]
    public DateTime EndTime { get; set; }

    public ICollection<AttendanceCheckEntity>? AttendanceChecks { get; set; }
}
```
* **CourseEntity**
```csharp
public class CourseEntity : BaseEntity
{
    [Required]
    [MaxLength(128)]
    public string CourseCode { get; set; } = default!;
    [Required]
    [MaxLength(128)]
    public string CourseName { get; set; } = default!;
    [Required]
    public ECourseValidStatus CourseValidStatus { get; set; }
    public ICollection<CourseTeacherEntity>? CourseTeacherEntities { get; set; }
}
```
* **CourseTeacherEntity**
```csharp
public class CourseTeacherEntity : BaseEntity
{
    [Required]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public CourseEntity? Course { get; set; }
    [Required]
    [ForeignKey("Teacher")]
    public int TeacherId { get; set; }
    public UserEntity? Teacher { get; set; }
}
```
* **UserAuthEntity**
```csharp
public class UserAuthEntity : BaseEntity
{
    [Required]
    [ForeignKey("User")]
    public int UserId { get; set; }
    public UserEntity? User { get; set; }
    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = default!;
}
```
* **UserEntity**
```csharp
public class UserEntity : BaseEntity
{
    [Required]
    [ForeignKey("UserType")]
    public int? UserTypeId { get; set; }
    public UserTypeEntity? UserType { get; set; }
    [Required]
    [MaxLength(128)]
    public string UniId { get; set; } = default!;
    [MaxLength(128)]
    public string? StudentCode { get; set; }
    [Required]
    [MaxLength(255)]
    public string FullName { get; set; } = default!;
}
```
* **UserTypeEntity**
```csharp
public class UserTypeEntity : BaseEntity
{
    [Required]
    [MaxLength(128)]
    public string UserType { get; set; } = default!;
    
}
```
* **WorkplaceEntity**
```csharp
public class WorkplaceEntity : BaseEntity
{
    [Required]
    [MaxLength(128)]
    public string ClassRoom { get; set; } = default!;
    [Required]
    [MaxLength(128)]
    public string ComputerCode { get; set; } = default!;
}
```

### BaseEntity
The `BaseEntity` class is defined in this project, and it is uploaded as a NuGet package [AL_AppDev.Base(v1.0.2)](https://www.nuget.org/packages/AL_AppDev.Base/1.0.2)
```csharp
public class BaseEntity
{
    [Required]
    public int Id { get; set; }
    [Required]
    [MaxLength(128)]
    public string CreatedBy { get; set; } = default!;
    [Required]
    public DateTime CreatedAt { get; set; }
    [Required]
    [MaxLength(128)]
    public string UpdatedBy { get; set; } = default!;
    [Required]
    public DateTime UpdatedAt { get; set; }
    [Required] 
    public bool Deleted { get; set; } = false;
}
```

### DTOs and enums
There are several DTOs and enums that are used in the application.  
* **CourseStatusDto**
```csharp
public class CourseStatusDto
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
}
```
* **CourseUserCountDto**
```csharp
public class CourseUserCountDto
{
    public DateTime AttendanceDate { get; set; }
    public int UserCount { get; set; } = 0;
}
```
* **ECourseValidStatus**
```csharp
public enum ECourseValidStatus
{
    Available,
    TempUnavailable,
    Unavailable
}
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

