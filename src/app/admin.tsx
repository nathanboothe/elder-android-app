import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COASTAL_BLUE = '#407DA8';

export default function AdminScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Elder / Admin Sign-In</Text>
        <Text style={styles.body}>
          Sign-in with your @gocoastal.org account is coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COASTAL_BLUE,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: { fontSize: 14, color: '#6b7c88', textAlign: 'center' },
});
