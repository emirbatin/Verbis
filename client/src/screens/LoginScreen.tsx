import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  Animated,
  TextInput,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

import { COLORS } from "../constants/colors";
import { RootStackParamList } from "../../App";
import OtpInput from "../components/OtpInput"; // OTP bileşeni import edildi

type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  // Screen dimensions
  const { width, height } = Dimensions.get("window");

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  // Animation refs for input fields
  const inputAnimations = useRef(
    [...Array(4)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Start animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered animations for input elements
    Animated.stagger(
      200,
      inputAnimations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();

    // Check if biometric authentication is available
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    setBiometricsAvailable(compatible && enrolled);
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Kimliğinizi doğrulayın",
        fallbackLabel: "Şifre kullanın",
      });

      if (result.success) {
        Alert.alert("Başarılı", "Biyometrik kimlik doğrulama başarılı");
        navigation.replace("Home");
      }
    } catch (error) {
      console.log("Biyometrik kimlik doğrulama hatası:", error);
    }
  };

  const sendVerificationCode = () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Hata", "Lütfen geçerli bir telefon numarası girin");
      return;
    }

    setIsSendingCode(true);

    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setIsSendingCode(false);
      setIsVerifying(true);
      Alert.alert(
        "Kod Gönderildi",
        `${phoneNumber} numarasına doğrulama kodu gönderildi.`
      );
    }, 1500);
  };

  const verifyCode = () => {
    if (verificationCode.length < 4) {
      Alert.alert("Hata", "Lütfen geçerli bir doğrulama kodu girin");
      return;
    }

    // Simüle edilmiş doğrulama işlemi
    setTimeout(() => {
      Alert.alert("Başarılı", "Kimlik doğrulama başarılı");
      navigation.replace("Home");
    }, 1000);
  };

  const resetVerification = () => {
    setIsVerifying(false);
    setVerificationCode("");
  };

  // QR Code ile giriş simülasyonu
  const handleQRCodeLogin = () => {
    Alert.alert(
      "QR Kod Girişi",
      "Bilgisayarınızda veya başka bir cihazda görüntülenen QR kodu taratın",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "QR Kod Tara",
          onPress: () => {
            // Burada QR kod tarama kamerasını açma işlemi yapılır
            setTimeout(() => {
              Alert.alert("Başarılı", "QR kod doğrulandı");
              navigation.replace("Home");
            }, 1500);
          },
        },
      ]
    );
  };

  const loginWithSocialProvider = (provider: string) => {
    Alert.alert("Bilgi", `${provider} ile giriş işlemi başlatılıyor...`);

    // Gerçek uygulamada burada OAuth işlemleri olurdu
    setTimeout(() => {
      Alert.alert("Başarılı", `${provider} ile giriş başarılı`);
      navigation.replace("Home");
    }, 1500);
  };

  const renderPhoneInput = () => (
    <Animated.View
      style={[
        styles.inputContainer,
        {
          opacity: inputAnimations[0],
          transform: [
            {
              translateY: Animated.multiply(
                inputAnimations[0],
                new Animated.Value(-20)
              ),
            },
          ],
        },
      ]}
    >
      <Text style={styles.label}>Telefon Numarası</Text>
      <View style={styles.phoneInputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+90</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#333333"
          />
        </View>
        <View style={styles.phoneInputWrapper}>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="5XX XXX XX XX"
            keyboardType="phone-pad"
            maxLength={10}
          />
          {phoneNumber.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setPhoneNumber("")}
            >
              <Ionicons name="close-circle" size={18} color="#bbb" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, !phoneNumber && styles.disabledButton]}
        disabled={!phoneNumber || isSendingCode}
        onPress={sendVerificationCode}
      >
        {isSendingCode ? (
          <View style={styles.loadingContainer}>
            <Animated.View
              style={{
                ...styles.loadingDot,
                opacity: fadeAnim,
              }}
            />
            <Text style={styles.actionButtonText}>Kod Gönderiliyor</Text>
          </View>
        ) : (
          <Text style={styles.actionButtonText}>Kod Gönder</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderVerificationInput = () => (
    <Animated.View
      style={[
        styles.inputContainer,
        {
          opacity: inputAnimations[1],
          transform: [
            {
              translateY: Animated.multiply(
                inputAnimations[1],
                new Animated.Value(-20)
              ),
            },
          ],
        },
      ]}
    >
      <View style={styles.verificationHeader}>
        <Text style={styles.label}>Doğrulama Kodu</Text>
        <TouchableOpacity
          style={styles.changeNumberButton}
          onPress={resetVerification}
        >
          <Ionicons
            name="arrow-back-outline"
            size={14}
            color="#333333"
          />
          <Text style={styles.changeNumberText}>Numara Değiştir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.otpContainer}>
        <OtpInput
          codeLength={6}
          onCodeChange={setVerificationCode}
          autoFocus={true}
        />
      </View>

      <View style={styles.hintContainer}>
        <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
        <Text style={styles.hintText}>
          <Text style={styles.phoneNumberHighlight}>{phoneNumber}</Text>{" "}
          numarasına gönderilen kodu girin
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          verificationCode.length < 4 && styles.disabledButton,
        ]}
        disabled={verificationCode.length < 4}
        onPress={verifyCode}
      >
        <Text style={styles.actionButtonText}>Doğrula</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendCodeButton}>
        <Text style={styles.resendCodeText}>Kodu tekrar gönder</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Image
        source={{ uri: "https://i.imgur.com/8FtZTU6.png" }}
        style={styles.backgroundPattern}
        resizeMode="cover"
      />
      <View style={styles.gradientOverlay}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.headerContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Verbis</Text>
                <View style={styles.subtitleContainer}>
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={16}
                    color="#4CAF50"
                    style={styles.securityIcon}
                  />
                  <Text style={styles.subtitle}>
                    Hızlı ve güvenli kimlik doğrulama
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.authContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Animated.View
                style={[
                  styles.cardContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: scaleAnim },
                    ],
                  },
                ]}
              >
                {!isVerifying ? renderPhoneInput() : renderVerificationInput()}
              </Animated.View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.divider} />
              </View>

              <Animated.View
                style={[
                  styles.socialButtonsContainer,
                  {
                    opacity: inputAnimations[2],
                    transform: [
                      {
                        translateY: Animated.multiply(
                          inputAnimations[2],
                          new Animated.Value(-20)
                        ),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => loginWithSocialProvider("Apple")}
                >
                  <View style={styles.socialIconContainer}>
                    <Ionicons name="logo-apple" size={22} color="#000" />
                  </View>
                  <Text style={styles.socialButtonText}>
                    Apple ile devam et
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => loginWithSocialProvider("Google")}
                >
                  <View style={styles.socialIconContainer}>
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                  </View>
                  <Text style={styles.socialButtonText}>
                    Google ile devam et
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  styles.alternativeLoginContainer,
                  {
                    opacity: inputAnimations[3],
                    transform: [
                      {
                        translateY: Animated.multiply(
                          inputAnimations[3],
                          new Animated.Value(-20)
                        ),
                      },
                    ],
                  },
                ]}
              >
                {biometricsAvailable && (
                  <TouchableOpacity
                    style={styles.biometricButton}
                    onPress={handleBiometricAuth}
                  >
                    <View style={styles.biometricIconContainer}>
                      <Ionicons
                        name={
                          Platform.OS === "ios"
                            ? "finger-print"
                            : "finger-print-outline"
                        }
                        size={24}
                        color="#333333"
                      />
                    </View>
                    <Text style={styles.biometricButtonText}>
                      Biyometrik Kimlik Doğrulama
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  style={styles.qrCodeButton}
                  onPress={handleQRCodeLogin}
                >
                  <View style={styles.qrIconContainer}>
                    <Ionicons name="qr-code-outline" size={22} color="#333333" />
                  </View>
                  <Text style={styles.qrCodeButtonText}>
                    QR Kod ile Giriş Yap
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            <Animated.View
              style={[
                styles.footer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: Animated.multiply(
                        fadeAnim,
                        new Animated.Value(-10)
                      ),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.footerIconContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color="#6B7280"
                />
              </View>
              <Text style={styles.footerText}>
                Devam ederek,
                <Text style={styles.footerLink}> Kullanım Şartları </Text>
                ve
                <Text style={styles.footerLink}> Gizlilik Politikası</Text>'nı
                kabul etmiş olursunuz
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.08,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginTop: 90,
    marginBottom: 20,
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  securityIcon: {
    marginRight: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "400",
  },
  authContainer: {
    marginBottom: 30,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 6,
    color: "#333333",
  },
  phoneInputWrapper: {
    flex: 1,
    position: "relative",
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: "#F9F9FB",
    paddingRight: 40,
  },
  clearButton: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginRight: 8,
  },
  actionButton: {
    backgroundColor: "#000000",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  verificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  changeNumberButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeNumberText: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  otpContainer: {
    marginBottom: 18,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  hintText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },
  phoneNumberHighlight: {
    fontWeight: "600",
    color: "#333333",
  },
  resendCodeButton: {
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 8,
  },
  resendCodeText: {
    color: "#333333",
    fontSize: 15,
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    paddingBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    paddingHorizontal: 16,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  socialButtonsContainer: {
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  socialIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  alternativeLoginContainer: {
    marginBottom: 20,
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  biometricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  qrCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  qrIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  qrCodeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  footer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  footerIconContainer: {
    marginTop: 2,
    marginRight: 6,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "left",
    lineHeight: 20,
  },
  footerLink: {
    color: "#333333",
    fontWeight: "500",
  },
});

export default LoginScreen;