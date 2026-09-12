# VignanAI — End-to-End Agent 5 + Frontend Wiring Specification

## Mission

Update the existing VignanAI repository so the real course-setup flow triggers the backend agentic lesson-plan pipeline and the generated plan is fully wired into the existing React/Vite Dashboard, Lesson Plans, Calendar, Progress, and Reports experiences.

Do NOT build disconnected mock screens. Do NOT leave buttons as placeholders. Inspect the repository first, preserve working code, then implement and test the complete flow.

---

## Existing UI to preserve

The supplied screens show these routes/concepts:

- Dashboard
- My Courses
- Lesson Plans
- Calendar
- Progress
- Reports
- Settings

The Dashboard is intentionally minimal:
- greeting
- Next Class
- My Courses
- Needs Attention

Do not turn it into a data-dump dashboard.

The current Course Setup flow contains:
1. Course Details
2. Sections Taught
3. Academic Documents

The current Lesson Plans screen contains:
- course selector
- section selector
- unit/scope selector
- filters
- summary
- instructional delivery roster
- scheduled date
- topic/core content
- pedagogical method
- CO mapping
- delivery status
- plan detail

Keep this design language and wire it to real backend data.

---

# 1. End-to-end product flow

```text
Faculty
  ↓
My Courses
  ↓
Select Course
  ↓
Course Setup
  ↓
Provide:
  - faculty details
  - course
  - sections
  - syllabus
  - academic calendar
  - optional timetable
  ↓
Save / Generate Semester Plan
  ↓
Document + data processing
  ↓
Agent 1 → academic context
Agent 2 → syllabus structure
Agent 3 → faculty context
Agent 4 → timetable
Agent 7 → assessment context where available
Agent 8 → reference resources where available
  ↓
Agent 5
  ↓
Calculate required workload
  ↓
Calculate actual available teaching capacity
  ↓
Generate section-specific semester plans
  ↓
Deterministic validation
  ↓
Draft
  ↓
Faculty review/edit
  ↓
Approve
  ↓
Publish
  ↓
Dashboard updates
  ↓
Lesson Plans updates
  ↓
Calendar/Progress/Reports reflect same source of truth
  ↓
Weekly progress
  ↓
Agent 6 variance analysis
  ↓
Replanning recommendation
  ↓
Agent 5 revised plan
  ↓
Faculty approval
  ↓
New plan version
```

---

# 2. Agent 5 — authoritative hackathon requirements

The official problem statement says Agent 5:

### Purpose
Turns a syllabus into a session-by-session teaching plan aligned to the academic calendar, then keeps that plan alive as a tracking instrument.

### Inputs
- course content from Agent 2
- allotted contact hours
- academic calendar with holidays and examination weeks
- section timetable from Agent 4
- past lesson plans for the same course

### Workflow
1. Determine available teaching sessions by subtracting holidays, examination days, and institutional events.
2. Retrieve unit/topic breakdown and notional hours from Agent 2.
3. Distribute topics across available sessions, respecting internal-assessment schedules and clean mid-term syllabus cut-offs.
4. Assign each session:
   - topic
   - Course Outcome
   - teaching method
   - reference material
5. Insert buffer sessions, typically one per unit, to absorb slippage.
6. Present draft to faculty for editing/approval.
7. Publish approved plan and open weekly progress marking.
8. Compare planned vs actual and feed variance to Agent 6.

### Outputs
- session-wise lesson plans
- course delivery plans
- CO-to-session mapping
- plan-vs-actual variance reports

### Integrations
Consumes Agents 1, 2, 4.
Feeds Agents 6 and 9.

Do not remove these requirements.

---

# 3. Course Setup behavior

The faculty should NOT manually calculate teaching capacity.

Minimum setup:

## Faculty
```json
{
  "faculty_id": "F001",
  "name": "Dr. A. R. Sharma",
  "department": "Computer Science & Engineering"
}
```

## Course
```json
{
  "course_code": "24CS303",
  "course_name": "Computer Networks",
  "academic_year": "2026-27",
  "semester": "Semester I"
}
```

## Sections
Allow multiple sections, for example:
```text
CSE-3
CSE-11
CSE-18
```

Do not hard-code these in production.

---

# 4. Document ownership

Syllabus:
- course-level document
- processed once
- reused for future planning

Academic calendar:
- semester/institution-level document
- uploaded once per academic period
- reusable across courses

