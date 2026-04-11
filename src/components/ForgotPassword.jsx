import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useForgotPasswordMutation } from "../redux/api/authApi";
import "react-toastify/dist/ReactToastify.css";

const emailRegex = /\S+@\S+\.\S+/;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const submitHandler = async (event) => {
        event.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        if (!emailRegex.test(normalizedEmail)) {
            toast.error("Zəhmət olmasa düzgün email ünvanı daxil edin.");
            return;
        }

        try {
            const response = await forgotPassword({ email: normalizedEmail }).unwrap();
            setSubmittedEmail(normalizedEmail);
            toast.success(response?.message || "Şifrə sıfırlama yönləndirməsi göndərildi.");
        } catch (err) {
            toast.error(err?.data?.message || "Sorğu göndərilərkən xəta baş verdi.");
        }
    };

    return (
        <>
            <style>{`
                .forgot-password-shell {
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    padding: 32px 16px;
                    background:
                        radial-gradient(circle at top left, rgba(203, 124, 47, 0.22), transparent 28%),
                        radial-gradient(circle at bottom right, rgba(95, 58, 33, 0.18), transparent 30%),
                        linear-gradient(135deg, #f6f0e7 0%, #fffaf4 52%, #efe3d2 100%);
                }

                .forgot-password-frame {
                    width: min(1080px, 100%);
                    display: grid;
                    grid-template-columns: 1.05fr 0.95fr;
                    border-radius: 32px;
                    overflow: hidden;
                    background: rgba(255, 253, 248, 0.96);
                    border: 1px solid rgba(142, 103, 67, 0.18);
                    box-shadow: 0 30px 80px rgba(62, 36, 14, 0.16);
                }

                .forgot-password-aside {
                    position: relative;
                    padding: 56px 48px;
                    color: #fff8f1;
                    background:
                        linear-gradient(180deg, rgba(22, 12, 5, 0.1), rgba(22, 12, 5, 0.45)),
                        linear-gradient(135deg, #20130a 0%, #5f3a21 52%, #c67c2f 100%);
                }

                .forgot-password-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 14px;
                    border-radius: 999px;
                    background: rgba(255, 248, 241, 0.14);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                }

                .forgot-password-heading {
                    margin: 22px 0 16px;
                    font-size: clamp(34px, 5vw, 52px);
                    line-height: 1.02;
                    font-weight: 800;
                }

                .forgot-password-copy {
                    max-width: 460px;
                    margin: 0;
                    font-size: 16px;
                    line-height: 1.8;
                    color: rgba(255, 244, 232, 0.88);
                }

                .forgot-password-points {
                    display: grid;
                    gap: 14px;
                    margin-top: 36px;
                }

                .forgot-password-point {
                    padding: 16px 18px;
                    border-radius: 22px;
                    background: rgba(255, 251, 246, 0.12);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                }

                .forgot-password-point strong {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 15px;
                    color: #ffffff;
                }

                .forgot-password-point span {
                    font-size: 14px;
                    line-height: 1.7;
                    color: rgba(255, 244, 232, 0.82);
                }

                .forgot-password-panel {
                    padding: 56px 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .forgot-password-eyebrow {
                    margin: 0 0 10px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #9a6a3f;
                }

                .forgot-password-title {
                    margin: 0;
                    font-size: clamp(28px, 4vw, 40px);
                    line-height: 1.1;
                    color: #22150b;
                }

                .forgot-password-description {
                    margin: 16px 0 0;
                    max-width: 460px;
                    font-size: 15px;
                    line-height: 1.8;
                    color: #62554c;
                }

                .forgot-password-success {
                    margin-top: 28px;
                    padding: 18px 20px;
                    border-radius: 22px;
                    background: linear-gradient(135deg, rgba(245, 234, 218, 0.82), rgba(255, 248, 240, 0.96));
                    border: 1px solid rgba(198, 124, 47, 0.22);
                }

                .forgot-password-success strong {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #5c381f;
                }

                .forgot-password-success span {
                    display: block;
                    word-break: break-word;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #6d5b4a;
                }

                .forgot-password-form {
                    display: grid;
                    gap: 18px;
                    margin-top: 28px;
                }

                .forgot-password-label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #4b3423;
                }

                .forgot-password-input {
                    width: 100%;
                    padding: 16px 18px;
                    border-radius: 18px;
                    border: 1px solid rgba(133, 102, 77, 0.18);
                    background: rgba(255, 255, 255, 0.85);
                    font-size: 15px;
                    color: #22150b;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
                    box-sizing: border-box;
                }

                .forgot-password-input:focus {
                    border-color: rgba(198, 124, 47, 0.65);
                    box-shadow: 0 0 0 5px rgba(198, 124, 47, 0.12);
                    transform: translateY(-1px);
                }

                .forgot-password-hint {
                    margin: -6px 0 0;
                    font-size: 13px;
                    line-height: 1.7;
                    color: #7c6f63;
                }

                .forgot-password-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    min-height: 56px;
                    border: 0;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #a75e17 0%, #d8913f 100%);
                    color: #fffaf4;
                    font-size: 15px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 18px 36px rgba(167, 94, 23, 0.22);
                    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
                }

                .forgot-password-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 22px 42px rgba(167, 94, 23, 0.28);
                }

                .forgot-password-button:disabled {
                    opacity: 0.72;
                    cursor: not-allowed;
                    transform: none;
                }

                .forgot-password-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 14px;
                    margin-top: 22px;
                }

                .forgot-password-links a {
                    color: #8d531d;
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: none;
                }

                .forgot-password-links a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 900px) {
                    .forgot-password-frame {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 640px) {
                    .forgot-password-aside,
                    .forgot-password-panel {
                        padding: 32px 22px;
                    }

                    .forgot-password-heading {
                        font-size: 34px;
                    }

                    .forgot-password-title {
                        font-size: 30px;
                    }
                }
            `}</style>

            <section className="forgot-password-shell">
                <div className="forgot-password-frame">
                    <aside className="forgot-password-aside">
                        <div className="forgot-password-badge">Brendex Account Care</div>
                        <h1 className="forgot-password-heading">Girişi bərpa etmək indi daha rahatdır.</h1>
                        <p className="forgot-password-copy">
                            Email ünvanınızı daxil edin, hesabınızı təhlükəsiz formada yeniləmək üçün
                            sıfırlama linki göndərək.
                        </p>

                        <div className="forgot-password-points">
                            <div className="forgot-password-point">
                                <strong>Təhlükəsiz yönləndirmə</strong>
                                <span>Link yalnız qısa müddət aktiv qalır və birbaşa yeni şifrə səhifəsinə aparır.</span>
                            </div>
                            <div className="forgot-password-point">
                                <strong>Bütün hesab tipləri üçün</strong>
                                <span>Alıcı, satıcı, bloger və admin hesabları eyni axınla dəstəklənir.</span>
                            </div>
                        </div>
                    </aside>

                    <div className="forgot-password-panel">
                        <p className="forgot-password-eyebrow">Şifrəni unutmusunuz?</p>
                        <h2 className="forgot-password-title">Emaili daxil edin, davamını biz yönləndirək.</h2>
                        <p className="forgot-password-description">
                            Sistem həmin email üçün uyğun hesab taparsa, şifrə sıfırlama linki göndəriləcək.
                            Təhlükəsizlik səbəbilə nəticə ümumi mesaj kimi göstərilir.
                        </p>

                        {submittedEmail && (
                            <div className="forgot-password-success">
                                <strong>Sorğu qəbul edildi</strong>
                                <span>{submittedEmail} ünvanı üçün yoxlama başladıldı. Inbox və spam qovluğunu da yoxlayın.</span>
                            </div>
                        )}

                        <form className="forgot-password-form" onSubmit={submitHandler}>
                            <div>
                                <label className="forgot-password-label" htmlFor="email">Email ünvanı</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="forgot-password-input"
                                    placeholder="murad@brendex.az"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <p className="forgot-password-hint">
                                Giriş etdiyiniz hesabda istifadə etdiyiniz emaili yazın.
                            </p>

                            <button type="submit" className="forgot-password-button" disabled={isLoading}>
                                {isLoading ? "Göndərilir..." : "Şifrə sıfırlama linki göndər"}
                            </button>
                        </form>

                        <div className="forgot-password-links">
                            <Link to="/login">Girişə qayıt</Link>
                            <Link to="/register">Yeni hesab yarat</Link>
                        </div>
                    </div>
                </div>

                <ToastContainer position="top-right" autoClose={4000} />
            </section>
        </>
    );
};

export default ForgotPassword;
