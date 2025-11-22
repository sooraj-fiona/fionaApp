import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

const { width } = Dimensions.get('window');

const SLIDES = [
  { key: 'logo', type: 'logo' },
  { key: 'care', type: 'care' },
  { key: 'journey', type: 'journey' },
];

const FLOW = {
  SPLASH: 'splash',
  AUTH: 'auth',
  BLUETOOTH: 'bluetooth',
  PROFILE: 'profile',
  DASHBOARD: 'dashboard',
};

const USER_FIXTURES = {
  google: {
    name: 'Edward',
    email: 'edward.rivers@example.com',
    avatar: 'ER',
    role: 'primary',
  },
  apple: {
    name: 'Edward',
    email: 'edward.rivers@example.com',
    avatar: 'ER',
    role: 'primary',
  },
};

const DEVICE_FIXTURES = [
  {
    id: 'thermosense-1024',
    label: 'ThermoSense_1024',
    shortCode: 'TS',
    status: 'idle',
  },
  {
    id: 'caretemp-a7b3',
    label: 'CareTemp Pro - A7B3',
    shortCode: 'CP',
    status: 'idle',
  },
  {
    id: 'smarttemp-xl',
    label: 'SmartTemp_XL - 91FF',
    shortCode: 'ST',
    status: 'idle',
  },
];

const BLUETOOTH_STEPS = ['intro', 'search', 'success'];
const PROFILE_STEPS = ['form', 'list', 'select', 'summary'];
const DEFAULT_PROFILES = [
  {
    id: 'lizzy-baby',
    name: 'Lizzy Baby',
    ageLabel: '4 Years old',
    gender: 'Female',
    mode: 'Febrile Epilepsy Mode',
    low: '37.5ºC',
    high: '37.5ºC',
  },
  {
    id: 'mia-hale',
    name: 'Mia Hale',
    ageLabel: '7 Years old',
    gender: 'Female',
    mode: 'Comfort Care Mode',
    low: '36.8ºC',
    high: '38.2ºC',
  },
  {
    id: 'leo-park',
    name: 'Leo Park',
    ageLabel: '12 Years old',
    gender: 'Male',
    mode: 'Standard Watch Mode',
    low: '36.5ºC',
    high: '38.0ºC',
  },
];
const TEMP_STATE_VARIANTS = {
  normal: {
    label: 'Normal',
    colorStops: ['#96F8D9', '#63C6BC'],
    tagColor: '#1F6756',
  },
  elevated: {
    label: 'Elevated',
    colorStops: ['#FFD994', '#FFB762'],
    tagColor: '#7A4A1F',
  },
  critical: {
    label: 'Critical',
    colorStops: ['#FF9A9A', '#F04E5A'],
    tagColor: '#821D1D',
  },
};

