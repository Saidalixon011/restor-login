import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Power, ShieldCheck, Search } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState(() => {
    const savedUsers = localStorage.getItem('appUsersList');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('appUsersList', JSON.stringify(usersList));
  }, [usersList]);

  const toggleUserStatus = (id) => {
    toast.dismiss();
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updatedStatus = !u.isActive;
          const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Foydalanuvchi';
          if (updatedStatus) {
            toast.success(`${fullName} aktivlashtirildi!`, {
              position: "top-right",
              autoClose: 1500,
            });
          } else {
            toast.warn(`${fullName} dezaktiv qilindi!`, {
              position: "top-right",
              autoClose: 1500,
            });
          }
          return { ...u, isActive: updatedStatus };
        }
        return u;
      })
    );
  };

  const confirmLogout = () => {
    localStorage.removeItem('userRole');
    setIsLogoutModalOpen(false);
    navigate('/', { replace: true });
  };

  const goToProfile = (user) => {
    // Agar foydalanuvchi dezaktiv qilingan bo'lsa, profilga kirmaydi
    if (user.isActive === false) {
      toast.dismiss();
      toast.error("Ushbu foydalanuvchi dezaktiv qilingan! Profilga kirish taqiqlangan.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    if (!localStorage.getItem('userRole')) {
      localStorage.setItem('userRole', 'admin');
    }
    navigate('/profil', { state: { user } });
  };

  const filteredUsers = usersList.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <ToastContainer limit={2} autoClose={2000} newestOnTop />
      <div className="admin-card-wide">
        <div className="admin-header">
          <div className="header-title">
            <div className="admin-icon-wrapper">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2>Admin Boshqaruv Paneli</h2>
              <p className="admin-subtitle">Foydalanuvchilar holatini va kirish huquqlarini boshqarish</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="admin-logout-btn" onClick={() => setIsLogoutModalOpen(true)}>
              <LogOut size={16} /> Chiqish
            </button>
          </div>
        </div>
        <div className="admin-controls">
          <div className="admin-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Ism, familiya yoki telefon bo'yicha qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="admin-stats">
            Jami: <span>{filteredUsers.length} ta</span>
          </div>
        </div>
        {filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>T/r</th>
                  <th>Foydalanuvchi (Ism / Familiya)</th>
                  <th>Telefon raqam</th>
                  <th>Holati</th>
                  <th style={{ textAlign: 'center' }}>Aktivlikni boshqarish</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const isDeactivated = user.isActive === false;
                  return (
                    <tr key={user.id} className={isDeactivated ? 'admin-row-disabled' : ''}>
                      <td>{index + 1}</td>
                      <td>
                        <button className="user-fullname-btn" onClick={() => goToProfile(user)}>
                          <span>{user.firstName}</span>
                          <span>{user.lastName}</span>
                        </button>
                      </td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`admin-badge ${isDeactivated ? 'badge-deactive' : 'badge-active'}`}>
                          {isDeactivated ? 'Dezaktiv (Muzlatilgan)' : 'Aktiv'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className={`admin-power-btn ${isDeactivated ? 'btn-activate' : 'btn-deactivate'}`}
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          <Power size={14} />
                          {isDeactivated ? 'Aktivlashtirish' : 'Dezaktiv qilish'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-no-data">Hozircha foydalanuvchilar topilmadi.</p>
        )}
      </div>
      {isLogoutModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsLogoutModalOpen(false)}>
          <div className="admin-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon logout-icon">
              <LogOut size={24} />
            </div>
            <h3>Tizimdan chiqish</h3>
            <p>Haqiqatdan ham tizimdan chiqmoqchimisiz?</p>
            <div className="admin-modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsLogoutModalOpen(false)}>
                Yo'q
              </button>
              <button type="button" className="btn-logout-confirm" onClick={confirmLogout}>
                Ha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;