import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CAMPUSES = [
  'Battery Park',
  'Bethany Campus',
  'Chesapeake',
  'Gloucester',
  'Hampton',
  'Mathews',
  'Williamsburg',
  'Yorktown',
];

const COASTAL_BLUE = '#407DA8';

export default function HomeScreen() {
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Your Campus</Text>

        <View style={styles.grid}>
          {CAMPUSES.map((campus) => {
            const isSelected = campus === selectedCampus;
            return (
              <Pressable
                key={campus}
                onPress={() => setSelectedCampus(campus)}
                style={[styles.campusButton, isSelected && styles.campusButtonSelected]}
              >
                <Text
                  style={[
                    styles.campusButtonText,
                    isSelected && styles.campusButtonTextSelected,
                  ]}
                >
                  {campus}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {selectedCampus && (
          <View style={styles.confirmation}>
            <Text style={styles.confirmationText}>Selected: {selectedCampus}</Text>
          </View>
        )}

        <Pressable
          disabled={!selectedCampus}
          style={[styles.continueButton, !selectedCampus && styles.continueButtonDisabled]}
          onPress={() => {
            if (!selectedCampus) return;
            router.push({ pathname: '/select-date', params: { campus: selectedCampus } });
          }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COASTAL_BLUE,
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  campusButton: {
    width: '48%',
    borderWidth: 1.5,
    borderColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  campusButtonSelected: {
    backgroundColor: COASTAL_BLUE,
  },
  campusButtonText: {
    color: COASTAL_BLUE,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  campusButtonTextSelected: {
    color: '#fff',
  },
  confirmation: {
    marginTop: 24,
    backgroundColor: '#EAF1F6',
    borderLeftWidth: 4,
    borderLeftColor: COASTAL_BLUE,
    borderRadius: 6,
    padding: 12,
  },
  confirmationText: {
    color: COASTAL_BLUE,
    fontWeight: '600',
  },
  continueButton: {
    marginTop: 'auto',
    marginBottom: 24,
    backgroundColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#B8CBD8',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});