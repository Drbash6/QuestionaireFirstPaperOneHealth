export const OPTIONS = {
  "1": ["Yes", "No"],
  "2": ["Physician", "Nurse", "Public health practitioner", "Veterinarian", "Health administrator/manager", "Allied health professional", "Other"],
  "3": ["Public hospital/clinic", "Private hospital/clinic", "NGO/nonprofit", "Academic/research institution", "Government/health authority", "Other"],
  "4": ["Human health", "Animal health", "Environmental health", "Community health", "Occupational health"],
  "5": ["0-2", "3-5", "6-10", "11-15", "16+"],
  "6": ["Diploma", "Bachelor", "Master", "Doctorate", "Other"],
  "7": ["Female", "Male", "Non-binary/third gender", "Prefer not to say"],
  "9": [
    "A hospital-based model focusing only on human health",
    "A model integrating human, animal, and environmental health",
    "A veterinary public health model only",
    "A policy framework unrelated to health outcomes"
  ],
  "10": [
    "Joint surveillance of zoonotic diseases across human and animal sectors",
    "Isolated treatment of patients without environmental assessment",
    "Restricting health services to a single sector",
    "Focusing only on laboratory diagnostics"
  ],
  "11": ["SDG 3", "SDG 7", "SDG 12", "SDG 16"],
  "Barriers": [
    "Limited awareness or understanding",
    "Inadequate funding or staffing",
    "Lack of leadership support",
    "Weak intersectoral coordination",
    "Insufficient data or monitoring systems",
    "Cultural or social resistance",
    "Limited gender-sensitive policies",
    "Other"
  ]
};

export const CHECKBOX_QUESTIONS = ["4", "Barriers"];

export const LIKERT_SCALE = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Somewhat disagree" },
  { value: 4, label: "Neutral" },
  { value: 5, label: "Somewhat agree" },
  { value: 6, label: "Agree" },
  { value: 7, label: "Strongly agree" }
];

