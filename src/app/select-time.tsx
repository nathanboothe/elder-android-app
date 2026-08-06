import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COASTAL_BLUE = '#407DA8';

const TIMES = ['7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export default function SelectTimeScreen() {
  const { campus, date } = useLocalSearchParams<{ campus: string; date: string }>();
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: formatDate(date) }} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          {campus} — {formatDate(date)}
        </Text>
        <Text style={styles.title}>What time works for you?</Text>

        <View style={styles.timeList}>
          {TIMES.map((time) => {
            const isSelected = time === selectedTime;
            return (
              <Pressable
                key={time}
                onPress={() => setSelectedTime(time)}
                style={[styles.timeButton, isSelected && styles.timeButtonSelected]}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    isSelected && styles.timeButtonTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedTime && (
          <View style={styles.confirmation}>
            <Text style={styles.confirmationText}>Selected: {selectedTime}</Text>
          </View>
        )}

        <Pressable
          disabled={!selectedTime}
          style={[styles.continueButton, !selectedTime && styles.continueButtonDisabled]}
          onPress={() => {
            if (!selectedTime || !campus || !date) return;
            router.push({
              pathname: '/select-elder',
              params: { campus, date, time: selectedTime },
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
  timeList: { gap: 12 },
  timeButton: {
    borderWidth: 1.5,
    borderColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  timeButtonSelected: { backgroundColor: COASTAL_BLUE },
  timeButtonText: { color: COASTAL_BLUE, fontSize: 15, fontWeight: '600' },
  timeButtonTextSelected: { color: '#fff' },
  confirmation: {
    marginTop: 24,
    backgroundColor: '#EAF1F6',
    borderLeftWidth: 4,
    borderLeftColor: COASTAL_BLUE,
    borderRadius: 6,
    padding: 12,
  },
  confirmationText: { color: COASTAL_BLUE, fontWeight: '600' },
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