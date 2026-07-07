# 0 Points Quiz Management System

A modern frontend web application for conducting the **0 Points Quiz** digitally. The system streamlines quiz management by automating score calculations, turn rotation, question tracking, and live leaderboard updates without requiring a backend or database.

## Features

- Team registration and management
- Automatic score calculation
- Interactive quiz board
- Live leaderboard with automatic ranking
- Automatic team turn rotation
- Question status tracking (Available, Completed, Passed)
- Admin panel for managing teams, scores, and questions
- Responsive design for desktop, laptop, and projector displays
- Frontend-only application with browser memory storage

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Context API
- React Router
- Framer Motion
- Lucide React

## Project Structure

```
src/
├── components/
├── context/
├── data/
├── pages/
├── styles/
├── App.tsx
└── main.tsx
```

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/<repository-name>.git
```

Navigate to the project:

```bash
cd <repository-name>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

*(or the URL shown in your terminal if Vite uses a different port).*

## How to Use

1. Open the application.
2. Register teams from the **Manage Teams** page.
3. Start the quiz from the **Home** page.
4. Select questions from the quiz board.
5. Mark each answer as **Correct**, **Wrong**, or **Pass**.
6. Monitor the live leaderboard as scores update automatically.
7. Use the **Admin Panel** to manage teams, scores, and questions when required.

## Score Rules

- Every team starts with **1000 points**.
- **Correct Answer:** Score decreases by the question value.
- **Wrong Answer:** Score increases by the question value.
- **Lowest score ranks highest** on the leaderboard.

## Future Enhancements

- Backend integration
- Persistent database
- Timer for each question
- Import questions from Excel
- Multiple quiz rounds
- Export scores to PDF or Excel
- Full-screen presentation mode
- Sound effects and keyboard shortcuts

## License

This project was developed for educational purposes as part of the **SEED Task Round 1**.
