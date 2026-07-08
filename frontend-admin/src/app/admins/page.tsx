'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Icon } from '@/components/Icon';
import {
  fetchMe, fetchAdmins, createAdmin, updateAdmin, deleteAdmin, AdminUser
} from '@/lib/data';

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

const emptyForm = { username: '', first_name: '', last_name: '', email: '', password: '', is_superuser: false };

export default function ManageAdminsPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createMessage, setCreateMessage] = useState('');

  const [actionError, setActionError] = useState('');

  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const loadAdmins = async () => {
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to load admins.');
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const meData = await fetchMe();
        setMe(meData);
        if (meData.is_superuser) {
          await loadAdmins();
        } else {
          setLoadingAdmins(false);
        }
      } catch {
        setLoadingAdmins(false);
      } finally {
        setLoadingMe(false);
      }
    }
    init();
  }, []);

  const filteredAdmins = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return admins;
    return admins.filter(a =>
      a.username.toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      `${a.first_name} ${a.last_name}`.toLowerCase().includes(q)
    );
  }, [admins, search]);

  const handleCreate = async () => {
    setCreateError('');
    setCreateMessage('');
    if (!form.username.trim() || !form.password) {
      setCreateError('Username and password are required.');
      return;
    }
    if (form.password.length < 8) {
      setCreateError('Password must be at least 8 characters.');
      return;
    }
    setCreating(true);
    try {
      await createAdmin({
        username: form.username.trim(),
        password: form.password,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        is_superuser: form.is_superuser,
      });
      setForm(emptyForm);
      setCreateMessage('Admin account created.');
      await loadAdmins();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create admin.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleSuperuser = async (admin: AdminUser) => {
    setActionError('');
    try {
      await updateAdmin(admin.id, { is_superuser: !admin.is_superuser });
      await loadAdmins();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to update admin.');
    }
  };

  const handleToggleActive = async (admin: AdminUser) => {
    setActionError('');
    try {
      await updateAdmin(admin.id, { is_active: !admin.is_active });
      await loadAdmins();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to update admin.');
    }
  };

  const openEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEditForm({ first_name: admin.first_name, last_name: admin.last_name, email: admin.email || '', password: '' });
    setEditError('');
  };

  const closeEdit = () => {
    setEditingAdmin(null);
    setEditError('');
  };

  const handleEditSave = async () => {
    if (!editingAdmin) return;
    setEditError('');
    if (editForm.password && editForm.password.length < 8) {
      setEditError('Password must be at least 8 characters.');
      return;
    }
    setEditSaving(true);
    try {
      await updateAdmin(editingAdmin.id, {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim(),
        ...(editForm.password ? { password: editForm.password } : {}),
      });
      closeEdit();
      await loadAdmins();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Failed to update admin.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!confirm(`Delete the admin account "${admin.username}"? This cannot be undone.`)) return;
    setActionError('');
    try {
      await deleteAdmin(admin.id);
      await loadAdmins();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to delete admin.');
    }
  };

  if (loadingMe) {
    return (
      <div className="admin">
        <Sidebar />
        <main className="admin-main">
          <div className="admin-content">
            <div className="panel" style={{ padding: 64, textAlign: 'center', color: 'var(--muted)' }}>
              Loading…
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!me?.is_superuser) {
    return (
      <div className="admin">
        <Sidebar />
        <main className="admin-main">
          <div className="admin-content">
            <div className="panel" style={{ padding: 64, textAlign: 'center', color: 'var(--muted)' }}>
              <Icon name="lock" size={32} style={{ marginBottom: 16, color: 'var(--clay)' }} />
              <p>Only superusers can manage admin accounts.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-top">
          <div className="admin-search">
            <Icon name="search" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search admins…"
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        <div className="admin-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <h2>Manage Admins</h2>
              <p className="sub" style={{ margin: '6px 0 0' }}>Create and manage admin/staff accounts and superuser access.</p>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 32, maxWidth: 640 }}>
            <div className="panel-head">
              <h4>New Admin</h4>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <Field label="Username">
                    <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="Password">
                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  </Field>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <Field label="First name">
                    <input type="text" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="Last name">
                    <input type="text" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
                  </Field>
                </div>
              </div>
              <Field label="Email">
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-2)' }}>
                <input
                  type="checkbox"
                  checked={form.is_superuser}
                  onChange={e => setForm({ ...form, is_superuser: e.target.checked })}
                />
                Grant superuser access
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={creating}>
                  {creating ? 'Creating…' : 'Create Admin'}
                </button>
                {createMessage && <span style={{ fontSize: 13, color: 'var(--forest)' }}>{createMessage}</span>}
                {createError && <span style={{ fontSize: 13, color: '#b8443a' }}>{createError}</span>}
              </div>
            </div>
          </div>

          {actionError && (
            <p style={{ fontSize: 13, color: '#b8443a', marginBottom: 16 }}>{actionError}</p>
          )}

          <div className="panel">
            {loadingAdmins ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Loading admins…</div>
            ) : admins.length === 0 ? (
              <div style={{ padding: 64, textAlign: 'center', color: 'var(--muted)' }}>
                <Icon name="shield" size={32} style={{ marginBottom: 16, color: 'var(--clay)' }} />
                <p>No admin accounts found.</p>
              </div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
                        No admins match your search.
                      </td>
                    </tr>
                  ) : filteredAdmins.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
                        {a.username}{a.id === me.id && <span className="tag" style={{ marginLeft: 8 }}>You</span>}
                      </td>
                      <td>{`${a.first_name} ${a.last_name}`.trim() || '—'}</td>
                      <td style={{ color: 'var(--ink-2)' }}>{a.email || '—'}</td>
                      <td>
                        <span className={'status ' + (a.is_superuser ? 'confirmed' : 'pending')}>
                          <span className="d"></span>{a.is_superuser ? 'superuser' : 'admin'}
                        </span>
                      </td>
                      <td>
                        <span className={'status ' + (a.is_active ? 'confirmed' : 'cancelled')}>
                          <span className="d"></span>{a.is_active ? 'active' : 'disabled'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button className="btn btn-sm btn-ghost" style={{ padding: '4px 10px' }} onClick={() => openEdit(a)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-ghost" style={{ padding: '4px 10px' }} onClick={() => handleToggleSuperuser(a)}>
                            {a.is_superuser ? 'Revoke superuser' : 'Make superuser'}
                          </button>
                          <button className="btn btn-sm btn-ghost" style={{ padding: '4px 10px' }} onClick={() => handleToggleActive(a)}>
                            {a.is_active ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            className="btn btn-sm btn-ghost"
                            style={{ padding: '4px 8px', color: 'var(--muted)' }}
                            onClick={() => handleDelete(a)}
                            disabled={a.id === me.id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {editingAdmin && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(28,25,22,0.6)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000, padding: 24,
          }}
          onClick={closeEdit}
        >
          <div
            style={{
              background: 'var(--paper)', border: '1px solid var(--line)',
              borderRadius: 8, padding: 32, maxWidth: 440, width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 22, marginBottom: 20 }}>Edit {editingAdmin.username}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <Field label="First name">
                    <input type="text" value={editForm.first_name} onChange={e => setEditForm({ ...editForm, first_name: e.target.value })} />
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="Last name">
                    <input type="text" value={editForm.last_name} onChange={e => setEditForm({ ...editForm, last_name: e.target.value })} />
                  </Field>
                </div>
              </div>
              <Field label="Email">
                <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              </Field>
              <Field label="New password">
                <input
                  type="password"
                  value={editForm.password}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
              </Field>
              {editError && <span style={{ fontSize: 13, color: '#b8443a' }}>{editError}</span>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={closeEdit} disabled={editSaving}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleEditSave} disabled={editSaving}>
                  {editSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
