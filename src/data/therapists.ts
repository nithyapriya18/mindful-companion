export interface Therapist {
  id: string;
  name: string;
  credentials: string;
  title: string;
  photoUrl: string;
  specializations: string[];
  approach: string;
  personalityTraits: string[];
  style: string;
  description: string;
  experience: string;
  sampleGreeting: string;
}

export const therapists: Therapist[] = [
  {
    id: "dr-sarah-chen",
    name: "Dr. Sarah Chen",
    credentials: "Ph.D., Licensed Clinical Psychologist",
    title: "Clinical Psychologist",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    specializations: ["Anxiety", "Depression", "Life Transitions", "Work Stress"],
    approach: "Cognitive Behavioral Therapy",
    personalityTraits: ["Warm", "Analytical", "Patient"],
    style: "warm-analytical",
    description: "Dr. Chen combines warmth with evidence-based approaches to help you understand and reshape thought patterns. She creates a safe space for exploration while providing practical tools for real change.",
    experience: "15+ years of clinical experience",
    sampleGreeting: "Welcome. I'm glad you're here. Whatever you're experiencing, we'll work through it together at your pace."
  },
  {
    id: "dr-marcus-williams",
    name: "Dr. Marcus Williams",
    credentials: "Psy.D., Licensed Counseling Psychologist",
    title: "Counseling Psychologist",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    specializations: ["Trauma", "Relationships", "Self-Esteem", "Identity"],
    approach: "Humanistic & Person-Centered",
    personalityTraits: ["Empathetic", "Grounded", "Supportive"],
    style: "empathetic-grounded",
    description: "Dr. Williams believes in your innate capacity for growth and healing. His person-centered approach focuses on understanding your unique experience and supporting your journey toward self-discovery.",
    experience: "12+ years of clinical experience",
    sampleGreeting: "Hello, and welcome. You've taken an important step by being here. I'm here to listen and support you however you need."
  },
  {
    id: "dr-elena-rodriguez",
    name: "Dr. Elena Rodriguez",
    credentials: "Ph.D., LMFT",
    title: "Marriage & Family Therapist",
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    specializations: ["Relationship Issues", "Family Dynamics", "Communication", "Grief"],
    approach: "Systems Therapy & Emotionally Focused",
    personalityTraits: ["Compassionate", "Insightful", "Direct"],
    style: "compassionate-direct",
    description: "Dr. Rodriguez specializes in understanding the complex dynamics of relationships and family systems. She helps you navigate emotional connections with clarity and compassion.",
    experience: "18+ years of clinical experience",
    sampleGreeting: "Hello! I'm excited to get to know you. Relationships shape so much of our lives—let's explore what's on your mind together."
  },
  {
    id: "dr-james-oconnor",
    name: "Dr. James O'Connor",
    credentials: "M.D., Psychiatrist",
    title: "Psychiatrist",
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
    specializations: ["Mood Disorders", "ADHD", "Stress Management", "Sleep Issues"],
    approach: "Integrative Psychiatry",
    personalityTraits: ["Methodical", "Calm", "Thorough"],
    style: "methodical-calm",
    description: "Dr. O'Connor takes a holistic view of mental health, considering biological, psychological, and social factors. His calm, methodical approach helps you understand the full picture of your wellbeing.",
    experience: "20+ years of clinical experience",
    sampleGreeting: "Good to meet you. Mental health is multifaceted, and I'm here to help you understand and address all aspects of what you're experiencing."
  },
  {
    id: "dr-maya-patel",
    name: "Dr. Maya Patel",
    credentials: "Ph.D., Licensed Clinical Psychologist",
    title: "Clinical Psychologist",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    specializations: ["Mindfulness", "Anxiety", "Burnout", "Personal Growth"],
    approach: "Mindfulness-Based & ACT",
    personalityTraits: ["Serene", "Encouraging", "Present"],
    style: "serene-encouraging",
    description: "Dr. Patel integrates mindfulness practices with acceptance and commitment therapy. She helps you develop present-moment awareness and align your actions with your deepest values.",
    experience: "10+ years of clinical experience",
    sampleGreeting: "Welcome. I believe in meeting each moment with openness and curiosity. Let's explore what's present for you right now."
  },
  {
    id: "dr-david-kim",
    name: "Dr. David Kim",
    credentials: "Psy.D., Licensed Psychologist",
    title: "Clinical Psychologist",
    photoUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    specializations: ["Career Issues", "Life Purpose", "Motivation", "Performance"],
    approach: "Solution-Focused & Strengths-Based",
    personalityTraits: ["Energetic", "Practical", "Motivating"],
    style: "energetic-practical",
    description: "Dr. Kim focuses on solutions and building on your existing strengths. His energetic, action-oriented approach helps you move from stuck to thriving with practical strategies.",
    experience: "8+ years of clinical experience",
    sampleGreeting: "Hey! Great to connect with you. I'm all about finding what works and building momentum. What would you like to tackle today?"
  }
];

export const approachFilters = [
  "All Approaches",
  "Cognitive Behavioral Therapy",
  "Humanistic & Person-Centered",
  "Systems Therapy & Emotionally Focused",
  "Integrative Psychiatry",
  "Mindfulness-Based & ACT",
  "Solution-Focused & Strengths-Based"
];

export const specialtyFilters = [
  "All Specialties",
  "Anxiety",
  "Depression",
  "Trauma",
  "Relationships",
  "Work Stress",
  "Grief",
  "ADHD",
  "Mindfulness",
  "Personal Growth"
];
