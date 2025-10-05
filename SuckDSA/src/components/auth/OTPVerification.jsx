import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Shield, RefreshCw } from 'lucide-react';

const OTPVerification = ({ email, name, password, onSwitchToLogin }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const { verifyOTP, resendOTP } = useAuth();

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setMessage('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setMessage('Please enter all 6 digits of the OTP! 🔢');
      setLoading(false);
      return;
    }

    const result = await verifyOTP(email, otpString, name, password);
    
    if (!result.success) {
      setMessage(result.message);
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setMessage('');

    const result = await resendOTP(email);
    
    if (result.success) {
      setMessage('New OTP sent! Check your inbox 📧');
      setTimer(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } else {
      setMessage(result.message);
    }
    
    setResendLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-0"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            🔥 SuckDSA
          </h1>
          <p className="text-white/80 text-lg">
            Almost there! Verify your email 📧
          </p>
        </div>

        {/* OTP Verification Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-white/70">
              We sent a 6-digit OTP to <br />
              <span className="font-semibold text-orange-400">{email}</span>
            </p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm backdrop-blur-sm ${
              message.includes('sent') 
                ? 'bg-green-500/20 border border-green-400/30 text-green-200'
                : 'bg-red-500/20 border border-red-400/30 text-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div>
              <label className="block text-sm font-medium text-white mb-3 text-center">
                Enter 6-Digit OTP
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-white/70 text-sm">
                  OTP expires in: <span className="font-semibold text-red-400">{formatTime(timer)}</span>
                </p>
              ) : (
                <p className="text-red-400 text-sm font-semibold">
                  OTP expired! Please request a new one.
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify & Join SuckDSA
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || resendLoading}
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                {resendLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend OTP
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-white/70">
              Wrong email?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                Go Back
              </button>
            </p>
          </div>

          {/* Savage Quote */}
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30 backdrop-blur-sm">
            <p className="text-sm text-yellow-200 italic text-center">
              "Don't be slower than a government website! Enter that OTP! ⏰"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
