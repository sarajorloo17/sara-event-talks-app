# sara-event-talks-app

A simple Python Flask web application that fetches and displays the latest BigQuery Release Notes from Google Cloud. You can refresh the notes and tweet about any update directly from the app.

## Features
- Fetches and displays BigQuery release notes
- Refresh button with loading spinner
- Tweet any release note with one click

## How to Run
1. Clone the repository
2. Install dependencies:
   ```bash
   pip install flask requests
   ```
3. Start the app:
   ```bash
   python app.py
   ```
4. Open [http://localhost:5000](http://localhost:5000) in your browser

## Project Structure
```
├── app.py
├── static/
│   ├── app.js
│   └── style.css
├── templates/
│   └── index.html
├── .gitignore
└── README.md
```

## License
MIT
