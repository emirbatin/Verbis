import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Constants
import { COLORS } from '../constants/colors';

interface VideoViewProps {
  stream: any; // Bu ileride gerçek stream türüyle değiştirilecek
  style?: object;
  userName?: string;
  isLocal?: boolean;
}

const VideoView: React.FC<VideoViewProps> = ({ stream, style, userName, isLocal = false }) => {
  // Şu anda stream gönderilmediği için mock bir görünüm oluşturuyoruz
  // Gerçek WebRTC entegrasyonunda RTCView kullanılacak
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.videoPlaceholder, isLocal && styles.localVideoPlaceholder]}>
        <Text style={styles.placeholderText}>
          {isLocal ? "Your Video" : userName ? `${userName}'s Video` : "Remote Video"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  videoPlaceholder: {
    backgroundColor: '#333',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoPlaceholder: {
    backgroundColor: '#555',
  },
  placeholderText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VideoView;