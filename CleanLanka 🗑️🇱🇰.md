# CleanLanka 🗑️🇱🇰

### Community-Based Waste Management and Reporting Platform

CleanLanka is a MERN-stack web application designed to improve garbage collection and waste management in Sri Lankan neighborhoods. The platform allows citizens to report garbage-related issues such as overflowing bins and missed collections, while providing municipal staff with a centralized dashboard to manage and track reported issues.

---

## 📌 Problem Statement

Garbage collection in many Sri Lankan neighborhoods is inconsistent. Residents often have no convenient way to report:

- Overflowing garbage bins
- Missed garbage collections
- Waste-related issues in their area

At the same time, local authorities lack a centralized system to view, manage, and track reported garbage problems.

CleanLanka addresses this problem by connecting citizens and municipal staff through a single web-based platform.

---

## 💡 Solution

CleanLanka provides a simple reporting and management system where:

### 👥 Citizens can

- Submit garbage-related reports
- Provide the waste location
- Select the waste type/category
- Add a description
- Upload an optional photo
- Track the status of submitted reports

### 👨‍💼 Administrators can

- View submitted waste reports
- Search and filter reports
- Retrieve reports based on area and status
- Manage reported waste issues
- Update report statuses

The report workflow follows:

**Pending → In Progress → Collected**

This gives both citizens and municipal authorities better visibility into the progress of waste-related issues.

---

# 🚀 Key Features

## 👤 User Features

### 📝 Waste Report Submission

Citizens can submit waste reports by providing:

- Report information
- Waste type/category
- Location
- Description
- Optional image

The report submission form includes input validation and supports image uploads through Cloudinary.

---

### 🔎 Report Browsing

Users can browse waste reports using:

- Search
- Filtering
- Area-based retrieval
- Status-based retrieval

This allows users to find relevant waste reports more easily.

---

### 📊 Report Status Tracking

Reports have a status that allows users and administrators to monitor their progress.

```text
Pending
   ↓
In Progress
   ↓
Collected
```

---

# 👨‍💼 Admin Dashboard

The administrator dashboard provides municipal staff with centralized report management.

Administrators can:

- View waste reports
- Search reports
- Filter reports
- Filter by status
- Filter by category
- Manage reports
- Update report status

The admin functionality was developed specifically to support report management and status updates.

---

# 🏗️ System Architecture

CleanLanka follows a **MERN stack architecture**.

```text
                    ┌──────────────────────┐
                    │      CITIZEN         │
                    │                      │
                    │  Submit / View       │
                    │  Waste Reports       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      REACT.JS        │
                    │     FRONTEND         │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │     EXPRESS.JS       │
                    │      + NODE.JS       │
                    │       BACKEND        │
                    └───────┬───────┬──────┘
                            │       │
               ┌────────────┘       └─────────────┐
               ▼                                  ▼
       ┌────────────────┐                 ┌────────────────┐
       │    MongoDB     │                 │   Cloudinary   │
       │    Database    │                 │ Image Storage  │
       └────────────────┘                 └────────────────┘
                            ▲
                            │
                    ┌───────┴────────┐
                    │     ADMIN      │
                    │   DASHBOARD    │
                    └────────────────┘
```

---

# 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **MongoDB** | Database for users, waste reports, categories, locations, and report statuses |
| **Express.js** | Backend framework for RESTful APIs |
| **React.js** | Frontend user interface |
| **Node.js** | Backend runtime environment |
| **Mongoose** | MongoDB ODM for schemas and database interaction |
| **JWT** | User authentication and role-based access control |
| **Bcrypt** | Secure password hashing |
| **Cloudinary** | Cloud storage and management of uploaded images |
| **Multer** | Image/file upload middleware |
| **HTML5** | Frontend structure |
| **CSS3** | Frontend styling |
| **JavaScript** | Application functionality |
| **Git & GitHub** | Version control and collaboration |
| **Swagger** | REST API testing and debugging |

