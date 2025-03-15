/**
 * Advanced Cover Letter Generator
 * This module provides utilities for parsing resumes and generating personalized cover letters
 */

export interface ResumeInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string[];
  experience: string;
  education: string;
  workHistory: string[];
  bio: string;
}

export interface JobAnalysis {
  requirements: string[];
  matchedSkills: string[];
  keyResponsibilities: string[];
  companyInsights: string;
}

/**
 * Extract detailed information from a resume using advanced pattern matching
 */
export async function extractResumeInfo(resumeText: string, userProfile: any): Promise<ResumeInfo> {
  console.log("Extracting resume info with enhanced pattern matching");
  
  // Use user profile data if available
  let name = userProfile?.name || "";
  let email = userProfile?.email || "";
  let phone = userProfile?.phone || "";
  let address = userProfile?.address || "";
  let bio = userProfile?.bio || "";
  
  // If profile data is missing, try to extract from resume
  if (!name) {
    // Try to extract name from resume
    const nameRegex = /([A-Z][a-z]+ [A-Z][a-z]+)/;
    const nameMatch = resumeText.match(nameRegex);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1];
    }
  }
  
  if (!email) {
    // Extract email using regex
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const emailMatches = resumeText.match(emailRegex);
    if (emailMatches && emailMatches.length > 0) {
      email = emailMatches[0];
    }
  }
  
  if (!phone) {
    // Extract phone number using multiple regex patterns
    const phoneRegexes = [
      /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g, // Standard US format
      /\d{10}/g, // 10 digit number
      /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g, // XXX-XXX-XXXX
      /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g, // (XXX) XXX-XXXX
    ];
    
    for (const regex of phoneRegexes) {
      const phoneMatches = resumeText.match(regex);
      if (phoneMatches && phoneMatches.length > 0) {
        phone = phoneMatches[0];
        break;
      }
    }
  }
  
  if (!address) {
    // Enhanced address extraction
    const addressLines = resumeText.split('\n').filter(line => 
      line.includes("Street") || 
      line.includes("Avenue") || 
      line.includes("Road") ||
      line.includes("Lane") ||
      line.includes("Drive") ||
      line.includes("Blvd") ||
      line.includes("NY") ||
      line.includes("New York") ||
      /\b[A-Z]{2}\s+\d{5}\b/.test(line) // US ZIP code pattern
    );
    
    if (addressLines.length > 0) {
      address = addressLines[0].trim();
    }
  }
  
  // Extract skills from resume text - comprehensive list
  const skillsKeywords = [
    // Technical Skills
    "Python", "R", "SQL", "Java", "JavaScript", "TypeScript", "C++", "C#", "PHP", "Ruby",
    "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask",
    "Spring Boot", "ASP.NET", "Ruby on Rails", "jQuery", "Bootstrap", "Tailwind CSS",
    
    // Data Skills
    "Data Analysis", "Data Science", "Machine Learning", "Deep Learning", "NLP", 
    "Computer Vision", "Statistics", "Statistical Analysis", "Hypothesis Testing",
    "A/B Testing", "Data Mining", "Data Visualization", "Data Modeling", "ETL",
    "Data Warehousing", "Big Data", "Data Engineering", "Data Pipelines",
    
    // Data Tools
    "Tableau", "Power BI", "Excel", "Google Sheets", "Looker", "Qlik", "D3.js",
    "SPSS", "SAS", "MATLAB", "Pandas", "NumPy", "SciPy", "Scikit-learn", "TensorFlow",
    "PyTorch", "Keras", "Hadoop", "Spark", "Hive", "Pig", "Kafka", "Airflow",
    
    // Cloud & DevOps
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "CI/CD",
    "Git", "GitHub", "GitLab", "Bitbucket", "Terraform", "Ansible", "Puppet", "Chef",
    
    // Databases
    "MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQL Server", "SQLite", "Redis",
    "Cassandra", "DynamoDB", "Elasticsearch", "Neo4j", "GraphQL", "NoSQL",
    
    // Soft Skills
    "Communication", "Teamwork", "Leadership", "Problem Solving", "Critical Thinking",
    "Time Management", "Project Management", "Agile", "Scrum", "Kanban", "JIRA",
    "Presentation", "Research", "Analysis", "Attention to Detail", "Creativity"
  ];
  
  // Find skills mentioned in the resume (case insensitive)
  const resumeTextLower = resumeText.toLowerCase();
  const skills = skillsKeywords.filter(skill => 
    resumeTextLower.includes(skill.toLowerCase())
  );
  
  // If no skills found, use default skills
  if (skills.length === 0) {
    skills.push("Data Analysis", "Python", "SQL", "Machine Learning", "Data Visualization");
  }
  
  // Extract years of experience
  let experience = "";
  const expRegexes = [
    /(\d+)\s*(?:years?|yrs?)(?:\s*of)?\s*experience/i,
    /experience\s*(?:of|:)?\s*(\d+)\s*(?:years?|yrs?)/i,
    /(\d+)\+\s*(?:years?|yrs?)/i
  ];
  
  for (const regex of expRegexes) {
    const expMatch = resumeText.match(regex);
    if (expMatch && expMatch[1]) {
      const years = parseInt(expMatch[1]);
      experience = `${years} years of experience`;
      break;
    }
  }
  
  if (!experience) {
    // Default experience if not found
    experience = "experienced professional";
  }
  
  // Extract education information
  const educationKeywords = [
    "Master", "Masters", "MS", "M.S.", "MBA", "Bachelor", "Bachelors", "BS", "B.S.", 
    "PhD", "Ph.D.", "Doctorate", "Degree", "University", "College", "School", 
    "Stony Brook", "Computer Science", "Data Science", "Statistics", "Mathematics"
  ];
  
  let education = "";
  const educationRegex = new RegExp(`((?:${educationKeywords.join('|')})(?:[^.]*))`, 'i');
  const educationMatch = resumeText.match(educationRegex);
  
  if (educationMatch && educationMatch[1]) {
    education = educationMatch[1].trim();
  } else {
    // Try line-by-line approach
    const educationLines = resumeText.split('\n').filter(line => 
      educationKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    if (educationLines.length > 0) {
      education = educationLines[0].trim();
    }
  }
  
  // Extract work history
  const workHistoryKeywords = ["Experience", "Employment", "Work History", "Professional Experience"];
  const workHistoryRegex = new RegExp(`(${workHistoryKeywords.join('|')})`, 'i');
  
  let workHistory: string[] = [];
  const lines = resumeText.split('\n');
  let inWorkSection = false;
  let currentPosition = "";
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (workHistoryRegex.test(line)) {
      inWorkSection = true;
      continue;
    }
    
    if (inWorkSection) {
      if (line === "" && currentPosition !== "") {
        workHistory.push(currentPosition);
        currentPosition = "";
      } else if (line !== "") {
        if (currentPosition === "") {
          currentPosition = line;
        } else {
          currentPosition += " " + line;
        }
      }
      
      // Exit work section if we hit another major section
      if (line.match(/^(Education|Skills|Projects|References)/i)) {
        inWorkSection = false;
      }
    }
  }
  
  // Add the last position if we have one
  if (currentPosition !== "") {
    workHistory.push(currentPosition);
  }
  
  // Limit work history to 3 entries
  workHistory = workHistory.slice(0, 3);
  
  // If no work history found, create a placeholder
  if (workHistory.length === 0) {
    workHistory.push("Professional experience in data analysis and visualization");
  }
  
  // Extract professional summary/bio if not in profile
  if (!bio) {
    const summaryKeywords = ["Summary", "Profile", "Objective", "About Me"];
    const summaryRegex = new RegExp(`(${summaryKeywords.join('|')})`, 'i');
    
    let inSummarySection = false;
    let summary = "";
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (summaryRegex.test(line)) {
        inSummarySection = true;
        continue;
      }
      
      if (inSummarySection) {
        if (line === "") {
          break; // End of summary section
        } else {
          summary += line + " ";
        }
        
        // Exit summary section if we hit another major section
        if (line.match(/^(Experience|Education|Skills|Projects|References)/i)) {
          inSummarySection = false;
        }
      }
    }
    
    bio = summary.trim();
  }
  
  console.log("Extracted user info:", { name, email, phone, address, skills, experience, education, workHistory, bio });
  
  return {
    name,
    email,
    phone,
    address,
    skills,
    experience,
    education,
    workHistory,
    bio
  };
}

