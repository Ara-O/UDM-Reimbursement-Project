<img src="https://ik.imagekit.io/x3m2gjklk/site-logo.png" alt="logo" width="100"/>

# UDM Reimbursement Project 🚀
The reimbursement system project at Detroit Mercy’s College of Engineering and Science aims to make the reimbursement process simpler and more efficient for faculty members within the college. This innovative system provides a user-friendly platform that allows faculty to create, manage, and submit reimbursement requests quickly. It also makes it easier to track expenses related to academic activities and events, while ensuring compliance with institutional policies and financial regulations. The system, which is built on a solid technical foundation, uses technologies such as Vue.js, Node.js, and MongoDB to provide a seamless and secure experience. The proposed reimbursement system project brings together technology, efficiency, and user-centric design to improve financial management processes within the university, creating a more productive and accountable academic environment.

## Technology stack 💻

#### Frontend 
- HTML/CSS
- Vue.js
- Typescript
- Tailwind

#### Backend
- Node.js (NODE.JS 18 OR LESS IS REQUIRED)
- Express
- MongoDB (Mongoose)

#### Tools used
- UI Design: Figma 
- PDF Generation: PdfMake
- Emails: Sendgrid
- Image Uploads: ImageKit 
- Deployment Services: Vercel (Frontend), Render (Backend)
- Development Environment: Visual Studio Code


## Run Locally

### Environment Variables

To run this project, you will need to have two .env files, which are password-protected, and can be retrieved by request

### Cloning Instructions

Clone the project

```bash
git clone https://github.com/Ara-O/UDM-Reimbursement-Project
```

Go to the project directory

```bash
  cd UDM-Reimbursement-Project
```

### Frontend instructions


Go to the frontend directory

```bash
  cd ui
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  make
```

### Backend instructions


Go to the backend directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  make
```

## Usage instructions

Technical instructions can be found: https://www.youtube.com/watch?v=Jg-N9Enmi0s

Demo accounts: 

Username: oladipea@udmercy.edu. Password: password 

Main features:
- Account verification during the signup process
- Reimbursement PDF generation
- FOAPA management
- Reimbursement request submission process management

### Known limitations
We are currently running a free-instance of Render (the service we use to host backend). Because of this, the server sleeps after 15 minutes of inactivity, so if the initial load time of the website is long, it's not broken (usually), and will have normal loading times after the initial load

