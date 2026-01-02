import React from 'react';
import { Image } from 'expo-image';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle, Globe } from 'lucide-react-native';
import { useScheduler } from '../hooks/useSchedulerHook';
import { MentorCard } from '../components/MentorCard';

const DateStrip = ({ days, selectedDate, onSelect }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateStrip}>
    {days.map((date, index) => {
      const isSelected = isSameDay(date, selectedDate);
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(date)}
          style={[styles.dateCard, isSelected && styles.dateCardSelected]}
          activeOpacity={0.6}
        >
          <Text style={[styles.dayText, isSelected && styles.textSelected]}>
            {format(date, 'EEE')}
          </Text>
          <Text style={[styles.dateNum, isSelected && styles.textSelected]}>
            {format(date, 'd')}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const EmptyState = () => (
  <View style={styles.centerContainer}>
    <View style={[styles.iconCircle, { backgroundColor: '#F3F4F6' }]}>
      <CalendarIcon size={40} color="#9CA3AF" />
    </View>
    <Text style={styles.heading}>No Available Slots</Text>
    <Text style={styles.subText}>This mentor is fully booked for this date.</Text>
  </View>
);

// --- MENTOR SELECTION VIEW ---

const MentorSelectionView = ({ mentors, selectedMentor, onSelect }) => (
  <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
  <SafeAreaView style={styles.container}>
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.headerSubtitle}>Select Your</Text>
        <Text style={styles.headerTitle}>Mentor</Text>
      </View>
    </View>

    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={styles.mentorListContainer}>
        {mentors.map((mentor, index) => (
          <MentorCard
            index={index}
            key={mentor.user_id}
            mentor={mentor}
            isSelected={selectedMentor?.user_id === mentor.user_id}
            onSelect={() => onSelect(mentor)}
          />
        ))}
      </View>
    </ScrollView>

    {selectedMentor && (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Text style={styles.btnText}>Continue to Booking</Text>
          <ChevronRight size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    )}
  </SafeAreaView>
  </ParallaxScrollView>
);


const SchedulerView = ({ mentor, state, computed, actions }) => {
  const { availableSlots, calendarDays } = computed;

  // VIEW 1: SUCCESS
  if (state.status === 'SUCCESS') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
            <CheckCircle size={48} color="#16A34A" />
          </View>
          <Text style={styles.heading}>Booking Confirmed! 🎉</Text>
          <Text style={styles.subText}>You are scheduled with {mentor.name}</Text>
          
          <View style={styles.ticket}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketLabel}>Session Details</Text>
            </View>
            <View style={styles.ticketDivider} />
            <View style={styles.ticketRow}>
              <CalendarIcon size={18} color="#7C3AED" />
              <View style={{ flex: 1 }}>
                <Text style={styles.ticketLabel}>Date</Text>
                <Text style={styles.ticketText}>{format(state.selectedDate, 'EEEE, MMMM d')}</Text>
              </View>
            </View>
            <View style={styles.ticketRow}>
              <Clock size={18} color="#7C3AED" />
              <View style={{ flex: 1 }}>
                <Text style={styles.ticketLabel}>Time</Text>
                <Text style={styles.ticketText}>{state.selectedSlot?.timeLabel} ({mentor.timezone})</Text>
              </View>
            </View>
            <View style={styles.ticketRow}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarTextSmall}>{mentor.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ticketLabel}>Mentor</Text>
                <Text style={styles.ticketText}>{mentor.name}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={actions.reset} style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.btnText}>Book Another Session</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // VIEW 2: RESCHEDULE
  if (state.status === 'RESCHEDULE') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={actions.reset}
            activeOpacity={0.6}
          >
            <ChevronLeft color="#7C3AED" size={24} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerSmallTitle}>Change Your</Text>
            <Text style={styles.headerMentorName}>Session</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Alert Banner */}
          <View style={styles.alertBanner}>
            <AlertCircle size={24} color="#EA580C" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.alertTitle}>Slot No Longer Available</Text>
              <Text style={styles.alertText}>Someone booked this slot just seconds ago. Scroll down to select a new time.</Text>
            </View>
          </View>

          {/* Current Booking Card */}
          <View style={styles.currentBookingSection}>
            <Text style={styles.sectionTitle}>Current Booking</Text>
            
            <View style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingMentorName}>{mentor.name}</Text>
                </View>
              </View>

              <View style={styles.bookingDivider} />

              <View style={styles.bookingDetail}>
                <View style={styles.bookingDetailIcon}>
                  <CalendarIcon size={18} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingDetailLabel}>Date</Text>
                  <Text style={styles.bookingDetailValue}>{format(state.selectedDate, 'EEEE, MMMM d')}</Text>
                </View>
              </View>

              <View style={styles.bookingDetail}>
                <View style={styles.bookingDetailIcon}>
                  <Clock size={18} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingDetailLabel}>Time (Previous)</Text>
                  <Text style={styles.bookingDetailValue}>
                    {state.selectedSlot?.timeLabel} • {state.selectedSlot?.menteeTime}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetail}>
                <View style={styles.bookingDetailIcon}>
                  <Globe size={18} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingDetailLabel}>Timezone</Text>
                  <Text style={styles.bookingDetailValue}>{mentor.timezone}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* New Date Selection */}
          <Text style={styles.sectionTitle}>Select New Date</Text>
          <DateStrip 
            days={calendarDays} 
            selectedDate={state.selectedDate} 
            onSelect={actions.handleDateSelect} 
          />

          {/* Available Slots */}
          <View style={styles.slotSection}>
            <View>
              <Text style={styles.sectionTitle}>Pick a New Time</Text>
            </View>
            <View style={styles.tzInfoBadge}>
              <Globe size={16} color="#7C3AED" />
              <Text style={styles.tzInfoText}>
                {mentor.name} - {mentor.timezone}
              </Text>
            </View>
            <Text style={styles.timeFormatHint}>Showing mentor time (your time)</Text>
          </View>

          {availableSlots.length === 0 ? (
            <EmptyState />
          ) : (
            <View style={styles.grid}>
              {availableSlots.map((slot, i) => (
                <TouchableOpacity
                  key={i}
                  disabled={slot.isBooked}
                  onPress={() => actions.handleSlotSelect(slot)}
                  style={[
                    styles.slot,
                    state.selectedSlot?.timeLabel === slot.timeLabel && styles.slotSelected,
                    slot.isBooked && styles.slotDisabled
                  ]}
                  activeOpacity={0.6}
                >
                  <Clock size={16} color={
                    state.selectedSlot?.timeLabel === slot.timeLabel ? '#FFF' :
                    slot.isBooked ? '#D1D5DB' : '#7C3AED'
                  } />
                  <Text style={[
                    styles.slotText,
                    state.selectedSlot?.timeLabel === slot.timeLabel && styles.textSelected,
                    slot.isBooked && styles.textDisabled
                  ]}>
                    {slot.timeLabel}
                  </Text>
                  <Text style={[
                    styles.subSlotText,
                    state.selectedSlot?.timeLabel === slot.timeLabel && styles.textSelected,
                    slot.isBooked && styles.textDisabled
                  ]}>
                    {slot.menteeTime}
                  </Text>
                  {slot.isBooked && <Text style={styles.bookedLabel}>Booked</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.rescheduleFooter}>
          <TouchableOpacity 
            onPress={actions.confirmBooking}
            disabled={!state.selectedSlot || state.status === 'VALIDATING'}
            style={[styles.primaryButton, (!state.selectedSlot) && styles.btnDisabled]}
            activeOpacity={0.8}
          >
            {state.status === 'VALIDATING' ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.btnText}>Confirm New Time</Text>
                <CheckCircle size={20} color="#FFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={actions.backToMentorSelection}
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // VIEW 3: BOOKING
  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={actions.backToMentorSelection}
          activeOpacity={0.6}
        >
          <ChevronLeft color="#7C3AED" size={24} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerSmallTitle}>Book a Session with</Text>
          <Text style={styles.headerMentorName}>{mentor.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        

        {/* date slector */}
        <Text style={styles.sectionTitle}>Select Date</Text>
        <DateStrip 
          days={calendarDays} 
          selectedDate={state.selectedDate} 
          onSelect={actions.handleDateSelect} 
        />

        {/* time slots */}
        <View style={styles.slotSection}>
          <View>
            <Text style={styles.sectionTitle}>Available Slots</Text>
          </View>
          <View style={styles.tzInfoBadge}>
            <Globe size={16} color="#7C3AED" />
            <Text style={styles.tzInfoText}>
              {mentor.name} - {mentor.timezone}
            </Text>
          </View>
          <Text style={styles.timeFormatHint}>Showing mentor time (your time)</Text>
        </View>

        {availableSlots.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.grid}>
            {availableSlots.map((slot, i) => (
              <TouchableOpacity
                key={i}
                disabled={slot.isBooked}
                onPress={() => actions.handleSlotSelect(slot)}
                style={[
                  styles.slot,
                  state.selectedSlot?.timeLabel === slot.timeLabel && styles.slotSelected,
                  slot.isBooked && styles.slotDisabled
                ]}
                activeOpacity={0.6}
              >
                <Clock size={16} color={
                  state.selectedSlot?.timeLabel === slot.timeLabel ? '#FFF' :
                  slot.isBooked ? '#D1D5DB' : '#7C3AED'
                } />
                <Text style={[
                  styles.slotText,
                  state.selectedSlot?.timeLabel === slot.timeLabel && styles.textSelected,
                  slot.isBooked && styles.textDisabled
                ]}>
                  {slot.timeLabel}
                </Text>
                <Text style={[
                  styles.subSlotText,
                  state.selectedSlot?.timeLabel === slot.timeLabel && styles.textSelected,
                  slot.isBooked && styles.textDisabled
                ]}>
                  {slot.menteeTime}
                </Text>
                {slot.isBooked && <Text style={styles.bookedLabel}>Booked</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* footet*/}
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={actions.confirmBooking}
          disabled={!state.selectedSlot || state.status === 'VALIDATING'}
          style={[styles.primaryButton, (!state.selectedSlot) && styles.btnDisabled]}
          activeOpacity={0.8}
        >
          {state.status === 'VALIDATING' ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.btnText}>Confirm Booking</Text>
              <CheckCircle size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default function SchedulerScreen() {
  const { state, computed, actions } = useScheduler();
  const selectedMentor = state.selectedMentor;

  // uf no mentor selected show mentor selection
  if (!selectedMentor) {
    return <MentorSelectionView 
      mentors={computed.mentors} 
      selectedMentor={selectedMentor}
      onSelect={actions.handleMentorSelect}
    />;
  }

  
  return <SchedulerView 
    mentor={selectedMentor} 
    state={state} 
    computed={computed} 
    actions={actions} 
  />;
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24 
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF'
  },
  headerSmallTitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  headerMentorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  backBtn: { 
    padding: 8,
    marginLeft: -8,
  },
  mentorListContainer: {
    paddingVertical: 8,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarTextSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827', 
    marginHorizontal: 16, 
    marginTop: 20,
    marginBottom: 12,
  },
  dateStrip: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    gap: 10 
  },
  dateCard: { 
    width: 62, 
    height: 72, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 16, 
    borderWidth: 2, 
    borderColor: '#E5E7EB', 
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateCardSelected: { 
    borderColor: '#7C3AED', 
    backgroundColor: '#F5F3FF',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  dayText: { 
    fontSize: 12, 
    color: '#9CA3AF', 
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  dateNum: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#1F2937',
    marginTop: 4,
  },

  slotSection: { 
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tzInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
    marginBottom: 8,
  },
  tzInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
    flex: 1,
  },
  timeFormatHint: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 4,
  },
  timezoneHint: { 
    fontSize: 12, 
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12, 
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  slot: { 
    width: '30%', 
    paddingVertical: 14, 
    paddingHorizontal: 8,
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#E5E7EB', 
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 6,
  },
  slotSelected: { 
    backgroundColor: '#7c3aed3f', 
    borderColor: '#7C3AED',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  slotDisabled: { 
    backgroundColor: '#F3F4F6', 
    borderColor: '#E5E7EB' 
  },
  slotText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#374151',
    textAlign: 'center',
  },
  subSlotText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  textSelected: { 
    color: '#000000ff' 
  },
  textDisabled: { 
    color: '#9CA3AF' 
  },
  bookedLabel: { 
    fontSize: 10, 
    color: '#9CA3AF', 
    marginTop: 2,
    fontWeight: '500',
  },

  // Footer & Buttons
  footer: { 
    padding: 16, 
    paddingBottom: 24,
    borderTopWidth: 1, 
    borderColor: '#F3F4F6', 
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  rescheduleFooter: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    gap: 12,
  },
  primaryButton: { 
    backgroundColor: '#7C3AED', 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryBtnText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '700',
  },
  btnDisabled: { 
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  btnText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700',
  },
  
  // Icons & Feedback
  iconCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heading: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#111827', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: { 
    fontSize: 15, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginBottom: 32,
    lineHeight: 22,
  },
  
  // Alert Banner
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#EA580C',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 18,
  },

  // Current Booking
  currentBookingSection: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  bookingCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    paddingVertical: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarTextLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bookingMentorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  bookingMentorTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bookingDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  bookingDetail: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 12,
  },
  bookingDetailIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingDetailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bookingDetailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Ticket
  ticket: { 
    width: '100%', 
    backgroundColor: '#F9FAFB', 
    borderRadius: 16,
    marginBottom: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  ticketLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  ticketRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start',
    gap: 12, 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ticketText: { 
    fontSize: 15, 
    color: '#374151', 
    fontWeight: '600',
  }
});
