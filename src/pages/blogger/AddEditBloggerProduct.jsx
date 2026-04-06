import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Smartphone, Laptop, Camera, Headphones, Gamepad2, Tablet,
  Shirt, Home, Flower2, Dumbbell, Car, Upload, X,
  Store, ChevronRight, ChevronDown, ChevronUp,
  Tv, Wifi, Cpu, Plug, Package,
  Monitor, Printer, HardDrive, Sofa, Bed, UtensilsCrossed,
  Footprints, Watch, ShoppingBag, Baby, Bike, Gift,
  Wrench, Droplets, Lamp, Bath, BookOpen, Tent,
  Save, Trash2, ArrowLeft, Image as ImageIcon, Plus
} from "lucide-react";
import {
  createBloggerProduct,
  updateBloggerProduct,
  clearActionResult,
  clearBloggerError
} from "../../slices/bloggerSlice";

// ─── KATEQORIYA TREE (Simplified for reuse) ──────────────────────────────────
const CATEGORY_TREE = [
  { parentValue: "Electronics", parentLabel: "Elektronika", parentIcon: Tv, subs: [
    { value: "Electronics_TV", label: "TV və Audio", icon: Tv },
    { value: "Electronics_Photo", label: "Foto və Video", icon: Camera },
    { value: "Electronics_Console", label: "Konsollar", icon: Gamepad2 },
    { value: "Electronics_SmartHome", label: "Smart Home", icon: Wifi },
    { value: "Electronics_Gadgets", label: "Gadgetlər", icon: Cpu },
    { value: "Electronics_Acc", label: "Aksesuarlar", icon: Plug },
  ]},
  { parentValue: "Phones", parentLabel: "Telefonlar", parentIcon: Smartphone, subs: [
    { value: "Phones_Smartphone", label: "Smartfonlar", icon: Smartphone },
    { value: "Phones_Basic", label: "Düyməli", icon: Smartphone },
    { value: "Phones_Headphones", label: "Qulaqlıqlar", icon: Headphones },
  ]},
  { parentValue: "Computers", parentLabel: "Kompüter", parentIcon: Laptop, subs: [
    { value: "Computers_Laptop", label: "Noutbuklar", icon: Laptop },
    { value: "Computers_Desktop", label: "Masaüstü", icon: Monitor },
  ]},
  { parentValue: "Clothing", parentLabel: "Geyim", parentIcon: Shirt, subs: [
    { value: "WomenClothing_Outer", label: "Qadın Geyimi", icon: ShoppingBag },
    { value: "MenClothing_Outer", label: "Kişi Geyimi", icon: ShoppingBag },
  ]},
  { parentValue: "Home", parentLabel: "Ev/Həyat", parentIcon: Home, subs: [
    { value: "HomeAppliances_Small", label: "Məişət Texnikası", icon: Home },
    { value: "HomeDecor_Deco", label: "Dekorasiya", icon: Lamp },
  ]}
];

const inputStyle = {
  width: "100%", padding: "12px 16px",
  border: "1.5px solid #eee", borderRadius: "12px",
  fontSize: "14px", outline: "none", transition: "all 0.2s"
};
const labelStyle = {
  display: "block", fontSize: "11px", fontWeight: "800",
  textTransform: "uppercase", color: "#999", marginBottom: "6px", letterSpacing: "0.05em"
};