These technologies are listed in the project documentation.

---

# 🔐 Authentication & Authorization

CleanLanka uses **JWT-based authentication** to manage users.

The system supports different user roles, including:

- **Citizen**
- **Admin**

Passwords are securely hashed using **Bcrypt**.

JWT authentication is used together with role-based authorization to control access to protected functionality.

---

# ☁️ Image Upload System

CleanLanka supports optional image uploads when citizens submit waste reports.

The image upload workflow uses:

```text
User
  │
  │ Select Image
  ▼
React Frontend
  │
  │ FormData
  ▼
Express / Node.js
  │
  │ Multer
  ▼
Cloudinary
  │
  │ Image URL
  ▼
MongoDB
```

**Multer** handles the uploaded file, while **Cloudinary** provides cloud-based image storage and management.

---

# 🗄️ Database

CleanLanka uses **MongoDB** as its database.

MongoDB stores information related to:

- Users
- Waste reports
- Categories
- Locations
- Report statuses

**Mongoose** is used as the ODM for defining schemas and interacting with MongoDB.

---

# 🔄 Application Workflow

## Citizen Workflow

```text
        Start
          │
          ▼
     Open CleanLanka
          │
          ▼
    Register / Login
          │
          ▼
   Submit Waste Report
          │
          ├── Waste Type
          ├── Location
          ├── Description
          └── Optional Photo
          │
          ▼
      Submit Report
          │
          ▼
       Pending
          │
          ▼
    In Progress
          │
          ▼
       Collected
```

---

## Admin Workflow

```text
        Admin Login
             │
             ▼
       Admin Dashboard
             │
             ▼
       View Reports
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
    Search Filter Area
             │
             ▼
       Select Report
             │
             ▼
      Update Status
             │
       ┌─────┼──────────┐
       ▼     ▼          ▼
    Pending In Progress Collected
```

---

# 👨‍💻 Team Members & Contributions

| Student ID | Name | Contribution |
|---|---|---|
| **IT24100853** | **Gaythri M.G.K** | Developed the report submission form with input validation and Cloudinary-based image upload functionality. |
| **IT24101011** | **Jayaweera A.J.D** | Developed the report browsing interface with search, filtering, and area/status-based report retrieval. |
| **IT24100378** | **Razni Ahamed M.R** | Developed the admin dashboard with report management and status update functionality. |
| **IT24101605** | **Fernando C.P.H.A.C** | Developed the landing page, navigation bar, and initial project/backend setup with MongoDB integration. |

The contribution breakdown follows the project documentation.

---

# 📁 Suggested Project Structure

```text
CleanLanka/
│
├── frontend/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── assets/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   │
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

> The structure above is a recommended organization for the MERN application; the uploaded project document does not specify the exact repository folder structure.

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Razni-Ahamed/CleanLanka.git
```

```bash
cd CleanLanka
```

The project repository is provided in the project documentation.

---

## 2. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Replace the placeholder values with your actual configuration.

**Do not commit your `.env` file to GitHub.**

---

## 4. Start the Backend

```bash
npm start
```

or, if the project uses Nodemon:

```bash
npm run dev
```

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## 6. Start the Frontend

```bash
npm run dev
```

The frontend can then be accessed through the local development URL provided by Vite.

---

# 🌐 Deployed Application

## Frontend

https://clean-lanka-c1ub.vercel.app/

## Backend

https://clean-lanka.vercel.app/

The deployed frontend and backend links are provided in the project documentation.

---

# 📡 API Documentation

Swagger is used for testing and debugging REST API endpoints.

The backend provides RESTful API functionality for operations such as:

```text
Authentication
      │
      ├── Register
      └── Login

Reports
      │
      ├── Create Report
      ├── View Reports
      ├── Search Reports
      ├── Filter Reports
      └── Update Report Status
```

> Specific endpoint URLs are not provided in the supplied project document, so they have intentionally not been invented here.

---

