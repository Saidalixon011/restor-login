import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
const Login = () => {
  const [phoneDigits, setPhoneDigits] = useState('');
  const [passwordDigits, setPasswordDigits] = useState('');
  const [showPhone, setShowPhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isProfileVerified');
    localStorage.removeItem('userData');
    localStorage.removeItem('currentUser');
  }, []);
  const handleDigitsChange = (e, setter) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
    let formatted = digits;
    if (digits.length > 2 && digits.length <= 5) {
      formatted = `${digits.slice(0, 2)} ${digits.slice(2)}`;
    } else if (digits.length > 5 && digits.length <= 7) {
      formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    } else if (digits.length > 7) {
      formatted = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
    }
    setter(formatted);
  };
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const rawPhone = phoneDigits.replace(/\s/g, '');
    const rawPassword = passwordDigits.replace(/\s/g, '');
    if (rawPhone.length !== 9 || rawPassword.length !== 9) {
      toast.error("Har ikkala maydonni to'liq (9 xonali raqam) kiriting!", { position: "top-right" });
      return;
    }
    if (rawPhone !== rawPassword) {
      toast.error("Telefon raqami va parol bir-biriga mos kelmadi!", { position: "top-right" });
      return;
    }
    const isAdmin = rawPhone === '000000000';
    if (!isAdmin) {
      const validCodes = ['90', '91', '93', '94', '95', '97', '98', '99', '33', '88', '77', '50', '87'];
      const phoneOperator = rawPhone.slice(0, 2);
      if (!validCodes.includes(phoneOperator)) {
        toast.error("Noto'g'ri operator kodi kiritildi!", { position: "top-right" });
        return;
      }
      const isAllSameDigits = /^(\d)\1+$/.test(rawPhone);
      if (isAllSameDigits) {
        toast.error("Yaroqsiz telefon raqami!", { position: "top-right" });
        return;
      }
      if (rawPhone === '123456789' || rawPhone === '987654321') {
        toast.error("Ketma-ket raqamlar kiritish taqiqlangan!", { position: "top-right" });
        return;
      }
      setIsProfileModalOpen(true);
    } else {
      const adminData = {
        firstName: 'Admin',
        lastName: '',
        phone: '+998 00 000 00 00'
      };
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('isProfileVerified', 'true');
      localStorage.setItem('userData', JSON.stringify(adminData));
      localStorage.setItem('currentUser', JSON.stringify(adminData));

      toast.success("Admin panelliga kirildi!", { position: "top-right", autoClose: 1500 });
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    }
  };
  const validateName = (name, fieldTitle) => {
    const trimmed = name.trim().replace(/\s+/g, ' ');
    if (!trimmed) {
      toast.error(`${fieldTitle} maydonini to'ldiring!`, { position: "top-right" });
      return false;
    }
    if (trimmed.length < 2) {
      toast.error(`${fieldTitle} kamida 2 ta harfdan iborat bo'lishi kerak!`, { position: "top-right" });
      return false;
    }
    if (trimmed.length > 35) {
      toast.error(`${fieldTitle} juda uzun (maksimal 35 belgi)!`, { position: "top-right" });
      return false;
    }
    const strictRegex = /^[A-Za-z'ʻʼ`\s]+$/;
    if (!strictRegex.test(trimmed)) {
      toast.error(`${fieldTitle}da faqat lotin harflari ishlatilishi shart (raqamlar yoki belgilarsiz)!`, { position: "top-right" });
      return false;
    }
    return trimmed;
  };
  const handleVerifyProfile = (e) => {
    e.preventDefault();
    const cleanFirstName = validateName(firstName, "Ism");
    if (!cleanFirstName) return;
    const cleanLastName = validateName(lastName, "Familiya");
    if (!cleanLastName) return;
    const userDataObj = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      phone: `+998 ${phoneDigits}`
    };
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('isProfileVerified', 'true');
    localStorage.setItem('userData', JSON.stringify(userDataObj));
    localStorage.setItem('currentUser', JSON.stringify(userDataObj));

    toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!", { position: "top-right", autoClose: 1500 });
    setIsProfileModalOpen(false);

    setTimeout(() => {
      navigate('/user');
    }, 500);
  };
  return (
    <div className="login-wrapper">
      <ToastContainer />
      <div className="login-card">
        <div className="login-header">
          <h2>Xush Kelibsiz!</h2>
          <p>Tizimga kirish uchun ma'lumotlarni kiriting</p>
        </div>
        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="input-field-group">
            <label>Telefon raqam</label>
            <div className="phone-input-wrapper">
              <span className="prefix">+998</span>
              <input
                type={showPhone ? "text" : "password"}
                placeholder="90 123 45 67"
                value={phoneDigits}
                onChange={(e) => handleDigitsChange(e, setPhoneDigits)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPhone(!showPhone)}
              >
                {showPhone ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="input-field-group">
            <label>Parol (raqamlarda)</label>
            <div className="phone-input-wrapper">
              <span className="prefix">+998</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="90 123 45 67"
                value={passwordDigits}
                onChange={(e) => handleDigitsChange(e, setPasswordDigits)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Kirish
          </button>
        </form>
      </div>
      {isProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Shaxsingizni Tasdiqlang</h2>
            <p>Tizimdan foydalanish uchun ma'lumotlaringizni kiriting:</p>
            <form onSubmit={handleVerifyProfile} className="profile-form">
              <div className="modal-input-group">
                <label>Ismingiz *</label>
                <input
                  type="text"
                  placeholder="Ali"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-input-group">
                <label>Familiyangiz *</label>
                <input
                  type="text"
                  placeholder="Valiyev"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  Bekor qilish
                </button>
                <button type="submit" className="verify-btn">
                  Tasdiqlash va Kirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;