Timetable:
- section/faculty assignment data
- optional from UX perspective
- strongly preferred because it lets the system infer actual teaching slots

Previous lesson plan:
- optional
- historical input for pacing/reference

The same document must not have to be uploaded repeatedly.

---

# 5. Timetable intelligence

The provided timetable demonstrates:
- 22 sections
- day/period grid
- course names/codes
- lecture/practical markers
- faculty assignments
- rooms in some slots

The system must parse:
- section
- day
- period
- start/end time
- course
- lecture/practical/lab
- faculty
- room when available

Supported inputs:
- XLSX
- CSV
- PDF
- image/screenshot

When timetable exists:

```text
Timetable
  ↓
Agent 4
  ↓
identify faculty
  ↓
identify assigned sections
  ↓
identify selected course
  ↓
identify weekly lecture/practical slots
  ↓
expand slots across semester
  ↓
apply calendar exclusions
```

Example:

```text
Faculty X
CN:
CSE-3  → 3 periods/week
CSE-11 → 3 periods/week
CSE-18 → 3 periods/week

Total CN load = 9 periods/week
```

Do not make the faculty type this manually when the timetable provides it.

---

# 6. Required workload vs available capacity

These are different.

## Required workload
From Agent 2 / syllabus.

For the supplied `CN.pdf`:

```text
24CS303 Computer Networks
L T P C = 3 0 2 4

Module 1 Unit 1 = 20 hours
Module 1 Unit 2 = 20 hours
Module 2 Unit 1 = 20 hours
Module 2 Unit 2 = 20 hours

Total = 80 instructional hours
48 lecture + 32 practical
```

The syllabus explicitly gives each unit block as 12L + 8P = 20 hours.

## Available capacity
From timetable + calendar:

```text
weekly course slots
× semester weeks
− holidays
− examinations
− institutional events
− other blocked/non-teaching dates
```

Never equate these two values.

Always show/compute:

```text
Required workload
vs
Available teaching capacity
```

---

# 7. Section-specific planning

This is mandatory.

If one faculty teaches:

```text
Computer Networks
CSE-3
CSE-11
CSE-18
```

generate three delivery plans:

```text
CN — CSE-3
CN — CSE-11
CN — CSE-18
```

The logical syllabus sequence may be shared, but:
- dates are section-specific
- periods are section-specific
- actual progress is section-specific
- variance is section-specific
- replanning is section-specific

Do not assume all sections stay synchronized.

If CSE-3 falls behind, replan CSE-3 without unnecessarily changing CSE-11 or CSE-18.

---

# 8. Course-level vs section-level plan

Implement both.

## Course-level
```text
Unit
Topic
Required hours
CO
Method
```

## Section-level
```text
Section
Date
Day
Period
Unit
Topic
CO
Method
Reference
Planned hours
Status
```

---

# 9. Semester planner

For each section:

1. Retrieve syllabus structure.
2. Determine required workload.
3. Retrieve recurring timetable slots.
4. Expand slots over semester date range.
5. Remove holidays.
6. Remove examination periods.
7. Remove institutional non-teaching events.
8. Identify assessment/mid-term boundaries.
9. Allocate topics according to notional hours.
10. Preserve prerequisite/logical ordering.
11. Keep clean syllabus cut-offs for assessments.
12. Map COs.
13. Select teaching methods.
14. Attach references.
15. Insert buffers where feasible.
16. Validate everything.
17. Save draft.

Do not invent arbitrary dates.

---

# 10. Academic calendar processing

The supplied academic calendar is a visual/table-heavy PDF with week/date layout and marked events.

Process:

```text
PDF/image
  ↓
text extraction where reliable
  ↓
vision/OCR fallback
  ↓
date normalization
  ↓
event classification
  ↓
validation
  ↓
database
```

Event types should include:

```text
TEACHING_DAY
HOLIDAY
INSTITUTIONAL_EVENT
MIDTERM_EXAM
INTERNAL_ASSESSMENT
FORMATIVE_ASSESSMENT
SUMMATIVE_ASSESSMENT
PREPARATION_PERIOD
SEMESTER_START
SEMESTER_END
MODULE_START
MODULE_END
UNKNOWN
```

Do not hard-code sample calendar dates.

---

# 11. Computer Networks demo data

Use the supplied files as the real demo input:

- `CN.pdf`
- `Academic Calender.pdf`
- `Time Table.pdf`

