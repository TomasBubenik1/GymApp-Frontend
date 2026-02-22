<div align="center">

<br/>

# 🏋️ GymApp

### *A full-stack fitness tracking app built with React, Node.js and PostgreSQL.*

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br/>

</div>

---

## 🖥️ Showcase

<br/>

<!-- ROW 1 — Image Left, Text Right -->
<table>
  <tr>
    <td width="60%">
      <img src="https://i.imgur.com/zTk0wvV.png" alt="Dashboard" width="100%" style="border-radius:8px"/>
    </td>
    <td width="40%" valign="middle" align="center">
      <h3>📊 Dashboard</h3>
      <p>Main overview page. Shows weight and calorie history through charts so you can see how things are progressing over time.</p>
    </td>
  </tr>
</table>

<br/>

<!-- ROW 2 — Text Left, Image Right -->
<table>
  <tr>
    <td width="40%" valign="middle" align="center">
      <h3>📋 Workout Plans</h3>
      <p>Users can create and manage their own workout plans, add exercises from the library, and tweak parameters like sets and reps.</p>
    </td>
    <td width="60%">
      <img src="https://i.imgur.com/a7wuRp1.png" alt="Workout Plans" width="100%" style="border-radius:8px"/>
    </td>
  </tr>
</table>

<br/>

<!-- ROW 3 — Image Left, Text Right -->
<table>
  <tr>
    <td width="60%">
      <img src="https://i.imgur.com/iXXtlL0.png" alt="Exercise Browser" width="100%" style="border-radius:8px"/>
    </td>
    <td width="40%" valign="middle" align="center">
      <h3>🔍 Exercise Browser</h3>
      <p>Browse and filter exercises by primary muscle, secondary muscle, or equipment. Also supports searching by name.</p>
    </td>
  </tr>
</table>

<br/>

<br/>


---

## ✨ Features

| Category | Features |
|---|---|
| 🗂️ **Workouts** | Create & delete workout plans · Add exercises · Customize exercise parameters |
| 🔎 **Exercise Library** | Filter by primary/secondary muscle, equipment, and more · Search by name |
| 📱 **Social** | Post images & text · Add friends · Workout plan visibility controls |
| ❤️ **Engagement** | Like posts · Notifications · User search |
| 👤 **Profile** | Editable picture, name & bio |
| 📊 **Tracking** | Progress graphs · Daily calorie tracker · Weight tracker |
| 📐 **Design** | Fully responsive with Tailwind CSS |

<br/>

---

## 🛠️ Tech Stack

```
Frontend    →  React · Tailwind CSS
Backend     →  Node.js · Express
Database    →  PostgreSQL · Prisma ORM
Auth        →  bcrypt password hashing
```

<br/>

---

## 🚀 Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/gymapp.git
cd gymapp
```

**2. Install dependencies**
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

**3. Configure environment variables**

Create a `.env` file inside the `/backend` directory:

```env
PG_USER     = ' '
PG_HOST     = ' '
PG_DATABASE = ' '
PG_PASSWORD = ' '
PG_PORT     = ' '
```

**4. Start the servers**
```bash
# In /backend
npm run dev

# In /frontend
npm start
```

The app runs at **http://localhost:3000**.

> 💡 To simulate multiple users, open the app in two browsers or use incognito mode.

<br/>

---

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
