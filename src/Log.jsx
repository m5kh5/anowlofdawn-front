import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';

function Log() {
  const { t } = useTranslation();
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [message, setmessage] = useState('');
  const [issucess, setissucess] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setuser] = useState(null);
  const navigate = useNavigate();
  //forgot your password
  const [showform, setshowform] = useState(false)
  const [forgotemail, setforgotemail] = useState("")
  const [newpassword, setnewpassword] = useState("")
  const [forgotmessage, setforgotmessage] = useState("")
  const [otp, setotp] = useState("")
  const [isotpsent, setisotpsent] = useState(false)

  const [showpassword, setShowpassword] = useState(false);

  const [loading, setLoading] = useState(false);
const [forgotLoading, setForgotLoading] = useState(false);

const [successmsg,setsuccessmsg]=useState('')


  //function connection
  const otpcheck = async (f) => {
    f.preventDefault();
    setforgotmessage("")
    setForgotLoading(true)
    try {
      const response = await fetch("https://anowlofdawn.onrender.com/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: forgotemail
        })
      })
      const data = await response.json()
      setforgotmessage(data.message)
      if (response.ok) {
        setisotpsent(true)
      }
    } catch (error) {
      setforgotmessage(t("failed connection to the server, please try again later"))
    }finally{
      setForgotLoading(false)
    }
  }

  const verifyotp = async (f) => {
    f.preventDefault()
    setforgotmessage("")
    setForgotLoading(true)
    setsuccessmsg("")
    try {
      const response = await fetch("https://anowlofdawn.onrender.com/api/verify-OTP", {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
          email: forgotemail,
          otp: otp,
          newpassword: newpassword
        })
      }) 
      const data=await response.json()
      if (response.ok) {
        setsuccessmsg(t("password has been changed successfully"));

        setshowform(false)
        setisotpsent(false)
        setforgotmessage("")
        setforgotemail("")
        setnewpassword("")
        setotp("")
      }else{
        setforgotmessage(t(data.message || "OTP is incorrect or expired"));
      }
    } catch (error) {
      setforgotmessage(t("failed connected to the server, please try again later "))
    }finally{
      setForgotLoading(false)
    }
  }

  const handlesubmit = async (e) => {
    e.preventDefault();
    setmessage('');
    setLoading(true)
    const endpoint = isLogin ? 'https://anowlofdawn.onrender.com/api/login' : 'https://anowlofdawn.onrender.com/api/signup';
    const bodydata = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(bodydata),
      });

      const data = await response.json();
      if (response.ok) {
        setissucess(true);
        setmessage(data.message);
        if (!isLogin) {
           localStorage.setItem("username", name)
          localStorage.setItem("useremail", email)
          setname("");
          setemail("");
          setpassword("");
          setTimeout(() => {
            navigate("/")
          }, 1000);

        } else {
          localStorage.setItem("username", data.username)
          localStorage.setItem("useremail", email)
          setTimeout(() => {
            navigate("/")
          }, 1000);
        }
        setuser(data.username || "User");
      } else {
        setissucess(false);
        setmessage(data.message);
      }
    } catch (error) {
      setissucess(false);
      setmessage(t("failed connect to the server"));
    }finally{
     setLoading(false)
    }

  };

  return (
    <div className="min-h-screen bg-[#0d0714] text-[#f1edf5] font-sans selection:bg-[#a78bfa] selection:text-black flex items-center justify-center p-4 md:p-8" dir="rtl">

      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-[#160d22] rounded-3xl border border-[#2d1b42] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

        {/* Section 1: Form & Interaction (Takes 7 columns) */}
        <div className="lg:col-span-7 p-8 md:p-14 flex flex-col justify-between text-right">

          {/* Logo & Home Link at the top */}
          <div className="w-full flex justify-between items-center mb-8">
            <div className="text-xl font-black tracking-wider text-[#cbd5e1]">
              An Owl<span className="text-[#a78bfa] font-light"> of Dawn</span>
            </div>
            <Link to="/" className="text-sm font-medium text-[#a78bfa] hover:underline">
              {t(' Home ← ')}
            </Link>
          </div>
          {successmsg && (
  <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg text-center my-4 font-medium animate-fade-in">
    {successmsg}
  </div>
)}

          {/* Data Form */}
          <div className="w-full max-w-md mx-auto my-auto">
            <h2 className="text-3xl font-extrabold text-white mb-2">
              {isLogin ? t('Welcome Back') : t('Join the Magical World')}
            </h2>
            <p className="text-sm text-gray-400 mb-8">
              {isLogin ? t('Enter your details to continue reading AL Andalos family chapters') : t('Create your account now and start a journey of mystery and excitement')}
            </p>

            {message && (
              <div className={`p-3 rounded-xl text-sm mb-4 font-medium text-center border ${
                issucess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handlesubmit} className="space-y-5">

              {/* Full Name Field (Sign Up Mode Only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#cbd5e1] tracking-wide block">{t('Full Name')}</label>
                  <input
                    type="text"
                    placeholder={t('yourname')}
                    disabled={loading}
                    value={name}
                    onChange={(n) => setname(n.target.value)}
                    required
                    className="w-full bg-[#0d0714] border border-[#2d1b42] focus:border-[#a78bfa] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300"
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#cbd5e1] tracking-wide block">{t('Email Address')}</label>
                <input
                disabled={loading}
                  type="email"
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                  className="w-full bg-[#0d0714] border border-[#2d1b42] focus:border-[#a78bfa] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 text-left"
                  dir="ltr"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#cbd5e1] tracking-wide block">{t('Password')}</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setshowform(true)}
                      className="text-xs text-[#a78bfa] hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      {t('Forgot your password ?')}
                    </button>
                  )}
                </div>
                <div className= "relative w-full">
                <input
                disabled={loading}
                  type={showpassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(p) => setpassword(p.target.value)}
                  required
                  className="w-full bg-[#0d0714] border border-[#2d1b42] focus:border-[#a78bfa] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 text-left"
                  dir="ltr"
                />
                <button
    type="button" // مهم حتى لا يقوم بتسليم النموذج (Form) عند الضغط
    onClick={() => setShowpassword(!showpassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a78bfa] text-xs transition-colors"
  >
      {showpassword ? t('Hide') : t('Show')} 
  </button>
                </div>
              </div>

              {/* Submit Button */}
              {/* الجديد */}
<button
  type="submit"
  disabled={loading}
  className="w-full bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] hover:from-[#cbd5e1] hover:to-[#94a3b8] text-black font-bold py-3.5 rounded-xl shadow-lg shadow-white/5 transition-all duration-300 transform hover:-translate-y-0.5 mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{t('Loading...')}</span>
    </>
  ) : (
    isLogin ? t('Login') : t('Create New Account')
  )}
</button>
            </form>
          </div>

          {/* Bottom Switch Button */}
          <div className="text-center text-sm text-gray-400 mt-8 lg:mt-0">
            {isLogin ? t("Don't have an account yet? ") : t('Is this your return to us? ')}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setmessage("")
                setname("")
                setemail("")
                setpassword("")
              }}
              className="text-[#a78bfa] font-bold hover:underline cursor-pointer focus:outline-none"
            >
              {isLogin ? t('Create an account now') : t('Login from here')}
            </button>
          </div>

        </div>

        {/* Section 2: Visual & Welcome Panel (Takes 5 columns) */}
        <div className="hidden lg:col-span-5 bg-gradient-to-br from-[#1c112b] to-[#0d0714] border-r border-[#2d1b42] p-12 flex flex-col justify-between text-center relative overflow-hidden">

          {/* Background Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#a78bfa]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-xs font-bold text-[#cbd5e1] tracking-widest uppercase">
            {t('Exclusive Access')}
          </div>

          {/* Mini Book Cover Simulation */}
          <div className="my-auto space-y-6 relative z-10">
            <div className="inline-block p-6 bg-[#160d22] rounded-2xl border border-[#cbd5e1]/20 shadow-2xl">
              <div className="text-6xl mb-2 animate-pulse">📘</div>
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide">{t('Al Andalos Family')}</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              {t('Book Description')}
            </p>
          </div>

          <div className="text-[10px] text-gray-500 tracking-wider">
            © 2026 An Owl of Dawn. All Rights Reserved
          </div>

        </div>

      </div>

      {/* Forgot Password Modal Pop-up */}
      {showform && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#160d22] border border-[#2d1b42] p-6 rounded-2xl w-full max-w-md text-right shadow-2xl">

            <h3 className="text-xl font-bold text-white mb-2">{t('Reset Password')}</h3>

            <p className="text-xs text-gray-400 mb-4">
              {!isotpsent
                ? t("Enter your email address to send the verification code (OTP).")
                : t("Enter the 6-digit code along with your new password.")}
            </p>

            <form onSubmit={!isotpsent ? otpcheck : verifyotp} className="space-y-4">

              {/* Email Field inside Modal */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">{t('Email Address')}</label>
                <input
                
                  type="email"
                  required
                  disabled={isotpsent||loading}
                  value={forgotemail}
                  onChange={(e) => setforgotemail(e.target.value)}
                  className={`w-full bg-[#0d0714] border border-[#2d1b42] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#a78bfa] ${isotpsent && 'opacity-50 cursor-not-allowed'}`}
                />
              </div>

              {/* OTP Stage 2 Fields */}
              {isotpsent && (
                <>
                  {/* OTP Code Field */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">{t('Verification Code (OTP)')}</label>
                    <input
                    disabled={loading}
                      type="text"
                      required
                      maxLength="6"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setotp(e.target.value)}
                      className="w-full bg-[#0d0714] border border-[#2d1b42] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#a78bfa] text-center tracking-widest"
                    />
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">{t('New Password')}</label>
                    <div className="relative">
                    <input
                     disabled={loading}
                      type={showpassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newpassword}
                      onChange={(e) => setnewpassword(e.target.value)}
                      className="w-full bg-[#0d0714] border border-[#2d1b42] text-white rounded-lg pl-3 pr-12 py-2 text-sm focus:outline-none focus:border-[#a78bfa] text-left dir-ltr"
                    />

                    <button
      type="button"
      onClick={() => setShowpassword(!showpassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#a78bfa] transition-colors"
    >
      {showpassword ? t('Hide') : t('Show')} 
    </button>
                    </div>
                  </div>
                </>
              )}

              {/* Error/Status Messages */}
              {forgotmessage && (
                <p className="text-xs text-center font-medium text-[#a78bfa] bg-[#a78bfa]/10 py-1.5 rounded">
                  {forgotmessage}
                </p>
              )}

              {/* Control Buttons at the bottom of Modal */}
              <div className="flex space-x-3 space-x-reverse pt-2">
                <button
  type="submit"
  disabled={forgotLoading}
  className="flex-1 bg-gradient-to-r from-[#e2e8f0] to-[#cbd5e1] text-black font-bold py-2 rounded-lg text-sm transition hover:opacity-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {forgotLoading ? (
    <>
      <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>{t('Loading...')}</span>
    </>
  ) : (
    !isotpsent ? t("send OTP code") : t("OTP Password")
  )}
</button>

                <button
                  type="button"
                  onClick={() => { setshowform(false); setisotpsent(false); setforgotmessage("") ,
                    setforgotemail("");
  setotp("");
  setnewpassword("");; }}
                  className="px-4 py-2 bg-[#2d1b42] hover:bg-[#3b2457] text-[#e2e8f0] rounded-lg text-sm border border-[#442966] cursor-pointer"
                >
                  {t('Cancel')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Log;