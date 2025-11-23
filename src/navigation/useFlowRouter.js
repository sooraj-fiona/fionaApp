import { useRef, useState } from 'react';
import { SCREEN_WIDTH, FLOW, USER_FIXTURES } from '../constants';

export const useFlowRouter = () => {
  const [flow, setFlow] = useState(FLOW.SPLASH);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const listRef = useRef(null);

  const handleMomentumEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
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

  const handleAuthSelect = (provider) => {
    const profile =
      USER_FIXTURES[provider] || USER_FIXTURES.google;
    setUserProfile(profile);
    setFlow(FLOW.BLUETOOTH);
  };

  return {
    flow,
    listRef,
    currentSlide,
    userProfile,
    goToSlide,
    handleMomentumEnd,
    handleAuthSelect,
    goToBluetooth: () => setFlow(FLOW.BLUETOOTH),
    goToProfile: () => setFlow(FLOW.PROFILE),
    goToDashboard: () => setFlow(FLOW.DASHBOARD),
    goToManagePermissions: () => setFlow(FLOW.MANAGE_PERMISSIONS),
    goBackToAuth: () => setFlow(FLOW.AUTH),
    goBackToBluetooth: () => setFlow(FLOW.BLUETOOTH),
    goBackToProfile: () => setFlow(FLOW.PROFILE),
  };
};