/**
 * Analyze job description and match with resume
 */
export function analyzeJob(jobDescription: string, resumeInfo: ResumeInfo): JobAnalysis {
  console.log("Analyzing job description with enhanced pattern matching");
  
  const jobDescLower = jobDescription.toLowerCase();
  
  // Extract key requirements from job description
  const requirementsKeywords = [
    // Technical Skills
    "python", "r", "sql", "java", "javascript", "typescript", "c++", "c#", "php", "ruby",
    "html", "css", "react", "angular", "vue.js", "node.js", "express", "django", "flask",
    
    // Data Skills
    "data analysis", "data science", "machine learning", "deep learning", "nlp", 
    "computer vision", "statistics", "statistical analysis", "hypothesis testing",
    "a/b testing", "data mining", "data visualization", "data modeling", "etl",
    
    // Data Tools
    "tableau", "power bi", "excel", "google sheets", "looker", "qlik", "d3.js",
    "spss", "sas", "matlab", "pandas", "numpy", "scipy", "scikit-learn", "tensorflow",
    
    // Cloud & DevOps
    "aws", "azure", "google cloud", "docker", "kubernetes", "jenkins", "ci/cd",
    "git", "github", "gitlab", "bitbucket",
    
    // Databases
    "mysql", "postgresql", "mongodb", "oracle", "sql server", "sqlite", "redis",
    
    // Soft Skills
    "communication", "teamwork", "leadership", "problem solving", "critical thinking",
    "time management", "project management", "agile", "scrum", "kanban", "jira"
  ];
  
  // Find requirements mentioned in the job description
  const requirements = requirementsKeywords.filter(req => 
    jobDescLower.includes(req)
  );
  
  // Match resume skills with job requirements (case insensitive)
  const matchedSkills = resumeInfo.skills.filter(skill => 
    requirements.some(req => req.toLowerCase() === skill.toLowerCase())
  );
  
  // If no matches found, use the first 3 skills from resume
  if (matchedSkills.length === 0) {
    matchedSkills.push(...resumeInfo.skills.slice(0, 3));
  }
  
  // Extract key responsibilities
  const responsibilityPatterns = [
    /responsibilities include(.*?)(?:\.|$)/i,
    /you will(.*?)(?:\.|$)/i,
    /duties include(.*?)(?:\.|$)/i,
    /responsibilities:(.*?)(?:\.|$)/i,
    /what you'll do:(.*?)(?:\.|$)/i
  ];
  
  let keyResponsibilities: string[] = [];
  
  for (const pattern of responsibilityPatterns) {
    const matches = jobDescription.match(pattern);
    if (matches && matches[1]) {
      const responsibilities = matches[1].split(/[,;]/).map(r => r.trim());
      keyResponsibilities.push(...responsibilities.filter(r => r.length > 10));
    }
  }
  
  // If no responsibilities found, extract sentences with action verbs
  if (keyResponsibilities.length === 0) {
    const actionVerbs = ["analyze", "develop", "create", "design", "implement", "manage", "build", "collaborate", "communicate", "report"];
    const sentences = jobDescription.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      if (actionVerbs.some(verb => sentence.toLowerCase().includes(verb))) {
        keyResponsibilities.push(sentence.trim());
      }
      
      if (keyResponsibilities.length >= 3) break;
    }
  }
  
  // Limit to 3 responsibilities
  keyResponsibilities = keyResponsibilities.slice(0, 3);
  
  // Extract company insights
  let companyInsights = "";
  
  // Look for company description patterns
  const companyPatterns = [
    /about us:(.*?)(?:\.|$)/i,
    /about the company:(.*?)(?:\.|$)/i,
    /our company:(.*?)(?:\.|$)/i,
    /we are(.*?)(?:\.|$)/i,
    /company overview:(.*?)(?:\.|$)/i
  ];
  
  for (const pattern of companyPatterns) {
    const matches = jobDescription.match(pattern);
    if (matches && matches[1]) {
      companyInsights = matches[1].trim();
      break;
    }
  }
  
  // If no company insights found, create a generic one
  if (!companyInsights) {
    companyInsights = `${jobDescription.split(' ')[0]}'s commitment to excellence and innovation in the industry`;
  }
  
  return {
    requirements,
    matchedSkills,
    keyResponsibilities,
    companyInsights
  };
}

