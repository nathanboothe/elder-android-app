import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchAllElders, type AdminElder } from '@/lib/api';

const COASTAL_BLUE = '#407DA8';

export default function ManageElderPickerScreen() {
  const router = useRouter();
  const [elders, setElders] = useState<AdminElder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadElders();
  }, []);

  async function loadElders() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllElders();
      setElders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load elders.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Select an Elder</Text>

        {loading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={COASTAL_BLUE} />
          </View>
        )}

        {!loading && error && (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadElders}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {!loading &&
          !error &&
          elders.map((elder) => (
            <Pressable
              key={elder.id}
              style={styles.elderRow}
              onPress={() =>
                router.push({ pathname: '/manage-elder', params: { elderName: elder.name } })
              }
            >
              <Text style={styles.elderName}>{elder.name}</Text>
              <Text style={styles.elderCampus}>{elder.campus}</Text>
            </Pressable>
          ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COASTAL_BLUE,
    textAlign: 'center',
    marginBottom: 20,
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
  elderRow: {
    borderWidth: 1,
    borderColor: '#EAF1F6',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },
  elderName: { fontSize: 15, fontWeight: '700', color: COASTAL_BLUE },
  elderCampus: { fontSize: 12, color: '#6b7c88', marginTop: 2 },
});
