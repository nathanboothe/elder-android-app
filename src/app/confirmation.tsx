import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COASTAL_BLUE = '#407DA8';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function ConfirmationScreen() {
  const { campus, date, time, elder } = useLocalSearchParams<{
    campus: string;
    date: string;
    time: string;
    elder: string;
  }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Confirmed' }} />
      <View style={styles.container}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>You're All Set!</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Campus</Text>
            <Text style={styles.value}>{campus}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDate(date)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{time}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Elder</Text>
            <Text style={styles.value}>{elder}</Text>
          </View>
        </View>

        <Text style={styles.note}>
          (Placeholder: confirmation emails to the elder, you, and OME will be sent once
          the backend is connected.)
        </Text>

        <Pressable style={styles.doneButton} onPress={() => router.replace('/')}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 32, alignItems: 'center' },
  checkmark: { fontSize: 48, color: COASTAL_BLUE, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: COASTAL_BLUE, marginBottom: 24 },
  card: {
    alignSelf: 'stretch',
    borderWidth: 1.5,
    borderColor: COASTAL_BLUE,
    borderRadius: 12,
    padding: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  divider: { height: 1, backgroundColor: '#EAF1F6' },
  label: { color: '#6b7c88', fontSize: 14, fontWeight: '600' },
  value: { color: COASTAL_BLUE, fontSize: 15, fontWeight: '700' },
  note: {
    marginTop: 20,
    color: '#6b7c88',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  doneButton: {
    marginTop: 'auto',
    marginBottom: 24,
    alignSelf: 'stretch',
    backgroundColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});