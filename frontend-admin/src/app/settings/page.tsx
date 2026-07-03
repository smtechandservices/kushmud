'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import { fetchMe, updateMe, changePassword, AdminUser } from '@/lib/data';

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--line-2)',
  borderRadius: 4,
  fontSize: 14,
  fontFamily: 'var(--sans)',
  color: 'var(--ink)',
  background: 'var(--paper)',
  outline: 'none',
  width: '100%',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--muted)',
      }}>{label}</label>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === 'input') {
          const existingStyle = (child.props as React.HTMLAttributes<HTMLElement>).style ?? {};
          return React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
            style: { ...inputStyle, ...existingStyle },
          });
        }
        return child;
      })}
    </div>
  );
}

export default function SettingsPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMe();
        setMe(data);
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
      } catch (e) {
        setLoadError('Failed to load your profile.');
      } finally {
        setLoadingMe(false);
      }
    }
    load();
  }, []);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileMessage('');
    setProfileError('');
    try {
      const updated = await updateMe({ first_name: firstName, last_name: lastName, email });
      setMe(updated);
      setProfileMessage('Profile updated.');
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordMessage('Password updated.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setPasswordError(e instanceof Error ? e.message : 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14}/>
            <span>Search settings…</span>
          </div>
        </div>

        <div className="admin-content">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
            <div>
              <h2>Settings</h2>
              <p className="sub" style={{margin:'6px 0 0'}}>Manage your admin profile and account security.</p>
            </div>
          </div>

          {loadingMe ? (
            <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
              Loading settings…
            </div>
          ) : loadError ? (
            <div className="panel" style={{padding: 64, textAlign: 'center', color: 'var(--muted)'}}>
              <Icon name="settings" size={32} style={{marginBottom: 16, color: 'var(--clay)'}} />
              <p>{loadError}</p>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560}}>
              {/* Profile panel */}
              <div className="panel">
                <div className="panel-head">
                  <h4>Profile</h4>
                </div>
                <div className="panel-body" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  <Field label="Username">
                    <input type="text" value={me?.username || ''} disabled />
                  </Field>
                  <div style={{display: 'flex', gap: 16}}>
                    <div style={{flex: 1}}>
                      <Field label="First name">
                        <input
                          type="text"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                        />
                      </Field>
                    </div>
                    <div style={{flex: 1}}>
                      <Field label="Last name">
                        <input
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                  <Field label="Email">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Field>

                  <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 4}}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveProfile}
                      disabled={profileSaving}
                    >
                      {profileSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                    {profileMessage && (
                      <span style={{fontSize: 13, color: 'var(--forest)'}}>{profileMessage}</span>
                    )}
                    {profileError && (
                      <span style={{fontSize: 13, color: '#b8443a'}}>{profileError}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Change password panel */}
              <div className="panel">
                <div className="panel-head">
                  <h4>Change Password</h4>
                </div>
                <div className="panel-body" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  <Field label="Current password">
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                    />
                  </Field>
                  <Field label="New password">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </Field>
                  <Field label="Confirm new password">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                  </Field>

                  <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 4}}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleChangePassword}
                      disabled={passwordSaving}
                    >
                      {passwordSaving ? 'Updating…' : 'Update Password'}
                    </button>
                    {passwordMessage && (
                      <span style={{fontSize: 13, color: 'var(--forest)'}}>{passwordMessage}</span>
                    )}
                    {passwordError && (
                      <span style={{fontSize: 13, color: '#b8443a'}}>{passwordError}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
