export type Language = 'en' | 'hi';

export const translations = {
  en: {
    brand: "TerraAlert",
    subBrand: "National Landslide Early Warning & Risk Intelligence System",
    govBadge: "Government of India | NDMA / SDMA Network",
    emergencyHelpline: "Emergency Control: 1070 | State Disaster: 1077 | Police/Ambulance: 112",
    nav: {
      overview: "Overview",
      dashboard: "GIS Map & Command",
      predict: "AI Risk Prediction",
      report: "Citizen Reporting",
      alerts: "Emergency Alerts",
      analytics: "Analytics & Trends",
      admin: "Operations HQ",
      login: "Login",
      register: "Register"
    },
    metrics: {
      activeAlerts: "Active Red/Orange Alerts",
      highRiskZones: "High Risk Hotspots",
      pendingIncidents: "Incidents Pending Triage",
      connectedVillages: "Connected Hill Villages",
      liveSensors: "IoT Sensors Online"
    },
    risk: {
      safe: "Safe / Low Risk",
      medium: "Medium / Moderate Risk",
      high: "Critical / High Risk",
      confidence: "Model Confidence",
      factorOfSafety: "Factor of Safety (Fs)",
      evacuationUrgency: "Evacuation Protocol"
    },
    actions: {
      runPrediction: "Execute AI Risk Analysis",
      reportHazard: "Report Hill Hazard",
      soundSiren: "Emergency Siren Simulator",
      exportSitRep: "Download Situation Report (PDF)",
      verifyIncident: "Verify Incident",
      resolveIncident: "Mark as Resolved",
      broadcastAlert: "Broadcast Emergency Blast"
    }
  },
  hi: {
    brand: "टेराअलर्ट (TerraAlert)",
    subBrand: "राष्ट्रीय भूस्खलन पूर्व चेतावनी एवं जोखिम निगरानी प्रणाली",
    govBadge: "भारत सरकार | राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA)",
    emergencyHelpline: "आपातकालीन नियंत्रण: 1070 | राज्य आपदा: 1077 | आपातकाल: 112",
    nav: {
      overview: "अवलोकन (Overview)",
      dashboard: "जीआईएस मानचित्र और नियंत्रण",
      predict: "एआई जोखिम पूर्वानुमान",
      report: "नागरिक रिपोर्टिंग",
      alerts: "आपातकालीन अलर्ट",
      analytics: "विश्लेषण एवं रुझान",
      admin: "आपदा संचालन केंद्र",
      login: "लॉग इन",
      register: "पंजीकरण"
    },
    metrics: {
      activeAlerts: "सक्रिय रेड/ऑरेंज अलर्ट",
      highRiskZones: "अति संवेदनशील हॉटस्पॉट",
      pendingIncidents: "समीक्षा हेतु लंबित घटनाएं",
      connectedVillages: "संबद्ध पर्वतीय गांव",
      liveSensors: "सक्रिय IoT सेंसर"
    },
    risk: {
      safe: "सुरक्षित / कम जोखिम",
      medium: "मध्यम जोखिम / निगरानी",
      high: "अति संवेदनशील / गंभीर जोखिम",
      confidence: "मॉडल विश्वसनीयता",
      factorOfSafety: "सुरक्षा कारक (Fs)",
      evacuationUrgency: "निकासी प्रोटोकॉल"
    },
    actions: {
      runPrediction: "एआई जोखिम विश्लेषण चलाएं",
      reportHazard: "आपदा की रिपोर्ट करें",
      soundSiren: "आपातकालीन सायरन सिम्युलेटर",
      exportSitRep: "स्थिति रिपोर्ट डाउनलोड करें (PDF)",
      verifyIncident: "घटना सत्यापित करें",
      resolveIncident: "समाधान चिह्नित करें",
      broadcastAlert: "आपातकालीन अलर्ट प्रसारित करें"
    }
  }
};
