# Quick Holidays Ltd - Workspace Testing Guide

This guide contains the pre-seeded credentials and step-by-step instructions to test the Admin, Agent Team, and Proccessing Team portals.

---

## 1. Seed Login Credentials

### System Administrator
* **URL**: [http://admin.localhost:3000](http://admin.localhost:3000) (Note: Direct access via `localhost:3000/admin` is blocked and will return a 404 Not Found page for security).
* **Username**: `admin`
* **Password**: `admin123`

---

### Team Workspace Portal
* **URL**: [http://localhost:3000/login](http://localhost:3000/login)

#### Seeded Accounts (Approved)
Use these credentials to sign in immediately:

| Name | Role | Username | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Chloe Dupont** | Agent Team | `chloe` | `chloe.d@quickholidays.co.uk` | `password123` |
| **David Smith** | Proccessing Team | `david` | `david.s@quickholidays.co.uk` | `password123` |

#### Seeded Accounts (Pending Approval)
These accounts exist but cannot log in until approved in the Admin Panel:

| Name | Role | Username | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Amara Okoye** | Agent Team | `amara` | `amara.o@quickholidays.co.uk` | `password123` |
| **Liam O'Connor** | Proccessing Team | `liam` | `liam.oc@quickholidays.co.uk` | `password123` |

---

## 2. Walkthrough Workflows

### Workflow A: Access Request & Admin Approval
1. Go to [http://localhost:3000/login](http://localhost:3000/login) and switch to the **"Request Access"** tab.
2. Select **Proccessing Team**.
3. Create a unique username (e.g., `testuser`), enter your details, and submit.
4. Try logging in immediately with your credentials; you will see a warning: *"Access Pending: Awaiting Admin approval."*
5. Open [http://localhost:3000/admin](http://localhost:3000/admin) and log in with `admin` / `admin123`.
6. Scroll down to the **"Access Requests Awaiting Approval"** section. You will see your new request. Click **Approve**.
7. Return to the Login Portal and log in as `testuser`; you will successfully enter the **Proccessing Team Dashboard**.

---

### Workflow B: Lead Booking & Collaborative Pipeline
1. Go to [http://localhost:3000/login](http://localhost:3000/login) and log in as the agent **Chloe** (using username `chloe` and password `password123`).
2. Click **"Add Booking"** to record a new customer consultation (e.g., Name: `James Bond`, Destination: `Spain`).
3. Click on James Bond in the list to open his **Lead Action Centre**.
4. Click the **"Send to Process"** button. The status badge will change to **"processing"**.
5. Log out, and log back in as the processor **David** (using username `david` and password `password123`).
6. You will see **James Bond** instantly in David's **Processing Queue**!
7. Click on James Bond to check off his document checklists, schedule his TLS/VFS appointment date, and click **"Approve & Complete Case"**.
