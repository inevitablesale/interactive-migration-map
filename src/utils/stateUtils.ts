import { supabase } from "@/integrations/supabase/client";

const STATE_NAMES: { [key: string]: string } = {
  "01": "Alabama",
  "02": "Alaska", 
  "04": "Arizona",
  "05": "Arkansas",
  "06": "California",
  "08": "Colorado",
  "09": "Connecticut",
  "10": "Delaware",
  "11": "District of Columbia",
  "12": "Florida",
  "13": "Georgia",
  "15": "Hawaii",
  "16": "Idaho",
  "17": "Illinois",
  "18": "Indiana",
  "19": "Iowa",
  "20": "Kansas",
  "21": "Kentucky",
  "22": "Louisiana",
  "23": "Maine",
  "24": "Maryland",
  "25": "Massachusetts",
  "26": "Michigan",
  "27": "Minnesota",
  "28": "Mississippi",
  "29": "Missouri",
  "30": "Montana",
  "31": "Nebraska",
  "32": "Nevada",
  "33": "New Hampshire",
  "34": "New Jersey",
  "35": "New Mexico",
  "36": "New York",
  "37": "North Carolina",
  "38": "North Dakota",
  "39": "Ohio",
  "40": "Oklahoma",
  "41": "Oregon",
  "42": "Pennsylvania",
  "44": "Rhode Island",
  "45": "South Carolina",
  "46": "South Dakota",
  "47": "Tennessee",
  "48": "Texas",
  "49": "Utah",
  "50": "Vermont",
  "51": "Virginia",
  "53": "Washington",
  "54": "West Virginia",
  "55": "Wisconsin",
  "56": "Wyoming"
};

export const getStateName = async (stateId: string): Promise<string> => {
  console.log('getStateName called with stateId:', stateId);
  
  try {
    // Ensure stateId is padded with leading zero if needed
    const paddedStateId = stateId.padStart(2, '0');
    
    // Use the static mapping instead of database lookup
    const stateName = STATE_NAMES[paddedStateId];
    
    if (!stateName) {
      console.log('No data found for stateId:', stateId);
      return `State ${stateId}`;
    }

    console.log('Found state_name:', stateName);
    return stateName;
  } catch (error) {
    console.error('Unexpected error in getStateName:', error);
    return `State ${stateId}`;
  }
};