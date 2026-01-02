export const MENTORS = [
  {
    user_id: "mentor_01",
    role: "MENTOR",
    name: "Anita Sharma",
    timezone: "Asia/Kolkata",
    availability: {
      1: ["09:00", "14:00"], 
      // 15:00 is a booked slot for conflict testing
      2: ["10:00", "12:00", "15:00", "18:00"],          
      4: ["13:00", "14:00"], 
      5: ["09:00", "10:00"]           
    },
  },
  {
    user_id: "mentor_02",
    role: "MENTOR",
    name: "Lucas Ferreira",
    timezone: "America/Sao_Paulo",
    availability: {
      1: ["09:00", "10:00", "14:00"], 
      2: ["10:00", "11:00"],          
      4: ["13:00", "15:00", "16:00"], 
      5: ["09:00", "10:00"]           
    },
  }
];

export const USERS = {
  mentee: {
    user_id: "mentee_01",
    role: "MENTEE",
    name: "Rahul Verma",
    timezone: "Asia/Kolkata"
  }
};

// Existing bookings to simulate conflicts
export const BOOKINGS_TABLE = [
  {
    booking_id: "bk_101",
    mentor_id: "mentor_01",
    start_time: "2026-01-06T15:00:00.000Z",
    status: "confirmed"
  },
  {
    booking_id: "bk_102",
    mentor_id: "mentor_02",
    start_time: "2026-01-06T10:00:00.000Z",
    status: "confirmed"
  }
];