/**
 * Generate a cover letter using templates and pattern matching
 */
export function generateCoverLetter(
  resumeInfo: ResumeInfo,
  jobInfo: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
  },
  jobAnalysis: JobAnalysis,
  specialInstructions?: string,
  templateStyle = "professional"
): string {
  console.log("Generating cover letter with enhanced template system");
  
  // Choose template based on style
  switch (templateStyle) {
    case "modern":
      return generateModernTemplate(resumeInfo, jobInfo, jobAnalysis, specialInstructions);
    case "creative":
      return generateCreativeTemplate(resumeInfo, jobInfo, jobAnalysis, specialInstructions);
    case "traditional":
      return generateTraditionalTemplate(resumeInfo, jobInfo, jobAnalysis, specialInstructions);
    case "professional":
    default:
      return generateProfessionalTemplate(resumeInfo, jobInfo, jobAnalysis, specialInstructions);
  }
}

function generateProfessionalTemplate(
  resumeInfo: ResumeInfo,
  jobInfo: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
  },
  jobAnalysis: JobAnalysis,
  specialInstructions?: string
): string {
  const { name, email, phone, address, skills, experience, education, workHistory, bio } = resumeInfo;
  const { companyName, jobTitle } = jobInfo;
  const { matchedSkills, keyResponsibilities, companyInsights } = jobAnalysis;
  
  // Format the date properly
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  // Generate personalized content
  const skillsHighlight = matchedSkills.length > 0 
    ? matchedSkills.join(", ") 
    : skills.slice(0, 3).join(", ");
  
  // Generate relevant experience statement
  let relevantExperience = "";
  if (bio && bio.trim() !== "") {
    relevantExperience = bio;
  } else if (workHistory.length > 0) {
    relevantExperience = `Throughout my career, I have ${workHistory[0].toLowerCase()}`;
  } else {
    relevantExperience = "Throughout my career, I have developed strong analytical skills and the ability to translate complex data into actionable insights";
  }
  
  // Include education if available
  let educationText = "";
  if (education && education.trim() !== "") {
    educationText = `\n\nWith my ${education}, I have developed a strong foundation in theoretical concepts and practical applications that are directly relevant to this role.`;
  }
  
  // Handle special instructions
  let specialInstructionsText = "";
  if (specialInstructions && specialInstructions.toLowerCase() !== "none" && specialInstructions.trim() !== "") {
    specialInstructionsText = `\n\n${specialInstructions}`;
  }
  
  // Generate responsibilities paragraph
  let responsibilitiesText = "";
  if (keyResponsibilities.length > 0) {
    responsibilitiesText = `\n\nIn this role, I understand that you are looking for someone who can ${keyResponsibilities.join(", and ")}. My background has prepared me well for these responsibilities, and I am eager to apply my skills to contribute to your team's success.`;
  }
  
  return `
${name}
${address}
${email}
${phone}
${formattedDate}

Hiring Manager
${companyName}
[Company Address]

Dear Hiring Manager,

I am excited to apply for the ${jobTitle} position at ${companyName}. With my background in ${skillsHighlight} and ${experience}, I am confident in my ability to make valuable contributions to your team.${educationText}

${relevantExperience}.${responsibilitiesText}

I am particularly impressed by ${companyInsights}. My experience with ${skills[0]} positions me uniquely to contribute to your projects, and I am eager to bring my expertise to your esteemed organization.${specialInstructionsText}

I would welcome the opportunity to discuss how my qualifications align with your needs for the ${jobTitle} position. I am available at your convenience and can be reached at ${phone} or ${email}.

Thank you for considering my application. I look forward to the possibility of contributing to ${companyName}'s continued success.

Sincerely,

${name}
  `.trim();
}

