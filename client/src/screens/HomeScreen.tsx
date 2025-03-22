import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Types
import { RootStackParamList } from '../../App';

// Constants
import { COLORS } from '../constants/colors';
import { DEFAULT_SOURCE_LANGUAGE } from '../constants/languages';

// Define the navigation prop type
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Mock user data - Gerçekte kullanıcı oturum açtığında alınacak
const CURRENT_USER = {
  username: 'batin',
  userId: 'batin#1234',
  language: DEFAULT_SOURCE_LANGUAGE.code,
};

// Mock friends data - sonradan gerçek verilerle değiştirilecek
const MOCK_FRIENDS = [
  {
    id: '1',
    username: 'wei',
    userId: 'wei#4587',
    name: 'Wei Zhang',
    avatar: null, // default avatar kullanılacak
    language: 'zh', // Çince
    online: true,
    lastSeen: null,
  },
  {
    id: '2',
    username: 'anna',
    userId: 'anna#9012',
    name: 'Anna Schmidt',
    avatar: null,
    language: 'de', // Almanca
    online: false,
    lastSeen: '10:30',
  },
  {
    id: '3',
    username: 'carlos',
    userId: 'carlos#3456',
    name: 'Carlos Rodriguez',
    avatar: null,
    language: 'es', // İspanyolca
    online: true,
    lastSeen: null,
  },
  {
    id: '4',
    username: 'yuki',
    userId: 'yuki#7890',
    name: 'Yuki Tanaka',
    avatar: null,
    language: 'ja', // Japonca
    online: false,
    lastSeen: 'Yesterday',
  },
  {
    id: '5',
    username: 'alex',
    userId: 'alex#2345',
    name: 'Alex Johnson',
    avatar: null,
    language: 'en', // İngilizce
    online: true,
    lastSeen: null,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [showAddFriend, setShowAddFriend] = useState<boolean>(false);
  const [friendUserId, setFriendUserId] = useState<string>('');
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
  
  // Generate a unique call ID
  const generateCallId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Call a friend
  const callFriend = (friend: typeof MOCK_FRIENDS[0]) => {
    // Generate a unique call ID
    const callId = generateCallId();
    
    // Navigate to the call screen
    navigation.navigate('Call', {
      callId,
      remoteUserName: friend.name,
      targetLanguage: friend.language,
    });
  };
  
  // Navigate to settings
  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };
  
  // Add a new friend by userId
  const addFriend = () => {
    if (!friendUserId.trim()) {
      Alert.alert('Error', 'Please enter a valid User ID');
      return;
    }
    
    // Check if friend already exists
    const friendExists = friends.some(friend => friend.userId === friendUserId);
    if (friendExists) {
      Alert.alert('Error', 'This user is already in your friends list');
      setFriendUserId('');
      return;
    }
    
    // Simulate friend search (Gerçekte bir API çağrısı yapılacak)
    // Rastgele arkadaş bilgileri oluştur
    const usernamePart = friendUserId.split('#')[0] || 'user';
    const newFriend = {
      id: (friends.length + 1).toString(),
      username: usernamePart,
      userId: friendUserId,
      name: usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1), // Basit bir isim oluştur
      avatar: null,
      language: ['en', 'zh', 'es', 'de', 'fr', 'ru'][Math.floor(Math.random() * 6)], // Rastgele dil
      online: Math.random() > 0.5, // Rastgele çevrimiçi durum
      lastSeen: null,
    };
    
    setFriends([...friends, newFriend]);
    setFriendUserId('');
    setShowAddFriend(false);
    
    Alert.alert('Success', `${newFriend.name} has been added to your friends list`);
  };

  // Copy your User ID to clipboard
  const copyUserId = () => {
    // Gerçekte panoya kopyalama işlemi yapılır
    Alert.alert('Copied', 'Your User ID has been copied to clipboard');
  };

  // Filter friends by search query
  const filteredFriends = searchQuery
    ? friends.filter(friend => 
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.userId.toLowerCase().includes(searchQuery.toLowerCase()))
    : friends;

  // Render each friend item
  const renderFriendItem = ({ item }: { item: typeof MOCK_FRIENDS[0] }) => (
    <View style={styles.friendItem}>
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.defaultAvatar, { backgroundColor: item.online ? COLORS.primary : COLORS.textDisabled }]}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
        )}
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.lastSeen}>
          {item.online ? 'Online' : item.lastSeen ? `Last seen ${item.lastSeen}` : 'Offline'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.callButton}
        onPress={() => callFriend(item)}
      >
        <Ionicons name="videocam" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfoButton} 
          onPress={() => setShowUserInfo(true)}
        >
          <View style={styles.currentUserAvatar}>
            <Text style={styles.currentUserAvatarText}>{CURRENT_USER.username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>Translation Call</Text>
        </TouchableOpacity>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setShowAddFriend(true)}
          >
            <Ionicons name="person-add-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={navigateToSettings}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor={COLORS.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.friendsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No friends found.</Text>
            <TouchableOpacity 
              style={styles.addFirstFriendButton}
              onPress={() => setShowAddFriend(true)}
            >
              <Text style={styles.addFirstFriendText}>Add your first friend</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Add Friend Modal */}
      <Modal
        visible={showAddFriend}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddFriend(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Friend</Text>
              <TouchableOpacity onPress={() => setShowAddFriend(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Enter Friend's User ID</Text>
              <Text style={styles.inputDescription}>
                Ask your friend for their unique User ID (example: username#1234)
              </Text>
              <TextInput
                style={styles.input}
                placeholder="username#1234"
                placeholderTextColor={COLORS.textDisabled}
                value={friendUserId}
                onChangeText={setFriendUserId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <TouchableOpacity
              style={[
                styles.addButton,
                !friendUserId.trim() && styles.disabledButton
              ]}
              onPress={addFriend}
              disabled={!friendUserId.trim()}
            >
              <Text style={styles.addButtonText}>Add Friend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* User Info Modal */}
      <Modal
        visible={showUserInfo}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUserInfo(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Profile</Text>
              <TouchableOpacity onPress={() => setShowUserInfo(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfoContainer}>
              <View style={styles.userInfoAvatar}>
                <Text style={styles.userInfoAvatarText}>{CURRENT_USER.username.charAt(0).toUpperCase()}</Text>
              </View>
              
              <Text style={styles.userInfoName}>
                {CURRENT_USER.username}
              </Text>
              
              <View style={styles.userIdContainer}>
                <Text style={styles.userId}>{CURRENT_USER.userId}</Text>
                <TouchableOpacity style={styles.copyButton} onPress={copyUserId}>
                  <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.userIdDescription}>
                Share your User ID with friends so they can add you
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  userInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  currentUserAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
  },
  friendsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  lastSeen: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  addFirstFriendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  addFirstFriendText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
    marginBottom: 4,
  },
  inputDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.border,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userInfoAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfoAvatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '600',
  },
  userInfoName: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  userId: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 10,
  },
  copyButton: {
    padding: 4,
  },
  userIdDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;