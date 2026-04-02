"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../redux/api/productsApi";
import ChartComponent from "./ChartComponent";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import {
  BarChart3, ShoppingBag, PlusCircle, DollarSign, Package,
  ChevronDown, ChevronUp, Smartphone, Laptop, Camera,
  Headphones, Gamepad2, Tablet, Shirt, Home, Flower2,
  Dumbbell, Car, Sparkles, Store, Tv, Wifi, Cpu, Plug,
  Monitor, Printer, HardDrive, Sofa, Bed, UtensilsCrossed,
  Footprints, Watch, ShoppingBag as BagIcon, Baby, Bike,
  Gift, Wrench, Droplets, Lamp, Bath, BookOpen, Tent,
} from "lucide-react";
import Swal from "sweetalert2";

// =====================================================================
// CATEGORY_CONFIG — 15 ana kateqoriya + subkateqoriyalar
// ---------------------------------------------------------------------
// Hər subkateqoriya üçün:
//   icon   → Lucide ikon
//   label  → Azərbaycanca ad (badge)
//   fields → texniki sahələr (key + label)
// =====================================================================
const CATEGORY_CONFIG = {

    // ── ELEKTRONİKA ────────────────────────────────────────────────
    Electronics_TV: {
        icon: Tv, label: "TV/Audio",
        fields: [{ key: "screenSize", label: "Ekran" }, { key: "resolution", label: "Çözümlülük" }, { key: "panelType", label: "Panel" }, { key: "connectivity", label: "Bağlantı" }, { key: "smartTv", label: "Smart TV" }],
    },
    Electronics_Photo: {
        icon: Camera, label: "Foto/Video",
        fields: [{ key: "resolution", label: "Çözümlülük" }, { key: "opticalZoom", label: "Optik Zoom" }, { key: "sensorType", label: "Sensor" }, { key: "imageStabilization", label: "Stabilizasiya" }, { key: "videoResolution", label: "Video" }],
    },
    Electronics_Console: {
        icon: Gamepad2, label: "Oyun Konsolu",
        fields: [{ key: "cpu", label: "CPU" }, { key: "gpu", label: "GPU" }, { key: "storage", label: "Yaddaş" }, { key: "memory", label: "RAM" }, { key: "supportedResolution", label: "Çözümlülük" }, { key: "connectivity", label: "Bağlantı" }, { key: "controllerIncluded", label: "Controller" }],
    },
    Electronics_SmartHome: {
        icon: Wifi, label: "Smart Home",
        fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "compatibility", label: "Uyğunluq" }, { key: "power", label: "Güc" }],
    },
    Electronics_Gadgets: {
        icon: Cpu, label: "Gadgetlər",
        fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "batteryLife", label: "Batareya" }, { key: "compatibility", label: "Uyğunluq" }],
    },
    Electronics_Acc: {
        icon: Plug, label: "Elektron Aksesuar",
        fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }],
    },

    // ── TELEFONLAR ──────────────────────────────────────────────────
    Phones_Smartphone: {
        icon: Smartphone, label: "Smartfon",
        fields: [{ key: "screenSize", label: "Ekran" }, { key: "storage", label: "Yaddaş" }, { key: "ram", label: "RAM" }, { key: "frontCamera", label: "Ön Kamera" }, { key: "backCamera", label: "Arxa Kamera" }, { key: "battery", label: "Batareya" }, { key: "processor", label: "Prosessor" }, { key: "operatingSystem", label: "OS" }],
    },
    Phones_Basic: {
        icon: Smartphone, label: "Düyməli Telefon",
        fields: [{ key: "battery", label: "Batareya" }, { key: "storage", label: "Yaddaş" }, { key: "simCount", label: "SIM sayı" }],
    },
    Phones_Headphones: {
        icon: Headphones, label: "Qulaqlıq",
        fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "batteryLife", label: "Batareya" }, { key: "noiseCancellation", label: "ANC" }, { key: "driverSize", label: "Driver" }],
    },
    Phones_Cables: {
        icon: Plug, label: "Kabel/Adapter",
        fields: [{ key: "length", label: "Uzunluq" }, { key: "compatibility", label: "Uyğunluq" }, { key: "maxCharge", label: "Maks. Şarj" }],
    },
    Phones_Powerbank: {
        icon: Package, label: "Powerbank",
        fields: [{ key: "capacity", label: "Tutum" }, { key: "maxCharge", label: "Maks. Şarj" }, { key: "portCount", label: "Port sayı" }],
    },
    Phones_Acc: {
        icon: Package, label: "Telefon Aksesuar",
        fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }],
    },

    // ── KOMPÜTER ────────────────────────────────────────────────────
    Computers_Laptop: {
        icon: Laptop, label: "Noutbuk",
        fields: [{ key: "screenSize", label: "Ekran" }, { key: "storage", label: "Yaddaş" }, { key: "ram", label: "RAM" }, { key: "gpu", label: "GPU" }, { key: "processor", label: "CPU" }, { key: "batteryLife", label: "Batareya" }, { key: "operatingSystem", label: "OS" }],
    },
    Computers_Desktop: {
        icon: Monitor, label: "Stolüstü Kompüter",
        fields: [{ key: "processor", label: "CPU" }, { key: "ram", label: "RAM" }, { key: "storage", label: "Yaddaş" }, { key: "gpu", label: "GPU" }, { key: "operatingSystem", label: "OS" }],
    },
    Computers_Monitor: {
        icon: Monitor, label: "Monitor",
        fields: [{ key: "screenSize", label: "Ekran" }, { key: "resolution", label: "Çözümlülük" }, { key: "refreshRate", label: "Yenilənmə" }, { key: "panelType", label: "Panel" }, { key: "connectivity", label: "Bağlantı" }],
    },
    Computers_Printer: {
        icon: Printer, label: "Printer/Skaner",
        fields: [{ key: "printType", label: "Çap Növü" }, { key: "resolution", label: "Keyfiyyət" }, { key: "connectivity", label: "Bağlantı" }, { key: "color", label: "Rəngli" }],
    },
    Computers_OfficeAcc: {
        icon: Package, label: "Ofis Aksesuar",
        fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "connectivity", label: "Bağlantı" }, { key: "color", label: "Rəng" }],
    },
    Computers_Parts: {
        icon: HardDrive, label: "Komponent",
        fields: [{ key: "partType", label: "Hissə" }, { key: "capacity", label: "Tutum/Sürət" }, { key: "compatibility", label: "Uyğunluq" }],
    },

    // ── MƏİŞƏT TEXNİKASI ───────────────────────────────────────────
    HomeAppliances_Large: {
        icon: Home, label: "Böyük Məişət",
        fields: [{ key: "capacity", label: "Tutum" }, { key: "energyClass", label: "Enerji" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }],
    },
    HomeAppliances_Small: {
        icon: Home, label: "Kiçik Məişət",
        fields: [{ key: "power", label: "Güc" }, { key: "capacity", label: "Tutum" }, { key: "dimensions", label: "Ölçülər" }],
    },
    HomeAppliances_Kitchen: {
        icon: UtensilsCrossed, label: "Mətbəx Texnikası",
        fields: [{ key: "power", label: "Güc" }, { key: "capacity", label: "Tutum" }, { key: "material", label: "Material" }],
    },
    HomeAppliances_Climate: {
        icon: Droplets, label: "Kondisioner",
        fields: [{ key: "power", label: "Güc (BTU)" }, { key: "coverage", label: "Əhatə" }, { key: "energyClass", label: "Enerji" }, { key: "inverter", label: "İnverter" }],
    },
    HomeAppliances_Water: {
        icon: Droplets, label: "Su Qızdırıcısı",
        fields: [{ key: "capacity", label: "Tutum" }, { key: "power", label: "Güc" }, { key: "energyClass", label: "Enerji" }],
    },

    // ── EV VƏ DEKOR ─────────────────────────────────────────────────
    HomeDecor_Deco:    { icon: Lamp,            label: "Dekorasiya",  fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
    HomeDecor_Light:   { icon: Lamp,            label: "İşıqlandırma",fields: [{ key: "power", label: "Güc" }, { key: "lightType", label: "İşıq Növü" }, { key: "color", label: "Rəng" }] },
    HomeDecor_Textile: { icon: Home,            label: "Tekstil",     fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
    HomeDecor_Kitchen: { icon: UtensilsCrossed, label: "Mətbəx Qabı",fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "setCount", label: "Dəst sayı" }] },
    HomeDecor_Bath:    { icon: Bath,            label: "Hamam Aksesuar",fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },

    // ── MEBEL ────────────────────────────────────────────────────────
    Furniture_Living:  { icon: Sofa,            label: "Qonaq Otağı", fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }, { key: "seatingCapacity", label: "Oturacaq" }] },
    Furniture_Bedroom: { icon: Bed,             label: "Yataq Otağı", fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
    Furniture_Kitchen: { icon: UtensilsCrossed, label: "Mətbəx Mebeli",fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
    Furniture_Office:  { icon: Monitor,         label: "Ofis Mebeli", fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "adjustable", label: "Tənzimlənir" }] },
    Furniture_Garden:  { icon: Tent,            label: "Bağ Mebeli",  fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "weatherResistant", label: "Hava Davamlı" }] },

    // ── QADIN GEYİMİ ────────────────────────────────────────────────
    WomenClothing_Outer:  { icon: Shirt, label: "Q. Üst Geyim",  fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    WomenClothing_Inner:  { icon: Shirt, label: "Q. Alt Geyim",  fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    WomenClothing_Casual: { icon: Shirt, label: "Q. Gündəlik",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    WomenClothing_Sport:  { icon: Shirt, label: "Q. İdman",      fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    WomenClothing_Formal: { icon: Shirt, label: "Q. Rəsmi",      fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    WomenClothing_Under:  { icon: Shirt, label: "Q. Alt Paltarı",fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },

    // ── KİŞİ GEYİMİ ─────────────────────────────────────────────────
    MenClothing_Outer:  { icon: Shirt, label: "K. Üst Geyim",  fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    MenClothing_Inner:  { icon: Shirt, label: "K. Alt Geyim",  fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    MenClothing_Casual: { icon: Shirt, label: "K. Gündəlik",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    MenClothing_Sport:  { icon: Shirt, label: "K. İdman",      fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    MenClothing_Formal: { icon: Shirt, label: "K. Rəsmi",      fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    MenClothing_Under:  { icon: Shirt, label: "K. Alt Paltarı",fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },

    // ── AYAQQABI ─────────────────────────────────────────────────────
    Shoes_Sport:   { icon: Footprints, label: "İdman Ayaqqabısı",fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }, { key: "gender", label: "Cins" }] },
    Shoes_Classic: { icon: Footprints, label: "Klassik Ayaqqabı", fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    Shoes_Casual:  { icon: Footprints, label: "Gündəlik Ayaqqabı",fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    Shoes_Sandal:  { icon: Footprints, label: "Sandalet",          fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },

    // ── AKSESUARLAR ──────────────────────────────────────────────────
    Accessories_Bag:        { icon: ShoppingBag, label: "Çanta",        fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
    Accessories_Watch:      { icon: Watch,       label: "Saat",          fields: [{ key: "material", label: "Qayış" }, { key: "waterResistant", label: "Su Keçirməz" }, { key: "color", label: "Rəng" }] },
    Accessories_Sunglasses: { icon: Watch,       label: "Gün Eynəyi",   fields: [{ key: "frameType", label: "Çərçivə" }, { key: "uvProtection", label: "UV Qoruma" }, { key: "color", label: "Rəng" }] },
    Accessories_Jewelry:    { icon: Watch,       label: "Zərgərlik",     fields: [{ key: "material", label: "Material" }, { key: "size", label: "Ölçü" }, { key: "color", label: "Rəng" }] },
    Accessories_Belt:       { icon: Package,     label: "Kəmər",         fields: [{ key: "material", label: "Material" }, { key: "size", label: "Ölçü" }, { key: "color", label: "Rəng" }] },

    // ── GÖZƏLLİK ─────────────────────────────────────────────────────
    Beauty_Makeup:   { icon: Flower2, label: "Makiyaj",        fields: [{ key: "volume", label: "Həcm" }, { key: "color", label: "Çalar" }, { key: "ingredients", label: "Tərkib" }] },
    Beauty_Skin:     { icon: Flower2, label: "Dəri Qulluğu",  fields: [{ key: "volume", label: "Həcm" }, { key: "skinType", label: "Dəri Növü" }, { key: "ingredients", label: "Tərkib" }] },
    Beauty_Hair:     { icon: Flower2, label: "Saç Qulluğu",   fields: [{ key: "volume", label: "Həcm" }, { key: "hairType", label: "Saç Növü" }, { key: "ingredients", label: "Tərkib" }] },
    Beauty_Perfume:  { icon: Flower2, label: "Parfümeriya",    fields: [{ key: "volume", label: "Həcm" }, { key: "scentType", label: "Qoxu" }, { key: "gender", label: "Cins" }] },
    Beauty_Men:      { icon: Flower2, label: "Kişi Baxımı",   fields: [{ key: "volume", label: "Həcm" }, { key: "ingredients", label: "Tərkib" }, { key: "skinType", label: "Dəri Növü" }] },
    Beauty_Hygiene:  { icon: Flower2, label: "Gigiyena",       fields: [{ key: "volume", label: "Həcm" }, { key: "ingredients", label: "Tərkib" }, { key: "quantity", label: "Miqdar" }] },

    // ── UŞAQ VƏ ANA ──────────────────────────────────────────────────
    KidsAndMom_Clothing: { icon: Baby,     label: "Uşaq Geyimi",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    KidsAndMom_Toys:     { icon: Baby,     label: "Oyuncaq",        fields: [{ key: "ageRange", label: "Yaş həddi" }, { key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }] },
    KidsAndMom_Stroller: { icon: Baby,     label: "Uşaq Arabası",  fields: [{ key: "maxWeight", label: "Maks. çəki" }, { key: "dimensions", label: "Ölçülər" }, { key: "foldable", label: "Qatlanır" }] },
    KidsAndMom_Food:     { icon: Baby,     label: "Qidalanma",      fields: [{ key: "volume", label: "Həcm" }, { key: "ageRange", label: "Yaş" }, { key: "ingredients", label: "Tərkib" }] },
    KidsAndMom_School:   { icon: BookOpen, label: "Məktəb Ləvazimatı",fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },

    // ── İDMAN VƏ OUTDOOR ─────────────────────────────────────────────
    Sports_Fitness:  { icon: Dumbbell, label: "Fitness",      fields: [{ key: "maxWeight", label: "Maks. yük" }, { key: "dimensions", label: "Ölçülər" }, { key: "material", label: "Material" }] },
    Sports_Camping:  { icon: Tent,     label: "Kampinq",      fields: [{ key: "material", label: "Material" }, { key: "capacity", label: "Tutum" }, { key: "weight", label: "Çəki" }] },
    Sports_Bicycle:  { icon: Bike,     label: "Velosiped",    fields: [{ key: "frameSize", label: "Çərçivə" }, { key: "gearCount", label: "Vites" }, { key: "material", label: "Material" }] },
    Sports_Clothing: { icon: Shirt,    label: "İdman Geyimi", fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    Sports_Acc:      { icon: Package,  label: "İdman Aksesuar",fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },

    // ── AVTO ──────────────────────────────────────────────────────────
    Automotive_Acc:         { icon: Car,     label: "Avto Aksesuar",   fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    Automotive_Electronics: { icon: Cpu,     label: "Avto Elektronika",fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "connectivity", label: "Bağlantı" }, { key: "resolution", label: "Çözümlülük" }] },
    Automotive_Parts:       { icon: Wrench,  label: "Ehtiyat Hissəsi", fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "partNumber", label: "Hissə №" }, { key: "material", label: "Material" }] },
    Automotive_Oils:        { icon: Droplets,label: "Yağ/Kimyəvi",     fields: [{ key: "viscosity", label: "Özlülük" }, { key: "volume", label: "Həcm" }, { key: "compatibility", label: "Uyğunluq" }] },

    // ── HƏDİYYƏ / LİFESTYLE ──────────────────────────────────────────
    Gifts_Sets:     { icon: Gift,     label: "Hədiyyə Dəsti",    fields: [{ key: "setCount", label: "Dəst sayı" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    Gifts_Souvenir: { icon: Gift,     label: "Suvenir",           fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
    Gifts_Trending: { icon: Gift,     label: "Trending",          fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
    Gifts_Books:    { icon: BookOpen, label: "Kitab/Hobbi",       fields: [{ key: "pageCount", label: "Səhifə" }, { key: "language", label: "Dil" }, { key: "author", label: "Müəllif" }] },
};


// =====================================================================
// SpecPanel — Desktop cədvəlindəki açılan spesifikasiya paneli
// =====================================================================
const SpecPanel = ({ product }) => {
    const cfg = CATEGORY_CONFIG[product.category];
    if (!cfg) return null;

    const specs = cfg.fields
        .map((f) => ({ label: f.label, value: product[f.key] }))
        .filter((s) => s.value !== undefined && s.value !== "" && s.value !== null);

    return (
        <tr>
            <td colSpan="6" style={{ padding: 0 }}>
                <div style={{ background: "linear-gradient(135deg, #fff5f6 0%, #fff 100%)", borderLeft: "4px solid #E8192C", borderBottom: "1px solid #fde8ea", padding: "16px 16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        {React.createElement(cfg.icon, { size: 14, color: "#E8192C" })}
                        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E8192C" }}>
                            {cfg.label} — Spesifikasiyalar
                        </span>
                    </div>
                    {specs.length === 0 ? (
                        <p style={{ color: "#ccc", fontSize: 13, fontStyle: "italic" }}>Bu məhsul üçün spesifikasiya daxil edilməyib.</p>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
                            {specs.map((s) => (
                                <div key={s.label} style={{ background: "white", borderRadius: 12, padding: "10px 12px", border: "1px solid #fde8ea", boxShadow: "0 1px 4px rgba(232,25,44,0.06)" }}>
                                    <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#bbb", margin: "0 0 4px" }}>{s.label}</p>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                                        {typeof s.value === "boolean" ? (s.value ? "✓ Bəli" : "✗ Xeyr") : s.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};


// =====================================================================
// StatCard
// =====================================================================
const StatCard = ({ title, value, icon: Icon, bg, sub }) => (
    <div style={{ background: bg, borderRadius: 20, padding: "20px 22px", color: "white", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(232,25,44,0.18)" }}>
        <div style={{ position: "absolute", right: -16, top: -16, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
        <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, letterSpacing: "0.04em", margin: 0 }}>{title}</p>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} />
                </div>
            </div>
            <p className="ap-stat-value" style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", margin: 0 }}>{value}</p>
            {sub && <p style={{ fontSize: 11, opacity: 0.7, margin: "4px 0 0", fontWeight: 500 }}>{sub}</p>}
        </div>
    </div>
);


// =====================================================================
// MobileProductCard
// =====================================================================
const MobileProductCard = ({ product, onEdit, onDelete, expandedId, toggleExpand }) => {
    const cfg = CATEGORY_CONFIG[product.category];
    const CatIcon = cfg?.icon || Sparkles;
    const isOpen = expandedId === product._id;
    const specs = cfg
        ? cfg.fields.map(f => ({ label: f.label, value: product[f.key] })).filter(s => s.value !== undefined && s.value !== "" && s.value !== null)
        : [];

    return (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #f0f0f0", marginBottom: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "14px 14px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 10, fontFamily: "monospace", color: "#bbb", margin: "0 0 3px" }}>#{product._id.slice(-6).toUpperCase()}</p>
                        <p style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14, margin: "0 0 8px", lineHeight: 1.3, wordBreak: "break-word" }}>{product.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 20, background: "#fff0f1", color: "#E8192C", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                                <CatIcon size={9} />{cfg?.label || product.category}
                            </span>
                            <span style={{ fontWeight: 900, color: "#E8192C", fontSize: 15, whiteSpace: "nowrap" }}>{product.price} ₼</span>
                        </div>
                        <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}>Satışlar:</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#22c55e" }}>{product.salesCount || 0} ədəd</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => onEdit(product._id)} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "1.5px solid #fdd", background: "#fff0f1", color: "#E8192C", cursor: "pointer" }}>
                            <FaRegEdit size={13} />
                        </button>
                        <button onClick={() => onDelete(product._id)} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "none", background: "#E8192C", color: "white", cursor: "pointer", boxShadow: "0 3px 10px rgba(232,25,44,0.3)" }}>
                            <MdDeleteSweep size={15} />
                        </button>
                    </div>
                </div>
                {specs.length > 0 && (
                    <button onClick={() => toggleExpand(product._id)}
                        style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 20, border: `1.5px solid ${isOpen ? "#E8192C" : "#fdd"}`, background: isOpen ? "#E8192C" : "#fff0f1", color: isOpen ? "white" : "#E8192C", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer" }}>
                        <CatIcon size={9} />SPEC{isOpen ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                    </button>
                )}
            </div>
            {isOpen && specs.length > 0 && (
                <div style={{ background: "linear-gradient(135deg, #fff5f6 0%, #fff 100%)", borderTop: "1px solid #fde8ea", borderLeft: "4px solid #E8192C", padding: "12px 14px 14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 7 }}>
                        {specs.map((s) => (
                            <div key={s.label} style={{ background: "white", borderRadius: 10, padding: "8px 10px", border: "1px solid #fde8ea" }}>
                                <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#bbb", margin: "0 0 3px" }}>{s.label}</p>
                                <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", margin: 0, wordBreak: "break-word" }}>
                                    {typeof s.value === "boolean" ? (s.value ? "✓ Bəli" : "✗ Xeyr") : s.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


// =====================================================================
// AdminProducts — ANA KOMPONENT
// =====================================================================
const AdminProducts = () => {
    const { user } = useSelector((state) => state.userSlice);
    const currentStoreName = user?.user?.sellerInfo?.storeName || user?.user?.name || "";
    const storeSlug = user?.user?.sellerInfo?.storeSlug || "";

    const { data, error, isLoading, refetch } = useGetProductsQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);

    const allProducts = data?.products || [];
    const products = allProducts.filter((p) => p.seller === currentStoreName);

    const productNames = products.map((p) => p.name);
    const sales = products.map((p) => p.salesCount || 0);
    const totalProducts = products.length;
    const averagePrice = products.reduce((acc, p) => acc + p.price, 0) / (totalProducts || 1);
    const totalSales = sales.reduce((a, b) => a + b, 0);

    const handleEdit   = (id) => navigate(`/admin/edit-product/${id}`);
    const handleCreate = () => navigate("/admin/create-product");
    const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Məhsulu silmək istədiyinizdən əminsinizmi?",
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#E8192C",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Xeyr",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                await deleteProduct(id).unwrap();
                await refetch();
                Swal.fire({ title: "Silindi!", text: "Məhsul uğurla silindi.", icon: "success", confirmButtonColor: "#E8192C" });
            } catch {
                Swal.fire({ title: "Xəta!", text: "Silinmə zamanı xəta baş verdi.", icon: "error", confirmButtonColor: "#E8192C" });
            }
        }
    };

    if (isLoading) return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f8f8f8", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "4px solid #fdd", borderTopColor: "#E8192C", animation: "spin 0.8s linear infinite" }} />
            <span style={{ color: "#E8192C", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>Yüklənir...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#E8192C", fontSize: 18, fontWeight: 700, padding: 20, textAlign: "center" }}>
            ❌ Xəta: {error.data?.message || error.error}
        </div>
    );

    const storeLink = storeSlug ? `${window.location.origin}/store/${storeSlug}` : null;

    return (
        <div style={{ minHeight: "100vh", background: "#f6f6f7", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ap-header { background: #E8192C; padding: 0 40px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 30; box-shadow: 0 4px 20px rgba(232,25,44,0.25); }
        .ap-content { max-width: 1200px; margin: 0 auto; padding: 32px 20px; width: 100%; }
        .ap-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .ap-desktop-table { display: block; overflow-x: auto; }
        .ap-mobile-cards  { display: none; }
        .ap-store-link   { display: flex; align-items: center; gap: 10px; background: #fff8f8; border: 1.5px solid #fdd; border-radius: 12px; padding: 10px 14px; flex-wrap: wrap; width: 100%; }
        .ap-store-header { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .ap-table-header { padding: 18px 32px; border-bottom: 1px solid #f5f5f5; display: flex; align-items: center; gap: 10px; background: #fafafa; }
        .ap-chart-wrapper { background: white; border-radius: 24px; padding: 28px 32px; box-shadow: 0 2px 16px rgba(0,0,0,0.06); margin-bottom: 24px; border: 1px solid #f0f0f0; }
        @media (max-width: 1024px) { .ap-header{padding:0 24px;} .ap-content{padding:24px 16px;} .ap-chart-wrapper{padding:22px 24px;} .ap-table-header{padding:16px 24px;} }
        @media (max-width: 768px) {
          .ap-header{padding:0 14px;height:56px;} .ap-brand-title{font-size:15px !important;} .ap-brand-sub{display:none !important;}
          .ap-create-btn-text{display:none;} .ap-create-btn{padding:8px 10px !important;min-width:36px;}
          .ap-content{padding:14px 10px;} .ap-page-title{font-size:18px !important;} .ap-page-sub{font-size:12px !important;}
          .ap-stats{grid-template-columns:1fr 1fr;gap:10px;} .ap-stats>div:last-child{grid-column:1/-1;} .ap-stat-value{font-size:20px !important;}
          .ap-chart-wrapper{padding:16px 14px;border-radius:16px;} .ap-chart-title{font-size:15px !important;} .ap-table-header{padding:12px 14px;border-radius:14px 14px 0 0;}
          .ap-desktop-table{display:none !important;} .ap-mobile-cards{display:block !important;padding:10px;}
          .ap-store-link{padding:8px 10px;gap:7px;} .ap-store-link a{font-size:12px !important;} .ap-store-header{gap:8px;} .ap-store-icon{width:34px !important;height:34px !important;border-radius:10px !important;}
        }
        @media (max-width: 480px) { .ap-header{padding:0 10px;} .ap-content{padding:10px 8px;} .ap-stats{grid-template-columns:1fr;} .ap-stats>div:last-child{grid-column:auto;} .ap-chart-wrapper{padding:14px 12px;border-radius:14px;} .ap-table-header{padding:10px 12px;} }
        @media (max-width: 360px) { .ap-brand-title{font-size:13px !important;} .ap-header-logo{width:30px !important;height:30px !important;} .ap-page-title{font-size:16px !important;} }
      `}</style>

            {/* HEADER */}
            <div className="ap-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="ap-header-logo" style={{ width: 36, height: 36, background: "white", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                        <span style={{ color: "#E8192C", fontWeight: 900, fontSize: 18, lineHeight: 1 }}>B</span>
                    </div>
                    <div>
                        <p className="ap-brand-title" style={{ color: "white", fontWeight: 900, fontSize: 17, letterSpacing: "-0.01em", lineHeight: 1, margin: 0 }}>BRENDEX</p>
                        <p className="ap-brand-sub" style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Admin Panel</p>
                    </div>
                </div>
                <button onClick={handleCreate} className="ap-create-btn"
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "white", color: "#E8192C", border: "none", borderRadius: 12, padding: "9px 18px", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
                    <PlusCircle size={15} />
                    <span className="ap-create-btn-text">Yeni Məhsul</span>
                </button>
            </div>

            <div className="ap-content">
                {/* Mağaza başlığı */}
                <div style={{ marginBottom: 20 }}>
                    <div className="ap-store-header">
                        <div className="ap-store-icon" style={{ width: 40, height: 40, background: "#fff0f1", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1.5px solid #fdd" }}>
                            <Store size={20} color="#E8192C" />
                        </div>
                        <div>
                            <h1 className="ap-page-title" style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", margin: 0, letterSpacing: "-0.02em" }}>{currentStoreName} — Məhsullar</h1>
                            <p className="ap-page-sub" style={{ color: "#999", fontSize: 13, marginTop: 2, marginBottom: 0 }}>Yalnız sizin mağazanızın məhsulları göstərilir</p>
                        </div>
                    </div>
                    {storeLink && (
                        <div className="ap-store-link" style={{ marginTop: 14 }}>
                            <Store size={14} color="#E8192C" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: "#999", whiteSpace: "nowrap" }}>Mağaza linkiniz:</span>
                            <a href={storeLink} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "#E8192C", textDecoration: "none", wordBreak: "break-all", flex: 1, minWidth: 0 }}>{storeLink}</a>
                            <button onClick={() => navigator.clipboard.writeText(storeLink)}
                                style={{ padding: "4px 12px", borderRadius: 8, border: "1.5px solid #fdd", background: "#fff0f1", color: "#E8192C", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>Kopyala</button>
                        </div>
                    )}
                </div>

                {/* Statistika */}
                <div className="ap-stats">
                    <StatCard title="Məhsul Sayı" value={totalProducts} icon={Package} bg="linear-gradient(135deg, #E8192C 0%, #ff4f61 100%)" sub="Aktiv məhsullar" />
                    <StatCard title="Orta Qiymət" value={`${averagePrice.toFixed(2)} ₼`} icon={DollarSign} bg="linear-gradient(135deg, #bf1124 0%, #E8192C 100%)" sub="Bütün məhsullar üzrə" />
                    <StatCard title="Ümumi Satış" value={totalSales} icon={BarChart3} bg="linear-gradient(135deg, #1c1c2e 0%, #2e2e42 100%)" sub="Ədəd" />
                </div>

                {/* Chart */}
                {products.length > 0 && (
                    <div className="ap-chart-wrapper">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                            <div style={{ background: "#fff0f1", borderRadius: 10, padding: 8, flexShrink: 0 }}>
                                <BarChart3 size={20} color="#E8192C" />
                            </div>
                            <h2 className="ap-chart-title" style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>Satış Statistikası</h2>
                        </div>
                        <ChartComponent labels={productNames} dataPoints={sales} gradientFrom="#E8192C" gradientTo="#ff9ca5" />
                    </div>
                )}

                {/* Məhsul cədvəli */}
                <div style={{ background: "white", borderRadius: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid #f0f0f0" }}>
                    <div className="ap-table-header">
                        <div style={{ background: "#fff0f1", borderRadius: 10, padding: 7, flexShrink: 0 }}>
                            <ShoppingBag size={18} color="#E8192C" />
                        </div>
                        <h2 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>Məhsullarım</h2>
                        <span style={{ marginLeft: "auto", background: "#fff0f1", color: "#E8192C", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" }}>{totalProducts} məhsul</span>
                    </div>

                    {/* Desktop cədvəl */}
                    <div className="ap-desktop-table">
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #f5f5f5" }}>
                                    {["ID", "Məhsul", "Qiymət", "Satış", "Kateqoriya", "Əməliyyat"].map((h, i) => (
                                        <th key={h} style={{ padding: "12px 20px", textAlign: i === 5 ? "center" : "left", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#bbb", background: "#fafafa", whiteSpace: "nowrap" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.map((product) => {
                                    const cfg = CATEGORY_CONFIG[product.category];
                                    const CatIcon = cfg?.icon || Sparkles;
                                    const isOpen = expandedId === product._id;
                                    return (
                                        <React.Fragment key={product._id}>
                                            <tr style={{ borderBottom: "1px solid #f9f9f9", background: isOpen ? "#fff5f6" : "white", transition: "background 0.2s" }}>
                                                <td style={{ padding: "14px 20px", fontSize: 11, fontFamily: "monospace", color: "#bbb", whiteSpace: "nowrap" }}>#{product._id.slice(-6).toUpperCase()}</td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14 }}>{product.name}</span>
                                                        <button onClick={() => toggleExpand(product._id)}
                                                            style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 9px", borderRadius: 20, border: `1.5px solid ${isOpen ? "#E8192C" : "#fdd"}`, background: isOpen ? "#E8192C" : "#fff0f1", color: isOpen ? "white" : "#E8192C", fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", whiteSpace: "nowrap" }}>
                                                            <CatIcon size={9} />SPEC{isOpen ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 20px", fontWeight: 900, color: "#E8192C", fontSize: 15, whiteSpace: "nowrap" }}>{product.price} ₼</td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: (product.salesCount || 0) > 0 ? "#f0fdf4" : "#fafafa", color: (product.salesCount || 0) > 0 ? "#16a34a" : "#bbb", fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" }}>
                                                        {product.salesCount || 0} ədəd
                                                    </span>
                                                </td>
                                                <td style={{ padding: "14px 20px" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "#fff0f1", color: "#E8192C", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                                                        <CatIcon size={11} />{cfg?.label || product.category}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "14px 20px", textAlign: "center" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                                                        <button onClick={() => handleEdit(product._id)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "1.5px solid #fdd", background: "#fff0f1", color: "#E8192C", cursor: "pointer" }}>
                                                            <FaRegEdit size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(product._id)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "none", background: "#E8192C", color: "white", cursor: "pointer", boxShadow: "0 3px 10px rgba(232,25,44,0.3)" }}>
                                                            <MdDeleteSweep size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isOpen && <SpecPanel product={product} />}
                                        </React.Fragment>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center", padding: "60px 20px", color: "#ccc" }}>
                                            <Package size={48} style={{ margin: "0 auto 12px", opacity: 0.3, display: "block" }} />
                                            <p style={{ fontWeight: 600, marginBottom: 4 }}>Heç bir məhsul tapılmadı</p>
                                            <p style={{ fontSize: 13 }}>Yeni məhsul əlavə etmək üçün yuxarıdakı düyməyə basın</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobil kartlar */}
                    <div className="ap-mobile-cards">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <MobileProductCard key={product._id} product={product} onEdit={handleEdit} onDelete={handleDelete} expandedId={expandedId} toggleExpand={toggleExpand} />
                            ))
                        ) : (
                            <div style={{ textAlign: "center", padding: "40px 20px", color: "#ccc" }}>
                                <Package size={40} style={{ margin: "0 auto 12px", opacity: 0.3, display: "block" }} />
                                <p style={{ fontWeight: 600, marginBottom: 4 }}>Heç bir məhsul tapılmadı</p>
                                <p style={{ fontSize: 13 }}>Yeni məhsul əlavə etmək üçün yuxarıdakı düyməyə basın</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;