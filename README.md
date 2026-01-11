# 🗳️ Nepal Pre-Election

A modern, secure, and transparent web application for conducting and monitoring elections in Nepal.  
Built with **Next.js**, **TypeScript**, **MongoDB**, and **Tailwind CSS**.

---

## 📋 Purposes

This application addresses the need for a **digital voting system** that provides:

- 🔍 **Transparent voting process** where voters can see real-time results
- 🔒 **Secure vote casting** with device fingerprinting and voter ID verification (prototype)
- 📊 **Live result monitoring** for election committees and the public
- 🧑‍🤝‍🧑 **User-friendly interface** accessible to all citizens

---

## 🎯 When to Use

### Election Scenarios

- 🏛️ Local government elections (ward, municipal, rural municipal levels)
- 🏫 Student union elections in colleges and universities
- 🌐 Organization internal elections (political parties, NGOs, associations)
- 🏘️ Community decision-making processes

### Timing

- ✅ During official election periods
- ✅ For by-elections and special elections
- ✅ For testing and research in **digital democracy**

---

## ✨ Features

- **Secure Voting:** One person = one vote rule
- **Anti-Duplicate Protection:** LocalStorage UUID + IP + user-agent fingerprint
- **Vote Storage:** Encrypted in MongoDB
- **Real-Time Results:** Instant vote counting and display
- **Responsive Design:** Works on desktop and mobile devices
- **Simple Deployment:** Easily deploy on **Vercel** or similar platforms

---

## 🛠️ How It Works

1. A voter clicks **Vote**.
2. The system generates a unique **device ID (UUID)** stored in `localStorage`.
3. Collects **IP address + user-agent fingerprint** for added security.
4. The vote is stored in MongoDB only if the device has not voted before.
5. Duplicate attempts are blocked automatically.

---

## 📦 Tech Stack Used

- **Frontend:** Next.js 15 (App Router), React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Styling:** TailwindCSS
- **Security:** UUID + IP + useragent fingerprinting

---
