import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COASTAL_BLUE = '#407DA8';

// TEMPORARY — real validation will come from the backend once connected.
const MEMBER_ACCESS_CODE = '2026';

export default function AccessGateScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit() {
    if (code === MEMBER_ACCESS_CODE) {
      setError(false);
      router.push('/book');
    } else {
      setError(true);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Coastal Church</Text>
        <Text style={styles.subtitle}>Schedule a Membership Meeting</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Enter your access code</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={code}
            onChangeText={(text) => {
              setCode(text);
              setError(false);
            }}
            keyboardType="number-pad"
            secureTextEntry
            placeholder="Access code"
            maxLength={12}
          />
          {error && <Text style={styles.errorText}>That code isn't recognized.</Text>}

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Continue</Text>
          </Pressable>
        </View>

        <Pressable style={styles.staffLink} disabled>
          <Text style={styles.staffLinkText}>Elder / Admin Login (coming soon)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COASTAL_BLUE,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7c88',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 40,
  },
  form: { gap: 10 },
  label: { fontSize: 14, fontWeight: '600', color: COASTAL_BLUE },
  input: {
    borderWidth: 1.5,
    borderColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    letterSpacing: 4,
  },
  inputError: { borderColor: '#c0392b' },
  errorText: { color: '#c0392b', fontSize: 13 },
  submitButton: {
    backgroundColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  staffLink: { marginTop: 40, alignItems: 'center' },
  staffLinkText: { color: '#B8CBD8', fontSize: 13, fontWeight: '600' },
});