import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const MODE_OPTIONS = [
  {
    id: 'febrile',
    title: 'Febrile Epilepsy Mode',
    subtitle: 'Detect early fever to prevent seizures',
    low: '37.0°C',
    high: '37.5°C',
    tag: 'Recommended',
  },
  {
    id: 'night',
    title: 'Nighttime Comfort Mode',
    subtitle: 'Comfort-first range for restful sleep',
    low: '36.8°C',
    high: '37.9°C',
    tag: 'Safe',
  },
  {
    id: 'post-vax',
    title: 'Post-Vaccination Mode',
    subtitle: 'For mild fevers post immunization',
    low: '37.0°C',
    high: '37.9°C',
    tag: 'Default',
  },
  {
    id: 'heat',
    title: 'Heat Sensitivity Mode',
    subtitle: 'For sensitive skin & heat intolerance',
    low: '36.5°C',
    high: '37.5°C',
    tag: 'Cautious',
  },
];

const ModalShell = ({ children, onClose }) => (
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 18,
    }}
  >
    <TouchableOpacity
      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
      activeOpacity={1}
      onPress={onClose}
    />
    {children}
  </View>
);

const SummaryModal = ({ mode, onEdit, onClose }) => (
  <ModalShell onClose={onClose}>
    <View
      style={{
        width: '100%',
        backgroundColor: '#1B1527',
        borderRadius: 24,
        padding: 18,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#E7E3F3', fontSize: 18, fontWeight: '700' }}>Adjust Threshold</Text>
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={20} color="#E7E3F3" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: '#0F0B18',
          borderRadius: 18,
          padding: 14,
          borderWidth: 1,
          borderColor: '#2C2339',
          gap: 6,
        }}
      >
        <Text style={{ color: '#B7B2CE', fontSize: 13 }}>37.5°C · Current Temperature</Text>
        <Text style={{ color: '#7FDBFF', fontSize: 13, fontWeight: '600' }}>Normal</Text>
      </View>
      <View
        style={{
          backgroundColor: '#0F0B18',
          borderRadius: 18,
          padding: 14,
          borderWidth: 1,
          borderColor: '#2C2339',
          gap: 6,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#E7E3F3', fontSize: 15, fontWeight: '700' }}>{mode.title}</Text>
          <TouchableOpacity onPress={onEdit}>
            <Feather name="edit-3" size={16} color="#7FDBFF" />
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#B7B2CE', fontSize: 13 }}>{mode.subtitle}</Text>
        <Text style={{ color: '#9AE0BD', fontSize: 12, fontWeight: '600' }}>
          Low: {mode.low} | High: {mode.high}
        </Text>
      </View>
      <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
        <Text style={{ color: '#7FDBFF', fontWeight: '600' }}>View History</Text>
      </TouchableOpacity>
    </View>
  </ModalShell>
);

const ModeSelectModal = ({ selectedId, onSelect, onContinue, onClose }) => (
  <ModalShell onClose={onClose}>
    <View
      style={{
        width: '100%',
        backgroundColor: '#1B1527',
        borderRadius: 24,
        padding: 18,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#E7E3F3', fontSize: 18, fontWeight: '700' }}>Choose Monitoring Mode</Text>
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={20} color="#E7E3F3" />
        </TouchableOpacity>
      </View>
      <Text style={{ color: '#B7B2CE', fontSize: 13 }}>
        Select a setup that best matches your child&apos;s current condition
      </Text>
      {MODE_OPTIONS.map((mode) => {
        const active = mode.id === selectedId;
        return (
          <TouchableOpacity
            key={mode.id}
            onPress={() => onSelect(mode)}
            activeOpacity={0.85}
            style={{
              backgroundColor: active ? '#252033' : '#120D1F',
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: active ? '#7FDBFF' : '#2C2339',
              marginBottom: 8,
              gap: 6,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#E7E3F3', fontSize: 15, fontWeight: '700' }}>{mode.title}</Text>
              {active && <Feather name="check" size={16} color="#7FDBFF" />}
            </View>
            <Text style={{ color: '#B7B2CE', fontSize: 13 }}>{mode.subtitle}</Text>
            <Text style={{ color: '#9AE0BD', fontSize: 12, fontWeight: '600' }}>
              Low: {mode.low} | High: {mode.high}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={onContinue}
        activeOpacity={0.9}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 26,
          paddingVertical: 14,
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <Text style={{ color: '#1B1527', fontWeight: '700' }}>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={{ alignItems: 'center' }}>
        <Text style={{ color: '#E7E3F3', fontWeight: '600' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </ModalShell>
);

const PreviewModal = ({ mode, onSubmit, onClose }) => (
  <ModalShell onClose={onClose}>
    <View
      style={{
        width: '100%',
        backgroundColor: '#1B1527',
        borderRadius: 24,
        padding: 18,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#E7E3F3', fontSize: 18, fontWeight: '700' }}>Preview & Confirm</Text>
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={20} color="#E7E3F3" />
        </TouchableOpacity>
      </View>
      <Text style={{ color: '#B7B2CE', fontSize: 13 }}>Review your monitoring setting</Text>
      <View
        style={{
          backgroundColor: '#0F0B18',
          borderRadius: 16,
          padding: 14,
          borderWidth: 1,
          borderColor: '#2C2339',
          gap: 6,
        }}
      >
        <Text style={{ color: '#E7E3F3', fontSize: 15, fontWeight: '700' }}>{mode.title}</Text>
        <Text style={{ color: '#B7B2CE', fontSize: 13 }}>{mode.subtitle}</Text>
        <Text style={{ color: '#9AE0BD', fontSize: 12, fontWeight: '700' }}>
          Low: {mode.low} | High: {mode.high}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#0F0B18',
          borderRadius: 16,
          padding: 14,
          borderWidth: 1,
          borderColor: '#2C2339',
          gap: 10,
        }}
      >
        <Text style={{ color: '#E7E3F3', fontSize: 15, fontWeight: '700' }}>Threshold Settings</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: '#B7B2CE', fontSize: 12 }}>Low Threshold</Text>
            <Text style={{ color: '#E7E3F3', fontWeight: '700' }}>35°C</Text>
          </View>
          <View
            style={{
              flex: 1,
              marginHorizontal: 12,
              height: 4,
              backgroundColor: '#2C2339',
              borderRadius: 2,
            }}
          />
          <View>
            <Text style={{ color: '#B7B2CE', fontSize: 12 }}>High Threshold</Text>
            <Text style={{ color: '#E7E3F3', fontWeight: '700' }}>40°C</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={onSubmit}
        activeOpacity={0.9}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 26,
          paddingVertical: 14,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#1B1527', fontWeight: '700' }}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={{ alignItems: 'center' }}>
        <Text style={{ color: '#E7E3F3', fontWeight: '600' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </ModalShell>
);

const SuccessModal = ({ mode, onClose }) => (
  <ModalShell onClose={onClose}>
    <View
      style={{
        width: '80%',
        backgroundColor: '#1B1527',
        borderRadius: 18,
        padding: 18,
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#7FDBFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="check" size={24} color="#0B0B15" />
      </View>
      <Text style={{ color: '#E7E3F3', fontSize: 16, fontWeight: '700' }}>Mode Activated</Text>
      <Text style={{ color: '#B7B2CE', fontSize: 13, textAlign: 'center' }}>
        {mode.title} is now active for monitoring.
      </Text>
    </View>
  </ModalShell>
);

export const useAdjustFlow = () => {
  const [adjustStep, setAdjustStep] = useState('hidden');
  const [selectedMode, setSelectedMode] = useState(MODE_OPTIONS[0]);
  const [pendingMode, setPendingMode] = useState(MODE_OPTIONS[0]);

  useEffect(() => {
    if (adjustStep === 'success') {
      const timer = setTimeout(() => setAdjustStep('hidden'), 1400);
      return () => clearTimeout(timer);
    }
  }, [adjustStep]);

  const startAdjustFlow = () => {
    setPendingMode(selectedMode);
    setAdjustStep('summary');
  };

  return {
    adjustStep,
    setAdjustStep,
    selectedMode,
    setSelectedMode,
    pendingMode,
    setPendingMode,
    startAdjustFlow,
  };
};

export const AdjustModals = ({
  adjustStep,
  selectedMode,
  pendingMode,
  setPendingMode,
  setSelectedMode,
  setAdjustStep,
}) => {
  return (
    <>
      {adjustStep === 'summary' && (
        <SummaryModal
          mode={selectedMode}
          onEdit={() => setAdjustStep('choose')}
          onClose={() => setAdjustStep('hidden')}
        />
      )}
      {adjustStep === 'choose' && (
        <ModeSelectModal
          selectedId={pendingMode.id}
          onSelect={(mode) => setPendingMode(mode)}
          onContinue={() => setAdjustStep('preview')}
          onClose={() => setAdjustStep('hidden')}
        />
      )}
      {adjustStep === 'preview' && (
        <PreviewModal
          mode={pendingMode}
          onSubmit={() => {
            setSelectedMode(pendingMode);
            setAdjustStep('success');
          }}
          onClose={() => setAdjustStep('hidden')}
        />
      )}
      {adjustStep === 'success' && (
        <SuccessModal mode={selectedMode} onClose={() => setAdjustStep('hidden')} />
      )}
    </>
  );
};
