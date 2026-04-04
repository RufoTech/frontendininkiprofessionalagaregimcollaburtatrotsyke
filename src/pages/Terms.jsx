const Terms = () => (
  <div style={{
    minHeight: "100vh", background: "#fafafa",
    display: "flex", justifyContent: "center", padding: "60px 24px",
    fontFamily: "'DM Sans', sans-serif",
  }}>
    <div style={{ maxWidth: 720, width: "100%" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 }}>
        Şərtlər və Qaydalar
      </h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 40 }}>
        Son yenilənmə: Aprel 2025
      </p>

      {[
        {
          title: "1. Ümumi müddəalar",
          body: "Brendex platformasından istifadə etməklə siz bu şərtləri qəbul etmiş sayılırsınız. Xidmətdən istifadə etməzdən əvvəl bu sənədi diqqətlə oxuyun.",
        },
        {
          title: "2. Hesab məsuliyyəti",
          body: "İstifadəçi hesabının təhlükəsizliyi sizin məsuliyyətinizdədir. Hesab məlumatlarını üçüncü şəxslərlə paylaşmamağınız tövsiyə olunur.",
        },
        {
          title: "3. Məxfilik",
          body: "Şəxsi məlumatlarınız Brendex Məxfilik Siyasətinə uyğun olaraq işlənilir. Məlumatlarınız üçüncü tərəflərlə yalnız qanuni əsaslarla paylaşıla bilər.",
        },
        {
          title: "4. Ödəniş və sifarişlər",
          body: "Bütün ödənişlər platformanın ödəniş qaydalarına uyğun həyata keçirilir. Geri ödəmə şərtləri hər alış üçün ayrıca müəyyən edilir.",
        },
        {
          title: "5. Dəyişikliklər",
          body: "Brendex bu şərtləri istənilən vaxt yeniləmək hüququnu özündə saxlayır. Dəyişikliklər platforma vasitəsilə elan ediləcəkdir.",
        },
      ].map(({ title, body }) => (
        <section key={title} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#222", marginBottom: 8 }}>{title}</h2>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75 }}>{body}</p>
        </section>
      ))}

      <p style={{ fontSize: 13, color: "#aaa", marginTop: 48, borderTop: "1px solid #eee", paddingTop: 24 }}>
        © {new Date().getFullYear()} Brendex. Bütün hüquqlar qorunur.
      </p>
    </div>
  </div>
)

export default Terms
