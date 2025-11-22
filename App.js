import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import styles from './src/styles';
import {
  SLIDES,
  USER_FIXTURES,
  SCREEN_WIDTH,
} from './src/constants';
import {
  AuthScreen,
  BluetoothJourney,
  CareSlide,
  DashboardScreen,
  JourneySlide,
  LogoSlide,
  ProfileJourney,
} from './src/screens';
import { useFlowRouter } from './src/navigation/useFlowRouter';

export default function App() {
  // Prevent system font scaling from breaking layout across screens.
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const {
    flow,
    listRef,
    currentSlide,
    userProfile,
    goToSlide,
    handleMomentumEnd,
    handleAuthSelect,
    goToBluetooth,
    goToProfile,
    goToDashboard,
    goBackToAuth,
    goBackToBluetooth,
    goBackToProfile,
  } = useFlowRouter();

  if (!fontsLoaded) {
    return null;
  }

  const renderContent = () => {
    if (flow === 'splash') {
      return (
        <>
          <FlatList
            ref={listRef}
            data={SLIDES}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleMomentumEnd}
            renderItem={({ item }) => (
              <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
                {item.type === 'logo' && <LogoSlide />}
                {item.type === 'care' && <CareSlide />}
                {item.type === 'journey' && (
                  <JourneySlide
                    onPressCta={() => {
                      if (currentSlide < SLIDES.length - 1) {
                        goToSlide(currentSlide + 1);
                      } else {
                        goBackToAuth();
                      }
                    }}
                  />
                )}
              </View>
            )}
          />

          <View style={styles.pagination}>
            {SLIDES.map((slide, index) => (
              <TouchableOpacity
                key={slide.key}
                activeOpacity={0.9}
                onPress={() => goToSlide(index)}
              >
                <View
                  style={[
                    styles.paginationDot,
                    index === currentSlide && styles.paginationDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </>
      );
    }

    if (flow === 'auth') {
      return (
        <AuthScreen
          onProviderSelect={handleAuthSelect}
        />
      );
    }

    if (flow === 'bluetooth') {
      return (
        <BluetoothJourney
          user={userProfile || USER_FIXTURES.google}
          onBack={goBackToAuth}
          onComplete={goToProfile}
        />
      );
    }

    if (flow === 'profile') {
      return (
        <ProfileJourney
          onBack={goBackToBluetooth}
          onFinish={goToDashboard}
        />
      );
    }

    return (
      <DashboardScreen
        user={userProfile || USER_FIXTURES.google}
        onBack={goBackToProfile}
      />
    );
  };

  return (
    <LinearGradient
      colors={['#4B355F', '#1C142F', '#07040A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        {renderContent()}
      </SafeAreaView>
    </LinearGradient>
  );
}
