import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SLIDES = [
  { key: 'logo', type: 'logo' },
  { key: 'care', type: 'care' },
  { key: 'journey', type: 'journey' },
];

export const FLOW = {
  SPLASH: 'splash',
  AUTH: 'auth',
  BLUETOOTH: 'bluetooth',
  PROFILE: 'profile',
  DASHBOARD: 'dashboard',
  MANAGE_PERMISSIONS: 'managePermissions',
};

export const USER_FIXTURES = {
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

export const DEVICE_FIXTURES = [
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

export const BLUETOOTH_STEPS = ['intro', 'search', 'success'];
export const PROFILE_STEPS = ['form', 'list', 'select', 'summary'];

export const DEFAULT_PROFILES = [
  {
    id: 'lizzy-baby',
    name: 'Lizzy Baby',
    ageLabel: '4 Years old',
    gender: 'Female',
    mode: 'Febrile Epilepsy Mode',
    low: '37.5°C',
    high: '37.5°C',
  },
  {
    id: 'mia-hale',
    name: 'Mia Hale',
    ageLabel: '7 Years old',
    gender: 'Female',
    mode: 'Comfort Care Mode',
    low: '36.8°C',
    high: '38.2°C',
  },
  {
    id: 'leo-park',
    name: 'Leo Park',
    ageLabel: '12 Years old',
    gender: 'Male',
    mode: 'Standard Watch Mode',
    low: '36.5°C',
    high: '38.0°C',
  },
];

export const TEMP_STATE_VARIANTS = {
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

export const MANAGE_ACCESS_FIXTURES = [
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

export const ALERTS_FIXTURES = [
  {
    id: 'alert-1',
    title: 'Threshold Change Request :',
    status: 'Awaiting Approval',
    body:
      'Dr. Sara has updated the temperature stability threshold for Lizzy’s Baby from 150°C to 145°C. Please review the modification before it takes effect.',
    time: '04:00 PM',
    ago: '2 min ago',
    type: 'request',
  },
  {
    id: 'alert-2',
    title: 'Threshold Change Request :',
    status: 'Awaiting Approval',
    body:
      'Dr. Sara has updated the temperature stability threshold for Lizzy’s Baby from 150°C to 145°C. Please review the modification before it takes effect.',
    time: '04:00 PM',
    ago: '2 min ago',
    type: 'request',
  },
  {
    id: 'alert-3',
    title: 'Stability Warning: Slight Drift',
    body:
      'Lizzy’s Baby : Temperature dropped 3°C below safe range for 5 minutes before stabilizing. Rachel acknowledged the alert. Continue monitoring, no immediate action required',
    time: '03:00 PM',
    ago: '12 min ago',
    type: 'warning',
  },
  {
    id: 'alert-4',
    title: 'Data Sync Complete : Device Health Summary',
    body:
      'Latest temperature data and threshold logs synced successfully for all devices. No new anomalies detected.',
    time: '02:30 PM',
    ago: '30 min ago',
    type: 'summary',
  },
];

export const STATS_FIXTURES = [
  {
    id: 'avg-daily',
    title: 'Daily Avg Temp',
    value: '37.2°C',
    delta: '+0.2°C vs yesterday',
  },
  {
    id: 'alerts-week',
    title: 'Alerts this week',
    value: '4',
    delta: '2 resolved',
  },
  {
    id: 'uptime',
    title: 'Device Uptime',
    value: '99.2%',
    delta: 'Stable connection',
  },
];

export const SETTINGS_OPTIONS = [
  {
    id: 'push-alerts',
    title: 'Push Notifications',
    subtitle: 'Critical alerts, threshold changes, and weekly summaries',
  },
  {
    id: 'email-digest',
    title: 'Email Digest',
    subtitle: 'Daily snapshot of temperature trends and battery health',
  },
  {
    id: 'auto-sync',
    title: 'Auto Sync',
    subtitle: 'Sync device data when connected to Bluetooth',
  },
];

export const SETTINGS_QUICK_ACTIONS = [
  { id: 'manage-profiles', label: 'Manage Profiles', icon: 'users' },
  { id: 'share-access', label: 'Share Access', icon: 'share-2' },
  { id: 'device-health', label: 'Device Health', icon: 'activity' },
  { id: 'help-center', label: 'Help Center', icon: 'life-buoy' },
];

export const SETTINGS_SUPPORT = [
  {
    id: 'contact-care',
    title: 'Contact Care Team',
    subtitle: 'Talk to a clinician about alerts and thresholds',
    icon: 'message-circle',
  },
  {
    id: 'device-guide',
    title: 'Device Setup Guide',
    subtitle: 'Step-by-step pairing, troubleshooting, and tips',
    icon: 'book-open',
  },
];

export const INSIGHT_CARDS = [
  {
    id: 'avg-week',
    title: 'Avg this week',
    value: '37.2°C',
    tone: 'primary',
    icon: 'trending-up',
  },
  {
    id: 'variation',
    title: 'Variation',
    value: '0.5°C',
    tone: 'warning',
    icon: 'activity',
  },
];

export const ANALYSIS_SUMMARY = [
  { id: 'lowest', label: 'Lowest Temperature', value: '37.2°C' },
  { id: 'highest', label: 'Highest Temperature', value: '37.2°C' },
  { id: 'range', label: 'Normal Range', value: '95% of time' },
];
