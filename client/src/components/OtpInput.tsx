import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

interface OtpInputProps {
  codeLength?: number;
  onCodeChange: (code: string) => void;
  autoFocus?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ 
  codeLength = 6, 
  onCodeChange, 
  autoFocus = true
}) => {
  const [code, setCode] = useState<string>('');
  const inputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    // Sadece sayıları kabul et
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Maximum uzunluğu kontrol et
    if (numericValue.length <= codeLength) {
      setCode(numericValue);
      onCodeChange(numericValue);
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Bir kutuya tıklandığında input'a odaklan
  const handlePress = () => {
    focusInput();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={code}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          autoFocus={autoFocus}
          maxLength={codeLength}
        />
        
        <View style={styles.inputsContainer}>
          {[...Array(codeLength)].map((_, index) => {
            const isFilled = index < code.length;
            const isCurrentPosition = index === code.length;
            
            return (
              <View
                key={index}
                style={[
                  styles.inputBox,
                  isFilled && styles.inputBoxFilled,
                  isCurrentPosition && styles.inputBoxCurrent,
                ]}
              >
                {isFilled && <TextInput 
                  style={styles.inputText} 
                  editable={false}
                  value={code[index]}
                />}
              </View>
            );
          })}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  inputBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9fb',
  },
  inputBoxFilled: {
    borderColor: '#8E54E9',
    backgroundColor: 'rgba(142, 84, 233, 0.05)',
  },
  inputBoxCurrent: {
    borderColor: '#4776E6',
    borderWidth: 2,
  },
  inputText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  }
});

export default OtpInput;