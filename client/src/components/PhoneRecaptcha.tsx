// src/components/PhoneRecaptcha.tsx
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { firebaseConfig } from '../config/firebaseConfig';

const RECAPTCHA_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>reCAPTCHA</title>
  <script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-auth-compat.js"></script>
  <style>
    #recaptcha-container { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="recaptcha-container"></div>
  <script>
    var firebaseConfig = ${JSON.stringify(firebaseConfig)};
    firebase.initializeApp(firebaseConfig);

    var auth = firebase.auth();
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': function(token) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'verify',
          token: token
        }));
      },
      'expired-callback': function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'expired'
        }));
      }
    });
    window.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  </script>
</body>
</html>
`;

export interface PhoneRecaptchaRef {
  getToken: () => Promise<string>;
  refreshToken: () => void;
}

const PhoneRecaptcha = forwardRef<PhoneRecaptchaRef>((props, ref) => {
  const webViewRef = useRef<WebView>(null);
  const tokenPromiseResolve = useRef<((value: string) => void) | null>(null);

  const getToken = (): Promise<string> => {
    return new Promise((resolve) => {
      tokenPromiseResolve.current = resolve;
      webViewRef.current?.injectJavaScript(`
        window.recaptchaVerifier.verify()
          .then(function(token) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'verify',
              token: token
            }));
          })
          .catch(function(error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              error: error.message
            }));
          });
        true;
      `);
    });
  };

  const refreshToken = () => {
    webViewRef.current?.injectJavaScript(`
      window.grecaptcha.reset(window.recaptchaWidgetId);
      true;
    `);
  };

  useImperativeHandle(ref, () => ({
    getToken,
    refreshToken
  }));

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'verify' && tokenPromiseResolve.current) {
        tokenPromiseResolve.current(data.token);
        tokenPromiseResolve.current = null;
      }
    } catch (error) {
      console.error('WebView message parse error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: RECAPTCHA_HTML }}
        onMessage={handleMessage}
        style={styles.webView}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
  },
  webView: {
    flex: 1,
  }
});

export default PhoneRecaptcha;