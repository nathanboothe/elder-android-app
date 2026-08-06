import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COASTAL_BLUE = '#407DA8';

const ELDERS = ['Dan Reeder', 'Paul Clegg', 'Frank Council'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export default function SelectElderScreen() {
  const { campus, date } = useLocalSearchParams<{ campus: string; date: string }>();
  const router = useRouter();
  const [selectedElder, setSelectedElder] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Select an Elder' }} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          {campus} — {formatDate(date)}
        </Text>
        <Text style={styles.title}>Who would you like to meet with?</Text>

        <View style={styles.elderList}>
          {ELDERS.map((elder) => {
            const isSelected = elder === selectedElder;
            return (
              <Pressable
                key={elder}
                onPress={() => setSelectedElder(elder)}
                style={[styles.elderButton, isSelected && styles.elderButtonSelected]}
              >
                <Text
                  style={[
                    styles.elderButtonText,
                    isSelected && styles.elderButtonTextSelected,
                  ]}
                >
                  {elder}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedElder && (
          <View style={styles.confirmation}>
            <Text style={styles.confirmationText}>Meeting with: {selectedElder}</Text>
          </View>
        )}

        <Pressable
          disabled={!selectedElder}
          style={[styles.continueButton, !selectedElder && styles.continueButtonDisabled]}
          onPress={() => {
            if (!selectedElder || !campus || !date) return;
            router.push({
              pathname: '/confirmation',
              params: { campus, date, elder: selectedElder },
            });
          }}
        >
          <Text style={styles.continueButtonText}>Confirm Appointment</Text>
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
  elderList: { gap: 12 },
  elderButton: {
    borderWidth: 1.5,
    borderColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  elderButtonSelected: { backgroundColor: COASTAL_BLUE },
  elderButtonText: { color: COASTAL_BLUE, fontSize: 16, fontWeight: '600' },
  elderButtonTextSelected: { color: '#fff' },
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