The supplied CN syllabus gives:
- course 24CS303
- 3L + 0T + 2P
- 4 credits
- four 20-hour instructional blocks
- practices
- six Course Outcomes
- textbooks and references

Use those actual extracted values in the demo, not invented mock values.

---

# 12. Course Outcomes

For CN, use the six COs extracted from the syllabus.

The plan should create CO-to-session mapping.

Example:

```text
CO1 → introductory network concepts
CO2 → media/switching
CO3 → protocol implementation/tools
CO4 → end-to-end/application interaction
CO5 → network-layer design/protocols
CO6 → data-link-layer protocols
```

Do not fabricate additional COs.

---

# 13. Teaching methods

Supported methods:

- Lecture
- Demonstration
- Problem Solving
- Flipped Class

Use LLM reasoning for semantic selection.

Examples:
- conceptual introduction → Lecture
- practical/procedural topic → Demonstration
- numerical/network-analysis topic → Problem Solving
- preparation-heavy topic → Flipped Class

Faculty must be able to override.

---

# 14. Practical/lecture distinction

The CN syllabus is 3L + 2P.

The planner must preserve lecture/practical intent.

Do not schedule a practical as a normal lecture simply because the topic fits.

Practical sessions should draw from syllabus practices such as:
- cabling
- network device configuration
- NIC setup
- troubleshooting commands
- Wireshark
- Ethernet/ARP
- 802.11
- Packet Tracer
- routing
- TCP/UDP
- Java Hello/Echo

---

# 15. Buffer sessions

Default policy:

```text
approximately 1 buffer per unit where capacity permits
```

Buffer states:

```text
AVAILABLE
USED
CANCELLED
CONVERTED_TO_TEACHING
EXPIRED
```

Buffers are explicit reserved capacity.

Do not treat buffer sessions as ordinary topics until actually used.

---

# 16. Deterministic validation

Before a plan becomes reviewable:

```text
✓ date valid
✓ date inside semester
✓ not a holiday
✓ not an exam
✓ not a blocked institutional event
✓ exists in timetable
✓ correct course
✓ correct section
✓ correct faculty
✓ no duplicate slot
✓ required topics covered
✓ required workload respected
✓ clean assessment cut-offs
✓ CO mappings exist
✓ lecture/practical structure valid
✓ buffer rules respected
```

LLM output must never bypass this validator.

If invalid:

```text
Plan
 ↓
Validator
 ↓
Errors
 ↓
Agent 5 replanning
 ↓
Validator
```

Limit retries.

---

# 17. Faculty review / approval

After generation:

```text
DRAFT
 ↓
FACULTY REVIEW
 ↓
EDIT
 ↓
VALIDATE
 ↓
APPROVE
 ↓
PUBLISH
```

Faculty may edit:
- topic
- date where valid
- teaching method
- CO
- reference
- planned hours
- notes

Invalid edits must be rejected with a useful explanation.

---

# 18. Versioning

Never overwrite a published plan.

Use:

```text
Plan v1
Plan v2
Plan v3
```

For replanning:

```text
v1 published
 ↓
variance
 ↓
v2 draft
 ↓
approval
 ↓
v2 published
```

Store:
- version number
- parent version
- created time
- changed by
- reason
- approval state
- change summary

---

# 19. Progress tracking

Every session needs:

```text
planned status
actual status
planned hours
actual hours
faculty remarks
completion time
```

Statuses:

```text
PLANNED
COMPLETED
PARTIALLY_COMPLETED
MISSED
CANCELLED
RESCHEDULED
BUFFER
```

Progress is section-specific.

---

# 20. Agent 6 integration

When progress changes:

```text
Actual progress
 ↓
planned vs actual
 ↓
variance
 ↓
Agent 6
```

Agent 6 should:
- calculate session/hour variance
- identify affected topics/units
- assess downstream impact
- check available buffers
- recommend recovery
- send recommendation to Agent 5

Do not silently change approved plans.

---

# 21. Agent 9 integration

Agent 9 consumes:
- approved lesson plans
- course delivery plans
- CO mappings
- progress
- variance
- buffer utilization

It can provide:
- course delivery report
- CO coverage
- plan-vs-actual
- unit completion
- semester delivery
- accreditation/audit evidence

---

# 22. Backend API

Ensure these work with real persistence:

