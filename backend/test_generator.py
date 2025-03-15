"""
Test script for the ML Cover Letter Generator
This script demonstrates how to use the MLCoverLetterGenerator class
"""

import json
import sys
from llm_cover_letter_generator import MLCoverLetterGenerator

def main():
    """Main function to test the ML cover letter generator"""
    # Create instance
    print("Initializing ML Cover Letter Generator...")
    generator = MLCoverLetterGenerator()
    
    # Check if resume file path is provided
    if len(sys.argv) > 1:
        resume_file = sys.argv[1]
        try:
            with open(resume_file, 'r', encoding='utf-8') as f:
                resume_text = f.read()
        except Exception as e:
            print(f"Error reading resume file: {e}")
            resume_text = get_sample_resume()
    else:
        print("No resume file provided, using sample resume")
        resume_text = get_sample_resume()
    
    # Test job description
    job_description = get_sample_job_description()
    
    # Extract info from resume
    print("\nExtracting information from resume...")
    resume_info = generator.extract_info_from_resume(resume_text)
    print("\nExtracted Resume Info:")
    print(json.dumps(resume_info, indent=2))
    
    # Analyze job description
    print("\nAnalyzing job description...")
    job_info = {
        "companyName": "DataTech Solutions",
        "jobTitle": "Data Scientist",
        "jobDescription": job_description
    }
    job_analysis = generator.analyze_job_description(job_description, resume_info)
    print("\nJob Analysis:")
    print(json.dumps(job_analysis, indent=2))
    
    # Generate cover letters in different styles
    for style in ["professional", "modern", "creative", "traditional"]:
        print(f"\nGenerating {style.upper()} cover letter...")
        cover_letter = generator.generate_cover_letter(
            resume_info,
            job_info,
            job_analysis,
            special_instructions="Please highlight my machine learning experience",
            template_style=style
        )
        print(f"\n{style.upper()} COVER LETTER:\n{'-'*50}")
        print(cover_letter)
        print("-"*50)
        
        # Save to file
        output_file = f"sample_cover_letter_{style}.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(cover_letter)
        print(f"Saved to {output_file}")

def get_sample_resume():
    """Return a sample resume for testing"""
    return """
Jane Doe
jane.doe@email.com
(555) 123-4567
123 Main Street, New York, NY 10001

SUMMARY
Data Scientist with 4+ years of experience applying machine learning, statistical analysis, 
and data visualization to solve complex business problems. Skilled in Python, R, SQL, and various 
ML frameworks with a proven track record of delivering actionable insights.

EXPERIENCE
Senior Data Scientist, ABC Analytics (2020-Present)
- Led development of customer churn prediction model using XGBoost, reducing churn by 15%
- Implemented NLP algorithms to analyze customer feedback, improving product ratings by 20% 
- Built interactive dashboards using Tableau to visualize key business metrics
- Collaborated with cross-functional teams to integrate ML solutions into existing systems

Data Analyst, XYZ Tech (2018-2020)
- Performed exploratory data analysis on large datasets to identify business opportunities
- Created automated reporting pipelines using Python and SQL
- Developed A/B testing framework for website optimizations
- Presented findings to non-technical stakeholders, driving data-based decision making

EDUCATION
Master of Science in Data Science, Columbia University (2018)
Bachelor of Science in Computer Science, University of Michigan (2016)

SKILLS
Technical: Python, R, SQL, Java, JavaScript
Data Science: Machine Learning, Deep Learning, Natural Language Processing, Statistical Modeling
Tools: TensorFlow, PyTorch, scikit-learn, Pandas, NumPy, Jupyter, Git
Visualization: Tableau, Power BI, Matplotlib, Seaborn, D3.js
Database: MySQL, PostgreSQL, MongoDB, Neo4j
Cloud: AWS (SageMaker, S3, EC2), Google Cloud Platform, Docker
"""

def get_sample_job_description():
    """Return a sample job description for testing"""
    return """
Data Scientist
DataTech Solutions

About us: DataTech Solutions is a leading technology company specializing in AI-driven analytics solutions for enterprise clients. We are committed to innovation and excellence in delivering data-driven insights.

Responsibilities:
- Design, develop, and implement machine learning models to solve business problems
- Conduct exploratory data analysis and feature engineering 
- Create data visualizations and dashboards to communicate findings
- Collaborate with engineers to deploy models to production
- Stay current with the latest research and techniques in machine learning
- Participate in client meetings to understand business requirements

Requirements:
- 3+ years of experience in data science or related field
- Strong programming skills in Python and SQL
- Experience with machine learning frameworks such as TensorFlow or PyTorch
- Knowledge of statistical analysis and modeling techniques
- Excellent data visualization skills
- Experience with cloud platforms (AWS, GCP, or Azure)
- Strong communication and presentation skills
- Master's degree in Data Science, Computer Science, Statistics, or related field

Preferred Qualifications:
- Experience with NLP or computer vision projects
- Knowledge of big data technologies (Hadoop, Spark)
- Experience with A/B testing and experimental design
- Contribution to open-source projects or research publications
- Experience in a client-facing role
"""

if __name__ == "__main__":
    main() 