function generateModernTemplate(
  resumeInfo: ResumeInfo,
  jobInfo: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
  },
  jobAnalysis: JobAnalysis,
  specialInstructions?: string
): string {
  const { name, email, phone, skills, experience, education, workHistory, bio } = resumeInfo;
  const { companyName, jobTitle } = jobInfo;
  const { matchedSkills, keyResponsibilities, companyInsights } = jobAnalysis;
  
  // Format the date properly
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  // Generate personalized content
  const skillsHighlight = matchedSkills.length > 0 
    ? matchedSkills.join(", ") 
    : skills.slice(0, 3).join(", ");
  
  // Use bio if available for personal statement
  let personalStatement = "";
  if (bio && bio.trim() !== "") {
    personalStatement = bio;
  } else if (workHistory.length > 0) {
    personalStatement = workHistory[0];
  } else {
    personalStatement = "I am a data professional passionate about turning complex information into actionable insights";
  }
  
  // Include education if available
  let educationText = "";
  if (education && education.trim() !== "") {
    educationText = `• My ${education} has equipped me with the knowledge and skills necessary to excel in this role.`;
  }
  
  // Handle special instructions
  let specialInstructionsText = "";
  if (specialInstructions && specialInstructions.toLowerCase() !== "none" && specialInstructions.trim() !== "") {
    specialInstructionsText = `\n${specialInstructions}`;
  }
  
  // Generate key skills bullets
  const skillBullets = skills.slice(0, 3).map(skill => `• ${skill}`).join("\n");
  
  return `
${name}
${email} | ${phone} | LinkedIn: linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}

${formattedDate}

Dear ${companyName} Hiring Team,

RE: Application for ${jobTitle} Position

I'm excited to apply for the ${jobTitle} role at ${companyName}. Having researched your company's innovative work in the industry, I'm eager to bring my expertise in ${skillsHighlight} to your team.

KEY QUALIFICATIONS:
• ${personalStatement}
${educationText}
• ${experience} with a focus on ${skills[0]} and ${skills[1] || "data analysis"}

RELEVANT SKILLS:
${skillBullets}${specialInstructionsText}

What draws me to ${companyName} is ${companyInsights}. I believe my experience aligns perfectly with your needs for this role, and I'm particularly interested in contributing to ${keyResponsibilities[0] || "your data-driven initiatives"}.

I welcome the opportunity to discuss how my background matches your requirements. Please feel free to contact me at ${email} or ${phone} to arrange a conversation.

Thank you for your consideration.

Best regards,

${name}
  `.trim();
}

