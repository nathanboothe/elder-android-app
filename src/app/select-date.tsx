import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchDates } from '@/lib/api';

const COASTAL_BLUE = '#407DA8';

// Backend returns plain YYYY-MM-DD strings. Parsing those with `new
// Date(iso)` directly treats them as UTC midnight, which can display as
// the PREVIOUS day in negative-UTC-offset timezones (e.g. anywhere in the
// US) — appending a local midnight time avoids that shift.
function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
}

export default function SelectDateScreen() {
  const { campus, classDate } = useLocalSearchParams<{ campus: string; classDate: string }>();
  const router = useRouter();
  const [mode, setMode] = useState<'choose' | 'sunday' | 'cant-meet'>('choose');
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'sunday') {
      loadDates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, campus, classDate]);

  async function loadDates() {
    if (!campus || !classDate) return;
    setLoading(true);
    setError(false);
    try {
      const data = await fetchDates(campus, classDate, 'Sunday');
      setDates(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

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
            <Pressable style={styles.choiceButtonOutline} onPress={() => setMode('cant-meet')}>
              <Text style={styles.choiceButtonOutlineText}>I can't meet on a Sunday</Text>
            </Pressable>
          </View>
        )}

        {mode === 'sunday' && loading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={COASTAL_BLUE} />
          </View>
        )}

        {mode === 'sunday' && !loading && error && (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>
              Couldn't load available dates. Check your connection and try again.
            </Text>
            <Pressable style={styles.retryButton} onPress={loadDates}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {mode === 'sunday' && !loading && !error && dates.length === 0 && (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>
              No Sundays are currently available at this campus. Try "I can't meet on a Sunday"
              instead.
            </Text>
          </View>
        )}

        {mode === 'sunday' && !loading && !error && dates.length > 0 && (
          <View style={styles.dateList}>
            {dates.map((date) => {
              const isSelected = date === selectedDate;
              return (
                <Pressable
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
                >
                  <Text
                    style={[styles.dateButtonText, isSelected && styles.dateButtonTextSelected]}
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
              Got it — someone from Coastal will reach out to schedule a time that works for you.
            </Text>
            <Text style={styles.placeholderNote}>
              (Placeholder: this will actually notify Coastal once wired to the backend's
              /sunday-optout endpoint — not part of this pass.)
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
              params: { campus, date: selectedDate },
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
  centerBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  errorText: { color: '#c0392b', textAlign: 'center', fontSize: 14 },
  retryButton: {
    backgroundColor: COASTAL_BLUE,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: { color: '#fff', fontWeight: '600' },
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