```text
POST /api/faculty
GET  /api/faculty/{id}
GET  /api/faculty/{id}/sections
GET  /api/faculty/{id}/workload

POST /api/documents/upload
POST /api/calendar/import
GET  /api/calendar/{semester_id}

POST /api/courses
POST /api/courses/{course_id}/syllabus
GET  /api/courses/{course_id}

POST /api/timetables/import
GET  /api/timetables/{section_id}
GET  /api/faculty/{faculty_id}/timetable

POST /api/lesson-plans/generate
GET  /api/lesson-plans/{plan_id}
POST /api/lesson-plans/{plan_id}/submit
POST /api/lesson-plans/{plan_id}/approve
POST /api/lesson-plans/{plan_id}/publish

GET  /api/lesson-plans/{plan_id}/sessions
POST /api/lesson-sessions/{session_id}/progress

GET  /api/lesson-plans/{plan_id}/variance
POST /api/lesson-plans/{plan_id}/replan

GET /api/reports/course-delivery/{course_id}
GET /api/reports/co-mapping/{course_id}
GET /api/reports/plan-vs-actual/{course_id}

GET /api/dashboard
GET /api/agent-events
```

---

# 23. Dashboard must be dynamically wired

Replace hard-coded dashboard values.

## Next Class

Retrieve the earliest future published session for the logged-in faculty.

Show:

```text
NEXT CLASS
Tomorrow · 10:30 AM · Lecture Hall 402

Computer Networks
CSE-3 · Period 3

Topic: <real generated topic>
Method: <real generated method>

View Lesson Plan →
```

No hard-coded DBMS.

## My Courses

Retrieve actual assignments:

```text
Computer Networks
CSE-3 · CSE-11 · CSE-18
<real progress> completed
```

## Needs Attention

Only show real exceptions.

Use:

```text
NEEDS ATTENTION

Computer Networks · CSE-3

1 session behind the current plan

Buffer session available for recovery.

Review plan →
```

Use a thin #D71920 left accent.

Do NOT use:
- red dots
- red badges
- red pills
- red-filled cards

If there is no issue:

```text
All courses are on track.
```

Do not invent alerts.

---

# 24. Lesson Plans page must be dynamically wired

Course selector must load actual courses.

Section selector must load actual sections for the selected course/faculty.

Unit selector must load actual syllabus units.

The delivery roster must come from stored lesson sessions.

Columns:

```text
Plan #
Scheduled Date
Topic & Core Instructional Content
Pedagogical Method
CO Mapping
Delivery Status
Plan Detail
```

Use real generated rows.

No static/fake DBMS plan after generation.

---

# 25. Lesson Plan detail

Clicking `View →` should open a real detail route/page.

Show:

```text
Computer Networks
CSE-3

07 Aug 2026
09:05–09:55

Introduction to Computer Networks

Unit 1
CO1

Method
Lecture

Reference
Kurose & Ross

Planned duration
50 minutes

Status
Planned
```

Also allow progress marking.

---

# 26. Progress wiring

From a session detail:

```text
Status:
Completed
Partially Completed
Missed
Cancelled
Rescheduled

Actual hours
Remarks
```

Save to backend.

The dashboard, Lesson Plans, Progress and Reports must immediately reflect the same stored state.

---

# 27. Calendar wiring

Calendar page should use:
- academic calendar events
- section timetable
- generated lesson sessions

The page should allow the faculty to see where generated sessions actually fall.

Do not duplicate a separate static calendar dataset.

---

# 28. No duplicated state

Backend/PostgreSQL is the source of truth.

The same state powers:

```text
Dashboard
Lesson Plans
Calendar
Progress
Reports
```

Do not maintain separate fake values for each screen.

Example:

If CSE-3 has 21/30 completed sessions in the database, every relevant page must use that same value.

---

# 29. Generation UX

After `Save & Generate Semester Plan`:

```text
Preparing your semester plan

✓ Reading syllabus
✓ Reading academic calendar
✓ Matching timetable slots
✓ Calculating teaching capacity
• Allocating topics
• Validating schedule
```

Then:

```text
Semester plan ready

Computer Networks
24CS303

3 sections
80 required periods per section
48 lecture
32 practical

[ Review Plan → ]
```

Do not expose hidden chain-of-thought.

Only show concise operational activity.

---

# 30. Agent activity

Useful messages:

```text
Reading academic calendar...
Detected semester teaching window.
Reading section timetable...
Matched faculty to 3 sections.
Found CN teaching slots.
Calculated available capacity.
Retrieved 4 course units.
Applying assessment cut-off.
Allocating Module 1...
Added buffer.
Validating schedule...
Validation passed.
Draft ready.
```

