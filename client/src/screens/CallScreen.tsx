import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Types
import { RootStackParamList } from '../../App';

// Constants
import { COLORS } from '../constants/colors';

// Components (we'll create these later)
// import VideoView from '../components/VideoView';
// import SubtitleView from '../components/SubtitleView';
// import CallControls from '../components/CallControls';

// Define the navigation prop type
type CallScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Call'>;
type CallScreenRouteProp = RouteProp<RootStackParamList, 'Call'>;

const CallScreen = () => {
  const navigation = useNavigation<CallScreenNavigationProp>();
  const route = useRoute<CallScreenRouteProp>();
  const { callId, remoteUserName, targetLanguage } = route.params;
  
  // States
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [currentTranslation, setCurrentTranslation] = useState<string>('');
  
  // Mock video streams for now
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  
  // Initialize the call
  useEffect(() => {
    console.log(`Starting call with ID: ${callId}, Target language: ${targetLanguage}`);
    
    // Simulate connection delay
    const timer = setTimeout(() => {
      setIsConnecting(false);
      // In a real implementation, we would set the localStream and remoteStream here
    }, 2000);
    
    // Clean up
    return () => {
      clearTimeout(timer);
      // In a real implementation, we would clean up the call resources here
    };
  }, [callId, targetLanguage]);
  
  // Handle back button press
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        confirmEndCall();
        return true; // Prevent default back behavior
      };
      
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [])
  );
  
  // Confirm ending the call
  const confirmEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          style: 'destructive',
          onPress: endCall 
        },
      ]
    );
  };
  
  // End the call and go back
  const endCall = () => {
    // In a real implementation, we would clean up call resources here
    navigation.goBack();
  };
  
  // Toggle audio
  const toggleAudio = () => {
    setIsMuted(prev => !prev);
    // In a real implementation, we would mute/unmute the audio track
    console.log(`Audio ${isMuted ? 'unmuted' : 'muted'}`);
  };
  
  // Toggle video
  const toggleVideo = () => {
    setIsVideoOff(prev => !prev);
    // In a real implementation, we would enable/disable the video track
    console.log(`Video ${isVideoOff ? 'enabled' : 'disabled'}`);
  };
  
  // Simulate translation updates (this would come from the translation service)
  useEffect(() => {
    if (!isConnecting) {
      // Simulate receiving translation updates
      const translations = [
        "Merhaba, nasılsın?",
        "Bugün hava çok güzel.",
        "Projeyi birlikte geliştirelim.",
        "Bu uygulama gerçek zamanlı çeviri yapıyor."
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        setCurrentTranslation(translations[index % translations.length]);
        index++;
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Main Video Area (Remote User) */}
      <View style={styles.remoteVideoContainer}>
        {isConnecting ? (
          <View style={styles.connectingContainer}>
            <Text style={styles.connectingText}>Connecting to {remoteUserName}...</Text>
          </View>
        ) : (
          <View style={styles.mockRemoteVideo}>
            <Text style={styles.mockVideoText}>{remoteUserName}'s Video</Text>
          </View>
        )}
      </View>
      
      {/* Local Video (Picture-in-Picture) */}
      {!isConnecting && !isVideoOff && (
        <View style={styles.localVideoContainer}>
          <View style={styles.mockLocalVideo}>
            <Text style={styles.mockVideoText}>Your Video</Text>
          </View>
        </View>
      )}
      
      {/* Subtitle Area */}
      {!isConnecting && currentTranslation && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>{currentTranslation}</Text>
        </View>
      )}
      
      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.activeControlButton]} 
          onPress={toggleAudio}
        >
          <Ionicons 
            name={isMuted ? "mic-off" : "mic"} 
            size={24} 
            color={isMuted ? COLORS.callControls.muteActive : COLORS.callControls.button} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]} 
          onPress={confirmEndCall}
        >
          <Ionicons name="call" size={24} color={COLORS.callControls.button} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.activeControlButton]} 
          onPress={toggleVideo}
        >
          <Ionicons 
            name={isVideoOff ? "videocam-off" : "videocam"} 
            size={24} 
            color={isVideoOff ? COLORS.callControls.videoOff : COLORS.callControls.button} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockRemoteVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockVideoText: {
    color: 'white',
    fontSize: 18,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mockLocalVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  connectingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  subtitleContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: COLORS.subtitle.background,
    padding: 12,
    borderRadius: 8,
  },
  subtitleText: {
    color: COLORS.subtitle.text,
    fontSize: 16,
    textAlign: 'center',
  },
  controlsContainer: {
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

export default CallScreen;