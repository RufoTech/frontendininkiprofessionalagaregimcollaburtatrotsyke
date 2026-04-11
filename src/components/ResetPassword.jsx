import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../redux/api/authApi";

const getStrengthLabel = (value) => {
    if (value.length >= 12) return "Güclü";
    if (value.length >= 8) return "Normal";
    return "Zəif";
};

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();

    const hasMinLength = password.length >= 8;
    const passwordsMatch = password === confirmPassword;
    const canSubmit = Boolean(token) && hasMinLength && passwordsMatch;
    const strengthLabel = getStrengthLabel(password);

    useEffect(() => {
        if (!isSuccess) return;

        const timeout = window.setTimeout(() => {
            navigate("/login", { replace: true });
        }, 1500);

        return () => window.clearTimeout(timeout);
    }, [isSuccess, navigate]);

    const submitHandler = async (event) => {
        event.preventDefault();
        if (!canSubmit) return;
        await resetPassword({ token, password, confirmPassword });
    };

    return (
        <>
            <style>{`
                .reset-password-shell {
                    min-height: 100vh;
                    display: grid;
                    place-items: center;
                    padding: 32px 16px;
                    background:
                        radial-gradient(circle at top right, rgba(198, 124, 47, 0.18), transparent 24%),
                        radial-gradient(circle at bottom left, rgba(95, 58, 33, 0.18), transparent 28%),
                        linear-gradient(135deg, #f7f1e8 0%, #fffaf3 52%, #ebdcc8 100%);
                }

                .reset-password-card {
                    width: min(760px, 100%);
                    padding: 40px;
                    border-radius: 32px;
                    background: rgba(255, 253, 249, 0.95);
                    border: 1px solid rgba(143, 104, 68, 0.18);
                    box-shadow: 0 30px 80px rgba(56, 33, 15, 0.14);
                }

                .reset-password-header {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    gap: 18px;
                    margin-bottom: 28px;
                }

                .reset-password-eyebrow {
                    margin: 0 0 10px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #9a6a3f;
                }

                .reset-password-title {
                    margin: 0;
                    max-width: 520px;
                    font-size: clamp(30px, 5vw, 44px);
                    line-height: 1.08;
                    color: #20130a;
                }

                .reset-password-description {
                    margin: 14px 0 0;
                    max-width: 540px;
                    font-size: 15px;
                    line-height: 1.8;
                    color: #65574c;
                }

                .reset-password-chip {
                    align-self: flex-start;
                    padding: 12px 16px;
                    border-radius: 999px;
                    background: rgba(245, 234, 218, 0.9);
                    border: 1px solid rgba(198, 124, 47, 0.2);
                    font-size: 13px;
                    font-weight: 700;
                    color: #7d5228;
                }

                .reset-password-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: 24px;
                }

                .reset-password-form {
                    display: grid;
                    gap: 18px;
                }

                .reset-password-field {
                    display: grid;
                    gap: 8px;
                }

                .reset-password-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #4d3624;
                }

                .reset-password-input {
                    width: 100%;
                    padding: 16px 18px;
                    border-radius: 18px;
                    border: 1px solid rgba(133, 102, 77, 0.18);
                    background: rgba(255, 255, 255, 0.85);
                    font-size: 15px;
                    color: #20130a;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
                    box-sizing: border-box;
                }

                .reset-password-input:focus {
                    border-color: rgba(198, 124, 47, 0.65);
                    box-shadow: 0 0 0 5px rgba(198, 124, 47, 0.12);
                    transform: translateY(-1px);
                }

                .reset-password-meta {
                    display: grid;
                    gap: 12px;
                }

                .reset-password-note,
                .reset-password-status,
                .reset-password-success,
                .reset-password-error {
                    padding: 14px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.7;
                }

                .reset-password-note {
                    background: #f8f3eb;
                    border: 1px solid #eadfce;
                    color: #6c5a47;
                }

                .reset-password-status {
                    background: rgba(245, 234, 218, 0.86);
                    border: 1px solid rgba(198, 124, 47, 0.22);
                    color: #74481f;
                }

                .reset-password-success {
                    background: rgba(225, 244, 230, 0.92);
                    border: 1px solid rgba(76, 145, 91, 0.22);
                    color: #1f6a34;
                }

                .reset-password-error {
                    background: rgba(255, 233, 230, 0.92);
                    border: 1px solid rgba(204, 87, 58, 0.2);
                    color: #a93a22;
                }

                .reset-password-button {
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

                .reset-password-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 22px 42px rgba(167, 94, 23, 0.28);
                }

                .reset-password-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .reset-password-panel {
                    padding: 24px;
                    border-radius: 26px;
                    background: linear-gradient(180deg, #23150c 0%, #5e3920 100%);
                    color: #fff7ee;
                }

                .reset-password-panel h3 {
                    margin: 0 0 18px;
                    font-size: 18px;
                }

                .reset-password-list {
                    display: grid;
                    gap: 14px;
                }

                .reset-password-list-item {
                    padding: 14px 16px;
                    border-radius: 18px;
                    background: rgba(255, 248, 241, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                }

                .reset-password-list-item strong {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #ffffff;
                }

                .reset-password-list-item span {
                    font-size: 13px;
                    line-height: 1.7;
                    color: rgba(255, 243, 231, 0.84);
                }

                .reset-password-footer {
                    margin-top: 22px;
                }

                .reset-password-footer a {
                    color: #8d531d;
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: none;
                }

                .reset-password-footer a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 860px) {
                    .reset-password-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 640px) {
                    .reset-password-card {
                        padding: 26px 20px;
                        border-radius: 24px;
                    }
                }
            `}</style>

            <section className="reset-password-shell">
                <div className="reset-password-card">
                    <div className="reset-password-header">
                        <div>
                            <p className="reset-password-eyebrow">Brendex Security Reset</p>
                            <h1 className="reset-password-title">Yeni şifrənizi təyin edin və hesaba təhlükəsiz qayıdın.</h1>
                            <p className="reset-password-description">
                                Şifrə ən azı 8 simvol olmalıdır. Daha uzun və qarışıq kombinasiya hesabınız üçün daha təhlükəsizdir.
                            </p>
                        </div>
                        <div className="reset-password-chip">Güc: {strengthLabel}</div>
                    </div>

                    <div className="reset-password-grid">
                        <form className="reset-password-form" onSubmit={submitHandler}>
                            <div className="reset-password-field">
                                <label className="reset-password-label" htmlFor="password">Yeni şifrə</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="reset-password-input"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Yeni şifrənizi yazın"
                                    required
                                />
                            </div>

                            <div className="reset-password-field">
                                <label className="reset-password-label" htmlFor="confirmPassword">Şifrəni təsdiqləyin</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="reset-password-input"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Şifrəni təkrar yazın"
                                    required
                                />
                            </div>

                            <div className="reset-password-meta">
                                <div className="reset-password-note">
                                    Şifrəni yadınızda saxlamaq çətindirsə, unikal söz birləşməsi və rəqəm kombinasiyası istifadə edin.
                                </div>

                                {!hasMinLength && password && (
                                    <div className="reset-password-error">Şifrə ən azı 8 simvol olmalıdır.</div>
                                )}

                                {confirmPassword && !passwordsMatch && (
                                    <div className="reset-password-error">Daxil etdiyiniz şifrələr eyni deyil.</div>
                                )}

                                {error && (
                                    <div className="reset-password-error">
                                        {error?.data?.message || "Şifrə yenilənərkən xəta baş verdi."}
                                    </div>
                                )}

                                {isSuccess && (
                                    <div className="reset-password-success">
                                        Şifrəniz uğurla yeniləndi. Bir neçə saniyəyə giriş səhifəsinə yönləndiriləcəksiniz.
                                    </div>
                                )}

                                <div className="reset-password-status">
                                    Minimum 8 simvol, təsdiq hissəsində isə eyni şifrə tələb olunur.
                                </div>
                            </div>

                            <button className="reset-password-button" type="submit" disabled={isLoading || !canSubmit}>
                                {isLoading ? "Yenilənir..." : "Şifrəni yenilə"}
                            </button>
                        </form>

                        <aside className="reset-password-panel">
                            <h3>Yaxşı şifrə üçün qısa qaydalar</h3>
                            <div className="reset-password-list">
                                <div className="reset-password-list-item">
                                    <strong>Uzun şifrə seçin</strong>
                                    <span>8 simvoldan artıq şifrələr daha dayanıqlı olur, 12+ simvol isə daha yaxşıdır.</span>
                                </div>
                                <div className="reset-password-list-item">
                                    <strong>Təkrar istifadə etməyin</strong>
                                    <span>Buradakı şifrəni başqa saytlarda istifadə etdiyiniz köhnə şifrələrlə eyni saxlamayın.</span>
                                </div>
                                <div className="reset-password-list-item">
                                    <strong>Link müddətlidir</strong>
                                    <span>Əgər token vaxtı keçibsə, yenidən “şifrəni unutdum” sorğusu göndərin.</span>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="reset-password-footer">
                        <Link to="/login">Giriş səhifəsinə qayıt</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ResetPassword;
