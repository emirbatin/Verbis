import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

// Constants
import { COLORS } from '../constants/colors';

interface SubtitleViewProps {
  translation: string;
  isActive: boolean;
}

const SubtitleView: React.FC<SubtitleViewProps> = ({ translation, isActive }) => {
  const [prevTranslation, setPrevTranslation] = useState<string>('');
  const opacity = useState(new Animated.Value(0))[0];
  
  // Animate the subtitle when it changes
  useEffect(() => {
    if (translation !== prevTranslation) {
      setPrevTranslation(translation);
      
      // Fade out and in when translation changes
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [translation]);
  
  // Show subtitle only when active and we have a translation
  if (!isActive || !translation) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.subtitleBox,
          { opacity },
        ]}
      >
        <Text style={styles.text}>{translation}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleBox: {
    backgroundColor: COLORS.subtitle.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    maxWidth: '100%',
  },
  text: {
    color: COLORS.subtitle.text,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SubtitleView;