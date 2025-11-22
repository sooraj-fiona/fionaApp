import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import styles from '../styles';

export const BackButton = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.backButton}
    onPress={onPress}
  >
    <Feather name="chevron-left" size={20} color="#EEE7FF" />
  </TouchableOpacity>
);

export const StepperDots = ({ count, activeIndex }) => (
  <View style={styles.stepDots}>
    {Array.from({ length: count }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.stepDot,
          index === activeIndex && styles.stepDotActive,
        ]}
      />
    ))}
  </View>
);

export const ThermoBadge = ({
  showTag = false,
  tagLabel = 'TS',
  tagColor = '#F04E5A',
}) => (
  <View style={styles.badge}>
    {[160, 190, 220, 250].map((size, index) => (
      <View
        key={size}
        style={[
          styles.badgeRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            opacity: 0.10 + index * 0.08,
          },
        ]}
      />
    ))}
    <View style={styles.badgeInner}>
      <ThermometerMark />
    </View>
    <View style={styles.badgeOrb} />
    {showTag && (
      <View style={[styles.badgeTag, { backgroundColor: tagColor }]}>
        <Text style={styles.badgeTagLabel}>{tagLabel}</Text>
      </View>
    )}
  </View>
);

export const ThermometerMark = () => (
  <Svg width={54} height={54} viewBox="0 0 54 54">
    <Rect
      x={23}
      y={8}
      width={8}
      height={28}
      rx={4}
      stroke="#F6EBC6"
      strokeWidth={2.5}
      fill="none"
    />
    <Circle
      cx={27}
      cy={40}
      r={9}
      stroke="#7FDBFF"
      strokeWidth={2}
      fill="none"
    />
    <Line
      x1={27}
      y1={12}
      x2={27}
      y2={31}
      stroke="#F6EBC6"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
    <Circle cx={27} cy={40} r={5} fill="#F6EBC6" />
  </Svg>
);