# 🤖 AI Tools Used

AI tools were used during the research, planning, development, and debugging stages of the project.

## ChatGPT

ChatGPT was used for:

### Research & Planning

- Identifying real Sri Lankan problems suitable for a MERN application
- Defining the CleanLanka problem
- Planning the core features
- Designing the user workflow
- Defining a realistic MVP for a 4-hour mini hackathon
- Planning the application architecture
- Dividing work among four team members
- Prioritizing essential features

### Image Upload Research

ChatGPT was used to:

- Explore image upload approaches with MongoDB
- Compare MongoDB GridFS and Cloudinary
- Determine a suitable image-storage approach
- Understand Cloudinary integration with React, Express, Node.js and MongoDB

### Git Collaboration

ChatGPT was also used to suggest appropriate Git branch names for:

- Landing page / project setup
- Report submission
- Report browsing/search/filtering
- Admin status management

These uses are documented in the submitted project material.

---

## Claude

Claude was used to assist with:

- Express.js backend implementation
- Project structure
- MongoDB/Mongoose connection
- User and Report models
- REST API routes
- JWT authentication
- Citizen and admin roles
- Bcrypt password hashing
- Authentication middleware
- Admin authorization middleware
- React report submission form
- FormData image uploads
- React admin dashboard
- Report filtering
- Report status management
- Debugging and correcting implementation errors

These AI-assisted development activities are listed in the project documentation.

---

# 🔒 Security Considerations

The application incorporates several security-related technologies:

- **JWT** for authentication
- **Bcrypt** for password hashing
- **Role-based access control** for restricting admin functionality
- **Input validation** for report submission
- **Environment variables** for sensitive configuration
- **Cloudinary** for managed image storage

---

# 🧪 Testing & Debugging

Swagger is used for testing and debugging REST API endpoints.

The development process also involved AI-assisted debugging to identify causes of errors and provide corrected code while maintaining the existing application architecture. 
---

# 🎯 Project Objectives

CleanLanka aims to:

1. Provide citizens with an easy method to report garbage-related problems.
2. Allow users to provide relevant information about waste issues.
3. Support optional image evidence for reports.
4. Provide authorities with a centralized report management system.
5. Enable report searching and filtering.
6. Allow administrators to update report statuses.
7. Improve visibility between citizens and municipal staff.
8. Demonstrate a practical MERN-stack solution to a real Sri Lankan problem.

---

# 🌱 Future Improvements

Potential future improvements could include:

- Interactive map-based report locations
- GPS-based location detection
- Push notifications when report status changes
- Email notifications
- Municipal-area assignment
- Analytics dashboard
- Garbage collection route optimization
- Waste hotspot visualization
- Mobile application
- Multilingual support for Sinhala and Tamil
- Automatic waste-category detection using AI

> These are suggested future enhancements and are **not stated as existing features** in the supplied project document.

---

# 📸 Demonstration

### Demo Video

**Demonstration video:**  
_Add the final demonstration video link here._

---

# 🔗 Project Links

| Resource | Link |
|---|---|
| GitHub Repository | https://github.com/Razni-Ahamed/CleanLanka.git |
| Frontend | https://clean-lanka-c1ub.vercel.app/ |
| Backend | https://clean-lanka.vercel.app/ |
| Demonstration Video | _Add link_ |

---

# 👥 Team

### CleanLanka Development Team

| Student ID | Name | Main Responsibility |
|---|---|---|
| IT24100853 | Gaythri M.G.K | Report Submission |
| IT24101011 | Jayaweera A.J.D | Report Browsing |
| IT24100378 | Razni Ahamed M.R | Admin Status Management |
| IT24101605 | Fernando C.P.H.A.C | Landing Page & Project Setup |

---

# 📄 License

This project was developed as an academic project.

---

# ❤️ CleanLanka

**Report it. Track it. Clean it.**

A community-driven approach to making waste management more visible, organized, and responsive in Sri Lankan neighborhoods.