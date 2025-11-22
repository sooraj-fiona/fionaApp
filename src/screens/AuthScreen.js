import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles';
import { ThermoBadge } from '../components/common';

const AuthButton = ({ icon, label, variant, onPress }) => {
  const backgroundColor = variant === 'apple' ? '#3F3550' : '#FFFFFF';
  const textColor = variant === 'apple' ? '#FFFFFF' : '#1C142F';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ width: '100%' }}
      onPress={onPress}
    >
      <View
        style={[
          styles.authButton,
          {
            backgroundColor,
            borderColor:
              variant === 'apple' ? 'transparent' : 'rgba(0,0,0,0.05)',
          },
        ]}
      >
        <View style={styles.authButtonIcon}>{icon}</View>
        <Text
          style={[
            styles.authButtonLabel,
            { color: textColor },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const AuthScreen = ({ onProviderSelect }) => {
  const isIOS = Platform.OS === 'ios';

  return (
    <View style={styles.authContainer}>
      <ThermoBadge />
      <Text style={styles.authHeadline}>
        Log in or sign up <Text style={styles.highlight}>in seconds</Text>
      </Text>

      <View style={styles.authButtons}>
        {isIOS && (
          <AuthButton
            icon={<Ionicons name="logo-apple" size={22} color="#FFFFFF" />}
            label="Continue with Apple"
            variant="apple"
            onPress={() => onProviderSelect('apple')}
          />
        )}
        <AuthButton
          icon={
            <FontAwesome5
              name="google"
              size={18}
              color={isIOS ? '#1C142F' : '#6C6C83'}
            />
          }
          label="Continue with Google"
          variant={isIOS ? 'googleIOS' : 'google'}
          onPress={() => onProviderSelect('google')}
        />
      </View>

      <Text style={styles.authNote}>
        Your data is securely protected with{' '}
        {isIOS ? 'Apple & Google' : 'Google'}
      </Text>

      <Text style={styles.authTerms}>
        By continuing, you agree to Fiona's{' '}
        <Text style={styles.link}>Terms of Use</Text>.{'\n'}
        Read our <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </View>
  );
};
