import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Constants
import { COLORS } from '../constants/colors';

interface CallControlsProps {
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
}

const CallControls: React.FC<CallControlsProps> = ({
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  isMuted,
  isVideoOff,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.controlButton,
          isMuted && styles.activeControlButton,
        ]}
        onPress={onToggleAudio}
      >
        <Ionicons
          name={isMuted ? 'mic-off' : 'mic'}
          size={24}
          color={isMuted ? COLORS.callControls.muteActive : COLORS.callControls.button}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.controlButton,
          styles.endCallButton,
        ]}
        onPress={onEndCall}
      >
        <Ionicons
          name="call"
          size={24}
          color={COLORS.callControls.button}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.controlButton,
          isVideoOff && styles.activeControlButton,
        ]}
        onPress={onToggleVideo}
      >
        <Ionicons
          name={isVideoOff ? 'videocam-off' : 'videocam'}
          size={24}
          color={isVideoOff ? COLORS.callControls.videoOff : COLORS.callControls.button}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.callControls.background,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: '#555',
  },
  endCallButton: {
    backgroundColor: COLORS.callControls.endCall,
  },
});

export default CallControls;