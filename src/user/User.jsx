import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, Users, CheckCircle, XCircle, UserPlus, Edit3, Trash2, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './user.css';

const User = () => {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState(() => {
    const savedUsers = localStorage.getItem('appUsersList');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '+998 ' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [attendanceModal, setAttendanceModal] = useState({ isOpen: false, user: null, status: null });
  useEffect(() => {
    const loggedInUserRaw = localStorage.getItem('currentUser');
    let loggedInUser = loggedInUserRaw ? JSON.parse(loggedInUserRaw) : null;
    if (!loggedInUser) {
      const phone = localStorage.getItem('adminPhone') || localStorage.getItem('userPhone');
      if (phone) {
        loggedInUser = {
          firstName: 'Admin',
          lastName: '',
          phone: phone
        };
      }
    }
    if (loggedInUser && loggedInUser.phone) {
      setUsersList((prevList) => {
        const cleanLoggedInPhone = String(loggedInUser.phone).replace(/\D/g, '');
        const exists = prevList.some((u) => {
          const cleanUserPhone = u.phone ? String(u.phone).replace(/\D/g, '') : '';
          return cleanUserPhone === cleanLoggedInPhone;
        });
        if (!exists) {
          const newUser = {
            id: Date.now(),
            firstName: loggedInUser.firstName || 'Foydalanuvchi',
            lastName: loggedInUser.lastName || '',
            phone: loggedInUser.phone,
            isActive: true,
            attendance: null
          };
          const updatedList = [newUser, ...prevList];
          localStorage.setItem('appUsersList', JSON.stringify(updatedList));
          return updatedList;
        }
        return prevList;
      });
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('appUsersList', JSON.stringify(usersList));
  }, [usersList]);
  const handlePhoneChange = (e) => {
    let input = e.target.value;
    let digits = input.replace(/\D/g, '');
    if (digits.startsWith('998')) {
      digits = digits.slice(3);
    }
    digits = digits.slice(0, 9);
    let formatted = '+998';
    if (digits.length > 0) formatted += ' ' + digits.slice(0, 2);
    if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
    if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
    if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
    setFormData({ ...formData, phone: formatted });
  };
  const openAttendanceModal = (user, status) => {
    if (user.isActive === false) return;
    setAttendanceModal({ isOpen: true, user, status });
  };
  const confirmAttendance = () => {
    const { user, status } = attendanceModal;
    if (!user || !status) return;
    toast.dismiss();
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === user.id) {
          const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Foydalanuvchi';
          if (status === 'present') {
            toast.success(`${fullName} — Keldi deb belgilandi!`, { autoClose: 1500 });
          } else {
            toast.error(`${fullName} — Kelmadi deb belgilandi!`, { autoClose: 1500 });
          }
          return { ...u, attendance: status };
        }
        return u;
      })
    );
    setAttendanceModal({ isOpen: false, user: null, status: null });
  };
  const openUserModal = (user = null) => {
    if (user && user.isActive === false) return;
    if (user) {
      setEditingUserId(user.id);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '+998 '
      });
    } else {
      setEditingUserId(null);
      setFormData({ firstName: '', lastName: '', phone: '+998 ' });
    }
    setIsUserModalOpen(true);
  };
  const handleSaveUser = (e) => {
    e.preventDefault();
    const digits = formData.phone.replace(/\D/g, '').slice(3);
    if (!formData.firstName.trim() || digits.length < 9) {
      toast.error("Ism va 9 xonali telefon raqamni to'liq kiriting!", { autoClose: 1500 });
      return;
    }
    if (editingUserId) {
      setUsersList((prev) =>
        prev.map((u) => (u.id === editingUserId ? { ...u, ...formData } : u))
      );
      toast.success("Foydalanuvchi ma'lumotlari yangilandi!", { autoClose: 1500 });
    } else {
      const newUser = {
        id: Date.now(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        isActive: true,
        attendance: null
      };
      setUsersList((prev) => [newUser, ...prev]);
      toast.success("Yangi foydalanuvchi qo'shildi!", { autoClose: 1500 });
    }
    setIsUserModalOpen(false);
    setFormData({ firstName: '', lastName: '', phone: '+998 ' });
  };
  const openDeleteModal = (user) => {
    if (user.isActive === false) return;
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    if (deletingUser) {
      setUsersList((prev) => prev.filter((u) => u.id !== deletingUser.id));
      toast.error(`${deletingUser.firstName} o'chirildi!`, { autoClose: 1500 });
    }
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };
  const confirmLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminPhone');
    localStorage.removeItem('userPhone');
    setIsLogoutModalOpen(false);
    navigate('/', { replace: true });
  };
  const filteredUsers = usersList.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="user-container">
      <ToastContainer limit={2} autoClose={1500} newestOnTop />
      <div className="user-card-wide">
        <div className="user-header">
          <div className="header-title">
            <div className="icon-wrapper">
              <Users size={24} />
            </div>
            <div>
              <h2>Foydalanuvchilar Paneli</h2>
              <p className="subtitle">Davomat va foydalanuvchilarni boshqarish</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="add-btn" onClick={() => openUserModal()}>
              <UserPlus size={16} /> Yangi Qo'shish
            </button>
            <button className="logout-btn" onClick={() => setIsLogoutModalOpen(true)}>
              <LogOut size={16} /> Chiqish
            </button>
          </div>
        </div>
        <div className="table-controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Ism, familiya yoki telefon bo'yicha qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="stats-badge">
            Jami: <span>{filteredUsers.length} ta</span>
          </div>
        </div>
        {filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="user-table-horizontal">
              <thead>
                <tr>
                  <th>T/r</th>
                  <th>Foydalanuvchi</th>
                  <th>Telefon raqam</th>
                  <th>Akkaunt holati</th>
                  <th style={{ textAlign: 'center' }}>Davomat</th>
                  <th style={{ textAlign: 'center' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const isDeactivated = user.isActive === false;
                  const firstLetter = user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
                  return (
                    <tr key={user.id} className={isDeactivated ? 'user-row-disabled' : ''}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="user-name-cell">
                          <div className="avatar-circle">{firstLetter}</div>
                          <div>
                            <strong>{user.firstName} {user.lastName}</strong>
                          </div>
                        </div>
                      </td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`badge ${isDeactivated ? 'badge-deactive' : 'badge-active'}`}>
                          {isDeactivated ? 'Dezaktiv (Muzlatilgan)' : 'Aktiv'}
                        </span>
                      </td>
                      <td>
                        {isDeactivated ? (
                          <div className="attendance-blocked">
                            <span>Muzlatilgan</span>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className={`attendance-btn btn-present ${user.attendance === 'present' ? 'active-present' : ''}`}
                              onClick={() => openAttendanceModal(user, 'present')}
                            >
                              <CheckCircle size={15} /> Keldi
                            </button>
                            <button
                              className={`attendance-btn btn-absent ${user.attendance === 'absent' ? 'active-absent' : ''}`}
                              onClick={() => openAttendanceModal(user, 'absent')}
                            >
                              <XCircle size={15} /> Kelmadi
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="icon-btn edit-icon-btn"
                            title={isDeactivated ? "Muzlatilgan foydalanuvchi tahrirlanmaydi" : "Tahrirlash"}
                            onClick={() => openUserModal(user)}
                            disabled={isDeactivated}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="icon-btn delete-icon-btn"
                            title={isDeactivated ? "Muzlatilgan foydalanuvchi o'chirilmaydi" : "O'chirish"}
                            onClick={() => openDeleteModal(user)}
                            disabled={isDeactivated}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data-box">Hozircha foydalanuvchilar mavjud emas.</div>
        )}
      </div>
      {isUserModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUserModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUserId ? "Foydalanuvchini Tahrirlash" : "Yangi Foydalanuvchi Qo'shish"}</h3>
              <button className="close-btn" onClick={() => setIsUserModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="modal-form">
              <div className="input-group">
                <label>Ism *</label>
                <input
                  type="text"
                  placeholder="Ismni kiriting"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Familiya</label>
                <input
                  type="text"
                  placeholder="Familiyani kiriting"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Telefon raqam *</label>
                <input
                  type="text"
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={17}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsUserModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="save-btn">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {attendanceModal.isOpen && (
        <div className="modal-overlay" onClick={() => setAttendanceModal({ isOpen: false, user: null, status: null })}>
          <div className="confirm-modal-card mini-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`confirm-icon ${attendanceModal.status === 'present' ? 'present-icon' : 'absent-icon'}`}>
              {attendanceModal.status === 'present' ? <CheckCircle size={22} /> : <XCircle size={22} />}
            </div>
            <h4>Davomatni belgilash</h4>
            <p>
              <strong>{attendanceModal.user?.firstName} {attendanceModal.user?.lastName}</strong> —{" "}
              {attendanceModal.status === 'present' ? (
                <span className="status-present-text">Keldi</span>
              ) : (
                <span className="status-absent-text">Kelmadi</span>
              )} deb belgilansinmi?
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setAttendanceModal({ isOpen: false, user: null, status: null })}>Yo'q</button>
              <button className="save-btn" onClick={confirmAttendance}>Ha, Tasdiqlayman</button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="confirm-modal-card mini-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon delete-icon">
              <Trash2 size={22} />
            </div>
            <h4>Foydalanuvchini o'chirish</h4>
            <p><strong>{deletingUser?.firstName} {deletingUser?.lastName}</strong> o'chiriladi. Ishonchingiz komilmi?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsDeleteModalOpen(false)}>Bekor qilish</button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>O'chirish</button>
            </div>
          </div>
        </div>
      )}
      {isLogoutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLogoutModalOpen(false)}>
          <div className="confirm-modal-card mini-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon logout-icon">
              <LogOut size={22} />
            </div>
            <h4>Tizimdan chiqish</h4>
            <p>Tizimdan chiqmoqchimisiz?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsLogoutModalOpen(false)}>Yo'q</button>
              <button className="confirm-logout-btn" onClick={confirmLogout}>Ha, Chiqish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default User;