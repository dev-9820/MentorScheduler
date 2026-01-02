import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Clock, Globe, ArrowRight } from 'lucide-react-native';
import { getTimezoneLabel } from '../utils/timezoneUtils';
import { USERS } from '../data/mockDB';

export const MentorCard = ({ mentor, isSelected, onSelect, index }) => {
  const menteeTimezone = USERS.mentee.timezone;
  const tzLabel = getTimezoneLabel(menteeTimezone, mentor.timezone);
  
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[
        styles.card,
        isSelected && styles.cardSelected
      ]}
      activeOpacity={0.7}
    >
      
      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{mentor.name}</Text>
        {/* Meta info with Timezone */}
        <View style={styles.metaRow}>
          <View style={[styles.metaItem, styles.tzBadge]}>
            <Globe size={14} color="#7C3AED" />
            <Text style={styles.tzText}>{tzLabel}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F3FF',
    shadowOpacity: 0.15,
    elevation: 6,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tzBadge: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#7C3AED',
  },
  tzText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
});
