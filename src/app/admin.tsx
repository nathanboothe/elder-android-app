import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ENTRA_CONFIG, loginWithEntraIdToken } from '@/lib/api';

// Required once per app so the browser sign-in flow can hand control back
// to this screen when it completes.
WebBrowser.maybeCompleteAuthSession();

const COASTAL_BLUE = '#407DA8';

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${ENTRA_CONFIG.tenantId}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${ENTRA_CONFIG.tenantId}/oauth2/v2.0/token`,
};

export default function AdminScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Relies on the app's "scheme" in app.json (elderandroidapp) — only
  // resolves to a usable redirect inside a custom dev client / standalone
  // build, not Expo Go.
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'elderandroidapp' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: ENTRA_CONFIG.clientId,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success' && response.params.code) {
      handleCodeExchange(response.params.code);
    } else if (response?.type === 'error') {
      setError(response.error?.message ?? 'Sign-in was cancelled or failed.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  async function handleCodeExchange(code: string) {
    if (!request) return;
    setSubmitting(true);
    setError(null);
    try {
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: ENTRA_CONFIG.clientId,
          code,
          redirectUri,
          extraParams: { code_verifier: request.codeVerifier ?? '' },
        },
        discovery
      );

      if (!tokenResult.idToken) {
        throw new Error('No ID token returned from sign-in.');
      }

      await loginWithEntraIdToken(tokenResult.idToken);
      router.replace('/admin-home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Elder / Admin Sign-In</Text>
        <Text style={styles.body}>Sign in with your @gocoastal.org Microsoft account.</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={[styles.signInButton, (!request || submitting) && styles.signInButtonDisabled]}
          disabled={!request || submitting}
          onPress={() => promptAsync()}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInButtonText}>Sign in with Microsoft</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: COASTAL_BLUE, textAlign: 'center' },
  body: { fontSize: 14, color: '#6b7c88', textAlign: 'center' },
  errorText: { color: '#c0392b', fontSize: 13, textAlign: 'center' },
  signInButton: {
    backgroundColor: COASTAL_BLUE,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
    minWidth: 220,
  },
  signInButtonDisabled: { opacity: 0.6 },
  signInButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
