// Sample parking locations data for different states and cities
export const sampleParkingLocations = [
  // Maharashtra - Mumbai
  { state: "Maharashtra", city: "Mumbai", location: "Phoenix Marketcity", locationType: "Mall", slotNumber: "A-101", floor: 1, vehicleType: "car", pricePerHour: 50, address: "Kurla West, Mumbai", features: ["CCTV", "24/7 Security"], isAvailable: true },
  { state: "Maharashtra", city: "Mumbai", location: "Phoenix Marketcity", locationType: "Mall", slotNumber: "A-102", floor: 1, vehicleType: "car", pricePerHour: 50, address: "Kurla West, Mumbai", features: ["CCTV", "24/7 Security"], isAvailable: true },
  { state: "Maharashtra", city: "Mumbai", location: "Lilavati Hospital", locationType: "Hospital", slotNumber: "B-201", floor: 2, vehicleType: "car", pricePerHour: 40, address: "Bandra West, Mumbai", features: ["Covered Parking"], isAvailable: true },
  { state: "Maharashtra", city: "Mumbai", location: "Chhatrapati Shivaji Airport", locationType: "Airport", slotNumber: "T1-301", floor: 3, vehicleType: "car", pricePerHour: 100, address: "Terminal 1, Mumbai Airport", features: ["Valet Service", "24/7 Security"], isAvailable: false },
  { state: "Maharashtra", city: "Mumbai", location: "Bandra Kurla Complex", locationType: "Office", slotNumber: "BKC-401", floor: 4, vehicleType: "car", pricePerHour: 60, address: "BKC, Mumbai", features: ["Covered", "EV Charging"], isAvailable: true },
  
  // Maharashtra - Pune
  { state: "Maharashtra", city: "Pune", location: "Phoenix Mall Pune", locationType: "Mall", slotNumber: "P-101", floor: 1, vehicleType: "car", pricePerHour: 40, address: "Viman Nagar, Pune", features: ["CCTV"], isAvailable: true },
  { state: "Maharashtra", city: "Pune", location: "Ruby Hall Clinic", locationType: "Hospital", slotNumber: "RH-201", floor: 2, vehicleType: "car", pricePerHour: 30, address: "Grant Road, Pune", features: ["Covered Parking"], isAvailable: true },
  { state: "Maharashtra", city: "Pune", location: "Pune Railway Station", locationType: "Railway Station", slotNumber: "RS-101", floor: 1, vehicleType: "bike", pricePerHour: 20, address: "Pune Junction", features: ["24/7 Access"], isAvailable: true },
  
  // Karnataka - Bangalore
  { state: "Karnataka", city: "Bangalore", location: "UB City Mall", locationType: "Mall", slotNumber: "UB-101", floor: 1, vehicleType: "car", pricePerHour: 60, address: "Vittal Mallya Road, Bangalore", features: ["Valet", "CCTV"], isAvailable: true },
  { state: "Karnataka", city: "Bangalore", location: "Manipal Hospital", locationType: "Hospital", slotNumber: "MH-301", floor: 3, vehicleType: "car", pricePerHour: 35, address: "HAL Airport Road, Bangalore", features: ["24/7 Security"], isAvailable: true },
  { state: "Karnataka", city: "Bangalore", location: "Kempegowda Airport", locationType: "Airport", slotNumber: "KIA-501", floor: 5, vehicleType: "car", pricePerHour: 120, address: "Devanahalli, Bangalore", features: ["Valet", "Long-term Parking"], isAvailable: true },
  { state: "Karnataka", city: "Bangalore", location: "Manyata Tech Park", locationType: "Office", slotNumber: "MTP-201", floor: 2, vehicleType: "bike", pricePerHour: 15, address: "Nagavara, Bangalore", features: ["Covered"], isAvailable: true },
  
  // Delhi
  { state: "Delhi", city: "New Delhi", location: "Select Citywalk", locationType: "Mall", slotNumber: "SC-101", floor: 1, vehicleType: "car", pricePerHour: 70, address: "Saket, New Delhi", features: ["Valet", "CCTV", "EV Charging"], isAvailable: true },
  { state: "Delhi", city: "New Delhi", location: "AIIMS Hospital", locationType: "Hospital", slotNumber: "AIIMS-401", floor: 4, vehicleType: "car", pricePerHour: 40, address: "Ansari Nagar, New Delhi", features: ["24/7 Security"], isAvailable: false },
  { state: "Delhi", city: "New Delhi", location: "Indira Gandhi Airport", locationType: "Airport", slotNumber: "T3-601", floor: 6, vehicleType: "car", pricePerHour: 150, address: "Terminal 3, IGI Airport", features: ["Valet", "24/7 Security"], isAvailable: true },
  { state: "Delhi", city: "New Delhi", location: "Connaught Place", locationType: "Office", slotNumber: "CP-301", floor: 3, vehicleType: "car", pricePerHour: 80, address: "Central Delhi", features: ["CCTV"], isAvailable: true },
  
  // Tamil Nadu - Chennai
  { state: "Tamil Nadu", city: "Chennai", location: "Express Avenue", locationType: "Mall", slotNumber: "EA-101", floor: 1, vehicleType: "car", pricePerHour: 50, address: "Royapettah, Chennai", features: ["CCTV", "Covered"], isAvailable: true },
  { state: "Tamil Nadu", city: "Chennai", location: "Apollo Hospital", locationType: "Hospital", slotNumber: "AP-201", floor: 2, vehicleType: "car", pricePerHour: 35, address: "Greams Road, Chennai", features: ["24/7 Access"], isAvailable: true },
  { state: "Tamil Nadu", city: "Chennai", location: "Chennai Airport", locationType: "Airport", slotNumber: "MAA-401", floor: 4, vehicleType: "car", pricePerHour: 100, address: "Meenambakkam, Chennai", features: ["Valet Available"], isAvailable: true },
  { state: "Tamil Nadu", city: "Chennai", location: "The Marina Restaurant", locationType: "Restaurant", slotNumber: "MR-101", floor: 1, vehicleType: "bike", pricePerHour: 20, address: "Marina Beach, Chennai", features: ["Free 2 hours"], isAvailable: true },
  
  // West Bengal - Kolkata
  { state: "West Bengal", city: "Kolkata", location: "South City Mall", locationType: "Mall", slotNumber: "SCM-201", floor: 2, vehicleType: "car", pricePerHour: 45, address: "Prince Anwar Shah Road, Kolkata", features: ["CCTV", "24/7"], isAvailable: true },
  { state: "West Bengal", city: "Kolkata", location: "AMRI Hospital", locationType: "Hospital", slotNumber: "AMRI-101", floor: 1, vehicleType: "car", pricePerHour: 30, address: "Dhakuria, Kolkata", features: ["Covered"], isAvailable: true },
  { state: "West Bengal", city: "Kolkata", location: "Netaji Subhash Airport", locationType: "Airport", slotNumber: "CCU-301", floor: 3, vehicleType: "car", pricePerHour: 90, address: "Dum Dum, Kolkata", features: ["Long-term Available"], isAvailable: true },
  
  // Telangana - Hyderabad
  { state: "Telangana", city: "Hyderabad", location: "Inorbit Mall", locationType: "Mall", slotNumber: "IO-101", floor: 1, vehicleType: "car", pricePerHour: 50, address: "Madhapur, Hyderabad", features: ["CCTV", "Valet"], isAvailable: true },
  { state: "Telangana", city: "Hyderabad", location: "Yashoda Hospital", locationType: "Hospital", slotNumber: "YH-201", floor: 2, vehicleType: "car", pricePerHour: 35, address: "Malakpet, Hyderabad", features: ["24/7 Security"], isAvailable: true },
  { state: "Telangana", city: "Hyderabad", location: "Rajiv Gandhi Airport", locationType: "Airport", slotNumber: "HYD-501", floor: 5, vehicleType: "car", pricePerHour: 110, address: "Shamshabad, Hyderabad", features: ["Valet", "EV Charging"], isAvailable: true },
  { state: "Telangana", city: "Hyderabad", location: "Paradise Restaurant", locationType: "Restaurant", slotNumber: "PR-101", floor: 1, vehicleType: "bike", pricePerHour: 15, address: "Secunderabad", features: ["Free 1 hour"], isAvailable: true },
  
  // Gujarat - Ahmedabad
  { state: "Gujarat", city: "Ahmedabad", location: "Ahmedabad One Mall", locationType: "Mall", slotNumber: "AO-101", floor: 1, vehicleType: "car", pricePerHour: 40, address: "Vastrapur, Ahmedabad", features: ["CCTV"], isAvailable: true },
  { state: "Gujarat", city: "Ahmedabad", location: "Civil Hospital", locationType: "Hospital", slotNumber: "CH-201", floor: 2, vehicleType: "car", pricePerHour: 25, address: "Asarwa, Ahmedabad", features: ["Covered"], isAvailable: true },
  { state: "Gujarat", city: "Ahmedabad", location: "Sardar Patel Airport", locationType: "Airport", slotNumber: "AMD-401", floor: 4, vehicleType: "car", pricePerHour: 95, address: "Hansol, Ahmedabad", features: ["24/7 Security"], isAvailable: true },
  
  // Rajasthan - Jaipur
  { state: "Rajasthan", city: "Jaipur", location: "World Trade Park", locationType: "Mall", slotNumber: "WTP-101", floor: 1, vehicleType: "car", pricePerHour: 45, address: "Malviya Nagar, Jaipur", features: ["CCTV", "Covered"], isAvailable: true },
  { state: "Rajasthan", city: "Jaipur", location: "SMS Hospital", locationType: "Hospital", slotNumber: "SMS-201", floor: 2, vehicleType: "car", pricePerHour: 30, address: "JLN Marg, Jaipur", features: ["24/7"], isAvailable: true },
  { state: "Rajasthan", city: "Jaipur", location: "Jaipur Airport", locationType: "Airport", slotNumber: "JAI-301", floor: 3, vehicleType: "car", pricePerHour: 85, address: "Sanganer, Jaipur", features: ["Valet Service"], isAvailable: true },
];

// Function to add sample data to database (for admin use)
export const getSampleLocationsForState = (state) => {
  return sampleParkingLocations.filter(loc => loc.state === state);
};

export const getSampleLocationsForCity = (state, city) => {
  return sampleParkingLocations.filter(loc => loc.state === state && loc.city === city);
};
