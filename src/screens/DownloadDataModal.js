import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function DownloadDataModal({ visible, onClose }) {
  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        onPress={onClose}
      />
      <View
        style={{
          width: '100%',
          backgroundColor: '#1B1527',
          borderRadius: 22,
          padding: 18,
          gap: 12,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#E7E3F3', fontSize: 18, fontWeight: '700' }}>Download Temperature Data</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={20} color="#E7E3F3" />
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#B7B2CE', fontSize: 13 }}>
          Export logs and temperature trends as CSV for further review.
        </Text>

        <Field label="Start Date" value="DD-MM-YYYY" />
        <Field label="End Date" value="DD-MM-YYYY" />
        <Field label="Export format" value="CSV - Spreadsheet" />

        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.9}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 26,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#1B1527', fontWeight: '700' }}>Download Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={{ alignItems: 'center' }}>
          <Text style={{ color: '#E7E3F3', fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Field = ({ label, value }) => (
  <View
    style={{
      backgroundColor: '#120D1F',
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: '#2C2339',
      gap: 4,
    }}
  >
    <Text style={{ color: '#B7B2CE', fontSize: 12 }}>{label}</Text>
    <Text style={{ color: '#E7E3F3', fontSize: 14, fontWeight: '700' }}>{value}</Text>
  </View>
);
