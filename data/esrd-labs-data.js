// ESRD (End-Stage Renal Disease) Lab Data
export const esrdData = {
  patient: { 
    name: "John Smith", 
    dob: "01 Jan 1951", 
    mrn: "440955" 
  },
  snapshot: {
    critical: 3,
    warning: 4
  },
  labs: [
    { 
      id: "hgb",  
      label: "Hemoglobin",   
      unit: "g/dL",   
      values: [11, 10.5, 9.8, 9.1, 8.7, 8.2],  
      target: [10, 12], 
      status: "CRITICAL",  
      action: "Increase EPO dose; check iron studies" 
    },
    { 
      id: "k",    
      label: "Potassium",    
      unit: "mmol/L", 
      values: [4.5, 5.3, 4.8, 5.5, 5.9, 6.3], 
      target: [4, 6],  
      status: "CRITICAL",  
      action: "Dietary counselling; review meds; K⁺ binder" 
    },
    { 
      id: "phos", 
      label: "Phosphorus",   
      unit: "mg/dL",  
      values: [5.5, 5.7, 6.1, 6.4, 6.8, 7.2],  
      target: [3.5, 5.5], 
      status: "CRITICAL",  
      action: "Increase phosphate binder; dietary review" 
    },
    { 
      id: "ca",   
      label: "Calcium",      
      unit: "mg/dL",  
      values: [8.6, 8.7, 8.8, 8.9, 8.9, 8.8],  
      target: [8.4, 10.2], 
      status: "NORMAL",  
      action: "Continue current management" 
    },
    { 
      id: "alb",   
      label: "Albumin",      
      unit: "g/dL",  
      values: [3.8, 3.7, 3.6, 3.5, 3.4, 3.3],  
      target: [3.5, 5.0], 
      status: "WARNING",  
      action: "Nutritional assessment; protein supplementation" 
    },
    { 
      id: "pth",   
      label: "PTH",      
      unit: "pg/mL",  
      values: [280, 310, 350, 420, 480, 520],  
      target: [150, 300], 
      status: "WARNING",  
      action: "Review vitamin D therapy; consider calcimimetics" 
    },
    { 
      id: "ktv",   
      label: "Kt/V",      
      unit: "",  
      values: [1.3, 1.4, 1.35, 1.25, 1.2, 1.18],  
      target: [1.2, 2.0], 
      status: "WARNING",  
      action: "Evaluate dialysis adequacy; consider longer sessions" 
    }
  ],
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
};