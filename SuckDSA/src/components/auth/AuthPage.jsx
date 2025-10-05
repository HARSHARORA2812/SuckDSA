import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import OTPVerification from './OTPVerification';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'otp'
  const [otpData, setOtpData] = useState({
    email: '',
    name: '',
    password: ''
  });

  const switchToLogin = () => {
    setCurrentView('login');
    setOtpData({ email: '', name: '', password: '' });
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToOTP = (email, name, password) => {
    setOtpData({ email, name, password });
    setCurrentView('otp');
  };

  if (currentView === 'login') {
    return <Login onSwitchToRegister={switchToRegister} />;
  }

  if (currentView === 'register') {
    return (
      <Register 
        onSwitchToLogin={switchToLogin}
        onSwitchToOTP={switchToOTP}
      />
    );
  }

  if (currentView === 'otp') {
    return (
      <OTPVerification
        email={otpData.email}
        name={otpData.name}
        password={otpData.password}
        onSwitchToLogin={switchToLogin}
      />
    );
  }

  return null;
};

export default AuthPage;