function generateCreativeTemplate(
  resumeInfo: ResumeInfo,
  jobInfo: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
  },
  jobAnalysis: JobAnalysis,
  specialInstructions?: string
): string {
  const { name, email, phone, skills, experience, education, workHistory } = resumeInfo;
  const { companyName, jobTitle } = jobInfo;
  const { matchedSkills, keyResponsibilities } = jobAnalysis;
  
  // Format the date properly
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  // Generate unique skills based on experience and job description
  const uniqueSkills = [
    `Ability to transform complex data into actionable insights using ${skills[0]}`,
    `Experience with ${matchedSkills[0] || skills[1] || "advanced analytics"} to drive business decisions`,
    `Strong problem-solving skills with a focus on ${matchedSkills[1] || skills[2] || "data-driven solutions"}`
  ];
  
  // Handle special instructions
  let specialInstructionsText = "";
  if (specialInstructions && specialInstructions.toLowerCase() !== "none" && specialInstructions.trim() !== "") {
    specialInstructionsText = `\nSPECIAL NOTE: ${specialInstructions}\n`;
  }
  
  // Include education if available
  let educationText = "";
  if (education && education.trim() !== "") {
    educationText = `\nMy ${education} has given me a solid foundation in ${matchedSkills[0] || skills[0]}.`;
  }
  
  // Include work history if available
  let workHistoryText = "";
  if (workHistory.length > 0) {
    workHistoryText = `\nMy experience includes: ${workHistory[0]}`;
  }
  
  return `
${name.toUpperCase()}
${email} • ${phone} • Portfolio: ${name.toLowerCase().replace(/\s+/g, '')}.com

${formattedDate}

Hello ${companyName} Team!

When I discovered the ${jobTitle} opportunity at ${companyName}, I knew it was the perfect chance to combine my passion for ${matchedSkills[0] || skills[0]} with my skills in ${skills.slice(0, 2).join(" and ")}.${educationText}${workHistoryText}

WHY I'M EXCITED ABOUT ${companyName.toUpperCase()}:
I've been following your work and am impressed by your approach to innovation and excellence. The prospect of contributing to such forward-thinking projects is thrilling.

WHAT I BRING TO THE TABLE:
• ${uniqueSkills[0]}
• ${uniqueSkills[1]}
• ${uniqueSkills[2]}
• ${experience} ready to make an immediate impact${specialInstructionsText}

I'd love to show you how my creative approach and technical abilities can help ${companyName} continue to excel in ${keyResponsibilities[0] || "data analysis and insights"}. Let's schedule a time to talk about how we might work together!

Creatively yours,

${name}
  `.trim();
}

