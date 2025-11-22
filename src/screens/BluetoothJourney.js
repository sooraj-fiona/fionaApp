import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import styles from '../styles';
import { BLUETOOTH_STEPS, DEVICE_FIXTURES } from '../constants';
import { BackButton, StepperDots, ThermoBadge } from '../components/common';

const DeviceConnectionCard = ({ label }) => (
  <View style={styles.connectionCard}>
    <Text style={styles.connectionLabel}>{label}</Text>
    <View style={styles.connectionRow}>
      <View style={styles.connectionIcon}>
        <Feather name="smartphone" size={18} color="#E6E1FF" />
      </View>
      <Svg height={40} width="60%" viewBox="0 0 200 40">
        <Path
          d="M0 30 C 40 5, 80 5, 120 30 S 200 55, 200 15"
          stroke="#7EE1FF"
          strokeWidth={3}
          fill="none"
        />
      </Svg>
      <View style={styles.connectionIcon}>
        <Feather name="thermometer" size={18} color="#E6E1FF" />
      </View>
    </View>
  </View>
);

const IntroConnection = ({ onConnect }) => (
  <View style={styles.btIntroCard}>
    <Text style={styles.btIntroTitle}>Real Time Monitoring</Text>
    <View style={styles.btBulletList}>
      <Text style={styles.btBullet}>• Continuous Temperature Tracking</Text>
      <Text style={styles.btBullet}>• Instant alert for spikes</Text>
      <Text style={styles.btBullet}>
        • Designed for safe, personalized care
      </Text>
    </View>
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.btPrimaryButton}
      onPress={onConnect}
    >
      <Ionicons name="bluetooth" size={18} color="#1C142F" />
      <Text style={styles.btPrimaryLabel}>Connect Device</Text>
    </TouchableOpacity>
  </View>
);

const DeviceListItem = ({ device, onPress }) => {
  const statusLabel = {
    idle: 'Not Connected',
    connecting: 'Connecting...',
    connected: 'Connected',
  }[device.status];

  const statusColor = {
    idle: '#CFC9E7',
    connecting: '#8F96FF',
    connected: '#58E0A8',
  }[device.status];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.deviceRow}
      onPress={onPress}
    >
      <View>
        <Text style={styles.deviceName}>{device.label}</Text>
        <Text style={[styles.deviceStatus, { color: statusColor }]}>
          {statusLabel}
        </Text>
      </View>
      <View style={styles.deviceActions}>
        {device.status === 'connecting' && (
          <ActivityIndicator size="small" color="#D8C9FF" style={{ marginRight: 8 }} />
        )}
        {device.status === 'connected' ? (
          <Feather name="check-circle" size={18} color="#58E0A8" />
        ) : (
          <Feather name="info" size={18} color="#DAD4F3" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SearchingSection = ({ devices, onDevicePress }) => (
  <View style={styles.btSearchWrapper}>
    <Text style={styles.btNote}>
      Make sure your device is powered on and within range
    </Text>
    <Text style={styles.btScanning}>Scanning using Bluetooth</Text>

    <View style={styles.devicesCard}>
      <Text style={styles.devicesHeader}>Available Devices</Text>
      {devices.map((device) => (
        <DeviceListItem
          key={device.id}
          device={device}
          onPress={() => onDevicePress(device.id)}
        />
      ))}
    </View>

    <Text style={styles.btFooterText}>
      Device not showing? <Text style={styles.link}>Try again</Text> or{' '}
      <Text style={styles.link}>Set up manually</Text>
    </Text>
  </View>
);

const SuccessSection = ({ onContinue, device }) => (
  <View style={styles.btSuccessWrapper}>
    <Text style={styles.btSuccessCopy}>
      Your device is now ready for temperature monitoring
    </Text>
    <View style={styles.successCard}>
      <View style={styles.successCardHeader}>
        <Text style={styles.devicesHeader}>My Device</Text>
        <Text style={styles.deviceStatusSuccess}>Connected</Text>
      </View>
      <DeviceConnectionCard label={device.label} />
    </View>
    <TouchableOpacity
      style={styles.successButton}
      activeOpacity={0.9}
      onPress={onContinue}
    >
      <Text style={styles.successButtonLabel}>Continue</Text>
    </TouchableOpacity>
  </View>
);

export const BluetoothJourney = ({ user, onBack, onComplete }) => {
  const [step, setStep] = useState('intro');
  const [devices, setDevices] = useState(DEVICE_FIXTURES);

  useEffect(() => {
    let transitionTimer;
    if (step === 'search') {
      setDevices((prev) =>
        prev.map((device, index) =>
          index === 0
            ? { ...device, status: 'connecting' }
            : { ...device, status: 'idle' },
        ),
      );
      transitionTimer = setTimeout(() => {
        setDevices((prev) =>
          prev.map((device, index) =>
            index === 0
              ? { ...device, status: 'connected' }
              : device,
          ),
        );
        setStep('success');
      }, 3200);
    }
    return () => {
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
    };
  }, [step]);

  const handleDevicePress = (deviceId) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? { ...device, status: 'connecting' }
          : { ...device, status: 'idle' },
      ),
    );
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, status: 'connected' }
            : device,
        ),
      );
      setStep('success');
    }, 2500);
  };

  const activeIndex = BLUETOOTH_STEPS.indexOf(step);

  return (
    <View style={styles.btContainer}>
      <BackButton onPress={onBack} />
      <ScrollView
        contentContainerStyle={styles.btContent}
        showsVerticalScrollIndicator={false}
      >
        <ThermoBadge
          showTag={step === 'success'}
          tagLabel="TS"
          tagColor="#F04E5A"
        />
        <Text style={styles.btWelcome}>
          Welcome, <Text style={styles.highlight}>{user.name}</Text>
        </Text>
        <Text style={styles.btSubHeading}>
          {step === 'intro' && 'Lets connect your smart temperature device to begin Real Time Monitoring'}
          {step === 'search' && 'Searching for Devices...'}
          {step === 'success' && 'Device connected successfully!'}
        </Text>

        <StepperDots count={BLUETOOTH_STEPS.length} activeIndex={activeIndex} />

        {step === 'intro' && (
          <IntroConnection onConnect={() => setStep('search')} />
        )}

        {step === 'search' && (
          <SearchingSection
            devices={devices}
            onDevicePress={handleDevicePress}
          />
        )}

        {step === 'success' && (
          <SuccessSection onContinue={onComplete} device={devices[0]} />
        )}
      </ScrollView>
    </View>
  );
};
