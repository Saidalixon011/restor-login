import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, ArrowLeft, KeyRound, Lock, ShieldAlert, X } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './profil.css';

const Profil = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || {
    id: 1,
    firstName: 'Foydalanuvchi',
    lastName: 'Familiya',
    phone: '+998 90 000 00 00'
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isOptionsSheetOpen, setIsOptionsSheetOpen] = useState(false);
  const toggleSettings = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="profil-container">
      <ToastContainer limit={2} autoClose={2000} newestOnTop />
      <div className={`profil-card ${isOpen ? 'card-compact' : ''}`}>
        <div className="profil-header">
          <button className="profil-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Orqaga
          </button>
          <button className="settings-toggle-btn" onClick={toggleSettings}>
            <Settings size={20} />
          </button>
        </div>
        <div className="profil-info">
          <h2>{user.firstName} {user.lastName}</h2>
          <p>{user.phone}</p>
        </div>
        {isOpen && (
          <div className="profil-settings-panel">
            <button className="change-pass-btn" onClick={() => setIsOptionsSheetOpen(true)}>
              <KeyRound size={16} /> Parol almashtirish
            </button>
          </div>
        )}
      </div>
      {isOptionsSheetOpen && (
        <div className="sheet-overlay" onClick={() => setIsOptionsSheetOpen(false)}>
          <div className="sheet-container" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="sheet-drag-handle"></div>
              <h3>Parol sozlamalari</h3>
              <button className="sheet-close-btn" onClick={() => setIsOptionsSheetOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="sheet-actions">
              <button className="sheet-option-btn disabled" disabled>
                <ShieldAlert size={18} />
                <span>Eski parol</span>
              </button>

              <button className="sheet-option-btn disabled" disabled>
                <Lock size={18} />
                <span>Yangi parol</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;