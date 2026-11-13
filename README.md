# FindSpace (SpaceLens) — Campus Study &amp; Space Finder

&gt; **Find Space That Fits. Right Now.**  
&gt; FindSpace (SpaceLens) is an intelligent campus space-matching platform designed for university students and administrators. By bridging the gap between raw room schedules, individual student timetables, and physical room equipment, FindSpace eliminates lost time between classes and brings visibility to idle university spaces.

---

## 1\. Project Overview &amp; Elevator Pitch

University students frequently face a recurring friction point: discovering a quiet, appropriately sized, and equipped space to study or collaborate during gaps between scheduled classes. Existing campus portals and static room lookup tools only display master schedule availability, leaving students to walk around campus searching for open rooms, only to find them occupied, locked, or lacking essential equipment such as whiteboards or power outlets.

FindSpace reimagines campus space discovery by shifting from a static room list to an **explainable decision-maker**. Rather than asking students to search room by room, FindSpace evaluates five key factors simultaneously:

* Student class gap duration
* Group size capacity
* Required room facilities (whiteboards, projectors, power outlets, quiet zones)
* Distance from current or next class location
* Crowd-verified physical availability

---

## 2\. Core Problem &amp; System Differentiation

### The Limitation of Traditional Campus Tools

As identified in campus evaluations of APU's classroom finder, traditional tools present fundamental operational gaps when applied to dynamic student schedules:

| Feature Dimension           | Traditional Campus Room Finder                 | FindSpace (SpaceLens) Decision Engine                             |
| --------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| **Availability Logic**      | Checks if a room has a scheduled class         | Checks room schedule **and** student's class gap schedule         |
| **Search Input**            | Complex multi-dropdown filtering forms         | One-sentence natural language input or single-tap gap detection   |
| **Ranking Transparency**    | Arbitrary or alphabetically ordered room lists | Transparent composite match score with "Why this score" breakdown |
| **Handling Dead Ends**      | Displays "No results found"                    | Recommends next available time slots ("Never a Dead End")         |
| **Real-world Verification** | Static timetable data                          | Real-time student crowd reporting ("Still free / Occupied")       |
| **Institutional Value**     | No usage tracking                              | Campus Insights heatmap displaying aggregate idle room capacity   |

---

## 3\. Key Feature Specifications

### 1\. Class Gap Finder ("Others Check the Room. We Check You.")

* **Mechanism**: Extracts free windows from the student's personal timetable schedule profile and cross-references available campus spaces matching that exact duration.
* **Workflow**: Clicking **"Find my next class gap"** automatically populates the current date, start time, and gap duration, presenting instantly ranked spaces.

### 2\. Natural Language Query Engine ("Ask in One Sentence")

* **Mechanism**: Parses plain English queries (such as *"90 min, quiet, 4 people, whiteboard"*) into structured parameters covering duration, atmosphere, capacity, and facilities.
* **Auto Demo Mode**: Built-in demonstration controller for live presentations and recorded video pitches.

### 3\. Explainable Match Scoring

* **Mechanism**: Each recommended space features a percentage-based score ring derived from four distinct criteria:  
  * **Capacity Fit**: Optimal sizing for individual or group work without over-allocating large rooms.
  * **Facility Coverage**: Presence of requested amenities (whiteboard, power sockets, quiet policy, video conferencing).
  * **Schedule Fit**: Buffer time before the next scheduled class.
  * **Proximity**: Walking distance relative to the student's previous or upcoming lecture hall.

### 4\. Crowd-Verified Availability &amp; Alternative Recommendations ("Never a Dead End")

* **Crowd Verification**: Students can tap **"Still free"** or **"Occupied"** on any room panel to update live availability state for peers.
* **Alternative Time Routing**: When a room is booked during the requested window, FindSpace immediately computes and displays the next three available time slots.

### 5\. Institutional Campus Insights Heatmap

* **University Analytics**: An aggregate hour-by-day utilization heatmap highlighting underused classrooms and peak library hours, enabling administrative facilities management to optimize space allocation.

---

## 4\. Technical Architecture &amp; Tech Stack

### Current Prototype Architecture

The prototype is deployed as a high-performance, responsive single-page web application hosted on Vercel:

* **Frontend Core**: HTML5, CSS3 (Custom Properties &amp; Design Tokens), ES6+ Vanilla JavaScript.
* **Design System**: Dark-mode visual hierarchy with near-black backgrounds (`#0b1927`), high-contrast typography, and amber visual accents (`#f59e0b`).
* **State Management**: Client-side reactive state tracking search filters, 27 representative campus spaces, selected rooms, crowd reports, and simulated live seat counts.

### Data Model &amp; Execution Safeguards

* **Operating Hours Enforcer**: Constrains queries to valid campus operating hours (08:00–22:00) to prevent unrealistic midnight suggestions.
* **Demo Clock Controller**: Maintains a fixed or adjustable reference time ensuring reliable live demonstrations regardless of the evaluation hour.

---

## 5\. Google Cloud Innovation Roadmap

FindSpace is architected to transition seamlessly from a client-side prototype to an enterprise-grade cloud service deployed on Google Cloud Platform:

### Phase 1: Managed Compute &amp; Database Infrastructure

* **Frontend**: Web application hosted on Vercel or Firebase Hosting.
* **API Microservices**: Google Cloud Run hosting containerized Go or Python API endpoints (`/search`, `/room/:id/timetable`, `/occupancy`).
* **Database Layer**: Cloud Firestore storing dynamic room catalogs, active bookings, and real-time state.

### Phase 2: Real-time Ingestion &amp; IoT Pipeline

* **Messaging Service**: Google Cloud Pub/Sub ingesting Wi-Fi Access Point connection density and hardware sensor payloads.
* **Processing Layer**: Serverless Cloud Functions processing streaming metrics into Firestore real-time state.

### Phase 3: Institutional Systems Integration

* **Automated Timetable Ingestion**: Cloud Scheduler triggering scheduled ingestion of APU timetable CSV or iCal data directly into Firestore.

### Phase 4: Conversational AI Agent

* **Gemini Enterprise Agent**: Integration of Gemini Enterprise LLM with structured function calling to parse complex natural language queries and execute instant room bookings.

---

## 6\. Deployment &amp; Local Execution Guide

### Local Development Setup

1. Clone or download the project files into a local folder:  
```  
mkdir findspace &amp;&amp; cd findspace  
```
2. Ensure the following core files are present in the directory root:  
  * `index.html` — Application structure and UI components
  * `style.css` — Design system and animations
  * `app.js` — Search logic, score calculation, map rendering, and demo controls
3. Serve locally using Python HTTP server or VS Code Live Server extension:  
```  
python3 -m http.server 8000  
```
4. Access the web interface at `http://localhost:8000`.

### Vercel Deployment via Git

1. Initialize Git repository and commit files:  
```  
git init  
git add .  
git commit -m "Initial FindSpace release"  
git branch -M main  
git remote add origin
