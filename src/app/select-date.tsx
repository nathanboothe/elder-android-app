import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COASTAL_BLUE = '#407DA8';

function getUpcomingSundays(count: number): Date[] {
  const sundays: Date[] = [];
  const cursor = new Date();
  const daysUntilSunday = (7 - cursor.getDay()) % 7;
  cursor.setDate(cursor.getDate() + daysUntilSunday);

  for (let i = 0; i < count; i++) {
    sundays.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }
  return sundays;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export default function SelectDateScreen() {
  const { campus } = useLocalSearchParams<{ campus: string }>();
  const router = useRouter();
  const [mode, setMode] = useState<'choose' | 'sunday' | 'cant-meet'>('choose');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const sundays = getUpcomingSundays(5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: campus ?? 'Select Date' }} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>{campus}</Text>
        <Text style={styles.title}>When can you meet?</Text>

        {mode === 'choose' && (
          <View style={styles.choiceRow}>
            <Pressable style={styles.choiceButton} onPress={() => setMode('sunday')}>
              <Text style={styles.choiceButtonText}>Sunday</Text>
            </Pressable>
            <Pressable
              style={styles.choiceButtonOutline}
              onPress={() => setMode('cant-meet')}
            >
              <Text style={styles.choiceButtonOutlineText}>
                I can't meet on a Sunday
              </Text>
            </Pressable>
          </View>
        )}

        {mode === 'sunday' && (
          <View style={styles.dateList}>
            {sundays.map((date) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => setSelectedDate(date)}
                  style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      isSelected && styles.dateButtonTextSelected,
                    ]}
                  >
                    {formatDate(date)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {mode === 'cant-meet' && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Got it — someone from Coastal will reach out to schedule a time that works
              for you.
            </Text>
            <Text style={styles.placeholderNote}>
              (Placeholder: this will email engagement@gocoastal.org once the backend is
              connected.)
            </Text>
          </View>
        )}

        <Pressable
          disabled={!selectedDate}
          style={[styles.continueButton, !selectedDate && styles.continueButtonDisabled]}
          onPress={() => {
            if (!selectedDate || !campus) return;
            router.push({
              pathname: '/select-time',
              params: { campus, date: selectedDate.toISOString() },
            });
          }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  subtitle: { textAlign: 'center', color: '#6b7c88', fontSize: 14, marginBottom: 4 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COASTAL_BLUE,
    textAlign: 'center',
    marginBottom: 24,
  },
  choiceRow: { gap: 12 },
  choiceButton: {
    backgroundColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  choiceButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  choiceButtonOutline: {
    borderWidth: 1.5,
    borderColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  choiceButtonOutlineText: { color: COASTAL_BLUE, fontSize: 15, fontWeight: '600' },
  dateList: { gap: 12 },
  dateButton: {
    borderWidth: 1.5,
    borderColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dateButtonSelected: { backgroundColor: COASTAL_BLUE },
  dateButtonText: { color: COASTAL_BLUE, fontSize: 15, fontWeight: '600' },
  dateButtonTextSelected: { color: '#fff' },
  placeholder: {
    backgroundColor: '#EAF1F6',
    borderLeftWidth: 4,
    borderLeftColor: COASTAL_BLUE,
    borderRadius: 6,
    padding: 16,
    gap: 8,
  },
  placeholderText: { color: COASTAL_BLUE, fontWeight: '600' },
  placeholderNote: { color: '#6b7c88', fontSize: 12, fontStyle: 'italic' },
  continueButton: {
    marginTop: 'auto',
    marginBottom: 24,
    backgroundColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: { backgroundColor: '#B8CBD8' },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});