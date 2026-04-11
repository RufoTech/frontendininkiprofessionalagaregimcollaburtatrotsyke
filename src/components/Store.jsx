import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  ArrowLeft,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Send,
  Star,
} from 'lucide-react'
import StarRatings from 'react-star-ratings'
import { useGetStoreBySlugQuery } from '../redux/api/authApi'
import {
  useGetSellerReviewsQuery,
  useCheckCanReviewQuery,
  useCreateOrUpdateSellerReviewMutation,
} from '../redux/api/productsApi'
import ProductCard from './ProductCard'
import toast from 'react-hot-toast'

const ratingLabel = (avg) => {
  if (avg >= 4) return { text: 'Yaxşı mağaza', color: '#15803d', bg: '#f0fdf4' }
  if (avg >= 3) return { text: 'Orta mağaza', color: '#b45309', bg: '#fffbeb' }
  if (avg > 0) return { text: 'Zəif mağaza', color: '#dc2626', bg: '#fef2f2' }
  return null
}

const StarDisplay = ({ value, size = 16 }) => (
  <StarRatings
    rating={Number(value) || 0}
    starRatedColor="#FBBF24"
    numberOfStars={5}
    starDimension={`${size}px`}
    starSpacing="1px"
  />
)

const Store = () => {
  const { t } = useTranslation()
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((s) => s.userSlice)

  const { data, isLoading, isError } = useGetStoreBySlugQuery(slug)
  const sellerId = data?.store?._id
  const { data: reviewData, isLoading: reviewsLoading } = useGetSellerReviewsQuery(sellerId, { skip: !sellerId })
  const { data: canData } = useCheckCanReviewQuery(sellerId, { skip: !sellerId || !isAuthenticated })
  const [submitReview, { isLoading: submitting }] = useCreateOrUpdateSellerReviewMutation()

  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')

  React.useEffect(() => {
    if (canData?.existingReview) {
      setMyRating(canData.existingReview.rating)
      setMyComment(canData.existingReview.comment || '')
    }
  }, [canData])

  const handleSubmitReview = async (event) => {
    event.preventDefault()
    if (!myRating) return toast.error(t("productDetail.selectRating"))
    try {
      await submitReview({ sellerId, rating: myRating, comment: myComment }).unwrap()
      toast.success(t("productDetail.reviewSent"))
    } catch (err) {
      toast.error(err?.data?.message || t("productDetail.errorGeneral"))
    }
  }

  if (isLoading) {
    return (
      <section className="page-section" style={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
        <Loader2 size={38} color="#e8192c" className="animate-spin" />
      </section>
    )
  }

  if (isError || !data?.store) {
    return (
      <section className="page-section" style={{ textAlign: 'center', padding: '64px 24px' }}>
        <h2 style={{ fontSize: 30, fontWeight: 900, margin: 0, color: '#0f172a' }}>{t("store.notFound")}</h2>
        <p style={{ marginTop: 10, color: '#64748b' }}>{t("store.notFoundDesc")}</p>
      </section>
    )
  }

  const { store, products, totalProducts } = data
  const reviews = reviewData?.reviews || []
  const avgRating = reviewData?.avgRating ?? store.avgRating ?? 0
  const numRev = reviewData?.numReviews ?? store.numReviews ?? 0
  const label = ratingLabel(avgRating)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {store.isBlocked && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, padding: '14px 18px', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={18} />
          Bu mağaza hazırda superadmin tərəfindən bloklanıb.
        </div>
      )}

      <section
        className="page-section"
        style={{
          padding: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #22080c 0%, #7f1520 46%, #ef4444 100%)',
          color: '#fff',
        }}
      >
        <div className="floating-orb floating-orb--rose" style={{ width: 240, height: 240, top: -70, right: -30 }} />
        <div className="floating-orb floating-orb--mint" style={{ width: 220, height: 220, bottom: -80, left: -30 }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '34px 30px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 18,
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            Geri
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Store profile
              </span>
              <h1 style={{ margin: '14px 0 8px', fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: 0.96, fontWeight: 900, letterSpacing: '-0.05em' }}>
                {store.storeName}
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: 620 }}>
                Mağazamızın keyfiyyətli məhsullarını kəşf edin. İndi bu səhifə daha premium vitrin və daha rahat məhsul axını ilə yenilənib.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
                {numRev > 0 ? (
                  <>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}>
                      <StarDisplay value={avgRating} size={18} />
                      <strong>{avgRating.toFixed(1)}</strong>
                      <span style={{ color: 'rgba(255,255,255,0.74)', fontSize: 13 }}>({numRev} rəy)</span>
                    </div>
                    {label && (
                      <span style={{ padding: '10px 14px', borderRadius: 16, background: label.bg, color: label.color, fontWeight: 800, fontSize: 13 }}>
                        {label.text}
                      </span>
                    )}
                  </>
                ) : (
                  <span style={{ padding: '10px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}>
                    Hələ mağaza rəyi yoxdur
                  </span>
                )}

                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)', fontWeight: 800 }}>
                  <Package size={15} />
                  {totalProducts} məhsul
                </span>
              </div>
            </div>

            <div style={{ justifySelf: 'center', width: 'min(100%, 520px)' }}>
              <div style={{ position: 'relative', borderRadius: 30, overflow: 'hidden', boxShadow: '0 28px 60px rgba(0,0,0,0.22)' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, rgba(15,23,42,0.18))', zIndex: 1 }} />
                <img
                  src="https://res.cloudinary.com/dwdvr0oxa/image/upload/v1740241625/1_xxbets.jpg"
                  alt={store.storeName}
                  style={{ width: '100%', objectFit: 'cover', aspectRatio: '4 / 3' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="section-kicker">Store details</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 12 }}>{t("store.storeInfo")}</h2>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          <div style={{ borderRadius: 24, padding: 22, background: 'rgba(255,255,255,0.84)', border: '1px solid rgba(148,163,184,0.14)', boxShadow: '0 16px 32px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 16, background: 'rgba(232,25,44,0.08)', color: '#e8192c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ünvan</div>
                <div style={{ marginTop: 6, fontSize: 16, color: '#0f172a', fontWeight: 700 }}>{store.storeAddress}</div>
              </div>
            </div>
          </div>

          {store.phone && (
            <div style={{ borderRadius: 24, padding: 22, background: 'rgba(255,255,255,0.84)', border: '1px solid rgba(148,163,184,0.14)', boxShadow: '0 16px 32px rgba(15,23,42,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 16, background: 'rgba(232,25,44,0.08)', color: '#e8192c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Telefon</div>
                  <a href={`tel:${store.phone}`} style={{ marginTop: 6, display: 'inline-block', fontSize: 16, color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>{store.phone}</a>
                </div>
              </div>
            </div>
          )}

          <div style={{ borderRadius: 24, padding: 22, background: 'rgba(255,255,255,0.84)', border: '1px solid rgba(148,163,184,0.14)', boxShadow: '0 16px 32px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 16, background: 'rgba(232,25,44,0.08)', color: '#e8192c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mağaza ID</div>
                <div style={{ marginTop: 6, fontSize: 16, color: '#0f172a', fontWeight: 700 }}>{store.storeSlug}</div>
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 24, padding: 22, background: 'rgba(255,255,255,0.84)', border: '1px solid rgba(148,163,184,0.14)', boxShadow: '0 16px 32px rgba(15,23,42,0.06)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{t("store.contactUs")}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="#" style={{ width: 44, height: 44, borderRadius: 16, background: '#f8fafc', color: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Facebook size={18} />
              </a>
              <a href="#" style={{ width: 44, height: 44, borderRadius: 16, background: '#f8fafc', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="section-kicker">Products</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 12 }}>{t("store.storeProducts")}</h2>
          </div>
          {totalProducts > 0 && (
            <span style={{ padding: '10px 14px', borderRadius: 16, background: '#111827', color: '#fff', fontWeight: 800, fontSize: 13 }}>
              {totalProducts} məhsul
            </span>
          )}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {products?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 18 }}>
              {products.map((product) => (
                <ProductCard key={product._id} mehsul={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '70px 24px', borderRadius: 24, background: 'rgba(255,255,255,0.82)', border: '1px dashed rgba(148,163,184,0.28)' }}>
              <Package size={44} color="#cbd5e1" style={{ marginBottom: 14 }} />
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: 20, fontWeight: 800 }}>Hələ məhsul yoxdur</h3>
              <p style={{ margin: '10px 0 0', color: '#64748b' }}>Bu mağaza hələ məhsul əlavə etməyib.</p>
            </div>
          )}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <span className="section-kicker">Reviews</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em', marginTop: 12 }}>Mağaza rəyləri</h2>
          </div>
          {numRev > 0 && (
            <span style={{ padding: '10px 14px', borderRadius: 16, background: 'rgba(232,25,44,0.06)', color: '#be123c', fontWeight: 800, fontSize: 13 }}>
              {numRev} rəy
            </span>
          )}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {isAuthenticated ? (
            canData?.canReview ? (
              <form onSubmit={handleSubmitReview} style={{ borderRadius: 24, padding: 22, background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(148,163,184,0.16)', boxShadow: '0 16px 32px rgba(15,23,42,0.06)', marginBottom: 24 }}>
                <h4 style={{ margin: '0 0 14px', fontWeight: 800, fontSize: 18, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Star size={16} color="#e8192c" />
                  {canData.existingReview ? "Rəyinizi yeniləyin" : "Rəyinizi bildirin"}
                </h4>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>Ulduz seçin</p>
                  <StarRatings
                    rating={myRating}
                    starRatedColor="#FBBF24"
                    starHoverColor="#F59E0B"
                    changeRating={setMyRating}
                    numberOfStars={5}
                    starDimension="30px"
                    starSpacing="3px"
                  />
                </div>
                <textarea
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  placeholder="Bu mağaza haqqında fikrinizi yazın... (ixtiyari)"
                  rows={4}
                  maxLength={500}
                  style={{ width: '100%', padding: '14px 16px', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 18, fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: 14, background: '#fff' }}
                />
                <button
                  type="submit"
                  disabled={submitting || !myRating}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 18px', background: submitting || !myRating ? '#cbd5e1' : 'linear-gradient(135deg,#e8192c,#be123c)', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 14, cursor: submitting || !myRating ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  {canData.existingReview ? "Rəyi yenilə" : "Rəy göndər"}
                </button>
              </form>
            ) : (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 16, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: '#92400e', fontWeight: 700 }}>
                <MessageSquare size={15} style={{ display: 'inline', marginRight: 8 }} />
                Yalnız bu mağazadan çatdırılmış sifarişi olan alıcılar rəy buraxa bilər.
              </div>
            )
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.84)', borderRadius: 16, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: '#475569', fontWeight: 700 }}>
              Rəy bildirmək üçün <strong>daxil olun</strong>.
            </div>
          )}

          {reviewsLoading ? (
            <div style={{ textAlign: 'center', padding: 30 }}><Loader2 size={24} color="#e8192c" className="animate-spin" /></div>
          ) : reviews.length > 0 ? (
            <div style={{ display: 'grid', gap: 14 }}>
              {reviews.map((r) => (
                <div key={r._id} style={{ background: 'rgba(255,255,255,0.86)', borderRadius: 22, padding: '18px 20px', boxShadow: '0 16px 32px rgba(15,23,42,0.06)', border: '1px solid rgba(148,163,184,0.16)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#e8192c,#fb7185)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15 }}>
                        {(r.userName?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{r.userName}</p>
                        <StarDisplay value={r.rating} size={13} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(r.createdAt).toLocaleDateString("az-AZ")}</span>
                  </div>
                  {r.comment && <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7, paddingLeft: 52 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '28px 0', fontSize: 14 }}>
              Bu mağaza hələ rəy almayıb. İlk rəyi siz yazın!
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Store
