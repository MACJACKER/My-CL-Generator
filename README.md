# ML-Powered Cover Letter Generator

A full-stack application that uses machine learning and natural language processing to automatically generate customized cover letters based on resume information and job descriptions.

## Project Overview

This Cover Letter Generator streamlines the job application process by:
- Extracting key information from user resumes
- Analyzing job descriptions to identify requirements and responsibilities
- Generating tailored cover letters that highlight relevant skills and experiences
- Offering various customization options for different letter styles

## Technology Stack

### Frontend
- **Next.js 14**: React framework with server-side rendering
- **React**: UI component library
- **TailwindCSS**: Utility-first CSS framework for styling
- **NextAuth.js**: Authentication solution
- **MongoDB**: Database for storing user data and cover letters
- **TypeScript**: Type-safe JavaScript
- **PDF Generation**: Client-side PDF creation for cover letters

### Backend
- **Flask**: Python web framework for the API
- **spaCy**: NLP library for text processing and entity recognition
- **Regular Expressions**: For pattern matching and text extraction
- **CORS**: Cross-Origin Resource Sharing support
- **RESTful API Design**: Organized endpoints for different functionalities

## ML & NLP Processing Pipeline

1. **Resume Information Extraction**:
   - Name, contact information, and skills extraction
   - Experience and education parsing
   - Pattern recognition for different resume formats

2. **Job Description Analysis**:
   - Key requirements identification
   - Responsibility extraction
   - Company values and culture detection
   - Skill-matching algorithms

3. **Cover Letter Generation**:
   - Template-based generation with dynamic content insertion
   - Skill matching and highlighting
   - Experience relevance scoring
   - Professional formatting and tone adjustment
   - Post-processing to remove filler content

## Architecture

The application follows a client-server architecture:

1. **Frontend (Next.js)**:
   - Server-side rendered React components
   - User authentication and session management
   - Form interfaces for resume and job information
   - Cover letter viewing, editing, and PDF export
   - MongoDB integration for data persistence

2. **Backend (Flask)**:
   - RESTful API with JSON responses
   - ML processing pipeline implementation
   - Text analysis and generation endpoints
   - Error handling and validation

3. **Integration**:
   - API client for communication between layers
   - Type definitions for data exchange
   - Environment configuration for different deployments

## API Endpoints

- **GET /api/health**: Check API status
- **POST /api/generate-cover-letter**: Generate customized cover letter
- **POST /api/extract-resume**: Extract structured data from resume text
- **POST /api/analyze-job**: Analyze job description for key information

## Setup and Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MongoDB database

### Frontend Setup
\\\ash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\\\

### Backend Setup
\\\ash
# Navigate to backend directory
cd backend

# Install required Python packages
pip install flask flask-cors spacy

# Download spaCy model
python -m spacy download en_core_web_sm

# Run the Flask server
python app.py
\\\

## Usage

1. Create an account or log in
2. Enter or upload your resume text
3. Enter the job details including title, company, and description
4. Generate your customized cover letter
5. Edit the cover letter if needed
6. Download as PDF or copy the text

## Project Structure

\\\
/
├── app/                  # Next.js frontend
│   ├── api/              # API routes for Next.js
│   ├── components/       # React components
│   └── ...               # Pages and other Next.js files
├── backend/              # Flask backend
│   ├── app.py            # Main Flask application
│   └── ...               # Other Python files
├── lib/                  # Shared libraries
├── public/               # Static assets
└── ...                   # Configuration files
\\\

## Machine Learning Details

### NLP Components
- **Named Entity Recognition**: Extract person names, locations, and organizations
- **Text Classification**: Categorize skills and experience
- **Pattern Matching**: Extract structured information from unstructured text
- **Text Generation**: Create coherent paragraphs based on extracted information

### Customization Features
- Different letter styles (professional, modern, creative)
- Emphasis on different skills based on job requirements
- Length adjustment options
- Tone variations

## License

This project is released under the MIT License.

## Development Roadmap

- Improved skill matching with industry-specific terminology
- More cover letter templates and styles
- Resume parsing from PDF and DOCX files
- Job description auto-fetch from URL
- Advanced sentiment analysis for company culture matching
