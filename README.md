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
├── public/
│   └── .gitkeep
├── package.json
├── package-lock.json
├── server.js
├── talks.json
├── .gitignore
└── README.md
```

## Sample Flow: Request & Response

### 1. Fetch Release Notes (Frontend → Backend)
- **Request:**
  - The browser sends a GET request to `/api/notes` when the page loads or when you click the Refresh button.
  - Example:
    ```http
    GET /api/notes HTTP/1.1
    Host: localhost:5000
    ```
- **Response:**
  - The Flask backend fetches the BigQuery release notes feed, parses it, and returns a JSON array of notes.
  - Example:
    ```json
    [
      {
        "title": "July 01, 2026",
        "link": "https://docs.cloud.google.com/bigquery/docs/release-notes#July_01_2026",
        "pubDate": "2026-07-01T00:00:00-07:00",
        "description": "<h3>Feature</h3>..."
      },
      ...
    ]
    ```

### 2. Tweet a Release Note (Frontend Only)
- When you click the Tweet button, a new window opens to Twitter with the note's title and link pre-filled. No backend request is made for this action.

## License
MIT
