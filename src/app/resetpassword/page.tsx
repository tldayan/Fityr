"use client";

import CustomTextInput from '@/components/CustomTextInput/CustomTextInput';
import { useStytch } from '@stytch/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import CustomButton from '@/components/CustomButton/CustomButton';
import ButtonStyles from '@/app/globalStyles/buttonStyles.module.css';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const tokenType = searchParams.get('stytch_token_type');
  const stytchClient = useStytch();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (tokenType !== 'reset_password' || !token) {
    return <p>Invalid or expired reset link</p>;
  }

  const handleResetPassword = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        token,
        password,
        session_duration_minutes: 60,
      };

      const res = await stytchClient.passwords.resetByEmail(params);
      await stytchClient.session.revoke();

      if(res.status_code === 200) {
        toast.success("Password reset complete!");
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.error_message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Reset password</h3>
      <CustomTextInput
        disabled={loading}
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <CustomButton
        title={loading ? 'Resetting...' : 'Reset Password'}
        className={ButtonStyles.primary_button}
        onClick={handleResetPassword}
        disabled={loading}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
