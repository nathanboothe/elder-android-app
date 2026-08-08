import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COASTAL_BLUE = '#407DA8';

// This screen exists so expo-router has a real route to land on when
// Entra redirects back to elderandroidapp://redirect — without it, the
// router shows "Unmatched Route" instead of letting the sign-in flow
// finish.
//
// Calling maybeCompleteAuthSession() here (not just once in admin.tsx at
// import time) matters: this is the screen that's actually mounted at the
// exact moment the OS delivers the redirect back into the app, so this is
// where that signal needs to fire for the pending sign-in (waiting in
// admin.tsx's useAuthRequest listener, which stays mounted underneath this
// screen in the stack) to actually resolve instead of spinning forever.
WebBrowser.maybeCompleteAuthSession();

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