const MANAGE_ACCESS_FIXTURES = [
  {
    id: 'dr-sarah',
    name: 'Dr. Sarah',
    role: 'Secondary User',
    access: 'Full Access',
    initials: 'DS',
  },
  {
    id: 'rachel',
    name: 'Rachel',
    role: 'Tertiary User',
    access: 'View Only',
    initials: 'RA',
  },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [flow, setFlow] = useState(FLOW.SPLASH);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const listRef = useRef(null);

  if (!fontsLoaded) {
    return null;
  }

  const handleMomentumEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width,
    );
    setCurrentSlide(index);
  };

  const goToSlide = (index) => {
    listRef.current?.scrollToIndex({
      index,
      animated: true,
    });
    setCurrentSlide(index);
  };

  const renderContent = () => {
    if (flow === FLOW.SPLASH) {
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
              <View style={[styles.slide, { width }]}>
                {item.type === 'logo' && <LogoSlide />}
                {item.type === 'care' && <CareSlide />}
                {item.type === 'journey' && (
                  <JourneySlide
                    onPressCta={() => {
                      if (currentSlide < SLIDES.length - 1) {
                        goToSlide(currentSlide + 1);
                      } else {
                        setFlow(FLOW.AUTH);
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

    if (flow === FLOW.AUTH) {
      return (
        <AuthScreen
          onProviderSelect={(provider) => {
            const profile =
              USER_FIXTURES[provider] || USER_FIXTURES.google;
            setUserProfile(profile);
            setFlow(FLOW.BLUETOOTH);
          }}
        />
      );
    }

    if (flow === FLOW.BLUETOOTH) {
      return (
        <BluetoothJourney
          user={userProfile || USER_FIXTURES.google}
          onBack={() => setFlow(FLOW.AUTH)}
          onComplete={() => setFlow(FLOW.PROFILE)}
        />
      );
    }

    if (flow === FLOW.PROFILE) {
      return (
        <ProfileJourney
          onBack={() => setFlow(FLOW.BLUETOOTH)}
          onFinish={() => setFlow(FLOW.DASHBOARD)}
        />
      );
    }

    return (
      <DashboardScreen
        user={userProfile || USER_FIXTURES.google}
        onBack={() => setFlow(FLOW.PROFILE)}
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

const LogoSlide = () => (
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

const CareSlide = () => (
  <View style={styles.messageSlide}>
    <ThermoBadge />
    <Text style={styles.headline}>
      Continuous{'\n'}
      <Text style={styles.highlight}>Temperature Care</Text>
      {'\n'}for the Ones You Love
    </Text>
  </View>
);

const JourneySlide = ({ onPressCta }) => (
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

const AuthScreen = ({ onProviderSelect }) => {
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
              name='google'
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
        By continuing, you agree to Fiona’s{' '}
        <Text style={styles.link}>Terms of Use</Text>.{'\n'}
        Read our <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </View>
  );
};

const AuthButton = ({ icon, label, variant, onPress }) => {
  const backgroundColor =
    variant === 'apple' ? '#3F3550' : '#FFFFFF';
  const textColor =
    variant === 'apple' ? '#FFFFFF' : '#1C142F';
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

const BluetoothJourney = ({ user, onBack, onComplete }) => {
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
      Device not showing?{' '}
      <Text style={styles.link}>Try again</Text> or{' '}
      <Text style={styles.link}>Set up manually</Text>
    </Text>
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

const ProfileJourney = ({ onBack, onFinish }) => {
  const [step, setStep] = useState(PROFILE_STEPS[0]);
  const [profiles, setProfiles] = useState(DEFAULT_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState(
    DEFAULT_PROFILES[0].id,
  );
  const [formState, setFormState] = useState({
    name: '',
    dob: '',
    gender: 'Female',
    threshold: 'Febrile Epilepsy Mode',
  });

  const getAgeLabel = (dob) => {
    if (!dob) return '4 Years old';
    const [day, month, year] = dob.split('-').map(Number);
    if (!year) return '4 Years old';
    const birth = new Date(year, (month || 1) - 1, day || 1);
    const diff = Date.now() - birth.getTime();
    const age = Math.max(1, Math.floor(diff / (365 * 24 * 60 * 60 * 1000)));
    return `${age} Years old`;
  };

  const handleSaveProfile = () => {
    const trimmed = formState.name.trim();
    const newProfile = {
      id: `${trimmed || 'profile'}-${Date.now()}`,
      name: trimmed || 'New Profile',
      ageLabel: getAgeLabel(formState.dob),
      gender: formState.gender || 'Female',
      mode: formState.threshold || 'Standard Mode',
      low: '37.0ºC',
      high: '38.0ºC',
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    setFormState({
      name: '',
      dob: '',
      gender: 'Female',
      threshold: 'Febrile Epilepsy Mode',
    });
    setStep('list');
  };

  const handleAddAnother = () => {
    setFormState({
      name: '',
      dob: '',
      gender: 'Female',
      threshold: 'Febrile Epilepsy Mode',
    });
    setStep('form');
  };

  const goBack = () => {
    const currentIndex = PROFILE_STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(PROFILE_STEPS[currentIndex - 1]);
    } else {
      onBack();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'form':
        return (
          <ProfileFormSection
            formState={formState}
            onChange={setFormState}
            onSave={handleSaveProfile}
            onCancel={() => (profiles.length ? setStep('list') : onBack())}
            onAddProfile={handleAddAnother}
          />
        );
      case 'list':
        return (
          <ProfileSavedSection
            profiles={profiles}
            onAddAnother={handleAddAnother}
            onContinue={() => setStep('select')}
          />
        );
      case 'select':
        return (
          <ProfileSelectSection
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelect={(id) => setActiveProfileId(id)}
            onContinue={() => setStep('summary')}
          />
        );
      case 'summary':
      default:
        return (
          <ProfileSummarySection
            profile={profiles.find((p) => p.id === activeProfileId) || profiles[0]}
            profileCount={profiles.length}
            onFinish={onFinish}
          />
        );
    }
  };

  return (
    <View style={styles.profileContainer}>
      <BackButton onPress={goBack} />
      <ScrollView
        style={styles.profileScroll}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileBadge}>
          <Feather name="user" size={34} color="#C9D6FF" />
        </View>
        {renderStep()}
      </ScrollView>
    </View>
  );
};

const ProfileFormSection = ({
  formState,
  onChange,
  onSave,
  onCancel,
  onAddProfile,
}) => (
  <View style={styles.profileSection}>
    <Text style={styles.profileTitle}>Create Profiles</Text>
    <Text style={styles.profileSubtitle}>
      Add profiles for each person using this device
    </Text>

    <View style={styles.formCard}>
      <View style={styles.inputWrapper}>
        <Feather name="user" size={16} color="#C9C3E2" />
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor="#B6AECF"
          value={formState.name}
          onChangeText={(text) => onChange({ ...formState, name: text })}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputWrapper, styles.inputHalf]}>
          <Feather name="calendar" size={16} color="#C9C3E2" />
          <TextInput
            style={styles.input}
            placeholder="DD-MM-YYYY"
            placeholderTextColor="#B6AECF"
            value={formState.dob}
            onChangeText={(text) => onChange({ ...formState, dob: text })}
          />
        </View>
        <TouchableOpacity
          style={[styles.inputWrapper, styles.inputHalf, styles.genderPicker]}
          activeOpacity={0.85}
          onPress={() =>
            onChange({
              ...formState,
              gender: formState.gender === 'Female' ? 'Male' : 'Female',
            })
          }
        >
          <Text style={styles.genderText}>{formState.gender}</Text>
          <Feather name="chevron-down" size={16} color="#B6AECF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.thresholdButton}
        activeOpacity={0.85}
      >
        <Text style={styles.thresholdPlaceholder}>
          {formState.threshold || 'Set Temperature Threshold'}
        </Text>
        <Feather name="arrow-right" size={16} color="#B6AECF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveProfileButton}
        activeOpacity={0.9}
        onPress={onSave}
      >
        <Text style={styles.saveProfileLabel}>Save Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelProfileButton}
        onPress={onCancel}
        activeOpacity={0.8}
      >
        <Text style={styles.cancelProfileLabel}>Cancel</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={styles.addProfileButton}
      activeOpacity={0.9}
      onPress={onAddProfile}
    >
      <Feather name="plus" size={16} color="#FFFFFF" />
      <Text style={styles.addProfileText}>Add Profile</Text>
    </TouchableOpacity>

    <Text style={styles.tipText}>
      Tip: You can add up to multiple profiles per device. Don’t worry, you can
      always add, edit, or remove profiles later in Profiles drop down.
    </Text>
  </View>
);

const ProfileSavedSection = ({ profiles, onAddAnother, onContinue }) => (
  <View style={styles.profileSection}>
    <Text style={styles.profileTitle}>Profiles saved Successfully!</Text>
    <Text style={styles.profileHint}>
      You have {profiles.length} profiles saved
    </Text>
    <View style={styles.profileListCard}>
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </View>
    <TouchableOpacity
      style={styles.addAnotherButton}
      activeOpacity={0.9}
      onPress={onAddAnother}
    >
      <Feather name="plus" size={16} color="#FFFFFF" />
      <Text style={styles.addProfileText}>Add Another Profile</Text>
    </TouchableOpacity>
    <Text style={styles.tipText}>
      Tip: You can add up to multiple profiles per device. Don’t worry, you can
      always add, edit, or remove profiles later in Profiles drop down.
    </Text>
    <TouchableOpacity
      style={styles.successButton}
      activeOpacity={0.9}
      onPress={onContinue}
    >
      <Text style={styles.successButtonLabel}>Continue</Text>
    </TouchableOpacity>
  </View>
);

const ProfileSelectSection = ({
  profiles,
  activeProfileId,
  onSelect,
  onContinue,
}) => (
  <View style={styles.profileSection}>
    <Text style={styles.profileTitle}>Select Active Profile</Text>
    <Text style={styles.profileHint}>
      Choose which profile to activate for monitoring
    </Text>
    <View style={styles.profileListCard}>
      {profiles.map((profile) => {
        const isActive = profile.id === activeProfileId;
        return (
          <TouchableOpacity
            key={profile.id}
            activeOpacity={0.85}
            onPress={() => onSelect(profile.id)}
          >
            <ProfileCard profile={profile} isActive={isActive} selectable />
          </TouchableOpacity>
        );
      })}
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

const ProfileSummarySection = ({ profile, profileCount, onFinish }) => (
  <View style={styles.profileSection}>
    <View style={styles.summaryBadge}>
      <Feather name="check" size={24} color="#1D2A3D" />
    </View>
    <Text style={styles.profileTitle}>All Set!</Text>
    <Text style={styles.profileHint}>Your device is ready!</Text>

    <View style={styles.summaryCard}>
      <SummaryTile
        title="1 Device Connected"
        subtitle="Your device is now monitoring and ready to send alerts"
        icon="bluetooth"
      />
      <SummaryTile
        title={`${profileCount} Profiles Created`}
        subtitle="Family members can now access device data"
        icon="users"
      />
      <SummaryTile
        title="Active Profile Selected"
        subtitle={`“${profile?.name || 'Profile'}” is now active for this monitoring session.`}
        icon="user-check"
        highlight
      />
    </View>

    <View style={styles.summaryChecklist}>
      <Text style={styles.checkItem}>✔ Customize temperature thresholds in settings</Text>
      <Text style={styles.checkItem}>✔ Set up notification preferences for alerts</Text>
      <Text style={styles.checkItem}>✔ Invite caregivers with specific permissions</Text>
    </View>

    <TouchableOpacity
      style={styles.dashboardButton}
      activeOpacity={0.9}
      onPress={onFinish}
    >
      <Text style={styles.dashboardButtonLabel}>Go to Dashboard</Text>
      <Feather name="arrow-right" size={18} color="#1C142F" />
    </TouchableOpacity>
  </View>
);

const ProfileCard = ({ profile, isActive = false, selectable = false }) => (
  <View
    style={[
      styles.profileCardItem,
      isActive && styles.profileCardActive,
    ]}
  >
    <View style={styles.profileCardHeader}>
      <View style={styles.profileAvatar}>
        <Text style={styles.profileAvatarText}>
          {profile.name
            .split(' ')
            .map((chunk) => chunk[0])
            .join('')
            .slice(0, 2)}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileMeta}>
          {profile.ageLabel} | {profile.gender}
        </Text>
      </View>
      {selectable && (
        <View
          style={[
            styles.selectBadge,
            isActive && styles.selectBadgeActive,
          ]}
        >
          {isActive && (
            <Feather name="check" size={14} color="#FFFFFF" />
          )}
        </View>
      )}
    </View>
    <View style={styles.profileThresholdRow}>
      <Text style={styles.thresholdLabel}>Threshold:</Text>
      <Text style={styles.thresholdValue}>{profile.mode}</Text>
    </View>
    <View style={styles.profileTempRow}>
      <Text style={styles.tempValue}>Low: ↓ {profile.low}</Text>
      <Text style={styles.tempValue}>High: ↑ {profile.high}</Text>
    </View>
  </View>
);

const SummaryTile = ({ title, subtitle, icon, highlight = false }) => (
  <View
    style={[
      styles.summaryTile,
      highlight && styles.summaryTileHighlight,
    ]}
  >
    <View style={styles.summaryTileIcon}>
      <Feather
        name={icon}
        size={18}
        color={highlight ? '#7DB4FF' : '#C8C5DB'}
      />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.summaryTileTitle}>{title}</Text>
      <Text style={styles.summaryTileSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

const DashboardScreen = ({ user, onBack }) => {
  const [tempState, setTempState] = useState('normal');
  const [timeframe, setTimeframe] = useState('Hour');
  const [activeNav, setActiveNav] = useState('home');
  const profile = DEFAULT_PROFILES[0];

  return (
    <View style={styles.dashboardContainer}>
      <BackButton onPress={onBack} />
      <ScrollView
        style={styles.dashboardScroll}
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader profile={profile} batteryLevel={0.2} />

        <TemperatureStatusTabs
          current={tempState}
          onChange={setTempState}
        />
        <TemperatureCard stateKey={tempState} />

        <TrendSection
          timeframe={timeframe}
          onSelect={setTimeframe}
        />

        <DeviceHealthCard />
        <ManageAccessCard accessList={MANAGE_ACCESS_FIXTURES} />
      </ScrollView>

      <BottomNavBar active={activeNav} onSelect={setActiveNav} />
    </View>
  );
};

const DashboardHeader = ({ profile, batteryLevel }) => (
  <View style={styles.dashboardHeader}>
    <TouchableOpacity style={styles.profileSelector} activeOpacity={0.85}>
      <View style={styles.profileAvatar}>
        <Text style={styles.profileAvatarText}>
          {profile.name
            .split(' ')
            .map((chunk) => chunk[0])
            .join('')
            .slice(0, 2)}
        </Text>
      </View>
      <View>
        <Text style={styles.profileSelectorLabel}>{profile.name}</Text>
      </View>
      <Feather name="chevron-down" size={18} color="#FFFFFF" />
    </TouchableOpacity>

    <View style={styles.headerIcons}>
      <View style={styles.headerBattery}>
        <Feather name="battery-charging" size={16} color="#F04E5A" />
        <Text style={styles.headerBatteryText}>{Math.round(batteryLevel * 100)}%</Text>
      </View>
      <View style={styles.headerBluetooth}>
        <Feather name="bluetooth" size={16} color="#7FDBFF" />
      </View>
    </View>
  </View>
);

const TemperatureStatusTabs = ({ current, onChange }) => (
  <View style={styles.tempTabs}>
    {Object.keys(TEMP_STATE_VARIANTS).map((key) => {
      const active = key === current;
      return (
        <TouchableOpacity
          key={key}
          style={[
            styles.tempTab,
            active && styles.tempTabActive,
          ]}
          onPress={() => onChange(key)}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.tempTabLabel,
              active && styles.tempTabLabelActive,
            ]}
          >
            {TEMP_STATE_VARIANTS[key].label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const TemperatureCard = ({ stateKey }) => {
  const variant = TEMP_STATE_VARIANTS[stateKey] || TEMP_STATE_VARIANTS.normal;
  return (
    <LinearGradient
      colors={variant.colorStops}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.tempCard}
    >
      <View style={styles.tempCardBadge}>
        <Feather name="thermometer" size={20} color="#FFFFFF" />
      </View>
      <View style={styles.tempCardRow}>
        <View>
          <Text style={styles.tempValue}>37.5ºC</Text>
          <Text style={styles.tempStateTag}>{variant.label}</Text>
        </View>
        <View style={styles.tempLiveContainer}>
          <View style={styles.tempLiveDot} />
          <Text style={styles.tempLiveLabel}>Live</Text>
        </View>
      </View>
      <Text style={styles.tempSync}>Last Sync: 1 min ago</Text>
    </LinearGradient>
  );
};

const TrendSection = ({ timeframe, onSelect }) => {
  const tabs = ['Hour', 'Day', 'Week', 'Month'];
  return (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <View style={styles.trendTabs}>
          {tabs.map((tab) => {
            const active = tab === timeframe;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.trendTab,
                  active && styles.trendTabActive,
                ]}
                onPress={() => onSelect(tab)}
              >
                <Text
                  style={[
                    styles.trendTabLabel,
                    active && styles.trendTabLabelActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity>
          <Text style={styles.adjustLink}>Adjust Threshold</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.trendMode}>Febrile Epilepsy Mode</Text>
      <Svg height={120} width="100%" viewBox="0 0 280 120">
        <Path
          d="M0 90 C 50 50, 90 60, 140 80 S 230 40, 280 65"
          stroke="#6ECCFF"
          strokeWidth={4}
          fill="none"
        />
        <Circle cx={180} cy={60} r={6} fill="#6ECCFF" />
      </Svg>
      <View style={styles.trendDays}>
        {['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'].map((day) => (
          <Text
            key={day}
            style={[
              styles.trendDayLabel,
              day === 'Fri' && styles.trendDayActive,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const DeviceHealthCard = () => (
  <View style={styles.deviceHealthCard}>
    <Text style={styles.sectionTitle}>Device Health & Control</Text>
    <View style={styles.deviceBattery}>
      <Text style={styles.deviceBatteryTitle}>Device Battery</Text>
      <Text style={styles.deviceName}>FIONATHERMO_01XYZ</Text>
      <Text style={styles.deviceBatteryValue}>24%</Text>
      <View style={styles.batteryBar}>
        <View style={[styles.batteryBarFill, { width: '24%' }]} />
      </View>
    </View>
    <View style={styles.deviceActionsButtons}>
      <TouchableOpacity style={styles.deviceAction} activeOpacity={0.85}>
        <Feather name="refresh-cw" size={16} color="#1C142F" />
        <Text style={styles.deviceActionLabel}>Sync Device</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.deviceAction, styles.deviceActionSecondary]}
        activeOpacity={0.85}
      >
        <Feather name="power" size={16} color="#1C142F" />
        <Text style={styles.deviceActionLabel}>Restart</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ManageAccessCard = ({ accessList }) => (
  <View style={styles.manageAccessCard}>
    <Text style={styles.sectionTitle}>Manage Access</Text>
    <View style={styles.accessList}>
      {accessList.map((member) => (
        <View key={member.id} style={styles.accessRow}>
          <View style={styles.accessInfo}>
            <View style={styles.accessAvatar}>
              <Text style={styles.accessAvatarText}>{member.initials}</Text>
            </View>
            <View>
              <Text style={styles.accessName}>{member.name}</Text>
              <Text style={styles.accessRole}>{member.role}</Text>
            </View>
          </View>
          <View style={styles.accessBadge}>
            <Text style={styles.accessBadgeLabel}>{member.access}</Text>
          </View>
        </View>
      ))}
    </View>
    <TouchableOpacity style={styles.managePermissionButton} activeOpacity={0.9}>
      <Text style={styles.managePermissionLabel}>Manage Permission</Text>
      <View style={styles.managePermissionArrows}>
        <Feather name="chevron-right" size={16} color="#1C142F" />
        <Feather name="chevron-right" size={16} color="#1C142F" />
      </View>
    </TouchableOpacity>
  </View>
);

const BottomNavBar = ({ active, onSelect }) => {
  const items = [
    { key: 'home', icon: 'grid', label: 'Home' },
    { key: 'stats', icon: 'bar-chart-2', label: 'Stats' },
    { key: 'alerts', icon: 'bell', label: 'Alerts', badge: 3 },
    { key: 'settings', icon: 'settings', label: 'Settings' },
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const isActive = item.key === active;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.bottomNavItem}
            onPress={() => onSelect(item.key)}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.bottomNavIconWrapper,
                isActive && styles.bottomNavIconActive,
              ]}
            >
              <Feather
                name={item.icon}
                size={18}
                color={isActive ? '#FFFFFF' : '#A8A2C2'}
              />
              {item.badge && (
                <View style={styles.bottomNavBadge}>
                  <Text style={styles.bottomNavBadgeLabel}>
                    {item.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.bottomNavLabel,
                isActive && styles.bottomNavLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

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

const BackButton = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.backButton}
    onPress={onPress}
  >
    <Feather name="chevron-left" size={20} color="#EEE7FF" />
  </TouchableOpacity>
);

const StepperDots = ({ count, activeIndex }) => (
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

const ThermoBadge = ({ showTag = false, tagLabel = 'TS', tagColor = '#F04E5A' }) => (
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

const ThermometerMark = () => (
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

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logoSlide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 80,
  },
  brandLetter: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 58,
    color: '#F6EBC6',
    letterSpacing: 8,
    textTransform: 'lowercase',
  },
  brandRest: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 58,
    color: '#F6EBC6',
    letterSpacing: 8,
    textTransform: 'lowercase',
    marginLeft: 8,
  },
  brandDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#F6EBC6',
    marginHorizontal: 10,
  },
  logoFooter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerLine: {
    width: 76,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 18,
  },
  tagline: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#EDE6FF',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  paginationDot: {
    width: 26,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
  },
  messageSlide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 56,
  },
  badgeRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgeInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(9, 7, 19, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOrb: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(133, 133, 168, 0.65)',
    left: 55,
    top: 120,
  },
  badgeTag: {
    position: 'absolute',
    top: 50,
    right: 75,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeTagLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  headline: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    lineHeight: 38,
    color: '#F5F1FF',
    textAlign: 'center',
  },
  highlight: {
    color: '#F6EBC6',
  },
  subline: {
    marginTop: 18,
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#F5B7D1',
  },
  ctaWrapper: {
    width: '100%',
    marginTop: 36,
    paddingHorizontal: 28,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 40,
    paddingVertical: 18,
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#FFFFFF',
  },
  ctaArrows: {
    flexDirection: 'row',
    gap: 6,
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authHeadline: {
    marginTop: 40,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
  },
  authButtons: {
    width: '100%',
    marginTop: 36,
    gap: 16,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
  },
  authButtonIcon: {
    marginRight: 10,
  },
  authButtonLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  authNote: {
    marginTop: 18,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#C4C0DD',
    textAlign: 'center',
  },
  authTerms: {
    marginTop: 52,
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#C4C0DD',
    textAlign: 'center',
    lineHeight: 20,
  },
  link: {
    color: '#F5B7D1',
  },
  btContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  btContent: {
    paddingBottom: 56,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  btWelcome: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  btSubHeading: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#B4AED0',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  btIntroCard: {
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(20, 16, 32, 0.85)',
  },
  btIntroTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#F5B7D1',
    marginBottom: 16,
  },
  btBulletList: {
    gap: 8,
  },
  btBullet: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#E5E2F6',
  },
  btPrimaryButton: {
    marginTop: 24,
    backgroundColor: '#F6EBC6',
    paddingVertical: 16,
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btPrimaryLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1C142F',
  },
  btSearchWrapper: {
    marginTop: 18,
  },
  btNote: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#D4CFE8',
    textAlign: 'center',
  },
  btScanning: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#8E8BB2',
    textAlign: 'center',
    marginTop: 8,
  },
  devicesCard: {
    marginTop: 28,
    borderRadius: 28,
    backgroundColor: 'rgba(20, 16, 32, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  devicesHeader: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#E9E5FF',
    marginBottom: 6,
  },
  deviceRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#F2EEFF',
  },
  deviceStatus: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    marginTop: 4,
  },
  deviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btFooterText: {
    marginTop: 18,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#BEB9D4',
    textAlign: 'center',
    lineHeight: 22,
  },
  btSuccessWrapper: {
    marginTop: 25,
  },
  btSuccessCopy: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#C8C5DB',
    textAlign: 'center',
  },
  successCard: {
    marginTop: 24,
    borderRadius: 26,
    backgroundColor: 'rgba(20, 16, 32, 0.85)',
    padding: 20,
  },
  successCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  deviceStatusSuccess: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#58E0A8',
  },
  successButton: {
    marginTop: 28,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
  },
  successButtonLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1C142F',
  },
  connectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 18,
  },
  connectionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  connectionRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  connectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  stepDot: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  stepDotActive: {
    backgroundColor: '#FFFFFF',
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  profileScroll: {
    flex: 1,
  },
  profileBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(123, 180, 255, 0.2)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  profileSection: {
    gap: 16,
    marginBottom: 32,
  },
  profileTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#CFCBE3',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 28,
    backgroundColor: 'rgba(18, 14, 30, 0.9)',
    padding: 20,
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  genderPicker: {
    justifyContent: 'space-between',
  },
  genderText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  thresholdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  thresholdPlaceholder: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#B6AECF',
  },
  saveProfileButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveProfileLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1C142F',
  },
  cancelProfileButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelProfileLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  addProfileButton: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  addProfileText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  tipText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#C6C2DA',
    textAlign: 'center',
    lineHeight: 20,
  },
  profileHint: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    color: '#CFCBE3',
    textAlign: 'center',
  },
  profileListCard: {
    borderRadius: 26,
    backgroundColor: 'rgba(18, 14, 30, 0.9)',
    padding: 18,
    gap: 12,
  },
  addAnotherButton: {
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  profileCardItem: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    gap: 8,
  },
  profileCardActive: {
    borderColor: '#7DB4FF',
    backgroundColor: 'rgba(125, 180, 255, 0.08)',
  },
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  profileName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  profileMeta: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#C6C2DA',
  },
  profileThresholdRow: {
    flexDirection: 'row',
    gap: 6,
  },
  thresholdLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#B7B2CB',
  },
  thresholdValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#F5B7D1',
  },
  profileTempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tempValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#E9E5FF',
  },
  selectBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBadgeActive: {
    backgroundColor: '#7DB4FF',
    borderColor: '#7DB4FF',
  },
  summaryBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#CCF5E9',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 18,
    gap: 14,
  },
  summaryTile: {
    borderRadius: 20,
    backgroundColor: 'rgba(18, 14, 30, 0.8)',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  summaryTileHighlight: {
    borderWidth: 1,
    borderColor: '#7DB4FF',
  },
  summaryTileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTileTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  summaryTileSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#BCB8CF',
    marginTop: 4,
  },
  summaryChecklist: {
    marginTop: 16,
    gap: 6,
  },
  checkItem: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#CBF0DA',
  },
  dashboardButton: {
    marginTop: 24,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  dashboardButtonLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#1C142F',
  },
  dashboardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  dashboardScroll: {
    flex: 1,
  },
  dashboardContent: {
    paddingBottom: 120,
    gap: 20,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  profileSelectorLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerBattery: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 78, 90, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    gap: 6,
  },
  headerBatteryText: {
    color: '#F04E5A',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },
  headerBluetooth: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(127, 219, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  tempTab: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tempTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  tempTabLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#B1ACC9',
  },
  tempTabLabelActive: {
    color: '#FFFFFF',
  },
  tempCard: {
    borderRadius: 26,
    padding: 20,
    gap: 14,
  },
  tempCardBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tempValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 44,
    color: '#FFFFFF',
  },
  tempStateTag: {
    marginTop: 4,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1F1F1F',
  },
  tempLiveContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tempLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5959',
  },
  tempLiveLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  tempSync: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
  },
  trendCard: {
    borderRadius: 28,
    backgroundColor: 'rgba(18, 14, 30, 0.9)',
    padding: 20,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  trendTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  trendTabActive: {
    backgroundColor: '#352949',
  },
  trendTabLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#B8B2CC',
  },
  trendTabLabelActive: {
    color: '#FFFFFF',
  },
  adjustLink: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#7EE1FF',
  },
  trendMode: {
    marginTop: 10,
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#9CE3B7',
  },
  trendDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  trendDayLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#A7A3BE',
  },
  trendDayActive: {
    color: '#FFFFFF',
  },
  deviceHealthCard: {
    borderRadius: 28,
    backgroundColor: 'rgba(18, 14, 30, 0.9)',
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  deviceBattery: {
    borderRadius: 22,
    backgroundColor: 'rgba(122, 187, 255, 0.18)',
    padding: 16,
    gap: 6,
  },
  deviceBatteryTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#1C2D45',
  },
  deviceName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1C2D45',
  },
  deviceBatteryValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 28,
    color: '#1C2D45',
  },
  batteryBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  batteryBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#1C2D45',
  },
  deviceActionsButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  deviceAction: {
    flex: 1,
    backgroundColor: '#F6EBC6',
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row',
  },
  deviceActionSecondary: {
    backgroundColor: '#FFE18A',
  },
  deviceActionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#1C142F',
  },
  manageAccessCard: {
    borderRadius: 28,
    backgroundColor: 'rgba(18, 14, 30, 0.9)',
    padding: 20,
    gap: 16,
  },
  accessList: {
    gap: 14,
  },
  accessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accessAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessAvatarText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  accessName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  accessRole: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#B4B0C9',
  },
  accessBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  accessBadgeLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  managePermissionButton: {
    marginTop: 8,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  managePermissionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: '#1C142F',
  },
  managePermissionArrows: {
    flexDirection: 'row',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(15, 10, 25, 0.9)',
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: 6,
  },
  bottomNavIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavIconActive: {
    backgroundColor: '#7FDBFF',
  },
  bottomNavLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 11,
    color: '#A8A2C2',
  },
  bottomNavLabelActive: {
    color: '#FFFFFF',
  },
  bottomNavBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F04E5A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavBadgeLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
});
