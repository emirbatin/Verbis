import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Application from 'expo-application';

// Constants
import { COLORS } from '../constants/colors';
import { LANGUAGES, DEFAULT_SOURCE_LANGUAGE, Language } from '../constants/languages';

// Platform kontrolleri için bir yardımcı fonksiyon
const isIOS = Platform.OS === 'ios';

// Mock user data - Gerçekte kullanıcı oturum açtığında alınacak
const CURRENT_USER = {
  username: 'batin',
  userId: 'batin#1234',
  language: DEFAULT_SOURCE_LANGUAGE.code,
  displayName: 'Batin',
};

const SettingsScreen = () => {
  // States for settings
  const [autoConnect, setAutoConnect] = useState<boolean>(true);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [highQualityVideo, setHighQualityVideo] = useState<boolean>(false);
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  
  // States for user profile
  const [userName, setUserName] = useState<string>(CURRENT_USER.displayName);
  const [userLanguage, setUserLanguage] = useState<string>(CURRENT_USER.language);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);
  
  // Get selected language
  const getSelectedLanguage = (): Language => {
    return LANGUAGES.find(lang => lang.code === userLanguage) || DEFAULT_SOURCE_LANGUAGE;
  };

  // Toggle functions
  const toggleAutoConnect = () => setAutoConnect(previousState => !previousState);
  const toggleShowSubtitles = () => setShowSubtitles(previousState => !previousState);
  const toggleHighQualityVideo = () => setHighQualityVideo(previousState => !previousState);
  const toggleDarkTheme = () => {
    // For now, just show an info message that this feature is coming soon
    Alert.alert('Coming Soon', 'Dark theme will be available in a future update.');
  };
  
  // Show language selector based on platform
  const showLanguagePicker = () => {
    if (isIOS && Platform.OS !== 'web') {
      // iOS için ActionSheet (web'de çalışmaz)
      try {
        const { ActionSheetIOS } = require('react-native');
        const options = LANGUAGES.map(lang => lang.nativeName);
        const cancelButtonIndex = options.length;
        
        options.push('Cancel');
        
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
            title: 'Select Language',
          },
          (buttonIndex: number) => {
            if (buttonIndex !== cancelButtonIndex) {
              setUserLanguage(LANGUAGES[buttonIndex].code);
            }
          }
        );
      } catch (error) {
        // ActionSheetIOS yoksa veya hata olursa modalı gösterelim
        setShowLanguageSelector(true);
      }
    } else {
      // Android ve Web için modal gösterelim
      setShowLanguageSelector(true);
    }
  };
  
  // Save user profile
  const saveUserProfile = () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }
    
    // Burada normalde API'ye kayıt yapılır
    Alert.alert('Success', 'Profile updated successfully');
    setShowEditProfile(false);
  };
  
  // Select language
  const selectLanguage = (languageCode: string) => {
    setUserLanguage(languageCode);
    setShowLanguageSelector(false);
  };
  
  // Clear app data
  const clearAppData = () => {
    Alert.alert(
      'Clear App Data',
      'Are you sure you want to clear all app data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // Here we would actually clear the data
            Alert.alert('Success', 'All app data has been cleared');
          }
        },
      ]
    );
  };
  
  // Show about info
  const showAboutInfo = () => {
    // Web için Application.nativeApplicationVersion kullanılamaz
    let appVersion = '1.0.0';
    try {
      appVersion = Application.nativeApplicationVersion || '1.0.0';
    } catch (error) {
      // Web'de çalışırsa veya hata alırsa varsayılan versiyon
      appVersion = '1.0.0';
    }
    
    Alert.alert(
      'About Translation Call',
      `Version: ${appVersion}\n\nA real-time translation video calling app built with React Native.`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileUserId}>{CURRENT_USER.userId}</Text>
            <Text style={styles.profileLanguage}>
              Language: {getSelectedLanguage().nativeName}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => setShowEditProfile(true)}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Call Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Auto-Connect Call</Text>
            <Text style={styles.settingDescription}>
              Automatically connect to calls when opened
            </Text>
          </View>
          <Switch
            value={autoConnect}
            onValueChange={toggleAutoConnect}
            trackColor={{ false: '#D1D1D6', true: COLORS.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Show Subtitles</Text>
            <Text style={styles.settingDescription}>
              Display translation subtitles during calls
            </Text>
          </View>
          <Switch
            value={showSubtitles}
            onValueChange={toggleShowSubtitles}
            trackColor={{ false: '#D1D1D6', true: COLORS.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>High Quality Video</Text>
            <Text style={styles.settingDescription}>
              Use higher quality video (uses more data)
            </Text>
          </View>
          <Switch
            value={highQualityVideo}
            onValueChange={toggleHighQualityVideo}
            trackColor={{ false: '#D1D1D6', true: COLORS.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Dark Theme</Text>
            <Text style={styles.settingDescription}>
              Use dark color theme (coming soon)
            </Text>
          </View>
          <Switch
            value={darkTheme}
            onValueChange={toggleDarkTheme}
            trackColor={{ false: '#D1D1D6', true: COLORS.primary }}
            thumbColor="#FFFFFF"
            disabled={true}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.actionItem} onPress={clearAppData}>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.settingTitle, styles.dangerText]}>Clear App Data</Text>
            <Text style={styles.settingDescription}>
              Remove all saved data and reset the app
            </Text>
          </View>
          <Ionicons name="trash-outline" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.actionItem} onPress={showAboutInfo}>
          <View style={styles.actionTextContainer}>
            <Text style={styles.settingTitle}>About Translation Call</Text>
            <Text style={styles.settingDescription}>
              App version and information
            </Text>
          </View>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditProfile(false)}
        presentationStyle={isIOS ? "overFullScreen" : undefined}
      >
        <KeyboardAvoidingView 
          behavior={isIOS ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textDisabled}
              />
              
              <Text style={styles.inputLabel}>Language</Text>
              <TouchableOpacity 
                style={styles.languageSelector}
                onPress={showLanguagePicker}
              >
                <Text style={styles.languageSelectorText}>
                  {getSelectedLanguage().nativeName}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
              
              <Text style={styles.inputLabel}>User ID (cannot be changed)</Text>
              <View style={styles.userIdContainer}>
                <Text style={styles.userIdText}>{CURRENT_USER.userId}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.saveButton,
                !userName.trim() && styles.disabledButton
              ]}
              onPress={saveUserProfile}
              disabled={!userName.trim()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Language Selector Modal */}
      <Modal
        visible={showLanguageSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageSelector(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    userLanguage === language.code && styles.selectedLanguageItem
                  ]}
                  onPress={() => selectLanguage(language.code)}
                >
                  <Text
                    style={[
                      styles.languageItemText,
                      userLanguage === language.code && styles.selectedLanguageItemText
                    ]}
                  >
                    {language.nativeName}
                  </Text>
                  {userLanguage === language.code && (
                    <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileSection: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileUserId: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  profileLanguage: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  editProfileButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editProfileText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  dangerText: {
    color: COLORS.error,
  },
  // Modal stilleri
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: isIOS ? 40 : 20, // iOS için ekstra alt padding
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  languageSelectorText: {
    fontSize: 16,
    color: COLORS.text,
  },
  userIdContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
  },
  userIdText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  selectedLanguageItem: {
    backgroundColor: COLORS.surface,
  },
  languageItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedLanguageItemText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default SettingsScreen;