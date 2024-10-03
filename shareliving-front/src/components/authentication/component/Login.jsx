import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, getAuthUser } from "../utils/service/apiUtil";
import Kakao from "../utils/service/Kakao";  
import "../scss/Login.scss";
import Google from "../../../public/img/Google.png"
import MainLogo from "../../../public/img/MainLogo.png"
import naver from "../../../public/img/naver.png"
import kakaoIcon from "../../../public/img/kakaoIcon.png"
import axios from "axios";

const API_BASE_URL = "https://kdt.frontend.5th.programmers.co.kr:5003";

const KAKAO_CLIENT_ID = import.meta.env.VITE_APP_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_APP_KAKAO_REDIRECT_URI;
const link = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}&response_type=code`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await getAuthUser();
      if (userData && userData.fullName) {
        setIsLoggedIn(true);
        setFullName(userData.fullName);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await login(email, password);
      setIsLoggedIn(true);
      setFullName(response.user.fullName);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaverLogin = () => {
    console.log("Naver login not implemented yet");
  };

  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}&response_type=code`;
  };

  return (
    <div className="login-container">
      <main className="login-content">
        <div className="login-form-container">
          <img src={MainLogo} alt="" className="form-logo" />
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>
          {message && <p className="error-message">{message}</p>}
          <div className="login-links">
            <Link to="/find-account-info">아이디/비밀번호 찾기</Link>
            <Link to="/signup">회원가입</Link>
          </div>
          <div className="social-login">
            <a onClick={handleKakaoLogin} className="kakao-login-button">
              <img src={kakaoIcon} alt="Kakao" className="kakao-icon" />
            </a>
            <GoogleLogin />
            <a onClick={handleNaverLogin} className="naver-login-button">
              <img src={naver} alt="Naver" className="naver-icon" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;