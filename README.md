# 🟩 Wordle Clone — Full-Stack React App

A feature-complete, full-stack clone of the New York Times Wordle game, built with **React + Node.js/Express** backend and a rich, polished UI.

---

## ✨ Features

### 🎮 Core Gameplay
- **Daily Word**: A new 5-letter word is automatically selected every day at **12:00 AM** from a curated dictionary of 2,000+ common English words.
- **6 Attempts**: Players have 6 tries to guess the correct 5-letter word.
- **Color-coded Feedback**:
  - 🟩 **Green**: Letter is correct and in the right position.
  - 🟨 **Yellow**: Letter exists in the word but in the wrong position.
  - ⬛ **Gray**: Letter is not in the word at all.
- **Keyboard Tracking**: On-screen keyboard updates to reflect letter states after each guess.
- **Hard Mode**: Once a letter is revealed as correct or present, it must be used in subsequent guesses.

### 🔄 Daily Auto-Reset
- The daily word rotates automatically at **12:00 AM** server time using a deterministic date-based seed.
- No manual intervention or cron jobs needed — the backend calculates the word based on the current date.

### 📊 Statistics & Streaks
- Tracks: **Games Played**, **Win %**, **Current Streak**, **Max Streak**.
- **Guess Distribution** bar chart (guesses 1–6).
- Stats are persisted in **localStorage** across sessions.

### 🌗 Dark / Light Mode
- Full dark mode and light mode with smooth transitions.
- Preference saved in localStorage.

### ⌨️ Input Methods
- **Physical keyboard** input support.
- **On-screen keyboard** with full functionality.
- Backspace and Enter key support.

### 🎉 Animations & UI Polish
- Tile **flip animation** when a guess is submitted with color reveal.
- **Bounce animation** on invalid word submission.
- **Pop animation** when a letter is typed.
- **Shake animation** on error (e.g., not enough letters).
- Win/lose **celebration** with a toast notification.
- Confetti effect on winning.
- Smooth row-by-row reveal timing.

### 📋 Share Results
- Copy results to clipboard as colored emoji grid (same format as the real Wordle).
- Share button appears after game completion.

### 🔤 Word Validation
- Backend validates every submitted guess against a dictionary of **valid 5-letter English words**.
- Invalid words are rejected with a "Not in word list" message.

### ⏳ Countdown Timer
- Displays a **live countdown** to the next daily word refresh.

### 📱 Responsive Design
- Fully responsive for mobile, tablet, and desktop.

---

## 🗂️ Project Structure

```
Wordle/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── server.js         # Main Express server
│   │   ├── wordService.js    # Daily word logic & dictionary
│   │   └── words/
│   │       ├── answers.js    # 2,000+ answer words
│   │       └── validWords.js # 10,000+ valid guess words
│   ├── package.json
│   └── .env
│
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Board.jsx         # Game board with 6 rows
│   │   │   ├── Row.jsx           # Individual guess row
│   │   │   ├── Tile.jsx          # Single letter tile
│   │   │   ├── Keyboard.jsx      # On-screen keyboard
│   │   │   ├── Header.jsx        # Top bar with logo & icons
│   │   │   ├── Modal.jsx         # Reusable modal wrapper
│   │   │   ├── StatsModal.jsx    # Statistics popup
│   │   │   ├── HelpModal.jsx     # How to play popup
│   │   │   ├── Toast.jsx         # Notification toasts
│   │   │   └── Countdown.jsx     # Next word countdown
│   │   ├── hooks/
│   │   │   ├── useWordle.js      # Core game logic hook
│   │   │   └── useStats.js       # Statistics management hook
│   │   ├── utils/
│   │   │   └── helpers.js        # Utility functions
│   │   └── context/
│   │       └── ThemeContext.jsx  # Dark/light mode context
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ ([Download here](https://nodejs.org))
- **npm** v8+ (comes with Node.js)
- **Git** (optional)

---

### Step 1 — Clone or Navigate to the Project

```bash
# If cloning from Git:
git clone <your-repo-url>
cd Wordle

# Or just navigate to the folder:
cd d:\PROJECTS\Wordle
```

---

### Step 2 — Set Up the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
# (Edit .env if needed — defaults work out of the box)

# Start the backend development server
npm run dev
```

The backend runs on **http://localhost:3001**

**Available API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/word/length` | Returns the word length (5) |
| `GET` | `/api/word/validate/:word` | Validates if a word is in the dictionary |
| `POST` | `/api/word/guess` | Submits a guess, returns color feedback |
| `GET` | `/api/word/today` | Returns today's word number (for sharing) |
| `GET` | `/api/stats` | Server health check |

---

### Step 3 — Set Up the Frontend

```bash
# Open a new terminal, navigate to frontend
cd d:\PROJECTS\Wordle\frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend runs on **http://localhost:5173**

---

### Step 4 — Open the Game

Open your browser and visit:
```
http://localhost:5173
```

Both servers must be running simultaneously.

---

### Step 5 — Production Build (Optional)

```bash
# Build frontend for production
cd frontend
npm run build
# Output is in frontend/dist/

# The backend can serve the built frontend
cd ../backend
npm start
# Visit http://localhost:3001
```

---

## 🎮 How to Play

1. **Type** a 5-letter word using your keyboard or the on-screen keyboard.
2. **Press Enter** to submit your guess.
3. Tiles will **flip** and reveal colors:
   - 🟩 **Green** = Right letter, right spot
   - 🟨 **Yellow** = Right letter, wrong spot
   - ⬛ **Gray** = Letter not in the word
4. Use the hints to narrow down the word in **6 tries**.
5. A **new word** appears every day at **midnight**!
6. After the game, **share** your result with friends.

---

## ⚙️ Configuration

Edit `backend/.env` to customize:

```env
PORT=3001
NODE_ENV=development
# Word rotation happens automatically based on UTC date
```

Edit `frontend/.env` to point to your backend:

```env
VITE_API_URL=http://localhost:3001
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| State Management | React Hooks + Context API |
| Styling | Vanilla CSS (CSS Variables) |
| Backend | Node.js 18+, Express 4 |
| Data Persistence | localStorage (client-side) |
| API Communication | Fetch API |
| Word Database | Curated JS word lists |
| Animations | CSS Keyframe Animations |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `EADDRINUSE: port 3001` | Kill the process using port 3001: `npx kill-port 3001` |
| `Cannot connect to API` | Ensure backend is running on port 3001 |
| Frontend shows blank page | Check browser console, ensure `npm install` completed |
| Word not changing daily | Backend uses UTC date — word changes at 12 AM UTC |

---

## 📝 License

MIT License — feel free to use, modify, and distribute.
