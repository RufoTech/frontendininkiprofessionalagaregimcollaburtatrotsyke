import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../redux/api/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const emailRegex = /\S+@\S+\.\S+/;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email.trim())) {
      toast.error("Zehmet olmasa duzgun e-poct unvani daxil edin.");
      return;
    }

    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      toast.success("Sifre sifirlama linki e-poct unvaniniza gonderildi.");
      setEmail("");
    } catch (err) {
      toast.error(err?.data?.message || "Xeta bas verdi. Zehmet olmasa yeniden cehd edin.");
    }
  };

  return (
    <>
      <style>{`
        .forgot-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);
          padding: 24px 16px;
        }

        .forgot-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .forgot-title {
          margin-bottom: 12px;
          font-size: 30px;
          font-weight: 800;
          text-align: center;
          color: #111;
        }

        .forgot-desc {
          margin-bottom: 24px;
          text-align: center;
          font-size: 15px;
          color: #666;
          line-height: 1.6;
        }

        .forgot-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #444;
        }

        .forgot-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.8);
          border: 1.5px solid rgba(0, 0, 0, 0.1);
          font-size: max(16px, 14px);
          outline: none;
          transition: 0.2s;
          box-sizing: border-box;
        }

        .forgot-input:focus {
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
          border-color: #6366f1;
        }

        .forgot-btn {
          width: 100%;
          padding: 14px;
          border-radius: 50px;
          background: #4f46e5;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          margin-top: 20px;
          transition: background 0.2s;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.25);
          min-height: 50px;
        }

        .forgot-btn:hover:not(:disabled) {
          background: #4338ca;
        }

        .forgot-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .forgot-links {
          margin-top: 18px;
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .forgot-links a {
          color: #4f46e5;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }

        .forgot-links a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .forgot-card {
            padding: 28px 20px;
            border-radius: 16px;
          }

          .forgot-title {
            font-size: 26px;
          }

          .forgot-desc {
            font-size: 14px;
          }
        }
      `}</style>

      <section className="forgot-section">
        <div className="forgot-card">
          <h1 className="forgot-title">Sifreni unutmusunuz?</h1>
          <p className="forgot-desc">
            E-poct unvaninizi daxil edin, size sifrenizi yenilemek ucun link gonderilsin.
          </p>

          <form onSubmit={submitHandler}>
            <div>
              <label htmlFor="email" className="forgot-label">E-poct unvaniniz</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adiniz@mail.com"
                required
                className="forgot-input"
                autoComplete="email"
              />
            </div>

            <button type="submit" disabled={isLoading} className="forgot-btn">
              {isLoading ? "Gonderilir..." : "Sifremi Sifirla"}
            </button>
          </form>

          <div className="forgot-links">
            <Link to="/login">Girise qayit</Link>
            <Link to="/register">Qeydiyyata kec</Link>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </section>
    </>
  );
};

export default ForgotPassword;
