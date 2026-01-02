import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { User, Calendar, Users, Star, ArrowRight } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#7C3AED', dark: '#5B21B6' }}
      headerImage={
        <View style={styles.headerIconContainer}>
          <Calendar size={80} color="#FFFFFF" strokeWidth={1.5} />
        </View>
      }>
      
      
      <ThemedView style={styles.heroSection}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.mainTitle}>Mentor Scheduler</ThemedText>
          <HelloWave />
        </View>
        <ThemedText style={styles.tagline}>
          Connect with experienced mentors and book sessions that work for you
        </ThemedText>
      </ThemedView>

      

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Why Use MentorScheduler?</ThemedText>
        
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Users size={28} color="#7C3AED" />
            </View>
            <ThemedText style={styles.featureTitle}>Expert Mentors</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Access top mentors in design and engineering
            </ThemedText>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Calendar size={28} color="#7C3AED" />
            </View>
            <ThemedText style={styles.featureTitle}>Easy Scheduling</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Book sessions 7 days in advance
            </ThemedText>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Star size={28} color="#7C3AED" />
            </View>
            <ThemedText style={styles.featureTitle}>Rated Mentors</ThemedText>
            <ThemedText style={styles.featureDesc}>
              View ratings and reviews before booking
            </ThemedText>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <User size={28} color="#7C3AED" />
            </View>
            <ThemedText style={styles.featureTitle}>Personal Growth</ThemedText>
            <ThemedText style={styles.featureDesc}>
              Get guidance from industry professionals
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>How It Works</ThemedText>
        
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>1</ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText type="defaultSemiBold">Select a Mentor</ThemedText>
              <ThemedText style={styles.stepDesc}>
                Browse our expert mentors and view their profiles, ratings, and availability
              </ThemedText>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>2</ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText type="defaultSemiBold">Pick a Date & Time</ThemedText>
              <ThemedText style={styles.stepDesc}>
                Choose from available slots in your timezone
              </ThemedText>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>3</ThemedText>
            </View>
            <View style={styles.stepContent}>
              <ThemedText type="defaultSemiBold">Confirm Booking</ThemedText>
              <ThemedText style={styles.stepDesc}>
                Get instant confirmation and calendar invite
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      
      <ThemedView style={styles.section}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(tabs)/explore')}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.primaryButtonText}>Start Booking Now</ThemedText>
          <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        
        <ThemedText style={styles.ctaSubtext}>
          Navigate to the Scheduler tab to book your first session with a mentor
        </ThemedText>
      </ThemedView>

      {/* Project Info Footer */}
      <ThemedView style={styles.footerSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>About This App</ThemedText>
        <ThemedText style={styles.footerText}>
          MentorScheduler is a React Native application built with Expo that enables seamless mentor-mentee connections. Browse multiple mentors, check real-time availability, and book sessions with just a few taps.
        </ThemedText>
        <ThemedText style={styles.footerSmall}>
          Built with React Native • TypeScript • Expo • date-fns
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIconContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  
  heroSection: {
    gap: 12,
    marginBottom: 24,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainTitle: {
    fontSize: 32,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  // User Card
  userCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userRole: {
    fontSize: 13,
    marginTop: 2,
  },
  timezone: {
    fontSize: 12,
    marginTop: 6,
  },

  // Section Styles
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },

  // Features Grid
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Steps
  stepContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 18,
  },

  // CTA Section
  primaryButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaSubtext: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },

  // Footer
  footerSection: {
    gap: 12,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 21,
  },
  footerSmall: {
    fontSize: 12,
    marginTop: 8,
  },
});
