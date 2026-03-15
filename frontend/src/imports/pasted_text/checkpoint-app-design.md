Design a mobile healthcare application UI called Checkpoint.
Checkpoint is a cognitive continuity system for nurses working in high-interruption hospital environments. Nurses are frequently interrupted during tasks such as medication administration and may forget their place in the workflow. The application allows nurses to quickly save their task context before an interruption and safely resume work afterward.
The design should emphasize working smarter when the brain is overwhelmed.
The interface must therefore prioritize:
• cognitive load reduction
• minimal decision making
• fast task recovery
• large touch targets
• clear visual hierarchy
• minimal clutter
• safety confirmation for medical tasks
This is not a typical hospital dashboard. It should feel like a calm, intelligent safety layer that helps nurses recover their mental context instantly.
The design should be clean, modern, and slightly futuristic, but still appropriate for healthcare.
Think Apple Health + Calm + modern hospital software.
Design Principles
Follow these design principles throughout the UI.
Cognitive Load Reduction
Use:
minimal visible options
progressive disclosure
large cards
whitespace
clear grouping of information
Avoid:
dense tables
large data walls
cluttered dashboards
complex navigation
One Primary Action Per Screen
Every screen should have one clearly dominant action.
Examples:
Capture Checkpoint
Resume Task
Approve Handover
Thumb-Friendly Layout
Important actions should appear in the bottom thumb zone for one-handed use.
Rapid Recognition Over Recall
The UI should help nurses recognize what they were doing, not remember it.
Use:
clear labels
icons
contextual summaries
progress indicators
Calm but High Contrast
Use a soft clinical color palette.
Primary color: soft medical blue
Secondary accent: muted teal
Success: green
Warning: amber
Danger: red
Background: off-white or light gray
Typography should be large, readable, and high contrast.
App Structure
The app has five main areas.
Nurse Dashboard
Patient List
Patient Context
Checkpoint Capture
Resume Task
Shift Handover
Analytics Dashboard
The primary workflow revolves around:
Dashboard → Patient → Capture Checkpoint → Resume Task
Screen 1 — Nurse Dashboard
Design a clean shift overview screen.
Top section:
greeting with nurse name
shift status
time
number of assigned patients
Example:
“Good Morning, Sarah”
Shift: Day Shift
Patients: 6
Main content area with cards:
Card 1:
Assigned Patients
Card 2:
Active Tasks
Card 3:
Unresolved Checkpoints
Card 4:
Shift Handover Later
Each card should show:
count
quick preview
tap interaction
Bottom navigation bar:
Patients
Tasks
Checkpoints
Handover
Floating center action button:
Checkpoint
The checkpoint button should be large and visually prominent.
Screen 2 — Patient List
Design a patient list optimized for quick scanning.
Each patient card should include:
• patient name
• room number
• active task
• status indicator
• time since last checkpoint
Example card:
Mr. Patel
Room 204
Active Task: Metoprolol Administration
Status: Needs Resume
Checkpoint saved 6 minutes ago
Use colored status chips:
Green = Normal
Amber = Interrupted
Red = High Risk
Cards should be large, spaced apart, and easy to tap.
Screen 3 — Patient Context Screen
This screen shows the current task context for a patient.
Top sticky header:
Patient Name
Room Number
Allergy indicator badge
Example:
Mr. Patel
Room 204
Allergy: Penicillin
Below the header, show collapsible cards:
Current Task
Medication Context
Recent Vitals
Open Checkpoints
Notes
Each card shows summary information first, expandable for details.
Bottom action area:
Primary button:
Create Checkpoint
If a checkpoint already exists:
Resume Task
Screen 4 — Checkpoint Capture
This is the core feature of the product.
Design a screen focused on voice capture.
Top:
“Save Task Context”
Patient identity visible.
Center of screen:
Large circular microphone button.
Below microphone:
Live transcript area.
Example:
“Patel, room 204, metoprolol 25 milligrams, bed alarm.”
Below transcript, display extracted structured fields as cards:
Patient
Room
Medication
Dosage
Interruption Type
Each field shows validation status.
Example:
Patient: Mr Patel ✓ Confirmed
Room: 204 ✓ Confirmed
Medication: Metoprolol ✓ Confirmed
Dosage: 25mg ⚠ Uncertain
Interruption: Bed Alarm ✓ Confirmed
Bottom actions:
Save Checkpoint (primary)
Edit
Cancel
Screen 5 — Resume Task Interface
This is the most important screen in the demo.
It restores the nurse’s context after an interruption.
Top header:
Patient name
Room number
Time since checkpoint
Example:
Mr Patel — Room 204
Checkpoint saved 8 minutes ago
Section 1:
What you were doing
Medication administration
Metoprolol 25 mg
Section 2:
What is confirmed
Patient identity verified
Medication order confirmed
Section 3:
What is uncertain
Dosage verification recommended
Charting status unclear
Section 4:
Risk Score Card
Example:
Risk Level: Medium
Interrupted during medication workflow
8 minutes elapsed
One field uncertain
Section 5:
Recommended next action
Re-verify patient identity and medication before continuing.
Bottom buttons:
Resume Safely
Mark Verified
Escalate
Screen 6 — Shift Handover
Design a screen that summarizes patient context for shift changes.
Top section:
Outgoing Nurse
Incoming Nurse
Shift time
Body sections:
Unresolved Checkpoints
Incomplete Tasks
Medication Events
Patient Notes
AI Generated Summary
Each patient should appear as an expandable accordion card.
Bottom action:
Approve Handover
Screen 7 — Analytics Dashboard
Design a simple operational analytics dashboard.
Charts:
Interruptions by hour
Interruptions by source
Most interrupted tasks
Average resume delay
High-risk checkpoint rate
Use simple bar charts and line graphs.
This screen should feel clean and high level, not data heavy.
Components to Include
Design reusable components:
Patient cards
Status chips
Validation indicators
Risk cards
Floating action button
Voice capture orb
Expandable information cards
Bottom navigation bar
Visual Style
Use:
Rounded cards
Soft shadows
Large spacing
Minimal borders
Clear hierarchy
Icons should be simple medical style.
The interface should feel calm, safe, and fast to understand.
Overall Experience Goal
The UI should make nurses feel:
“I instantly know where I was and what I should safely do next.”
The design should feel like a mental reset button during chaotic hospital workflows.