import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import styles from '../styles';
import {
  DEFAULT_PROFILES,
  TEMP_STATE_VARIANTS,
  MANAGE_ACCESS_FIXTURES,
  ALERTS_FIXTURES,
  STATS_FIXTURES,
  INSIGHT_CARDS,
  ANALYSIS_SUMMARY,
} from '../constants';
import { BackButton } from '../components/common';

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
          <Text style={styles.tempValue}>37.5°C</Text>
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

const AlertCard = ({ alert }) => {
  const iconStyle =
    alert.type === 'warning'
      ? styles.alertIconWarning
      : alert.type === 'summary'
        ? styles.alertIconSummary
        : styles.alertIconRequest;

  const statusColor =
    alert.type === 'warning'
      ? '#6ECCFF'
      : alert.type === 'summary'
        ? '#7CE89C'
        : '#F6C66E';

  return (
    <View style={styles.alertCard}>
      <View style={[styles.alertIconWrapper, iconStyle]}>
        <Feather
          name={
            alert.type === 'summary'
              ? 'check-circle'
              : alert.type === 'warning'
                ? 'alert-triangle'
                : 'edit-3'
          }
          size={18}
          color={statusColor}
        />
      </View>
      <View style={styles.alertContent}>
        <View style={styles.alertTitleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            {alert.status && (
              <Text style={[styles.alertStatus, { color: statusColor }]}>
                {alert.status}
              </Text>
            )}
          </View>
          <Text style={styles.alertMetaText}>{alert.ago}</Text>
        </View>
        <Text style={styles.alertBody}>{alert.body}</Text>
        <View style={styles.alertMetaRow}>
          <View style={styles.alertMetaDot} />
          <Text style={styles.alertMetaText}>{alert.time}</Text>
        </View>
      </View>
    </View>
  );
};

const InsightCards = ({ items }) => (
  <View style={styles.insightRow}>
    {items.map((item) => {
      const isPrimary = item.tone === 'primary';
      return (
        <View
          key={item.id}
          style={[
            styles.insightCard,
            isPrimary ? styles.insightPrimary : styles.insightWarning,
          ]}
        >
          <View style={styles.insightIconRow}>
            <Feather
              name={item.icon}
              size={16}
              color={isPrimary ? '#CBEAFF' : '#FFE3ED'}
            />
            <Text style={styles.insightTitle}>{item.title}</Text>
          </View>
          <Text style={styles.insightValue}>{item.value}</Text>
        </View>
      );
    })}
  </View>
);

const AnalysisCard = ({ summary, timeframe, onSelectTimeframe }) => (
  <View style={styles.analysisCard}>
    <View style={styles.analysisHeader}>
      <Text style={styles.sectionTitle}>Analysis</Text>
      <View style={styles.analysisActions}>
        <TouchableOpacity>
          <Feather name="share-2" size={16} color="#B8B3CB" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="download" size={16} color="#B8B3CB" />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.analysisTabs}>
      {['Hour', 'Day', 'Week', 'Month'].map((tab) => {
        const active = tab === timeframe;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onSelectTimeframe(tab)}
            style={[
              styles.analysisTab,
              active && styles.analysisTabActive,
            ]}
          >
            <Text
              style={[
                styles.analysisTabLabel,
                active && styles.analysisTabLabelActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={{ marginLeft: 'auto' }}>
        <Text style={styles.adjustLink}>Adjust Threshold</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.analysisSummary}>
      <Text style={styles.analysisMode}>Febrile Epilepsy Mode</Text>
      {summary.map((item) => (
        <View key={item.id} style={styles.analysisRow}>
          <Text style={styles.analysisLabel}>{item.label}</Text>
          <Text style={styles.analysisValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  </View>
);

const StatsCard = ({ item }) => (
  <View style={styles.statsCard}>
    <Text style={styles.statsTitle}>{item.title}</Text>
    <Text style={styles.statsValue}>{item.value}</Text>
    <Text style={styles.statsDelta}>{item.delta}</Text>
  </View>
);

const ProfileCardScreen = ({ user, onEditPress, onSignOut }) => (
  <View style={styles.profileScreenContainer}>
    <View style={styles.profileAvatarLg}>
      <Feather name="user" size={42} color="#FFFFFF" />
      <TouchableOpacity
        style={styles.profileAvatarEdit}
        activeOpacity={0.85}
        onPress={onEditPress}
      >
        <Feather name="edit-3" size={14} color="#1C142F" />
      </TouchableOpacity>
    </View>
    <Text style={styles.profileScreenName}>{user.name}</Text>
    <Text style={styles.profileScreenEmail}>{user.email}</Text>

    <View style={styles.profileMenu}>
      <View style={styles.profileMenuItem}>
        <View style={[styles.profileMenuIcon, { backgroundColor: 'rgba(110, 204, 255, 0.18)' }]}>
          <Feather name="user" size={16} color="#6ECCFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileMenuTitle}>Account setting</Text>
          <Text style={styles.profileMenuSubtitle}>Manage your Profile</Text>
        </View>
        <Feather name="chevron-right" size={16} color="#C8C5DB" />
      </View>

      <View style={styles.profileMenuItem}>
        <View style={[styles.profileMenuIcon, { backgroundColor: 'rgba(247, 173, 212, 0.18)' }]}>
          <Feather name="help-circle" size={16} color="#F7ADD4" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileMenuTitle}>Help & Support</Text>
          <Text style={styles.profileMenuSubtitle}>Get help with the app</Text>
        </View>
        <Feather name="chevron-right" size={16} color="#C8C5DB" />
      </View>
    </View>

    <TouchableOpacity style={styles.signOutButton} activeOpacity={0.9} onPress={onSignOut}>
      <Feather name="log-out" size={16} color="#FFFFFF" />
      <Text style={styles.signOutLabel}>Sign Out</Text>
    </TouchableOpacity>
  </View>
);

const DashboardHeader = ({ profile, batteryLevel, onPressProfile }) => (
  <View style={styles.dashboardHeader}>
    <TouchableOpacity
      style={styles.profileSelector}
      activeOpacity={0.85}
      onPress={onPressProfile}
    >
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
        <Text
          style={styles.profileSelectorLabel}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {profile.name}
        </Text>
      </View>
      <Feather name="chevron-down" size={18} color="#FFFFFF" />
    </TouchableOpacity>

    <View style={styles.headerIcons}>
      <View style={styles.headerBattery}>
        <Text style={styles.headerBatteryText}>{Math.round(batteryLevel * 100)}%</Text>
      </View>
      <View style={styles.headerBluetooth}>
        <Feather name="bluetooth" size={16} color="#7FDBFF" />
      </View>
    </View>
  </View>
);

const BottomNavBar = ({ active, onSelect, alertsCount = 0 }) => {
  const items = [
    { key: 'home', icon: 'grid', label: 'Home' },
    { key: 'stats', icon: 'bar-chart-2', label: 'Stats' },
    { key: 'alerts', icon: 'bell', label: 'Alerts', badge: alertsCount },
    { key: 'settings', icon: 'user', label: 'Profile' },
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const isActive = item.key === active;
        const badge = item.key === 'alerts' ? item.badge : item.badge;
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
              {badge > 0 && !isActive && (
                <View style={styles.bottomNavBadge}>
                  <Text style={styles.bottomNavBadgeLabel}>
                    {badge}
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

const ProfileSheet = ({
  visible,
  profiles,
  activeProfileId,
  onSelect,
  onAddProfile,
  onClose,
  translateY,
  panHandlers,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.profileSheetOverlay}>
      <TouchableOpacity
        style={styles.profileSheetScrim}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.profileSheetContainer,
          { transform: [{ translateY: translateY || 0 }] },
        ]}
        {...panHandlers}
      >
        <View style={styles.profileSheetHandle} />
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          const statusLabel = profile.status || profile.mode || 'Active';
          return (
            <TouchableOpacity
              key={profile.id}
              activeOpacity={0.85}
              style={[
                styles.profileSheetItem,
                isActive && styles.profileSheetItemActive,
              ]}
              onPress={() => onSelect(profile.id)}
            >
              <View style={styles.profileSheetAvatar}>
                <Text style={styles.profileAvatarText}>
                  {profile.name
                    .split(' ')
                    .map((chunk) => chunk[0])
                    .join('')
                    .slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileSheetName}>{profile.name}</Text>
                <View style={styles.profileSheetStatusRow}>
                  <View
                    style={[
                      styles.profileSheetStatusDot,
                      !isActive && { backgroundColor: '#B6B0CA' },
                    ]}
                  />
                  <Text style={styles.profileSheetStatus}>{statusLabel}</Text>
                </View>
              </View>
              <View style={styles.profileSheetActions}>
                {isActive && (
                  <View style={styles.profileSheetCheck}>
                    <Feather name="check" size={14} color="#FFFFFF" />
                  </View>
                )}
                <Feather name="edit-3" size={16} color="#D6D1E9" />
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.profileSheetAdd}
          activeOpacity={0.9}
          onPress={onAddProfile}
        >
          <Feather name="plus" size={16} color="#1C142F" />
          <Text style={styles.profileSheetAddLabel}>Add Another Profile</Text>
        </TouchableOpacity>

        <Text style={styles.profileSheetPowered}>Powered by</Text>
        <Text style={styles.profileSheetBrand}>FIONA</Text>
      </Animated.View>
    </View>
  );
};

export const DashboardScreen = ({ user, onBack }) => {
  const tempState = 'normal';
  const [timeframe, setTimeframe] = useState('Hour');
  const [activeNav, setActiveNav] = useState('home');
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [profiles, setProfiles] = useState(() => [
    ...DEFAULT_PROFILES,
    {
      id: 'lizzys-mom',
      name: "Lizzy's Mom",
      ageLabel: 'Active',
      gender: 'Female',
      mode: 'Active',
      status: 'Active',
    },
    {
      id: 'lizzys-brother',
      name: "Lizzy's Brother",
      ageLabel: 'Frequently Connected',
      gender: 'Male',
      mode: 'Frequently Connected',
      status: 'Frequently Connected',
    },
  ]);
  const [activeProfileId, setActiveProfileId] = useState(
    DEFAULT_PROFILES[0].id,
  );
  const [profileSheetVisible, setProfileSheetVisible] = useState(false);
  const sheetTranslate = useRef(new Animated.Value(300)).current;

  const activeProfile =
    profiles.find((profile) => profile.id === activeProfileId) || profiles[0];
  const displayUser = user || {
    name: activeProfile?.name || 'Edward',
    email: 'Edward1234@example.com',
  };

  const openProfileSheet = () => {
    setProfileSheetVisible(true);
    Animated.spring(sheetTranslate, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeProfileSheet = () => {
    Animated.timing(sheetTranslate, {
      toValue: 300,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setProfileSheetVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 6,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          sheetTranslate.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          closeProfileSheet();
        } else {
          Animated.spring(sheetTranslate, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleAddProfile = () => {
    const nextIndex = profiles.length + 1;
    const newProfile = {
      id: `profile-${nextIndex}`,
      name: `New Profile ${nextIndex}`,
      ageLabel: 'Active',
      gender: 'N/A',
      mode: 'Active',
      status: 'Active',
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    closeProfileSheet();
  };

  useEffect(() => {
    if (activeNav === 'alerts') {
      setAlertsLoading(true);
      const timer = setTimeout(() => setAlertsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [activeNav]);

  const renderNavContent = useMemo(() => {
    if (activeNav === 'alerts') {
      if (alertsLoading) {
        return (
          <View style={styles.alertsLoading}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.alertMetaText}>Loading alerts...</Text>
          </View>
        );
      }
      return (
        <View style={styles.alertsWrapper}>
          {ALERTS_FIXTURES.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </View>
      );
    }

    if (activeNav === 'settings') {
      return (
        <ProfileCardScreen
          user={displayUser}
          onEditPress={() => {}}
          onSignOut={() => {}}
        />
      );
    }

    if (activeNav === 'stats') {
      return (
        <View style={styles.statsWrapper}>
          <InsightCards items={INSIGHT_CARDS} />
          <AnalysisCard
            summary={ANALYSIS_SUMMARY}
            timeframe={timeframe}
            onSelectTimeframe={setTimeframe}
          />
          <TrendSection timeframe={timeframe} onSelect={setTimeframe} />
        </View>
      );
    }

    return (
      <>
        <TrendSection
          timeframe={timeframe}
          onSelect={setTimeframe}
        />
        <DeviceHealthCard />
        <ManageAccessCard accessList={MANAGE_ACCESS_FIXTURES} />
      </>
    );
  }, [activeNav, alertsLoading, timeframe]);

  return (
    <View style={styles.dashboardContainer}>
      <ScrollView
        style={styles.dashboardScroll}
        contentContainerStyle={[
          styles.dashboardContent,
          activeNav === 'alerts' && styles.dashboardContentAlt,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {(activeNav === 'home' || activeNav === 'stats') && (
          <DashboardHeader
            profile={activeProfile}
            batteryLevel={0.2}
            onPressProfile={openProfileSheet}
          />
        )}

        {activeNav === 'home' && <TemperatureCard stateKey={tempState} />}
        {renderNavContent}
      </ScrollView>

      <BottomNavBar
        active={activeNav}
        alertsCount={activeNav === 'alerts' ? 0 : ALERTS_FIXTURES.length}
        onSelect={(key) => {
          setActiveNav(key);
        }}
      />
      <ProfileSheet
        visible={profileSheetVisible}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelect={(id) => {
          setActiveProfileId(id);
          setProfileSheetVisible(false);
        }}
        onAddProfile={handleAddProfile}
        onClose={() => setProfileSheetVisible(false)}
      />
    </View>
  );
};
