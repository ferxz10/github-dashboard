# 📊 GitHub Dashboard

-GitHub analytics dashboard built with FastAPI, React, and Chart.js. 
- Enter a username and get real-time visual statistics: languages, activity, popular repositories, and trends. No API key required.


## Tech Stack
- **Backend:** Python · FastAPI · httpx
- **Frontend:** React 18 · Chart.js · Vite
- **API:** GitHub REST API (Public)

## Setup local

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173