export default function AddEditBloggerProduct() {
  const { id } = useParams();
  const isEdit = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, actionResult, profile } = useSelector((s) => s.blogger);

  const [formData, setFormData] = useState({
    name: "", price: "", stock: "", category: "", description: ""
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [openParent, setOpenParent] = useState(null);

  useEffect(() => {
    if (isEdit && products.length > 0) {
      const p = products.find(x => x._id === id);
      if (p) {
        setFormData({
          name: p.name || "",
          price: p.price || "",
          stock: p.stock || "",
          category: p.category || "",
          description: p.description || ""
        });
        setExistingImages(p.images || []);
      }
    }
  }, [id, products, isEdit]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearBloggerError()); }
    if (actionResult?.type === "productCreated") {
      Swal.fire("Uğurlu! 🎉", "Məhsul yaradıldı.", "success");
      dispatch(clearActionResult());
      navigate("/blogger/products");
    }
    if (actionResult?.type === "productUpdated") {
      toast.success("Məhsul yeniləndi");
      dispatch(clearActionResult());
      navigate("/blogger/products");
    }
  }, [error, actionResult, dispatch, navigate]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const removeNewImage = (idx) => setImages(images.filter((_, i) => i !== idx));
  const removeExistingImage = (img) => {
    // Collect images to remove on submit
    setExistingImages(existingImages.filter(i => i.public_id !== img.public_id));
    setFormData(prev => ({ 
      ...prev, 
      existingImagesToRemove: [...(prev.existingImagesToRemove || []), img] 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error("Zəhmət olmasa kateqoriya seçin");
    
    const form = new FormData();
    Object.keys(formData).forEach(k => {
      if (k !== "existingImagesToRemove") form.append(k, formData[k]);
    });
    
    images.forEach(f => form.append("newImages", f));
    
    if (formData.existingImagesToRemove) {
      form.append("existingImages", JSON.stringify(formData.existingImagesToRemove));
    }

    if (isEdit) {
      dispatch(updateBloggerProduct({ id, formData: form }));
    } else {
      dispatch(createBloggerProduct(form));
    }
  };

  if (!profile) return null;

  return (
    <div style={{ padding: "30px", background: "#f5f6fa", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
             <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#888", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "14px", fontWeight: "600", padding: 0, marginBottom: "8px" }}>
               <ArrowLeft size={16} /> Geri dön
             </button>
             <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#1a1a2e" }}>
               {isEdit ? "Məhsulu Redaktə Et" : "Yeni Məhsul Əlavə Et"}
             </h1>
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{ border: "none", borderRadius: "12px", padding: "12px 24px", background: "#E8192C", color: "white", fontWeight: "700", boxShadow: "0 4px 12px rgba(232,25,44,0.3)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            {loading ? "Gözləyin..." : <><Save size={18} /> {isEdit ? "Yenilə" : "Yarat"}</>}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
          
          {/* SOL TƏRƏF — ƏSAS MƏLUMATLAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
               <div style={{ marginBottom: "20px" }}>
                 <label style={labelStyle}>Məhsulun Adı *</label>
                 <input name="name" value={formData.name} onChange={handleInputChange} required style={inputStyle} placeholder="Məs: iPhone 15 Pro Max" />
               </div>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                 <div>
                   <label style={labelStyle}>Qiymət (₼) *</label>
                   <input name="price" type="number" value={formData.price} onChange={handleInputChange} required style={inputStyle} placeholder="0.00" />
                 </div>
                 <div>
                   <label style={labelStyle}>Stok miqdarı *</label>
                   <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} required style={inputStyle} placeholder="0" />
                 </div>
               </div>
               <div>
                  <label style={labelStyle}>Qısa Açıqlama *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required style={{ ...inputStyle, height: "120px", resize: "none" }} placeholder="Məhsul haqqında qısa məlumat..." />
               </div>
            </div>

            <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
               <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "800", color: "#1a1a2e" }}>Şəkillər</h3>
               
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  {existingImages.map((img, i) => (
                    <div key={img.public_id} style={{ position: "relative", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
                      <img src={img.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => removeExistingImage(img)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "4px", padding: 2, cursor: "pointer" }}>
                         <X size={12} color="#E8192C" />
                      </button>
                    </div>
                  ))}
                  {images.map((f, i) => (
                    <div key={i} style={{ position: "relative", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E8192C20", background: "#E8192C05" }}>
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#E8192C" }}>
                        <ImageIcon size={20} />
                      </div>
                      <button onClick={() => removeNewImage(i)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(232,25,44,0.1)", border: "none", borderRadius: "4px", padding: 2, cursor: "pointer" }}>
                         <X size={12} color="#E8192C" />
                      </button>
                    </div>
                  ))}
                  <label style={{ height: "80px", borderRadius: "8px", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa" }}>
                    <Plus size={24} />
                    <input type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />
                  </label>
               </div>
               <p style={{ fontSize: "11px", color: "#bbb", margin: 0 }}>* Tövsiyə olunan ölçü 800x800px, max 15 şəkil.</p>
            </div>
          </div>

          {/* SAĞ TƏRƏF — KATEQORİYA SEÇİMİ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
             <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "800", color: "#1a1a2e" }}>Kateqoriya Seçi *</h3>
                
                {formData.category && (
                  <div style={{ marginBottom: "12px", padding: "10px", background: "#f0f0f0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#1a1a2e" }}>{formData.category}</span>
                    <button onClick={() => setFormData({ ...formData, category: "" })} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}>✕</button>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {CATEGORY_TREE.map(p => (
                    <div key={p.parentValue}>
                      <button onClick={() => setOpenParent(openParent === p.parentValue ? null : p.parentValue)}
                        style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "1px solid #eee", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700" }}>
                          <p.parentIcon size={16} color="#aaa" /> {p.parentLabel}
                        </span>
                        {openParent === p.parentValue ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      
                      {openParent === p.parentValue && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4px", marginTop: "4px", paddingLeft: "10px" }}>
                          {p.subs.map(s => (
                            <button key={s.value} onClick={() => setFormData({ ...formData, category: s.value })}
                              style={{ width: "100%", textAlign: "left", padding: "8px 12px", background: formData.category === s.value ? "#fff0f1" : "none", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: formData.category === s.value ? "#E8192C" : "#555", cursor: "pointer" }}>
                              • {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
             </div>
          </div>

        </div>
      </div>
      <style>{`
        input:focus, textarea:focus { border-color: #E8192C !important; box-shadow: 0 0 0 4px rgba(232,25,44,0.05) !important; }
      `}</style>
    </div>
  );
}
