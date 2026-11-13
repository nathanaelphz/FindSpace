# SpaceLens

**Find the space that fits. Right now.**

SpaceLens is a campus space finder prototype for APU students. Instead of listing rooms, it answers one question: *which place best fits what I need, for the time I have?*

It combines time, group size, facilities, the student's own class gaps, distance and library seat estimates into one search, and explains every match.

> **Prototype data notice:** room capacities, facilities, timetables, the sample student schedule and library occupancy are all **simulated**. Nothing is connected to APU systems, sensors, cameras or booking tools. "Free" means "no class in the sample data", not a guarantee of access.

---

## Features

### Main workflow
1. **Set your need**: day, start time, duration, number of people, place type and facilities (or just type a sentence).
2. **See the map light up**: every modelled space appears as a tile. Matches glow green, rooms in use turn red, free-but-filtered-out rooms stay dim.
3. **Read ranked results**: each card shows a fit score (out of 100), plain-language reasons, distance (demo) and library seat counts.
4. **Open a room**: a side panel shows the day timeline (08:00-22:00), the next free slot, the score breakdown and the "Is it really free?" buttons.

### Three special features
1. **Class Gap Finder**: finds the next gap in the sample student timetable that is long enough for the chosen duration, then searches inside it. Most room finders only check the room's schedule; SpaceLens also checks yours.
2. **Ask in One Sentence**: type a request like a message and the filters fill themselves in.
3. **Never a Dead End**: when nothing matches, it suggests up to three later times (same day) when a suitable space is free, with one-tap "Use this time". Students can also report "Still free / Occupied" because a timetable alone cannot prove a room is empty.

### Extras
- **Explainable score**: capacity, facilities, class gap and distance, each out of 25.
- **Live library seats**: simulated seat counts that change every 5 seconds.
- **Campus Insights**: an hour-by-day heatmap showing how many modelled rooms are in use (simulated).
- **Cloud roadmap**: an honest, labelled plan for moving from prototype to real deployment.
- **Auto demo button**: types a sample sentence and runs it, handy for screen recordings.

---

## How to use it

### Using the controls
| Control | What it does |
|---|---|
| **Day** | Choose Mon-Sun. Weekends have no sample classes. |
| **Start time** slider | 08:00 to 21:00 in 30-minute steps. The label shows the start and end time. |
| **Duration** | 30 min, 1h, 1.5h, 2h or 3h. |
| **People** | Minimum group size (1, 2, 4, 6, 10, 20, 50, 100). |
| **Place type** | All, Library, Discussion, Labs or Auditorium. |
| **Facilities** | Whiteboard, Projector, Power outlets, Quiet study, Video conferencing. A room must have all that you select. |
| **Find my next class gap** | Jumps to the next time that fits a gap in the sample student timetable for your chosen duration. |

### Using the sentence box
Type naturally, then press **Ask**. It understands:

| You write | It sets |
|---|---|
| `4 people`, `for 6`, `10 pax` | People |
| `90 min`, `2 hours`, `1.5 hr` | Duration (rounded to 30 minutes) |
| `2pm`, `10:30 am` | Start time |
| `monday`, `friday`, etc. (`tomorrow` is not supported) | Day |
| `whiteboard`, `projector`, `charging`, `zoom`, `quiet` | Facilities |
| `library`, `discussion`, `lab`, `auditorium` | Place type |
| `gap` or `between classes` | Runs the class gap finder |

Examples:
- `I have 90 minutes, need a quiet place for 4 people with a whiteboard`
- `Discussion room for 4 people at 2pm`
- `Projector room for 20 people on friday`
- `Library seat with power`
- `Find a 2 hour gap between classes`

> The sentence box is a keyword parser, not an AI model. The roadmap replaces it with a Gemini function-calling agent.

### Reading results
- **BEST MATCH** is the highest score.
- The **ring** is the total score out of 100.
- **Tags** explain why a room matched ("Fits 4", "90 min clear", "Fits your class gap").
- Click any **card** or any **map tile** to open the room panel. Press **Esc** or click outside to close.
- In the panel, **green** timeline cells are free and **red** cells are sample classes.
- **Still free / Occupied** saves a report in the current browser session only.

### No results?
You will see "No space matches this time". Pick one of the suggested times, or reduce facilities, group size or duration.

---

## Suggested demo flow (3-5 minutes)
1. Scroll to **The Finder** and explain the map.
2. Click **Auto demo** and let the sentence type itself.
3. Open the top result and show the score breakdown.
4. Click **Find my next class gap**.
5. Select several facilities and a large group to trigger a no-match, then use a suggested time.
6. Click a room and use **Still free / Occupied**.
7. Show **Campus Insights** and the **Cloud roadmap**. State clearly that data is simulated and the cloud steps are planned.

---

## Project structure
```
spacelens/
├── index.html   # page structure and content
├── style.css    # visual design and animation
├── app.js       # data, search, scoring, map, parser, demo
└── README.md
```
No build step, no dependencies. Fonts load from Google Fonts.

## Run locally
- Double-click `index.html`, or
- In VS Code, install **Live Server**, right-click `index.html` and choose **Open with Live Server**.

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New > Project** and import the repo.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty.
4. Click **Deploy**.

You can also drag the folder onto vercel.com/new.

---

## Customising

### Rename the product
Use VS Code **Find & Replace in Files** (Ctrl+Shift+H) to replace `SpaceLens` everywhere (page title, nav, footer, text, this README).

### Add the APU logo
Put the logo file in the folder, then in `index.html` replace the `<span class="apu">APU</span>` tag in the nav with `<img src="apu-logo.png" height="20" alt="APU">`.

### Change rooms or timetables (`app.js`)
- Rooms are created with `add(name, category, capacity, facilities, zone, options)`.
- Class patterns come from the `busy()` function.
- The sample student timetable is the `STU` object (minutes from midnight, e.g. `[540, 660]` = 09:00-11:00).
- Library seat totals are in `TOT`; starting free seats are in `seats`.

### Change the look (`style.css`)
Colours are variables at the top of the file (`--ac` accent, `--vi` violet glow, `--bad` busy red).

---

## Scoring
Each match gets four parts out of 25:
- **Capacity**: how closely the room size fits your group.
- **Facilities**: whether it has what you selected.
- **Class gap**: whether the time fits a gap in the sample student timetable.
- **Distance**: demo distance estimate.

## Limitations (honest scope)
- All data is simulated and resets on refresh.
- Search hours are fixed at 08:00-22:00.
- Room reports are stored in the browser only and are not shared.
- The sentence parser is rule-based.
- Distances are placeholder values.

## Cloud roadmap (planned, not built)
1. **Today:** static front end on Vercel.
2. **Step 1:** Cloud Run API plus Firestore for shared room status, bookings and verified reports.
3. **Step 2:** Scheduled import of an approved timetable feed; aggregate seat counts through Pub/Sub.
4. **Step 3:** Gemini Enterprise agent using function calling over the search API.

## Privacy by design (concept)
Aggregate counts only. No cameras and no personal tracking. A real deployment would need APU approval and a privacy review.
