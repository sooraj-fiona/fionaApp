import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const USERS = [
  {
    id: 'sarah',
    name: 'Dr. Sarah',
    email: 'Sarah1234@gmail.com',
    role: 'Secondary User',
    avatar: 'DS',
  },
  {
    id: 'rachel',
    name: 'Rachel',
    email: 'Rachel1234@gmail.com',
    role: 'Tertiary User',
    avatar: 'RA',
  },
];

const ROLE_OPTIONS = ['Primary User', 'Secondary User', 'Tertiary User'];

export const ManagePermissionsScreen = () => {
  const [users, setUsers] = useState(USERS);
  const [step, setStep] = useState('list'); // list | role | invite | success
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [showRoles, setShowRoles] = useState(false);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId),
    [users, selectedUserId],
  );

  const openRoleModal = (user) => {
    setSelectedUserId(user.id);
    setSelectedRole('');
    setStep('role');
    setShowRoles(false);
  };

  const handleActivate = () => {
    if (!selectedUser) return;
    setStep('invite');
  };

  const handleSendInvite = () => {
    if (!selectedUser || !selectedRole) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, role: selectedRole } : u,
      ),
    );
    setStep('success');
    setShowRoles(false);
  };

  const closeAll = () => {
    setStep('list');
    setSelectedUserId(null);
    setSelectedRole('');
    setShowRoles(false);
  };

  return (
    <View style={s.screen}>
      <Text style={s.header}>Manage Permission</Text>
      <Pressable style={s.newUserButton}>
        <Feather name="plus" size={16} color="#0F0B18" />
        <Text style={s.newUserText}>New User</Text>
      </Pressable>

      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 40 }}>
        {users.map((user) => (
          <View key={user.id} style={s.card}>
            <View style={s.cardTop}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{user.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{user.name}</Text>
                <Text style={s.email}>{user.email}</Text>
                <View style={s.roleTag}>
                  <Text style={s.roleTagText}>{user.role}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={s.modifyButton}
                onPress={() => openRoleModal(user)}
              >
                <Text style={s.modifyText}>Modify</Text>
              </TouchableOpacity>
            </View>
            <View style={s.permissions}>
              {['View Temperature', 'Manage Alerts', 'Device Control', 'View History'].map(
                (perm) => (
                  <View key={perm} style={s.permRow}>
                    <Text style={s.permText}>{perm}</Text>
                    <View style={s.switchGhost} />
                  </View>
                ),
              )}
            </View>
            <Pressable style={s.removeButton}>
              <Text style={s.removeText}>Remove Access</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {step !== 'list' && (
        <View style={s.backdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeAll}
          />
          {step === 'role' && selectedUser && (
            <View style={s.modal}>
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.modalTitle}>Update User Role</Text>
                  <Text style={s.modalSubtitle}>
                    Modify role – updates take effect right away
                  </Text>
                </View>
                <TouchableOpacity onPress={closeAll}>
                  <Feather name="x" size={18} color="#E7E3F3" />
                </TouchableOpacity>
              </View>
              <View style={s.userRow}>
                <View style={s.avatarSm}>
                  <Text style={s.avatarText}>{selectedUser.avatar}</Text>
                </View>
                <View>
                  <Text style={s.name}>{selectedUser.name}</Text>
                  <Text style={s.roleSmall}>{selectedUser.role}</Text>
                </View>
              </View>

              <Text style={s.fieldLabel}>Access Role</Text>
              <Pressable
                onPress={() => setShowRoles((p) => !p)}
                style={s.select}
              >
                <Text style={s.selectText}>
                  {selectedRole || 'Select'}
                </Text>
                <Feather
                  name={showRoles ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#E7E3F3"
                />
              </Pressable>
              {showRoles && (
                <View style={s.selectList}>
                  {ROLE_OPTIONS.map((role) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => {
                        setSelectedRole(role);
                        setShowRoles(false);
                      }}
                      style={[
                        s.selectItem,
                        selectedRole === role && s.selectItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          s.selectItemText,
                          selectedRole === role && s.selectItemTextActive,
                        ]}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity
                onPress={handleActivate}
                activeOpacity={0.9}
                style={s.primaryButton}
              >
                <Text style={s.primaryButtonText}>Activate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeAll}
                activeOpacity={0.8}
                style={{ alignItems: 'center' }}
              >
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'invite' && selectedUser && (
            <View style={s.modal}>
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.modalTitle}>Device Health & Control</Text>
                  <Text style={s.modalSubtitle}>
                    Send an invitation to grant access to this device
                  </Text>
                </View>
                <TouchableOpacity onPress={closeAll}>
                  <Feather name="x" size={18} color="#E7E3F3" />
                </TouchableOpacity>
              </View>

              <Text style={s.fieldLabel}>Email address</Text>
              <View style={s.input}>
                <Feather name="mail" size={16} color="#B7B2CE" />
                <TextInput
                  placeholder="user@example.com"
                  placeholderTextColor="#B7B2CE"
                  style={s.inputText}
                  defaultValue={selectedUser.email}
                />
              </View>

              <Text style={s.fieldLabel}>Access Role</Text>
              <Pressable
                onPress={() => setShowRoles((p) => !p)}
                style={s.select}
              >
                <Text style={s.selectText}>
                  {selectedRole || 'Select'}
                </Text>
                <Feather
                  name={showRoles ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#E7E3F3"
                />
              </Pressable>
              {showRoles && (
                <View style={s.selectList}>
                  {ROLE_OPTIONS.map((role) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => {
                        setSelectedRole(role);
                        setShowRoles(false);
                      }}
                      style={[
                        s.selectItem,
                        selectedRole === role && s.selectItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          s.selectItemText,
                          selectedRole === role && s.selectItemTextActive,
                        ]}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity
                onPress={handleSendInvite}
                activeOpacity={0.9}
                style={s.primaryButton}
              >
                <Text style={s.primaryButtonText}>Send invitation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeAll}
                activeOpacity={0.8}
                style={{ alignItems: 'center' }}
              >
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'success' && (
            <View style={s.successModal}>
              <View style={s.successIcon}>
                <Feather name="check" size={22} color="#0F0B18" />
              </View>
              <Text style={s.successTitle}>Invitation sent successfully</Text>
              <Text style={s.successBody}>
                Access will be activated once the user accepts the email invitation.
              </Text>
              <TouchableOpacity
                onPress={closeAll}
                activeOpacity={0.9}
                style={[s.primaryButton, { marginTop: 8, width: '80%' }]}
              >
                <Text style={s.primaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    backgroundColor: '#140F20',
  },
  header: {
    color: '#F5F1FF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  newUserButton: {
    backgroundColor: '#E6E3F8',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  newUserText: {
    color: '#0F0B18',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#1B1527',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#261C35',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2C2339',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSm: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2C2339',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#F5F1FF',
    fontWeight: '700',
  },
  name: {
    color: '#F5F1FF',
    fontSize: 15,
    fontWeight: '700',
  },
  email: {
    color: '#B7B2CE',
    fontSize: 12,
  },
  roleTag: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#2C2339',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleTagText: {
    color: '#9AE0BD',
    fontWeight: '700',
    fontSize: 11,
  },
  roleSmall: {
    color: '#7FDBFF',
    fontSize: 12,
  },
  modifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2C2339',
  },
  modifyText: {
    color: '#E7E3F3',
    fontWeight: '700',
    fontSize: 12,
  },
  permissions: {
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#261C35',
    paddingTop: 10,
    gap: 8,
  },
  permRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permText: {
    color: '#E7E3F3',
    fontSize: 13,
  },
  switchGhost: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0E8AE2',
  },
  removeButton: {
    marginTop: 12,
    backgroundColor: '#E24E4E',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  removeText: {
    color: '#FDF6F6',
    fontWeight: '700',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  modal: {
    width: '100%',
    backgroundColor: '#1B1527',
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#E7E3F3',
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: '#B7B2CE',
    fontSize: 12,
    marginTop: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldLabel: {
    color: '#B7B2CE',
    fontSize: 12,
    marginTop: 6,
  },
  select: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: '#120D1F',
    padding: 12,
    borderWidth: 1,
    borderColor: '#2C2339',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: '#E7E3F3',
    fontSize: 14,
  },
  selectList: {
    backgroundColor: '#120D1F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2339',
    marginTop: 6,
    overflow: 'hidden',
  },
  selectItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectItemActive: {
    backgroundColor: '#2A2040',
  },
  selectItemText: {
    color: '#E7E3F3',
    fontSize: 14,
  },
  selectItemTextActive: {
    color: '#7FDBFF',
    fontWeight: '700',
  },
  input: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: '#120D1F',
    padding: 12,
    borderWidth: 1,
    borderColor: '#2C2339',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputText: {
    flex: 1,
    color: '#E7E3F3',
    fontSize: 14,
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#1B1527',
    fontWeight: '700',
  },
  cancelText: {
    color: '#E7E3F3',
    fontWeight: '700',
    marginTop: 6,
  },
  successModal: {
    width: '90%',
    maxWidth: 320,
    backgroundColor: '#2A2040',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    gap: 10,
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7FDBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    color: '#F5F1FF',
    fontSize: 16,
    fontWeight: '700',
  },
  successBody: {
    color: '#D7D2EA',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
