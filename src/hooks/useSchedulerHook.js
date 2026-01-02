// src/hooks/useScheduler.js
import { useState, useMemo, useReducer } from 'react';
import { addDays, format, parseISO, isSameDay, addMinutes } from 'date-fns';
import { MENTORS, USERS, BOOKINGS_TABLE } from '../data/mockDB';
import { calculateTimezoneOffset, convertTimeToMentorTZ } from '../utils/timezoneUtils';


const initialState = {
  status: 'IDLE', // STATE MACHINE
  selectedMentor: null,
  selectedDate: new Date(),
  selectedSlot: null,
  error: null,
};

function schedulerReducer(state, action) {
  switch (action.type) {
    case 'SELECT_MENTOR':
      return { ...state, selectedMentor: action.payload, status: 'MENTOR_SELECTION' };
    case 'SELECT_DATE':
      return { ...state, selectedDate: action.payload, selectedSlot: null, status: 'DATE_SELECTION' };
    case 'SELECT_SLOT':
      return { ...state, selectedSlot: action.payload };
    case 'START_VALIDATION':
      return { ...state, status: 'VALIDATING' };
    case 'BOOKING_SUCCESS':
      return { ...state, status: 'SUCCESS' };
    case 'BOOKING_CONFLICT':
      return { ...state, status: 'RESCHEDULE', error: 'Slot was just taken' };
    case 'RESET':
      return { ...initialState, selectedDate: state.selectedDate, status: 'IDLE' };
    case 'BACK_TO_MENTOR_SELECTION':
      return { ...state, selectedMentor: null, status: 'IDLE' };
    default:
      return state;
  }
}

export const useScheduler = () => {
  const [state, dispatch] = useReducer(schedulerReducer, initialState);
  const [bookings, setBookings] = useState(BOOKINGS_TABLE);

  //Get all mentors
  const mentors = useMemo(() => MENTORS, []);

  // Calendar Generation
  const calendarDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));
  }, []);

  // Availability Logic
  const availableSlots = useMemo(() => {
    if (!state.selectedDate || !state.selectedMentor) return [];

    const dayIndex = state.selectedDate.getDay();
    const pattern = state.selectedMentor.availability[dayIndex];

    if (!pattern) return [];  
    // specific timestamps for the selected date
    const dateStr = format(state.selectedDate, 'yyyy-MM-dd');
    
    // Calculate timezone offset
    const tzOffset = calculateTimezoneOffset(USERS.mentee.timezone, state.selectedMentor.timezone);
    
    return pattern.map(timeStr => {
      // Create a simplified ISO string for comparison
      const slotIso = `${dateStr}T${timeStr}:00.000Z`; 
      
      // Convert mentor's time to mentee's timezone
      const menteeTime = convertTimeToMentorTZ(timeStr, -tzOffset); // Negative because we're going backwards

      // CONFLICT CHECKER Before booking ( disabled for edge case testing )

      const isConflict = bookings.some(b => 
        b.mentor_id === state.selectedMentor.user_id &&
        b.start_time.includes(`${dateStr}T${timeStr}`) && 
        b.status === 'confirmed'
      );
      
      return {
        timeLabel: timeStr,
        menteeTime: menteeTime.time,
        menteeDay: menteeTime.dayOffset,
        fullIso: slotIso,
        tzOffset: tzOffset,
        isBooked: isConflict //isConflict
      };
    });
  }, [state.selectedDate, state.selectedMentor, bookings]);

  // 4. Actions
  const handleMentorSelect = (mentor) => {
    dispatch({ type: 'SELECT_MENTOR', payload: mentor });
  };

  const handleDateSelect = (date) => dispatch({ type: 'SELECT_DATE', payload: date });
  
  const handleSlotSelect = (slot) => {
    if (slot.isBooked) {
      dispatch({ type: 'BOOKING_CONFLICT' });
      return;
    }
    dispatch({ type: 'SELECT_SLOT', payload: slot });
  };

  const confirmBooking = () => {
    dispatch({ type: 'START_VALIDATION' });

    // Simulate Network Latency & Race Condition Check
    setTimeout(() => {
      // Double check conflict immediately before write
      const doubleCheck = bookings.find(b => 
        b.mentor_id === state.selectedMentor.user_id &&
        b.start_time === state.selectedSlot.fullIso
      );

      if (doubleCheck) {
        dispatch({ type: 'BOOKING_CONFLICT' });
      } else {
        // Immutable Update
        const newBooking = {
          booking_id: `bk_${Date.now()}`,
          mentor_id: state.selectedMentor.user_id,
          start_time: state.selectedSlot.fullIso,
          status: 'confirmed'
        };
        setBookings(prev => [...prev, newBooking]);
        dispatch({ type: 'BOOKING_SUCCESS' });
      }
    }, 1000);
  };

  const backToMentorSelection = () => {
    dispatch({ type: 'BACK_TO_MENTOR_SELECTION' });
  };

  return {
    state,
    computed: { mentors, calendarDays, availableSlots },
    actions: { 
      handleMentorSelect,
      handleDateSelect, 
      handleSlotSelect, 
      confirmBooking, 
      reset: () => dispatch({ type: 'RESET' }),
      backToMentorSelection
    }
  };
};