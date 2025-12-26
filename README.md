# Real-time Patient Form + Staff View (Next.js + Tailwind + WebSockets)

## Overview

This project implements two synchronized interfaces:

- **Patient Form**: a responsive form where patients can enter their personal details.
- **Staff View**: a responsive, real-time interface for staff members to monitor information being entered in the patient form.

The two interfaces synchronize in real-time, reflecting patient input immediately on the staff view.
The staff view also shows indicators for **Active (Filling)**, **Inactive**, and **Submitted**.

---

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: TailwindCSS
- **Real-time Communication**: WebSockets (Socket.IO)
- **Form Validation**: react-hook-form + zod

---

## Code Repository & Deployed Application

- **Code Repository**:
- **Deployed Application**:

## Setup Instructions (Local)

### Prerequisites

- Node.js (LTS recommended)
- Yarn (or npm)

### Install dependencies

- yarn install

## Configure environment variables

1. Create a file named .env.local in the project root.
2. Add the following variable:
   NEXT_PUBLIC_WS_URL=http://localhost:4000

## Run the project (frontend + websocket server)

- yarn dev

## Local URLs

- Frontend: http://localhost:3000
- WebSocket server: http://localhost:4000

## Deployment Setup (Netlify + Render)

### Frontend (Netlify)

- Deployed URL:
  https://agnos-phornhathai-fe-demo.netlify.app/
- Netlify environment variable:
  NEXT*PUBLIC_WS_URL=https://agnos-phornhathai-server.onrender.com
  Important: NEXT_PUBLIC*\* variables are embedded at build time, so redeploy the site after updating env vars.

## WebSocket Server (Render)

### Deployed URL:

https://agnos-phornhathai-server.onrender.com/
The server listens on Render’s assigned port via process.env.PORT (Render sets this automatically).
CORS can be configured to allow the Netlify domain if needed.

## How to Use (local)

1. Open the application at http://localhost:3000.
2. Enter a Session ID (e.g., ABC123).
3. Open two tabs (or two browsers):
4. Tab A: Continue as Patient
5. Tab B: Continue as Staff
6. Start typing or updating fields in the Patient Form → the Staff View updates instantly.

## How to Use (Deployed)

1. Open the deployed site: https://agnos-phornhathai-fe-demo.netlify.app/
2. Enter a Session ID (example: ABC123) and continue as Patient.
3. Open a new tab/window with the same deployed site again, enter the same Session ID, and continue as Staff.
4. Start typing in the Patient Form → the Staff View updates in real time.

## Deployed URLs

- Frontend (Netlify): https://agnos-phornhathai-fe-demo.netlify.app/
- WebSocket server (Render): https://agnos-phornhathai-server.onrender.com/

## Bonus Features Implemented

1. Debounced real-time updates

- The patient form emits updates while typing.
- A small debounce (~250ms) is applied to reduce event spamming while keeping the UI responsive.

2. Inactive detection

- The staff view computes inactivity using the last activity timestamp (lastActiveAt).
- If there is no update for ~10 seconds, the status becomes Inactive automatically.

3. Submitted status (highest priority)

- When the patient clicks Submit, a final payload is sent with status Submitted.
- Submitted overrides other statuses and remains visible even if time passes.

# Development Planning Documentation

Email attachment (PDF) : `development-planning.pdf`
