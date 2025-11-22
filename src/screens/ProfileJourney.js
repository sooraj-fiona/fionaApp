import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '../styles';
import { PROFILE_STEPS, DEFAULT_PROFILES } from '../constants';
import { BackButton } from '../components/common';

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
      <Text style={styles.tempValue}>Low: {profile.low}</Text>
      <Text style={styles.tempValue}>High: {profile.high}</Text>
    </View>
  </View>
);

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
      Tip: You can add up to multiple profiles per device. Don't worry, you can
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
      Tip: You can add up to multiple profiles per device. Don't worry, you can
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
      <Feather name="check" size={28} color="#1D2A3D" />
    </View>
    <Text style={styles.summaryHeadline}>All Set!</Text>
    <Text style={styles.summarySubhead}>Your device is ready!</Text>

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
        subtitle={`"${profile?.name || 'Profile'}" is now active for this monitoring session.`}
        icon="user-check"
        highlight
      />
    </View>

    <View style={styles.summaryChecklist}>
      <Text style={styles.checkItem}>Customize temperature thresholds in settings</Text>
      <Text style={styles.checkItem}>Set up notification preferences for alerts</Text>
      <Text style={styles.checkItem}>Invite caregivers with specific permissions</Text>
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

export const ProfileJourney = ({ onBack, onFinish }) => {
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
      low: '37.0°C',
      high: '38.0°C',
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
