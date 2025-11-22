import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles';
import { ThermoBadge, ThermometerMark } from '../components/common';

export const LogoSlide = () => (
  <View style={styles.logoSlide}>
    <View style={styles.logoRow}>
      <Text style={styles.brandLetter}>f</Text>
      <View style={styles.brandDot} />
      <ThermometerMark />
      <Text style={styles.brandRest}>ona</Text>
    </View>
    <View style={styles.logoFooter}>
      <View style={styles.footerLine} />
      <Text style={styles.tagline}>Care That Never Sleeps</Text>
    </View>
  </View>
);

export const CareSlide = () => (
  <View style={styles.messageSlide}>
    <ThermoBadge />
    <Text style={styles.headline}>
      Continuous{'\n'}
      <Text style={styles.highlight}>Temperature Care</Text>
      {'\n'}for the Ones You Love
    </Text>
  </View>
);

export const JourneySlide = ({ onPressCta }) => (
  <View style={styles.messageSlide}>
    <ThermoBadge />
    <Text style={styles.headline}>
      Start Your{'\n'}
      <Text style={styles.highlight}>Smart Temperature Care</Text>
      {'\n'}Journey
    </Text>
    <Text style={styles.subline}>Monitor | Detect | Protect</Text>

    <TouchableOpacity
      style={styles.ctaWrapper}
      activeOpacity={0.9}
      onPress={onPressCta}
    >
      <LinearGradient
        colors={['#1A1427', '#06040C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaLabel}>Lets start</Text>
        <View style={styles.ctaArrows}>
          <Feather name="chevron-right" size={18} color="#F6EBC6" />
          <Feather name="chevron-right" size={18} color="#F6EBC6" />
          <Feather name="chevron-right" size={18} color="#F6EBC6" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);