Do not show internal reasoning.

---

# 31. LLM / deterministic split

## LLM: DeepSeek-R1 8B via Ollama
Use for:
- syllabus interpretation
- topic grouping/sequencing
- CO semantic mapping
- teaching method selection
- resource selection
- variance reasoning
- replanning recommendations

## Python tools
Use for:
- date arithmetic
- timetable expansion
- holiday/exam exclusion
- capacity calculation
- conflict checking
- variance arithmetic
- hard validation
- persistence

---

# 32. Vision model

DeepSeek-R1 8B is text reasoning.

For image-heavy timetable/calendar/syllabus extraction, use a vision-capable local model such as:

```text
Gemma 3 4B
```

through Ollama where required.

Pipeline:

```text
PDF/image
 ↓
Gemma 3 / parser
 ↓
structured JSON
 ↓
Python validation
 ↓
Agent workflow
```

---

# 33. Seed/demo data

Provide a demo environment using:

```text
Faculty:
Dr. A. R. Sharma

Course:
24CS303 Computer Networks

Semester:
Semester I
2026–27

Sections:
CSE-3
CSE-11
CSE-18

Source files:
CN.pdf
Academic Calender.pdf
Time Table.pdf
```

Do not assume these are real assignments outside demo mode.

Make demo assignments explicit in seed data.

---

# 34. Required end-to-end test

Run this complete scenario:

```text
1. Open My Courses.
2. Select Computer Networks.
3. Select CSE-3, CSE-11, CSE-18.
4. Upload/use CN syllabus.
5. Upload/use academic calendar.
6. Upload/use timetable.
7. Save & Generate Semester Plan.
8. Verify syllabus parsing.
9. Verify faculty/section/timetable matching.
10. Verify required workload.
11. Verify available capacity.
12. Generate section-specific plans.
13. Validate dates and assessment boundaries.
14. Review draft.
15. Approve.
16. Publish.
17. Open Dashboard.
18. Verify Next Class comes from generated plan.
19. Verify My Courses uses real progress.
20. Open Lesson Plans.
21. Verify generated sessions appear.
22. Open one session.
23. Mark it Partially Completed.
24. Enter actual hours.
25. Verify variance.
26. Verify Agent 6 recommendation.
27. Generate revised plan for affected section.
28. Validate revised plan.
29. Approve.
30. Verify new version.
31. Verify Dashboard/Lesson Plans/Progress reflect new state.
32. Verify Agent 9 report data.
33. Restart backend.
34. Verify all persisted data remains.
```

---

# 35. No fake functionality

Never leave:

```text
Generate button → no backend action
Static plan → shown after generation
Fake progress
Fake next class
Fake alerts
Fake sections
Fake agent activity
Replan button → no new version
Progress → local-only update
```

Every visible action must call the real backend.

---

# 36. Final acceptance criteria

The implementation is complete only when:

### Setup
- faculty data saves
- course saves
- sections save
- syllabus uploads/processes
- calendar uploads/processes
- timetable optionally uploads/processes

### Agent pipeline
- Agents 1–4 and 7–8 provide useful inputs
- Agent 5 generates a real plan
- validator runs
- Agent 6 receives variance
- Agent 9 receives report data

### Planning
- required workload is correct
- available capacity is calculated
- timetable constraints respected
- calendar exclusions respected
- assessment boundaries respected
- CO mapping works
- methods assigned
- buffers inserted
- separate section plans generated

### Lifecycle
- draft
- review
- edit
- approve
- publish
- progress
- variance
- replan
- new version

### Frontend
- Dashboard is dynamic
- Lesson Plans are dynamic
- Calendar is dynamic
- Progress is dynamic
- Reports reflect backend state

### Persistence
- restart does not lose data

### Demo
The full scenario above works without manual database editing.

---

# 37. Final target behavior

The finished system must support:

> A faculty member selects a course, selects the sections they teach, provides the syllabus and academic calendar, optionally provides the timetable, and VignanAI automatically understands the course workload, identifies the faculty's section-specific teaching slots, calculates actual semester teaching capacity after holidays and assessments, generates section-specific semester lesson plans, validates them, gets faculty approval, publishes them, tracks real teaching progress, detects variance, recommends recovery, replans only affected sections, creates a new version, and keeps Dashboard, Lesson Plans, Calendar, Progress and Reports synchronized.

Build the actual working implementation. Do not stop at scaffolding, static data, or disconnected UI.