function generateTraditionalTemplate(
  resumeInfo: ResumeInfo,
  jobInfo: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
  },
  jobAnalysis: JobAnalysis,
  specialInstructions?: string
): string {
  const { name, email, phone, address, skills, experience, education, workHistory } = resumeInfo;
  const { companyName, jobTitle } = jobInfo;
  const { matchedSkills } = jobAnalysis;
  
  // Format the date properly
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  // Generate relevant skills based on job description
  const relevantSkills = matchedSkills.length > 0 ? matchedSkills : skills.slice(0, 3);
  
  // Handle special instructions
  let specialInstructionsText = "";
  if (specialInstructions && specialInstructions.toLowerCase() !== "none" && specialInstructions.trim() !== "") {
    specialInstructionsText = `\nI would like to note that ${specialInstructions}\n`;
  }
  
  // Include education if available
  let educationText = "";
  if (education && education.trim() !== "") {
    educationText = `\n\nMy educational background includes ${education}, which has provided me with a strong foundation in ${relevantSkills[0]}.`;
  }
  
  // Include work history if available
  let workHistoryText = "";
  if (workHistory.length > 0) {
    workHistoryText = `\n\nMy professional experience includes ${workHistory[0]}.`;
  }
  
  return `
${name}
${address}
${email}
${phone}

${formattedDate}

Hiring Manager
${companyName}
[Company Address]

Dear Hiring Manager:

Please accept my application for the position of ${jobTitle} at ${companyName}, as advertised. With ${experience}, I believe my qualifications make me an excellent candidate for this role.

Throughout my professional career, I have developed strong skills in ${relevantSkills.join(", ")}, and ${skills[0]}. In my current position, I have consistently demonstrated the ability to deliver results and contribute to team success.${workHistoryText}${educationText}${specialInstructionsText}

I am particularly interested in joining ${companyName} because of your reputation for excellence in the industry. I am confident that my experience in ${skills.slice(0, 2).join(" and ")} would allow me to make a valuable contribution to your team.

Thank you for your time and consideration. I look forward to the opportunity to further discuss my qualifications in an interview. I can be reached at ${phone} or ${email}.

Sincerely,

${name}
  `.trim();
} 