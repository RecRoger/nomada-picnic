# Nómada Picnic 🧺✨

**Nómada Picnic** is a production-ready, highly interactive web application designed for a luxury picnic rental business. The platform management features complex user interactions, premium smooth animations, and an automated backend workflow to streamline inquiries, inventory management, and event scheduling.

🌐 **Live Demo:**

- [Nomada Picnic development web](https://nomada-client-389141432152.us-east1.run.app/)

---

## 🚀 Key Features & Architecture

- **Interactive UI/UX:** Implemented high-performance, scroll-triggered animations and fluid interactive headers to deliver a premium brand experience.
- **Automated Workflow Integration:** Built a custom event management and quotation tool synced with external services (Google Workspace ecosystem via Apps Script) to handle scheduling, price calculations, and calendar synchronization seamlessly.
- **Modular Architecture:** Designed with a clean separation of concerns, ensuring high maintainability, reusable components, and scalable business logic.
- **Modern Styling & Responsiveness:** Built using modular SASS structure to achieve an immaculate, responsive layout across all device types.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, SASS (Modular CSS Architecture), JavaScript / TypeScript.
- **Animations:** [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) & [Lottie Files](https://airbnb.io/lottie/) for high-fidelity vector animations.
- **Backend Automation:** Google Apps Script / Google Sheets API for automated calendar event generation, pricing engine, and quoting workflows.
- **Environment:** Dockerized setup for local development.

---

## ⚙️ Core Architecture Decisions

### 📊 Workflow Automation

Instead of over-engineering a heavy, costly database infrastructure for an early-stage business, the architecture leverages a lightweight, serverless approach using **Google Apps Script** as a micro-backend. This triggers automatic availability checks, computes dynamic quotes based on inventory, and instantly syncs confirmed bookings with Google Calendar.

### 🎨 Animation Performance

To ensure a premium feel without sacrificing performance, animations are orchestrated via **GSAP ScrollTrigger**. Vector heavy-lifting is delegated to **Lottie**, keeping the bundle size optimized and maintaining a smooth 60fps rendering curve on mobile devices.

---

## 🛠️ Local Development

### Prerequisites

- Node.js (v18+ recommended)
- Docker (optional, for containerized environment)

### Installation

1. Clone the repository:

```bash
   git clone [https://github.com/RecRoger/nomada-picnic.git](https://github.com/RecRoger/nomada-picnic.git)
   cd nomada-picnic
```

2. Install dependencies:

```bash
   npm install
```

3. Start the development server:

```bash
   npm run start
```

### 👤 Author

- **Rogelio Arzola** - Senior Fullstack Developer & Software Architect
- LinkedIn: linkedin.com/in/rogelioarzola
