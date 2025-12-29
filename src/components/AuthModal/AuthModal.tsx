'use client';
import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import styles from "./AuthModal.module.css";
import BackgroundOverlay from '../BackgroundOverlay/BackgroundOverlay';
import CustomTextInput from '../CustomTextInput/CustomTextInput';
import CustomButton from '../CustomButton/CustomButton';
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css";
import X from "@/assets/icons/x.svg";
import { useStytch } from '@stytch/nextjs';
import { apiClient } from '@/utils/apiClient';
import { BASE_URL, ENDPOINTS } from '@/_lib/apiEndpoints';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { LoginResponse, SignupResponse, User } from '@/types/user';
import { queryClient } from "@/utils/reactQueryClient";


interface AuthModalProps {
  authMode: string;
  setAuthMode: React.Dispatch<React.SetStateAction<string>>;
}

interface AuthInfo {
  username: string;
  email: string;
  password: string;
  emailOTP: string;
  methodId: string;
}

export default function AuthModal({ authMode, setAuthMode }: AuthModalProps) {
  const [authInfo, setAuthInfo] = useState<AuthInfo>({
    username: "",
    email: "",
    password: "",
    emailOTP: "",
    methodId: ""
  });

  const [showOtpUi, setShowOtpUi] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const stytchClient = useStytch();
  const modalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);


  const handleAuthInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthInfo(prev => ({ ...prev, [name]: value }));
  };


const getErrorMessage = (error: unknown): string => {


  if (typeof error === "object" && error !== null && "error_type" in error) {
    const stytchError = error as { error_type: string };
    alert(stytchError.error_type)

    switch (stytchError.error_type) {
      case "user_lock_limit_reached":
        return "Too many failed attempts. Please try again later.";
      case "unauthorized_credentials":
        return "Incorrect email or password.";
      case "email_not_found":
        return "No account found with this email.";
      default:
        return "Authentication failed. Please try again.";
    }
  }

  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  return "Something went wrong. Please try again.";
};


  const handleSignUp = async () => {
    setLoading(true);
    try {
      if (!authInfo.email || !authInfo.password || !authInfo.username) {
        throw new Error("Please fill out all fields");
      }

    const { data } = await apiClient<{ available: boolean }>(
      `${BASE_URL}${ENDPOINTS.CHECK_USERNAME}`,
      "POST",
      { username: authInfo.username }
    );
    

      if (!data?.available) throw new Error("Username already taken");

      const response = await stytchClient.otps.email.loginOrCreate(authInfo.email, {
        expiration_minutes: 5,
      });

      if (response.status_code !== 200) throw new Error("Failed to send OTP");

      setAuthInfo((prev) => ({ ...prev, methodId: response.method_id }));
      setShowOtpUi(true);
      setErrorMessage("");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOTPVerification = async () => {
    setLoading(true);
    try {
      if (!authInfo.methodId || !authInfo.emailOTP) {
        throw new Error("Please enter the OTP code.");
      }

      const response = await stytchClient.otps.authenticate(
        authInfo.emailOTP,
        authInfo.methodId,
        { session_duration_minutes: 60 }
      );

      if (response.status_code !== 200) throw new Error("Invalid OTP");

      const singUpResponse = await apiClient<SignupResponse>(`${BASE_URL}${ENDPOINTS.SIGNUP}`, "POST", {
        email: authInfo.email,
        password: authInfo.password,
        session_token: response.session_token,
        username: authInfo.username,
      });

      if(singUpResponse.data) {
        console.log("Savin user data to tanstack", singUpResponse.data.user)
        queryClient.setQueryData(["me"], singUpResponse.data.user);
      }

      setErrorMessage("");
/*       window.location.reload(); */
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!authInfo.email || !authInfo.password) {
        throw new Error("Please enter email and password.");
      }

      const response = await stytchClient.passwords.authenticate({
        email: authInfo.email,
        password: authInfo.password,
        session_duration_minutes: 60,
      });

      const backendResp = await apiClient<LoginResponse>(`${BASE_URL}${ENDPOINTS.LOGIN}`, "POST", {
        session_jwt: response.session_jwt,
        stytch_user_id: response.user_id,
      });

      if (!backendResp || backendResp.status !== 200) {
        throw new Error("Backend login failed.");
      }

      if (backendResp.data) {
        console.log("SAVING me info to tanstack", backendResp.data.user)
        queryClient.setQueryData(["me"], backendResp.data.user);
      }

      setErrorMessage("");
      setAuthMode("");
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setAuthMode("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setAuthMode]);

  return (
    <BackgroundOverlay>
      <div ref={modalRef} className={styles.AuthModalContainer}>
        <h3 className={styles.authMode}>{authMode}</h3>
        <X
          onClick={() => setAuthMode("")}
          color="black"
          className={styles.closeButton}
          width={23}
          height={23}
        />

        {showOtpUi && (
          <div>
            <CustomTextInput
              name='emailOTP'
              label='Enter OTP from your email'
              type='text'
              onChange={handleAuthInfo}
            />
            <CustomButton
              title='Verify Email & Create Account'
              onClick={handleEmailOTPVerification}
            />
          </div>
        )}

        {!loading ? (
          <>
            {!showOtpUi && (
              <div className={styles.authActions}>
                {authMode === "Sign Up" && (
                  <CustomTextInput
                    label='Username'
                    placeholder='username'
                    onChange={handleAuthInfo}
                    name='username'
                    type='text'
                    value={authInfo.username}
                  />
                )}
                <CustomTextInput
                  label='Email'
                  placeholder='email'
                  onChange={handleAuthInfo}
                  name='email'
                  type='email'
                  value={authInfo.email}
                />
                <CustomTextInput
                  label='Password'
                  placeholder='password'
                  onChange={handleAuthInfo}
                  name='password'
                  type='password'
                  value={authInfo.password}
                />
                <p
                  onClick={() => setAuthMode("Sign Up")}
                  className={styles.forgotPassword}
                >
                  Forgot password?, Reset now.
                </p>
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <CustomButton
                  className={`${ButtonStyles.primary_button} ${styles.actionButton}`}
                  title={authMode === "Log In" ? 'Log In' : 'Sign Up'}
                  onClick={authMode === "Log In" ? handleLogin : handleSignUp}
                />
              </div>
            )}

            {authMode === "Log In" ? (
              <p
                onClick={() => setAuthMode("Sign Up")}
                className={styles.noAccount}
              >
               Don&apos;t have an account? Sign up.</p>
            ) : (
              <p
                onClick={() => setAuthMode("Log In")}
                className={styles.noAccount}
              >
                Already have an account? Log In.
              </p>
            )}
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </BackgroundOverlay>
  );
}
