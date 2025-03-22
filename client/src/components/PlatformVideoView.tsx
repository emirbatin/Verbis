// src/components/PlatformVideoView.tsx - Expo Go uyumlu versiyon
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface VideoViewProps {
  uid: number;
  isLocalView?: boolean;
  style?: any;
  objectFit?: 'contain' | 'cover';
}

const PlatformVideoView: React.FC<VideoViewProps> = (props) => {
  const { uid, isLocalView, style, objectFit } = props;

  // Web platformu için basit placeholder
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>
          {isLocalView ? 'Local Video' : 'Remote Video'}
        </Text>
        <Text style={styles.placeholderSubText}>
          {isLocalView 
            ? 'Video calls are disabled in web version'
            : 'Please use the mobile app for video calls'}
        </Text>
        <Text style={styles.placeholderUID}>
          UID: {uid}
        </Text>
      </View>
    );
  } 
  
  // Native platforms için
  try {
    // Dynamically try to import Agora components
    let RtcEngine: any = null;
    let RtcLocalView: any = null;
    let RtcRemoteView: any = null;
    
    try {
      const agoraPackage = require('react-native-agora');
      RtcEngine = agoraPackage.default;
      RtcLocalView = agoraPackage.RtcLocalView;
      RtcRemoteView = agoraPackage.RtcRemoteView;
      
      if (isLocalView && RtcLocalView) {
        return (
          <RtcLocalView.SurfaceView
            style={[styles.videoView, style]}
            renderMode={objectFit === 'contain' ? 1 : 0} // 1 = FIT, 0 = HIDDEN
          />
        );
      } else if (!isLocalView && RtcRemoteView) {
        return (
          <RtcRemoteView.SurfaceView
            style={[styles.videoView, style]}
            uid={uid}
            renderMode={objectFit === 'contain' ? 1 : 0}
            zOrderMediaOverlay={true}
          />
        );
      }
    } catch (error) {
      console.warn("react-native-agora not available:", error);
    }
  } catch (error) {
    console.warn("Error importing Agora components:", error);
  }
  
  // Fallback placeholder
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.placeholderText}>
        {isLocalView ? 'Local Video' : 'Remote Video'}
      </Text>
      <Text style={styles.placeholderSubText}>
        {isLocalView 
          ? 'Camera preview not available' 
          : 'Waiting for remote video...'}
      </Text>
      <Text style={styles.placeholderUID}>
        UID: {uid || 'Unknown'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  videoView: {
    flex: 1,
    backgroundColor: '#333',
  },
  placeholder: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  placeholderUID: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
  }
});

export default PlatformVideoView;