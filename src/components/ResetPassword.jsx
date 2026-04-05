import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../redux/api/authApi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();

  const hasMinLength = password.length >= 8;
  const passwordsMatch = password === confirmPassword;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!hasMinLength || !passwordsMatch) {
      return;
    }

    try {
      await resetPassword({ token, password, confirmPassword }).unwrap();
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      console.error('Password reset failed', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sifreni yenile</h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Yeni sifre
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Sifreni tesdiqle
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {password && !hasMinLength && (
            <div className="text-red-500 text-sm">
              Sifre en azi 8 simvol olmalidir.
            </div>
          )}

          {password && confirmPassword && !passwordsMatch && (
            <div className="text-red-500 text-sm">
              Sifreler eyni deyil.
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">
              {error.data?.message || 'Xeta bas verdi. Zehmet olmasa yeniden cehd edin.'}
            </div>
          )}

          {isSuccess && (
            <div className="text-green-500 text-sm">
              Sifre ugurla yenilendi. Giris sehifesine yonlendirilirsiniz...
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !hasMinLength || !passwordsMatch}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Yenilenir...' : 'Sifreni Yenile'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
            Girise qayit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
