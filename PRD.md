# Product Requirements Document (PRD)

# 0 Points Quiz Management Website

**Version:** 1.0
**Platform:** Web Application (Frontend Only)
**Deployment:** Localhost (No Backend)
**Target Users:** Quiz Coordinators, Event Volunteers, Participants

---

# 1. Product Overview

The **0 Points Quiz Management Website** is a frontend web application designed to conduct the "0 Points Quiz" event digitally. It replaces manual scorekeeping and leaderboard management with an interactive interface that automates score calculations, turn management, question tracking, and live rankings.

All data is stored in browser memory during the event. No login system, backend, or database is required.

---

# 2. Goals

The website should enable organizers to:

* Register teams
* Conduct quiz rounds
* Automatically calculate scores
* Track completed questions
* Pass questions to the next team
* Automatically rotate turns
* Display a live leaderboard
* Allow manual score adjustments

---

# 3. Application Structure

The application consists of four primary screens.

## Screen 1 – Home

Purpose:
Landing page before starting the quiz.

Components:

* Event title
* "Start Quiz" button
* "Manage Teams" button

---

## Screen 2 – Team Management

Purpose:
Register teams before starting.

### Features

Display all registered teams.

Each team card contains:

* Team Name
* Member 1
* Member 2
* Member 3
* Member 4 (optional)

Buttons:

* Add Team
* Edit Team
* Delete Team

### Add Team Form

Fields:

* Team Name
* Member 1
* Member 2
* Member 3
* Member 4 (Optional)

Validation

* Minimum 3 members
* Maximum 4 members
* Team name required

On Save

Every team automatically receives

Score = **1000**

---

# 4. Main Quiz Screen

This is the primary screen used during the event.

Layout

---

Top Bar

* Current Team Turn
* Current Score
* Next Team Indicator

---

Center

Question Grid

Categories

Tech

Sports

Rajagiri

Entertainment

Each category contains

20

40

60

80

Example

| Tech | Sports | Rajagiri | Entertainment |
| ---- | ------ | -------- | ------------- |
| 20   | 20     | 20       | 20            |
| 40   | 40     | 40       | 40            |
| 60   | 60     | 60       | 60            |
| 80   | 80     | 80       | 80            |

Each cell is clickable.

---

Question Status

Each question has one of three states.

Available

Completed

Passed

Visual

Available

Normal Button

Completed

Gray button with ✓

Passed

Orange highlight

Completed questions cannot be clicked again.

---

# 5. Question Flow

Step 1

Current team clicks a question.

Step 2

Popup appears.

Popup displays

Category

Point Value

Question Number

Buttons

Correct

Wrong

Pass

Cancel

---

If Correct

Score decreases

New Score

Current Score − Question Points

Example

1000

Question

40

Result

960

Question becomes Completed

Turn moves to next team

Leaderboard updates

---

If Wrong

Score increases

Example

1000

Wrong 40

Result

1040

Question becomes Completed

Turn changes

Leaderboard updates

---

If Pass

Question remains active

Status becomes Passed

Turn changes

Next team attempts same question

---

# 6. Automatic Turn Management

After every action

Correct

Wrong

Pass

Turn automatically rotates.

Example

Team A

↓

Team B

↓

Team C

↓

Team D

↓

Team A

Current turn is always highlighted.

---

# 7. Leaderboard

Displayed on right side of screen.

Columns

Rank

Team

Score

Ranking Rule

Lowest score wins.

Example

| Rank | Team    | Score |
| ---- | ------- | ----- |
| 1    | Alpha   | 720   |
| 2    | Bravo   | 760   |
| 3    | Charlie | 840   |

Leaderboard updates immediately after every score change.

Animation

Smooth movement when rankings change.

---

# 8. Admin Panel

Accessible from navigation bar.

Functions

### Team Management

Add Team

Delete Team

Edit Team

Reset Scores

---

### Score Management

Increase Score

Decrease Score

Manual Score Input

Reset Team Score to 1000

---

### Question Management

Reset Question

Mark Question Completed

Mark Question Available

Reset Entire Board

---

### Game Controls

Reset Game

Restart Event

Clear All Teams

Export Scores (optional)

---

# 9. Score Rules

Every team begins

1000 points

Correct Answer

New Score

Current Score − Selected Points

Wrong Answer

New Score

Current Score + Selected Points

Example

1000

Correct 80

920

1000

Wrong 80

1080

Lowest score always ranks highest.

---

# 10. UI Requirements

Theme

Modern Quiz Interface

Primary Colors

Blue

White

Dark Gray

Cards

Rounded Corners

Soft Shadows

Responsive Layout

Works on

Laptop

Desktop

Projector

Buttons

Large

Easy to click

Animations

Hover effects

Leaderboard movement

Question completion transition

---

# 11. Navigation

Home

↓

Manage Teams

↓

Start Quiz

↓

Quiz Board

↓

Leaderboard Updates

↓

Admin Panel

---

# 12. Technical Requirements

Framework

React.js

Styling

CSS Modules or Tailwind CSS

State Management

React Context or useState

Storage

Browser Memory

No Backend

No Database

No Authentication

Runs entirely on localhost

---

# 13. Project Folder Structure

```text
src/
│
├── components/
│   ├── Navbar
│   ├── TeamCard
│   ├── Leaderboard
│   ├── QuestionGrid
│   ├── QuestionPopup
│   ├── TeamForm
│
├── pages/
│   ├── Home
│   ├── TeamManagement
│   ├── QuizBoard
│   ├── AdminPanel
│
├── context/
│   └── QuizContext
│
├── data/
│   └── questions.js
│
├── styles/
│
└── App.jsx
```

---

# 14. Future Enhancements

* Backend integration
* Persistent database
* Timer per question
* Question import from Excel
* Live participant display
* Sound effects
* Full-screen mode
* Keyboard shortcuts
* Multiple quiz rounds
* Final winner announcement
* Export results as PDF or Excel

---

# 15. Acceptance Criteria

The application is considered complete when:

* Teams can be added, edited, and removed.
* Each team starts with 1000 points.
* Quiz board displays four categories with four point values each.
* Questions become unavailable after being answered.
* Passed questions are available only to the next team.
* Scores update automatically based on correct or incorrect answers.
* Team turns rotate automatically after each action.
* Leaderboard updates instantly and always ranks by the lowest score.
* Admin panel supports team management, score adjustments, and question resets.
* The interface is responsive and suitable for projection during the event.
* The entire application runs locally without a backend or database.
