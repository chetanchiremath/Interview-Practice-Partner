// Role-Specific Interview Prompts
// These define the context and questions for different job roles

const ROLE_PROMPTS = {
  SOFTWARE_ENGINEER: {
    context: `You're interviewing for a Software Engineer position. Have a natural conversation about:
- Their technical problem-solving journey (with real examples!)
- Coding experiences - what they've built, what they're proud of
- How they think about system design and architecture
- Collaboration stories - working with teams, handling conflicts
- Past projects - dig into interesting technical decisions they've made

Be conversational: "Oh, I'd love to hear more about that!" or "That's fascinating - what made you choose that approach?"`,
    
    sampleQuestions: [
      "Tell me about a challenging technical problem you've solved recently.",
      "How do you approach debugging a complex issue in production?",
      "Describe your experience with version control and collaborative development.",
      "Walk me through how you would design a scalable web application.",
      "What's your process for learning new technologies or frameworks?",
    ],
    
    evaluationCriteria: [
      "Technical depth and accuracy",
      "Problem-solving approach",
      "Communication of complex concepts",
      "Code quality awareness",
      "Collaboration mindset",
    ],
  },

  SALES_REPRESENTATIVE: {
    context: `You're interviewing for a Sales Representative position. Have a friendly conversation about:
- Their communication style - how they connect with customers (ask for stories!)
- Relationship building - "Tell me about a customer relationship you're proud of"
- How they handle rejection and difficult conversations
- Their wins - hitting targets, big deals they've closed
- How they learn about products and present them

React naturally: "That's impressive!" or "I can tell you're passionate about this!"`,
    
    sampleQuestions: [
      "Tell me about a time you closed a difficult sale.",
      "How do you handle rejection from potential clients?",
      "Describe your approach to building long-term customer relationships.",
      "Walk me through how you would sell our product to a skeptical customer.",
      "How do you prioritize your leads and manage your sales pipeline?",
    ],
    
    evaluationCriteria: [
      "Persuasion and influence",
      "Confidence and enthusiasm",
      "Resilience and persistence",
      "Customer-centric thinking",
      "Results orientation",
    ],
  },

  RETAIL_ASSOCIATE: {
    context: `You are interviewing for a Retail Associate position. Focus on:
- Customer service excellence
- Handling difficult situations
- Team collaboration
- Product knowledge
- Work ethic and reliability`,
    
    sampleQuestions: [
      "Tell me about a time you provided excellent customer service.",
      "How would you handle an angry or upset customer?",
      "Describe a situation where you had to work as part of a team.",
      "What would you do if a customer asked about a product you're unfamiliar with?",
      "How do you stay motivated during slow periods or repetitive tasks?",
    ],
    
    evaluationCriteria: [
      "Customer service attitude",
      "Conflict resolution",
      "Teamwork and collaboration",
      "Adaptability",
      "Reliability and work ethic",
    ],
  },

  PRODUCT_MANAGER: {
    context: `You are interviewing for a Product Manager position. Focus on:
- Product strategy and vision
- Stakeholder management
- Data-driven decision making
- User empathy and research
- Cross-functional leadership`,
    
    sampleQuestions: [
      "Tell me about a product you've managed from conception to launch.",
      "How do you prioritize features when you have limited resources?",
      "Describe a time you had to make a difficult trade-off decision.",
      "How do you gather and incorporate user feedback into your product roadmap?",
      "Walk me through how you would improve a product you use daily.",
    ],
    
    evaluationCriteria: [
      "Strategic thinking",
      "User-centric approach",
      "Data and analytics skills",
      "Communication and influence",
      "Execution and delivery",
    ],
  },

  DATA_ANALYST: {
    context: `You are interviewing for a Data Analyst position. Focus on:
- Data analysis and interpretation
- Statistical knowledge
- Tool proficiency (SQL, Excel, Python, etc.)
- Business insight generation
- Data visualization and communication`,
    
    sampleQuestions: [
      "Describe a time when you used data to solve a business problem.",
      "How do you ensure the accuracy and quality of your data analysis?",
      "Walk me through your process for creating a dashboard or report.",
      "Tell me about a time when your analysis led to an important business decision.",
      "How do you explain complex data findings to non-technical stakeholders?",
    ],
    
    evaluationCriteria: [
      "Analytical thinking",
      "Technical proficiency",
      "Business acumen",
      "Communication clarity",
      "Attention to detail",
    ],
  },

  MARKETING_MANAGER: {
    context: `You are interviewing for a Marketing Manager position. Focus on:
- Marketing strategy and campaigns
- Brand management
- Digital marketing channels
- Analytics and ROI
- Creative thinking`,
    
    sampleQuestions: [
      "Tell me about a successful marketing campaign you've led.",
      "How do you measure the success of your marketing initiatives?",
      "Describe your approach to understanding your target audience.",
      "How do you stay current with marketing trends and technologies?",
      "Walk me through how you would launch a new product to market.",
    ],
    
    evaluationCriteria: [
      "Strategic marketing thinking",
      "Creativity and innovation",
      "Data-driven approach",
      "Multi-channel expertise",
      "Results measurement",
    ],
  },
};

module.exports = ROLE_PROMPTS;

