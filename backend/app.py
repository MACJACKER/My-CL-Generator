"""
Flask API Server for ML Cover Letter Generator
This module provides a RESTful API for generating cover letters using ML/NLP
"""

import os
import datetime
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import re  # Add this import for regular expressions

# Define a simplified MLCoverLetterGenerator class
class MLCoverLetterGenerator:
    def __init__(self, use_spacy=False):
        self.use_spacy = use_spacy
        self.nlp = None
        
        if use_spacy:
            try:
                import spacy
                self.nlp = spacy.load("en_core_web_sm")
            except:
                print("Spacy model not found. Using fallback.")
        
    def extract_resume_info(self, resume_text):
        """
        Extract information from resume text.
        Simple version that picks out key information.
        """
        # Default information
        info = {
            "name": "John Smith",
            "email": "john.doe@example.com",
            "phone": "123-456-7890",
            "skills": [],
            "experience": []
        }
        
        # Extract name (first line usually has the name)
        lines = resume_text.strip().split('\n')
        if lines:
            info["name"] = lines[0].strip()
        
        # Look for skills
        skills_section = re.search(r'(?:SKILLS|Skills|skills)(?::|.)(.*?)(?:\n\n|\Z)', resume_text, re.DOTALL)
        if skills_section:
            skills_text = skills_section.group(1)
            # Split by commas or new lines
            skill_list = re.split(r'[,\n]', skills_text)
            info["skills"] = [s.strip() for s in skill_list if s.strip()]
        else:
            # If no skills section, look for common skills
            common_skills = ["Python", "Java", "JavaScript", "SQL", "Machine Learning", 
                            "Data Science", "Analytics", "AWS", "Cloud", "Docker"]
            info["skills"] = [skill for skill in common_skills 
                             if skill.lower() in resume_text.lower()]
        
        # Extract experience
        experience_section = re.search(r'(?:EXPERIENCE|Experience|experience)(?::|.)(.*?)(?:\n\n|\Z)', resume_text, re.DOTALL)
        if experience_section:
            experience_text = experience_section.group(1)
            # Simple extraction - get each paragraph as an experience
            experience_paragraphs = experience_text.split('\n\n')
            for para in experience_paragraphs:
                if para.strip():
                    info["experience"].append({
                        "title": para.strip().split('\n')[0] if '\n' in para else para.strip(),
                        "description": para.strip()
                    })
        
        return info
    
    def analyze_job_description(self, job_description):
        """
        Analyze job description to extract key information.
        """
        # Extract skills required
        skills_required = []
        common_skills = ["python", "java", "javascript", "sql", "machine learning", "data science", 
                         "analytics", "aws", "cloud", "docker", "communication", "teamwork", "leadership"]
        
        for skill in common_skills:
            if skill.lower() in job_description.lower():
                skills_required.append(skill.capitalize())
        
        # Extract responsibilities
        responsibilities = []
        lines = job_description.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('-') or line.startswith('•'):
                responsibilities.append(line.lstrip('-•').strip())
        
        # If no bullet points, try to extract sentences
        if not responsibilities:
            sentences = re.split(r'[.!?]', job_description)
            for sentence in sentences:
                if 'responsible' in sentence.lower() or 'duties' in sentence.lower():
                    responsibilities.append(sentence.strip())
        
        return {
            "skills_required": skills_required[:5],  # Top 5 skills
            "responsibilities": responsibilities[:3],  # Top 3 responsibilities
            "company_values": ["innovation", "teamwork"]  # Default values
        }
    
    def generate_cover_letter(self, resume_text, job_info):
        """
        Generate a cover letter based on resume information and job details.
        """
        # Extract resume information
        resume_info = self.extract_resume_info(resume_text)
        
        # Analyze job description
        job_description = job_info.get("jobDescription", "")
        job_analysis = self.analyze_job_description(job_description)
        
        # Get key information
        name = resume_info.get("name", "")
        email = resume_info.get("email", "john.doe@example.com")
        phone = resume_info.get("phone", "123-456-7890")
        
        job_title = job_info.get("jobTitle", "the position")
        company_name = job_info.get("companyName", "your company")
        
        # Get skills to highlight (matching skills between resume and job)
        resume_skills = resume_info.get("skills", [])
        required_skills = job_analysis.get("skills_required", [])
        
        matching_skills = []
        for skill in resume_skills:
            if any(req.lower() in skill.lower() or skill.lower() in req.lower() 
                  for req in required_skills):
                matching_skills.append(skill)
        
        # If no matching skills, use top resume skills
        if not matching_skills and resume_skills:
            matching_skills = resume_skills[:3]
        elif not matching_skills:
            matching_skills = ["relevant skills", "professional experience"]
        
        # Generate cover letter
        letter = f"Dear Hiring Manager,\n\n"
        
        # Introduction
        letter += f"I am writing to express my interest in the {job_title} position at {company_name}. "
        letter += f"With my background in {', '.join(matching_skills[:-1])}{' and ' if len(matching_skills) > 1 else ''}{matching_skills[-1] if matching_skills else ''}, "
        letter += f"I am confident I would be a valuable addition to your team.\n\n"
        
        # Body - skills and experience
        if matching_skills:
            letter += f"My proficiency in {matching_skills[0]} aligns perfectly with the requirements of this position. "
        
        # Experience
        experiences = resume_info.get("experience", [])
        if experiences:
            exp = experiences[0]
            letter += f"Throughout my career, I have developed expertise in {exp.get('title', 'my field')}, "
            letter += f"which has prepared me to excel in this role. "
        else:
            letter += f"Throughout my career, I have developed expertise in {', '.join(resume_skills[:2] if resume_skills else ['relevant areas'])}, "
            letter += f"which has prepared me to excel in this role. "
        
        # Value proposition
        letter += f"My experience with data-driven projects and ability to translate insights into actionable recommendations would allow me to contribute effectively to your team's objectives. "
        
        # Closing
        letter += f"I am excited about the opportunity to bring my skills in {', '.join(matching_skills[:-1])}{' and ' if len(matching_skills) > 1 else ''}{matching_skills[-1] if matching_skills else ''} to {company_name} and help drive your continued success.\n\n"
        
        # Signature
        letter += f"Thank you for your consideration. I look forward to the possibility of discussing how my background and skills would be a good match for this position.\n\n"
        letter += f"Sincerely,\n{name}\n{email} | {phone}"
        
        # Clean up the letter
        letter = self._clean_letter(letter)
        
        return letter
    
    def _clean_letter(self, letter):
        """
        Clean up the cover letter.
        """
        # Fix spacing
        letter = re.sub(r'\s+', ' ', letter)
        letter = re.sub(r' \n', '\n', letter)
        letter = re.sub(r'\n ', '\n', letter)
        
        # Fix paragraph breaks
        letter = letter.replace('\n\n\n', '\n\n')
        
        # Restore paragraph breaks
        letter = re.sub(r'\.(?=\w)', '. ', letter)
        
        # Fix email and phone formatting in signature
        letter = re.sub(r'(\w+)\. (\w+@\w+)\. (\w+)', r'\1.\2.\3', letter)
        letter = re.sub(r'(\d+)-(\d+)-(\d+)', r'\1-\2-\3', letter)
        
        return letter

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Create an instance of the generator
generator = MLCoverLetterGenerator(use_spacy=False)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "API is running"})

@app.route('/api/generate-cover-letter', methods=['POST'])
def generate_cover_letter_api():
    try:
        data = request.json
        resume_text = data.get('resumeText', '')
        job_info = data.get('jobInfo', {})
        
        cover_letter = generator.generate_cover_letter(resume_text, job_info)
        
        return jsonify({
            "coverLetter": cover_letter,
            "generatedAt": str(datetime.datetime.now())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/extract-resume', methods=['POST'])
def extract_resume_api():
    try:
        data = request.json
        resume_text = data.get('resumeText', '')
        
        resume_info = generator.extract_resume_info(resume_text)
        
        return jsonify({
            "resumeInfo": resume_info
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-job', methods=['POST'])
def analyze_job_api():
    try:
        data = request.json
        job_description = data.get('jobDescription', '')
        
        job_analysis = generator.analyze_job_description(job_description)
        
        return jsonify({
            "jobAnalysis": job_analysis
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

