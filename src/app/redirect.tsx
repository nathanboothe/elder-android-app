import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COASTAL_BLUE = '#407DA8';

// This screen exists only so expo-router has a real route to land on when
// Entra redirects back to elderandroidapp://redirect — without it, the
// router shows "Unmatched Route" instead of letting the sign-in flow
// finish. The actual token handling happens in admin.tsx's own response
// listener (which stays mounted underneath this screen in the stack), not
// here — this is just a brief loading placeholder while that resolves.
export default function RedirectScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COASTAL_BLUE} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
