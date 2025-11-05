export const STATUS_FLOW = [
  "Overview",
  "Under Review",
  "Matched",
  "Approved",
  "In Execution",
  "Completed",
];

export const PROJECT_FLOW = [
  "Submitted",
  "Reviewed",
  "Matched",
  "Financing",
  "Contract Signed",
  "Installation",
  "Testing",
  "Completed",
];

export const MOCK_COMPANIES = [
  { id: "sunrise-solar", name: "Sunrise Solar", size: "500 kWp", cost: "$420,000", warranty: "10 years", timeline: "90 days", score: 4.8 },
  { id: "qatar-green-tech", name: "Qatar Green Tech", size: "450 kWp", cost: "$399,000", warranty: "8 years", timeline: "75 days", score: 4.6 },
  { id: "desert-sun-epc", name: "Desert Sun EPC", size: "520 kWp", cost: "$445,000", warranty: "12 years", timeline: "95 days", score: 4.7 },
];

export const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belgium","Brazil","Bulgaria","Canada","Chile","China","Colombia","Croatia","Cyprus","Czech Republic","Denmark","Egypt","Estonia","Finland","France","Germany","Greece","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Lithuania","Luxembourg","Malaysia","Malta","Mexico","Monaco","Morocco","Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan","Palestine","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Saudi Arabia","Serbia","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Thailand","Tunisia","Turkey","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen"
];

// Hero background image (can be overridden by setting window.__HERO_URL__ before this script runs)
export const HERO_URL = (typeof window !== 'undefined' && window.__HERO_URL__) ||
  "https://images.unsplash.com/photo-1592833159117-ac790d4066e4?q=80&w=1600&auto=format&fit=crop";