# Cover Letter Generator Backend

This is the Flask backend for the ML-powered Cover Letter Generator application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

2. Set up environment variables:
Create a `.env` file with:
```
PORT=5000
DEBUG=True
```

3. Run the server:
```bash
python app.py
```

## Deployment to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
heroku create your-app-name
```

4. Set environment variables:
```bash
heroku config:set PORT=5000
heroku config:set DEBUG=False
heroku config:set ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

5. Deploy to Heroku:
```bash
git subtree push --prefix backend heroku main
```

## API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/generate-cover-letter`: Generate a cover letter
- `POST /api/extract-resume`: Extract information from a resume
- `POST /api/analyze-job`: Analyze a job description 