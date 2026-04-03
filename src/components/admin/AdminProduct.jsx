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
  Footprints, Watch, Baby, Bike, Gift, Wrench,
  Droplets, Lamp, Bath, BookOpen, Tent, ShoppingBag as BagIcon,
} from "lucide-react";
import Swal from "sweetalert2";

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY CONFIG — Bütün 15 ana kateqoriya + subkateqoriyalar
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {

  // 1. ELEKTRONİKA
  Electronics_TV: {
    icon: Tv, label: "TV/Audio Sistemlər",
    fields: [{ key: "screenSize", label: "Ekran" }, { key: "resolution", label: "Çözümlülük" }, { key: "panelType", label: "Panel" }, { key: "connectivity", label: "Bağlantı" }, { key: "smartTv", label: "Smart TV" }],
  },
  Electronics_Photo: {
    icon: Camera, label: "Foto/Video Texnika",
    fields: [{ key: "resolution", label: "Çözümlülük" }, { key: "opticalZoom", label: "Optik Zoom" }, { key: "sensorType", label: "Sensor" }, { key: "imageStabilization", label: "Stabilizasiya" }, { key: "videoResolution", label: "Video" }],
  },
  Electronics_Console: {
    icon: Gamepad2, label: "Oyun Konsolları",
    fields: [{ key: "cpu", label: "CPU" }, { key: "gpu", label: "GPU" }, { key: "storage", label: "Yaddaş" }, { key: "memory", label: "RAM" }, { key: "supportedResolution", label: "Çözümlülük" }, { key: "controllerIncluded", label: "Controller" }],
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
    icon: Plug, label: "Elektron Aksesuarlar",
    fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }],
  },

  // 2. TELEFONLAR
  Phones_Smartphone: {
    icon: Smartphone, label: "Smartfonlar",
    fields: [{ key: "screenSize", label: "Ekran" }, { key: "storage", label: "Yaddaş" }, { key: "ram", label: "RAM" }, { key: "frontCamera", label: "Ön Kamera" }, { key: "backCamera", label: "Arxa Kamera" }, { key: "battery", label: "Batareya" }, { key: "processor", label: "Prosessor" }, { key: "operatingSystem", label: "OS" }],
  },
  Phones_Basic: {
    icon: Smartphone, label: "Düyməli Telefonlar",
    fields: [{ key: "battery", label: "Batareya" }, { key: "storage", label: "Yaddaş" }, { key: "simCount", label: "SIM sayı" }],
  },
  Phones_Headphones: {
    icon: Headphones, label: "Qulaqlıqlar",
    fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "batteryLife", label: "Batareya" }, { key: "noiseCancellation", label: "ANC" }, { key: "driverSize", label: "Driver" }],
  },
  Phones_Cables: {
    icon: Plug, label: "Kabellər/Adapterlər",
    fields: [{ key: "length", label: "Uzunluq" }, { key: "compatibility", label: "Uyğunluq" }, { key: "maxCharge", label: "Maks. Şarj" }],
  },
  Phones_Powerbank: {
    icon: Package, label: "Powerbank",
    fields: [{ key: "capacity", label: "Tutum" }, { key: "maxCharge", label: "Maks. Şarj" }, { key: "portCount", label: "Port sayı" }],
  },
  Phones_Acc: {
    icon: Package, label: "Telefon Aksesuarları",
    fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }],
  },

  // 3. KOMPÜTER
  Computers_Laptop: {
    icon: Laptop, label: "Noutbuklar",
    fields: [{ key: "screenSize", label: "Ekran" }, { key: "storage", label: "Yaddaş" }, { key: "ram", label: "RAM" }, { key: "gpu", label: "GPU" }, { key: "processor", label: "CPU" }, { key: "batteryLife", label: "Batareya" }, { key: "operatingSystem", label: "OS" }],
  },
  Computers_Desktop: {
    icon: Monitor, label: "Stolüstü Kompüterlər",
    fields: [{ key: "processor", label: "CPU" }, { key: "ram", label: "RAM" }, { key: "storage", label: "Yaddaş" }, { key: "gpu", label: "GPU" }, { key: "operatingSystem", label: "OS" }],
  },
  Computers_Monitor: {
    icon: Monitor, label: "Monitorlar",
    fields: [{ key: "screenSize", label: "Ekran" }, { key: "resolution", label: "Çözümlülük" }, { key: "refreshRate", label: "Hz" }, { key: "panelType", label: "Panel" }, { key: "connectivity", label: "Bağlantı" }],
  },
  Computers_Printer: {
    icon: Printer, label: "Printer/Skanerlər",
    fields: [{ key: "printType", label: "Çap Növü" }, { key: "resolution", label: "Keyfiyyət" }, { key: "connectivity", label: "Bağlantı" }],
  },
  Computers_OfficeAcc: {
    icon: Package, label: "Ofis Aksesuarları",
    fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "connectivity", label: "Bağlantı" }, { key: "color", label: "Rəng" }],
  },
  Computers_Parts: {
    icon: HardDrive, label: "Komponentlər",
    fields: [{ key: "partType", label: "Hissə" }, { key: "capacity", label: "Tutum/Sürət" }, { key: "compatibility", label: "Uyğunluq" }],
  },

  // 4. MƏİŞƏT TEXNİKASI
  HomeAppliances_Large: {
    icon: Home, label: "Böyük Məişət Texnikası",
    fields: [{ key: "capacity", label: "Tutum" }, { key: "energyClass", label: "Enerji" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }],
  },
  HomeAppliances_Small: {
    icon: Home, label: "Kiçik Məişət Texnikası",
    fields: [{ key: "power", label: "Güc" }, { key: "capacity", label: "Tutum" }, { key: "dimensions", label: "Ölçülər" }],
  },
  HomeAppliances_Kitchen: {
    icon: UtensilsCrossed, label: "Mətbəx Texnikası",
    fields: [{ key: "power", label: "Güc" }, { key: "capacity", label: "Tutum" }, { key: "material", label: "Material" }],
  },
  HomeAppliances_Climate: {
    icon: Droplets, label: "Kondisioner/İsitmə",
    fields: [{ key: "power", label: "Güc (BTU)" }, { key: "coverage", label: "Əhatə" }, { key: "energyClass", label: "Enerji" }, { key: "inverter", label: "İnverter" }],
  },
  HomeAppliances_Water: {
    icon: Droplets, label: "Su Qızdırıcıları",
    fields: [{ key: "capacity", label: "Tutum" }, { key: "power", label: "Güc" }, { key: "energyClass", label: "Enerji" }],
  },

  // 5. EV VƏ DEKOR
  HomeDecor_Deco:    { icon: Lamp,            label: "Dekorasiya",         fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
  HomeDecor_Light:   { icon: Lamp,            label: "İşıqlandırma",       fields: [{ key: "power", label: "Güc" }, { key: "lightType", label: "İşıq Növü" }, { key: "color", label: "Rəng" }] },
  HomeDecor_Textile: { icon: Home,            label: "Ev Tekstili",        fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
  HomeDecor_Kitchen: { icon: UtensilsCrossed, label: "Mətbəx Qabları",    fields: [{ key: "material", label: "Material" }, { key: "setCount", label: "Dəst sayı" }, { key: "dishwasherSafe", label: "Maşında Yuyulur" }] },
  HomeDecor_Bath:    { icon: Bath,            label: "Hamam Aksesuarları", fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },

  // 6. MEBEL
  Furniture_Living:  { icon: Sofa,            label: "Qonaq Otağı Mebeli",  fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }, { key: "seatingCapacity", label: "Oturacaq" }] },
  Furniture_Bedroom: { icon: Bed,             label: "Yataq Otağı Mebeli",  fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
  Furniture_Kitchen: { icon: UtensilsCrossed, label: "Mətbəx Mebeli",       fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
  Furniture_Office:  { icon: Monitor,         label: "Ofis Mebeli",          fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "adjustable", label: "Tənzimlənir" }] },
  Furniture_Garden:  { icon: Tent,            label: "Bağ Mebeli",           fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "weatherResistant", label: "Hava Davamlı" }] },

  // 7. QADIN GEYİMİ
  WomenClothing_Outer:  { icon: Shirt, label: "Q. Üst Geyim",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }, { key: "season", label: "Mövsüm" }] },
  WomenClothing_Inner:  { icon: Shirt, label: "Q. Alt Geyim",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  WomenClothing_Casual: { icon: Shirt, label: "Q. Gündəlik",    fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  WomenClothing_Sport:  { icon: Shirt, label: "Q. İdman",       fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  WomenClothing_Formal: { icon: Shirt, label: "Q. Rəsmi",       fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  WomenClothing_Under:  { icon: Shirt, label: "Q. Alt Paltarı", fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },

  // 8. KİŞİ GEYİMİ
  MenClothing_Outer:  { icon: Shirt, label: "K. Üst Geyim",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }, { key: "season", label: "Mövsüm" }] },
  MenClothing_Inner:  { icon: Shirt, label: "K. Alt Geyim",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  MenClothing_Casual: { icon: Shirt, label: "K. Gündəlik",    fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  MenClothing_Sport:  { icon: Shirt, label: "K. İdman",       fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  MenClothing_Formal: { icon: Shirt, label: "K. Rəsmi",       fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  MenClothing_Under:  { icon: Shirt, label: "K. Alt Paltarı", fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },

  // 9. AYAQQABI
  Shoes_Sport:   { icon: Footprints, label: "İdman Ayaqqabısı",  fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }, { key: "gender", label: "Cins" }] },
  Shoes_Classic: { icon: Footprints, label: "Klassik Ayaqqabı",  fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  Shoes_Casual:  { icon: Footprints, label: "Gündəlik Ayaqqabı", fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  Shoes_Sandal:  { icon: Footprints, label: "Sandalet/Yay",      fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },

  // 10. AKSESUARLAR
  Accessories_Bag:        { icon: BagIcon,  label: "Çantalar",       fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
  Accessories_Watch:      { icon: Watch,    label: "Saatlar",         fields: [{ key: "material", label: "Qayış" }, { key: "waterResistant", label: "Su Keçirməz" }, { key: "color", label: "Rəng" }] },
  Accessories_Sunglasses: { icon: Watch,    label: "Gün Eynəkləri",  fields: [{ key: "frameType", label: "Çərçivə" }, { key: "uvProtection", label: "UV Qoruma" }, { key: "color", label: "Rəng" }] },
  Accessories_Jewelry:    { icon: Watch,    label: "Zərgərlik",       fields: [{ key: "material", label: "Material" }, { key: "size", label: "Ölçü" }, { key: "color", label: "Rəng" }] },
  Accessories_Belt:       { icon: Package, label: "Kəmərlər",        fields: [{ key: "material", label: "Material" }, { key: "size", label: "Ölçü" }, { key: "color", label: "Rəng" }] },

  // 11. GÖZƏLLİK
  Beauty_Makeup:   { icon: Flower2, label: "Makiyaj",            fields: [{ key: "volume", label: "Həcm" }, { key: "color", label: "Çalar" }, { key: "ingredients", label: "Tərkib" }] },
  Beauty_Skin:     { icon: Flower2, label: "Dəriyə Qulluq",     fields: [{ key: "volume", label: "Həcm" }, { key: "skinType", label: "Dəri Növü" }, { key: "ingredients", label: "Tərkib" }] },
  Beauty_Hair:     { icon: Flower2, label: "Saça Qulluq",       fields: [{ key: "volume", label: "Həcm" }, { key: "hairType", label: "Saç Növü" }, { key: "ingredients", label: "Tərkib" }] },
  Beauty_Perfume:  { icon: Flower2, label: "Parfümeriya",        fields: [{ key: "volume", label: "Həcm" }, { key: "scentType", label: "Qoxu" }, { key: "gender", label: "Cins" }] },
  Beauty_Men:      { icon: Flower2, label: "Kişi Baxım",        fields: [{ key: "volume", label: "Həcm" }, { key: "ingredients", label: "Tərkib" }, { key: "skinType", label: "Dəri Növü" }] },
  Beauty_Hygiene:  { icon: Flower2, label: "Gigiyena",           fields: [{ key: "volume", label: "Həcm" }, { key: "ingredients", label: "Tərkib" }, { key: "quantity", label: "Miqdar" }] },

  // 12. UŞAQ VƏ ANA
  KidsAndMom_Clothing: { icon: Baby,     label: "Uşaq Geyimləri",        fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }, { key: "ageRange", label: "Yaş" }] },
  KidsAndMom_Toys:     { icon: Baby,     label: "Oyuncaqlar",             fields: [{ key: "ageRange", label: "Yaş həddi" }, { key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }] },
  KidsAndMom_Stroller: { icon: Baby,     label: "Uşaq Arabaları",         fields: [{ key: "maxWeight", label: "Maks. çəki" }, { key: "dimensions", label: "Ölçülər" }, { key: "foldable", label: "Qatlanır" }] },
  KidsAndMom_Food:     { icon: Baby,     label: "Qidalanma Məhsulları",   fields: [{ key: "volume", label: "Həcm" }, { key: "ageRange", label: "Yaş" }, { key: "ingredients", label: "Materiallar" }] },
  KidsAndMom_School:   { icon: BookOpen, label: "Məktəb Ləvazimatları",  fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },

  // 13. İDMAN VƏ OUTDOOR
  Sports_Fitness:  { icon: Dumbbell, label: "Fitness Avadanlıqları", fields: [{ key: "maxWeight", label: "Maks. yük" }, { key: "dimensions", label: "Ölçülər" }, { key: "material", label: "Material" }] },
  Sports_Camping:  { icon: Tent,     label: "Kampinq",               fields: [{ key: "material", label: "Material" }, { key: "capacity", label: "Tutum" }, { key: "weight", label: "Çəki" }] },
  Sports_Bicycle:  { icon: Bike,     label: "Velosipedlər",          fields: [{ key: "frameSize", label: "Çərçivə" }, { key: "gearCount", label: "Vites" }, { key: "material", label: "Material" }] },
  Sports_Clothing: { icon: Shirt,    label: "İdman Geyimi",          fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  Sports_Acc:      { icon: Package,  label: "İdman Aksesuarları",    fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },

  // 14. AVTO
  Automotive_Acc:         { icon: Car,      label: "Avto Aksesuarlar",    fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  Automotive_Electronics: { icon: Cpu,      label: "Avto Elektronika",    fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "connectivity", label: "Bağlantı" }, { key: "resolution", label: "Çözümlülük" }] },
  Automotive_Parts:       { icon: Wrench,   label: "Ehtiyat Hissələri",   fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "partNumber", label: "Hissə №" }, { key: "material", label: "Material" }] },
  Automotive_Oils:        { icon: Droplets, label: "Yağlar/Kimyəvi",      fields: [{ key: "viscosity", label: "Özlülük" }, { key: "volume", label: "Həcm" }, { key: "compatibility", label: "Uyğunluq" }] },

  // 15. HƏDİYYƏ/LİFESTYLE
  Gifts_Sets:     { icon: Gift,     label: "Hədiyyə Setləri",    fields: [{ key: "setCount", label: "Dəst sayı" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  Gifts_Souvenir: { icon: Gift,     label: "Suvenirlər",         fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }, { key: "color", label: "Rəng" }] },
  Gifts_Trending: { icon: Gift,     label: "Trending Məhsullar", fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  Gifts_Books:    { icon: BookOpen, label: "Kitablar/Hobbi",     fields: [{ key: "pageCount", label: "Səhifə" }, { key: "language", label: "Dil" }, { key: "author", label: "Müəllif" }] },

  // ── Legacy kateqoriyalar (köhnə məhsullar üçün) ───────────────────────────
  Phones:         { icon: Smartphone,     label: "Telefon (Köhnə)",       fields: [{ key: "screenSize", label: "Ekran" }, { key: "storage", label: "Yaddaş" }, { key: "ram", label: "RAM" }, { key: "battery", label: "Batareya" }] },
  Laptops:        { icon: Laptop,         label: "Noutbuk (Köhnə)",       fields: [{ key: "screenSize", label: "Ekran" }, { key: "storage", label: "Yaddaş" }, { key: "ram", label: "RAM" }, { key: "gpu", label: "GPU" }] },
  Cameras:        { icon: Camera,         label: "Kamera (Köhnə)",        fields: [{ key: "resolution", label: "Çözümlülük" }, { key: "sensorType", label: "Sensor" }] },
  Headphones:     { icon: Headphones,     label: "Qulaqlıq (Köhnə)",      fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "batteryLife", label: "Batareya" }] },
  Console:        { icon: Gamepad2,       label: "Konsol (Köhnə)",        fields: [{ key: "cpu", label: "CPU" }, { key: "gpu", label: "GPU" }, { key: "storage", label: "Yaddaş" }] },
  iPad:           { icon: Tablet,         label: "iPad (Köhnə)",          fields: [{ key: "screenSize", label: "Ekran" }, { key: "storage", label: "Yaddaş" }, { key: "processor", label: "Prosessor" }] },
  WomenClothing:  { icon: Shirt,          label: "Qadın Geyimi (Köhnə)",  fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  MenClothing:    { icon: Shirt,          label: "Kişi Geyimi (Köhnə)",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  KidsClothing:   { icon: Baby,           label: "Uşaq Geyimi (Köhnə)",   fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  HomeAppliances: { icon: Home,           label: "Məişət Tex. (Köhnə)",   fields: [{ key: "power", label: "Güc" }, { key: "dimensions", label: "Ölçülər" }] },
  HomeAndGarden:  { icon: Tent,           label: "Ev/Bağ (Köhnə)",        fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }] },
  Beauty:         { icon: Flower2,        label: "Gözəllik (Köhnə)",      fields: [{ key: "volume", label: "Həcm" }, { key: "skinType", label: "Dəri Növü" }] },
  Sports:         { icon: Dumbbell,       label: "İdman (Köhnə)",         fields: [{ key: "material", label: "Material" }, { key: "weight", label: "Çəki" }] },
  Automotive:     { icon: Car,            label: "Avto (Köhnə)",          fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "material", label: "Material" }] },

  // TVs, AudioSystems, etc. — köhnə flat kateqoriyalar
  TVs:            { icon: Tv,             label: "TV",                    fields: [{ key: "screenSize", label: "Ekran" }, { key: "resolution", label: "Çözümlülük" }] },
  AudioSystems:   { icon: Headphones,     label: "Audio Sistem",          fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "power", label: "Güc" }] },
  PhotoVideo:     { icon: Camera,         label: "Foto/Video",            fields: [{ key: "resolution", label: "Çözümlülük" }, { key: "sensorType", label: "Sensor" }] },
  GameConsoles:   { icon: Gamepad2,       label: "Oyun Konsolu",          fields: [{ key: "cpu", label: "CPU" }, { key: "gpu", label: "GPU" }, { key: "storage", label: "Yaddaş" }] },
  SmartHome:      { icon: Wifi,           label: "Smart Home",            fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "compatibility", label: "Uyğunluq" }] },
  Gadgets:        { icon: Cpu,            label: "Gadget",                fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "batteryLife", label: "Batareya" }] },
  ElectronicsAccessories: { icon: Plug,  label: "Elektron Aksesuar",     fields: [{ key: "compatibility", label: "Uyğunluq" }] },
  Smartphones:    { icon: Smartphone,     label: "Smartfon",              fields: [{ key: "screenSize", label: "Ekran" }, { key: "storage", label: "Yaddaş" }, { key: "ram", label: "RAM" }] },
  FeaturePhones:  { icon: Smartphone,     label: "Düyməli Telefon",       fields: [{ key: "battery", label: "Batareya" }] },
  HeadphonesNew:  { icon: Headphones,     label: "Qulaqlıq",              fields: [{ key: "connectivity", label: "Bağlantı" }, { key: "noiseCancellation", label: "ANC" }] },
  CablesAdapters: { icon: Plug,           label: "Kabel/Adapter",         fields: [{ key: "length", label: "Uzunluq" }, { key: "compatibility", label: "Uyğunluq" }] },
  Powerbanks:     { icon: Package,        label: "Powerbank",             fields: [{ key: "capacity", label: "Tutum" }] },
  PhoneAccessories:{ icon: Package,       label: "Telefon Aksesuar",      fields: [{ key: "compatibility", label: "Uyğunluq" }, { key: "color", label: "Rəng" }] },
  LaptopsNew:     { icon: Laptop,         label: "Noutbuk",               fields: [{ key: "screenSize", label: "Ekran" }, { key: "ram", label: "RAM" }, { key: "storage", label: "Yaddaş" }] },
  Desktops:       { icon: Monitor,        label: "Stolüstü",              fields: [{ key: "processor", label: "CPU" }, { key: "ram", label: "RAM" }] },
  Monitors:       { icon: Monitor,        label: "Monitor",               fields: [{ key: "screenSize", label: "Ekran" }, { key: "resolution", label: "Çözümlülük" }] },
  PrintersScanners:{ icon: Printer,       label: "Printer/Skaner",        fields: [{ key: "printType", label: "Çap Növü" }] },
  OfficeAccessories:{ icon: Package,      label: "Ofis Aksesuar",         fields: [{ key: "compatibility", label: "Uyğunluq" }] },
  Components:     { icon: HardDrive,      label: "Komponent",             fields: [{ key: "partType", label: "Hissə" }, { key: "capacity", label: "Tutum" }] },
  LargeAppliances:{ icon: Home,           label: "Böyük Məişət",          fields: [{ key: "capacity", label: "Tutum" }, { key: "energyClass", label: "Enerji" }] },
  SmallAppliances:{ icon: Home,           label: "Kiçik Məişət",          fields: [{ key: "power", label: "Güc" }] },
  KitchenAppliances:{ icon: UtensilsCrossed, label: "Mətbəx Tex.",        fields: [{ key: "power", label: "Güc" }, { key: "capacity", label: "Tutum" }] },
  AirConditioners:{ icon: Droplets,       label: "Kondisioner",           fields: [{ key: "power", label: "BTU" }, { key: "energyClass", label: "Enerji" }] },
  WaterHeaters:   { icon: Droplets,       label: "Su Qızdırıcısı",        fields: [{ key: "capacity", label: "Tutum" }] },
  HomeDecor:      { icon: Lamp,           label: "Ev Dekor",              fields: [{ key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  Lighting:       { icon: Lamp,           label: "İşıqlandırma",          fields: [{ key: "power", label: "Güc" }, { key: "lightType", label: "İşıq növü" }] },
  HomeTextiles:   { icon: Home,           label: "Tekstil",               fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }] },
  Kitchenware:    { icon: UtensilsCrossed, label: "Mətbəx Qabı",          fields: [{ key: "material", label: "Material" }] },
  BathAccessories:{ icon: Bath,           label: "Hamam Aksesuar",        fields: [{ key: "material", label: "Material" }] },
  LivingRoomFurniture:{ icon: Sofa,       label: "Qonaq Otağı",           fields: [{ key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  BedroomFurniture:{ icon: Bed,           label: "Yataq Otağı",           fields: [{ key: "material", label: "Material" }, { key: "dimensions", label: "Ölçülər" }] },
  KitchenFurniture:{ icon: UtensilsCrossed, label: "Mətbəx Mebeli",       fields: [{ key: "material", label: "Material" }] },
  OfficeFurniture: { icon: Monitor,       label: "Ofis Mebeli",           fields: [{ key: "material", label: "Material" }] },
  GardenFurniture: { icon: Tent,          label: "Bağ Mebeli",            fields: [{ key: "material", label: "Material" }] },
  WomensTops:     { icon: Shirt,          label: "Q. Üst Geyim",          fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  WomensBottoms:  { icon: Shirt,          label: "Q. Alt Geyim",          fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  WomensCasual:   { icon: Shirt,          label: "Q. Gündəlik",           fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  WomensSport:    { icon: Shirt,          label: "Q. İdman",              fields: [{ key: "size", label: "Ölçü" }] },
  WomensFormal:   { icon: Shirt,          label: "Q. Rəsmi",              fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  WomensUnderwear:{ icon: Shirt,          label: "Q. Alt Paltarı",        fields: [{ key: "size", label: "Ölçü" }] },
  MensTops:       { icon: Shirt,          label: "K. Üst Geyim",          fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  MensBottoms:    { icon: Shirt,          label: "K. Alt Geyim",          fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  MensCasual:     { icon: Shirt,          label: "K. Gündəlik",           fields: [{ key: "size", label: "Ölçü" }] },
  MensSport:      { icon: Shirt,          label: "K. İdman",              fields: [{ key: "size", label: "Ölçü" }] },
  MensFormal:     { icon: Shirt,          label: "K. Rəsmi",              fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  MensUnderwear:  { icon: Shirt,          label: "K. Alt Paltarı",        fields: [{ key: "size", label: "Ölçü" }] },
  SportsShoes:    { icon: Footprints,     label: "İdman Ayaqqabısı",      fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  ClassicShoes:   { icon: Footprints,     label: "Klassik Ayaqqabı",      fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  CasualShoes:    { icon: Footprints,     label: "Gündəlik Ayaqqabı",     fields: [{ key: "size", label: "Ölçü" }] },
  Sandals:        { icon: Footprints,     label: "Sandalet",              fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  Bags:           { icon: BagIcon,        label: "Çantalar",              fields: [{ key: "material", label: "Material" }, { key: "color", label: "Rəng" }] },
  Watches:        { icon: Watch,          label: "Saatlar",               fields: [{ key: "material", label: "Material" }] },
  Sunglasses:     { icon: Watch,          label: "Gün Eynəkləri",         fields: [{ key: "frameType", label: "Çərçivə" }, { key: "uvProtection", label: "UV" }] },
  Jewelry:        { icon: Watch,          label: "Zərgərlik",             fields: [{ key: "material", label: "Material" }] },
  Belts:          { icon: Package,        label: "Kəmərlər",              fields: [{ key: "material", label: "Material" }, { key: "size", label: "Ölçü" }] },
  Makeup:         { icon: Flower2,        label: "Makiyaj",               fields: [{ key: "volume", label: "Həcm" }, { key: "color", label: "Çalar" }] },
  Skincare:       { icon: Flower2,        label: "Dəri Qulluğu",         fields: [{ key: "volume", label: "Həcm" }, { key: "skinType", label: "Dəri Növü" }] },
  HairCare:       { icon: Flower2,        label: "Saç Qulluğu",          fields: [{ key: "volume", label: "Həcm" }] },
  Fragrance:      { icon: Flower2,        label: "Parfümeriya",           fields: [{ key: "volume", label: "Həcm" }] },
  MenGrooming:    { icon: Flower2,        label: "Kişi Baxım",           fields: [{ key: "volume", label: "Həcm" }] },
  Hygiene:        { icon: Flower2,        label: "Gigiyena",              fields: [{ key: "volume", label: "Həcm" }] },
  KidsClothingNew:{ icon: Baby,           label: "Uşaq Geyimi",           fields: [{ key: "size", label: "Ölçü" }, { key: "ageRange", label: "Yaş" }] },
  Toys:           { icon: Baby,           label: "Oyuncaqlar",            fields: [{ key: "ageRange", label: "Yaş həddi" }] },
  Strollers:      { icon: Baby,           label: "Uşaq Arabası",          fields: [{ key: "maxWeight", label: "Maks. çəki" }] },
  BabyFeeding:    { icon: Baby,           label: "Qidalanma",             fields: [{ key: "volume", label: "Həcm" }] },
  SchoolSupplies: { icon: BookOpen,       label: "Məktəb Ləvazimatı",     fields: [{ key: "material", label: "Material" }] },
  FitnessEquipment:{ icon: Dumbbell,      label: "Fitness",               fields: [{ key: "maxWeight", label: "Maks. yük" }, { key: "dimensions", label: "Ölçülər" }] },
  Camping:        { icon: Tent,           label: "Kampinq",               fields: [{ key: "material", label: "Material" }, { key: "capacity", label: "Tutum" }] },
  Bicycles:       { icon: Bike,           label: "Velosipedlər",          fields: [{ key: "frameSize", label: "Çərçivə" }, { key: "gearCount", label: "Vites" }] },
  SportsApparel:  { icon: Shirt,          label: "İdman Geyimi",          fields: [{ key: "size", label: "Ölçü" }, { key: "material", label: "Material" }] },
  SportsAccessories:{ icon: Package,      label: "İdman Aksesuar",        fields: [{ key: "material", label: "Material" }] },
  AutoAccessories:{ icon: Car,            label: "Avto Aksesuar",         fields: [{ key: "compatibility", label: "Uyğunluq" }] },
  AutoElectronics:{ icon: Cpu,            label: "Avto Elektronika",      fields: [{ key: "compatibility", label: "Uyğunluq" }] },
  SpareParts:     { icon: Wrench,         label: "Ehtiyat Hissəsi",       fields: [{ key: "compatibility", label: "Uyğunluq" }] },
  AutoChemicals:  { icon: Droplets,       label: "Yağ/Kimyəvi",           fields: [{ key: "viscosity", label: "Özlülük" }, { key: "volume", label: "Həcm" }] },
  GiftSets:       { icon: Gift,           label: "Hədiyyə Setləri",       fields: [{ key: "setCount", label: "Dəst sayı" }] },
  Souvenirs:      { icon: Gift,           label: "Suvenirlər",            fields: [{ key: "material", label: "Material" }] },
  TrendingProducts:{ icon: Gift,          label: "Trending",              fields: [{ key: "material", label: "Material" }] },
  BooksHobbies:   { icon: BookOpen,       label: "Kitab/Hobbi",           fields: [{ key: "pageCount", label: "Səhifə" }, { key: "author", label: "Müəllif" }] },
};

// ─────────────────────────────────────────────────────────────────────────────
// SpecPanel — Desktop cədvəlindəki açılan panel
// ─────────────────────────────────────────────────────────────────────────────
const SpecPanel = ({ product }) => {
  const cfg = CATEGORY_CONFIG[product.category];
  if (!cfg) return null;

  const specs = cfg.fields
    .map((f) => ({ label: f.label, value: product[f.key] }))
    .filter((s) => s.value !== undefined && s.value !== "" && s.value !== null);

  if (specs.length === 0) return null;

  return (
    <tr>
      <td colSpan="6" style={{ padding: 0 }}>
        <div style={{ background: "linear-gradient(135deg, #fff5f6 0%, #fff 100%)", borderLeft: "4px solid #E8192C", borderBottom: "1px solid #fde8ea", padding: "14px 20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            {React.createElement(cfg.icon, { size: 13, color: "#E8192C" })}
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#E8192C" }}>
              {cfg.label} — Spesifikasiyalar
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 7 }}>
            {specs.map((s) => (
              <div key={s.label} style={{ background: "white", borderRadius: 10, padding: "9px 11px", border: "1px solid #fde8ea" }}>
                <p style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#bbb", margin: "0 0 3px" }}>{s.label}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", margin: 0, wordBreak: "break-word" }}>
                  {typeof s.value === "boolean" ? (s.value ? "✓ Bəli" : "✗ Xeyr") : s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, bg, sub }) => (
  <div style={{ background: bg, borderRadius: 18, padding: "18px 20px", color: "white", position: "relative", overflow: "hidden", boxShadow: "0 6px 20px rgba(232,25,44,0.15)" }}>
    <div style={{ position: "absolute", right: -14, top: -14, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, margin: 0 }}>{title}</p>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} />
        </div>
      </div>
      <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", margin: 0 }}>{value}</p>
      {sub && <p style={{ fontSize: 10, opacity: 0.7, margin: "3px 0 0" }}>{sub}</p>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MobileProductCard
// ─────────────────────────────────────────────────────────────────────────────
const MobileProductCard = ({ product, onEdit, onDelete, expandedId, toggleExpand }) => {
  const cfg = CATEGORY_CONFIG[product.category];
  const CatIcon = cfg?.icon || Sparkles;
  const isOpen = expandedId === product._id;

  const specs = cfg
    ? cfg.fields
        .map((f) => ({ label: f.label, value: product[f.key] }))
        .filter((s) => s.value !== undefined && s.value !== "" && s.value !== null)
    : [];

  return (
    <div style={{ background: "white", borderRadius: 14, border: "1px solid #eee", marginBottom: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 10, fontFamily: "monospace", color: "#bbb", margin: "0 0 3px" }}>
              #{product._id?.slice(-6).toUpperCase()}
            </p>
            <p style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14, margin: "0 0 7px", lineHeight: 1.3, wordBreak: "break-word" }}>
              {product.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 20, background: "#fff0f1", color: "#E8192C", fontSize: 10, fontWeight: 700 }}>
                <CatIcon size={9} />{cfg?.label || product.category}
              </span>
              <span style={{ fontWeight: 900, color: "#E8192C", fontSize: 15 }}>{product.price} ₼</span>
            </div>
            <div style={{ marginTop: 5, display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}>Satış:</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#22c55e" }}>{product.salesCount || 0} ədəd</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <button onClick={() => onEdit(product._id)}
              style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9, border: "1.5px solid #fdd", background: "#fff0f1", color: "#E8192C", cursor: "pointer" }}>
              <FaRegEdit size={13} />
            </button>
            <button onClick={() => onDelete(product._id)}
              style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9, border: "none", background: "#E8192C", color: "white", cursor: "pointer", boxShadow: "0 3px 10px rgba(232,25,44,0.3)" }}>
              <MdDeleteSweep size={15} />
            </button>
          </div>
        </div>

        {specs.length > 0 && (
          <button onClick={() => toggleExpand(product._id)}
            style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 11px", borderRadius: 20, border: `1.5px solid ${isOpen ? "#E8192C" : "#fdd"}`, background: isOpen ? "#E8192C" : "#fff0f1", color: isOpen ? "white" : "#E8192C", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer" }}>
            <CatIcon size={9} /> Spec {isOpen ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
          </button>
        )}
      </div>

      {isOpen && specs.length > 0 && (
        <div style={{ background: "linear-gradient(135deg, #fff5f6, #fff)", borderTop: "1px solid #fde8ea", borderLeft: "4px solid #E8192C", padding: "12px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 7 }}>
            {specs.map((s) => (
              <div key={s.label} style={{ background: "white", borderRadius: 9, padding: "8px 10px", border: "1px solid #fde8ea" }}>
                <p style={{ fontSize: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#bbb", margin: "0 0 3px" }}>{s.label}</p>
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

// ─────────────────────────────────────────────────────────────────────────────
// AdminProducts — ANA KOMPONENT
// ─────────────────────────────────────────────────────────────────────────────
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
  const averagePrice = products.reduce((acc, p) => acc + (p.price || 0), 0) / (totalProducts || 1);
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

  // ── Yüklənmə ────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f8f8f8", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "4px solid #fdd", borderTopColor: "#E8192C", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#E8192C", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>Yüklənir...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Xəta ────────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 14, padding: 20, textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff0f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 24 }}>⚠️</span>
      </div>
      <p style={{ color: "#E8192C", fontSize: 16, fontWeight: 700, margin: 0 }}>Məhsullar yüklənə bilmədi</p>
      <p style={{ color: "#999", fontSize: 13, margin: 0 }}>{error?.data?.message || error?.error || "Şəbəkə xətası"}</p>
      <button onClick={() => refetch()}
        style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "#E8192C", color: "white", fontWeight: 700, cursor: "pointer" }}>
        Yenidən cəhd et
      </button>
    </div>
  );

  const storeLink = storeSlug ? `${window.location.origin}/store/${storeSlug}` : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .adp-header { background: #E8192C; padding: 0 32px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 30; box-shadow: 0 2px 16px rgba(232,25,44,0.28); }
        .adp-content { max-width: 1180px; margin: 0 auto; padding: 28px 16px; width: 100%; }
        .adp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 22px; }
        .adp-card { background: white; border-radius: 20px; box-shadow: 0 2px 14px rgba(0,0,0,0.06); border: 1px solid #eee; overflow: hidden; }
        .adp-chart-wrap { background: white; border-radius: 20px; padding: 24px 28px; box-shadow: 0 2px 14px rgba(0,0,0,0.06); margin-bottom: 22px; border: 1px solid #eee; }

        /* Desktop table */
        .adp-desktop { display: block; }
        .adp-mobile  { display: none; }

        /* Table row hover */
        .adp-tr:hover { background: #fafafa !important; }
        .adp-tr-open { background: #fff8f8 !important; }

        @media (max-width: 1024px) { .adp-header{padding:0 20px;} .adp-content{padding:22px 14px;} .adp-chart-wrap{padding:20px 22px;} }
        @media (max-width: 768px) {
          .adp-header{padding:0 14px;height:54px;}
          .adp-brand-sub{display:none;} .adp-create-text{display:none;}
          .adp-content{padding:14px 10px;}
          .adp-stats{grid-template-columns:1fr 1fr;gap:10px;}
          .adp-stats>div:last-child{grid-column:1/-1;}
          .adp-chart-wrap{padding:16px 14px;border-radius:16px;}
          .adp-desktop{display:none !important;}
          .adp-mobile{display:block !important; padding:10px;}
          .adp-store-link{flex-wrap:wrap;}
        }
        @media (max-width: 480px) {
          .adp-stats{grid-template-columns:1fr;}
          .adp-stats>div:last-child{grid-column:auto;}
          .adp-header{padding:0 10px;}
          .adp-content{padding:10px 8px;}
        }
      `}</style>

      {/* HEADER */}
      <div className="adp-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "white", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
            <span style={{ color: "#E8192C", fontWeight: 900, fontSize: 17, lineHeight: 1 }}>B</span>
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 900, fontSize: 16, margin: 0, letterSpacing: "-0.01em" }}>BRENDEX</p>
            <p className="adp-brand-sub" style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Admin Panel</p>
          </div>
        </div>
        <button onClick={handleCreate}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "white", color: "#E8192C", border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 3px 10px rgba(0,0,0,0.12)" }}>
          <PlusCircle size={14} />
          <span className="adp-create-text">Yeni Məhsul</span>
        </button>
      </div>

      <div className="adp-content">
        {/* Başlıq */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ width: 38, height: 38, background: "#fff0f1", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #fdd", flexShrink: 0 }}>
              <Store size={18} color="#E8192C" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", margin: 0, letterSpacing: "-0.02em" }}>
                {currentStoreName} — Məhsullar
              </h1>
              <p style={{ color: "#999", fontSize: 12, margin: "2px 0 0" }}>
                Yalnız sizin mağazanızın məhsulları
              </p>
            </div>
          </div>

          {storeLink && (
            <div className="adp-store-link" style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff8f8", border: "1.5px solid #fdd", borderRadius: 11, padding: "10px 14px", marginTop: 12 }}>
              <Store size={13} color="#E8192C" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#bbb", whiteSpace: "nowrap" }}>Mağaza:</span>
              <a href={storeLink} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, fontWeight: 700, color: "#E8192C", textDecoration: "none", wordBreak: "break-all", flex: 1 }}>
                {storeLink}
              </a>
              <button onClick={() => navigator.clipboard.writeText(storeLink)}
                style={{ padding: "4px 10px", borderRadius: 8, border: "1.5px solid #fdd", background: "#fff0f1", color: "#E8192C", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                Kopyala
              </button>
            </div>
          )}
        </div>

        {/* Statistika */}
        <div className="adp-stats">
          <StatCard title="Məhsul Sayı"  value={totalProducts}             icon={Package}   bg="linear-gradient(135deg, #E8192C, #ff4f61)"  sub="Aktiv məhsullar" />
          <StatCard title="Orta Qiymət" value={`${averagePrice.toFixed(2)} ₼`} icon={DollarSign} bg="linear-gradient(135deg, #bf1124, #E8192C)" sub="Bütün məhsullar" />
          <StatCard title="Ümumi Satış" value={totalSales}                 icon={BarChart3} bg="linear-gradient(135deg, #1c1c2e, #2e2e42)"   sub="Ədəd" />
        </div>

        {/* Chart */}
        {products.length > 0 && (
          <div className="adp-chart-wrap">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ background: "#fff0f1", borderRadius: 9, padding: 7, flexShrink: 0 }}>
                <BarChart3 size={18} color="#E8192C" />
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>Satış Statistikası</h2>
            </div>
            <ChartComponent labels={productNames} dataPoints={sales} gradientFrom="#E8192C" gradientTo="#ff9ca5" />
          </div>
        )}

        {/* Məhsul cədvəli */}
        <div className="adp-card">
          {/* Başlıq */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 8, background: "#fafafa" }}>
            <div style={{ background: "#fff0f1", borderRadius: 9, padding: 6 }}>
              <ShoppingBag size={16} color="#E8192C" />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>Məhsullarım</h2>
            <span style={{ marginLeft: "auto", background: "#fff0f1", color: "#E8192C", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>
              {totalProducts} məhsul
            </span>
          </div>

          {/* ── Desktop cədvəl ── */}
          <div className="adp-desktop" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  {["ID", "Məhsul", "Qiymət", "Satış", "Kateqoriya", "Əməliyyat"].map((h, i) => (
                    <th key={h} style={{ padding: "11px 18px", textAlign: i === 5 ? "center" : "left", fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#bbb", background: "#fafafa", whiteSpace: "nowrap" }}>{h}</th>
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
                      <tr className={`adp-tr${isOpen ? " adp-tr-open" : ""}`}
                        style={{ borderBottom: "1px solid #f5f5f5", background: isOpen ? "#fff8f8" : "white", transition: "background 0.15s" }}>
                        <td style={{ padding: "13px 18px", fontSize: 10, fontFamily: "monospace", color: "#bbb", whiteSpace: "nowrap" }}>
                          #{product._id?.slice(-6).toUpperCase()}
                        </td>
                        <td style={{ padding: "13px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 13 }}>{product.name}</span>
                            <button onClick={() => toggleExpand(product._id)}
                              style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 20, border: `1.5px solid ${isOpen ? "#E8192C" : "#fdd"}`, background: isOpen ? "#E8192C" : "#fff0f1", color: isOpen ? "white" : "#E8192C", fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", whiteSpace: "nowrap" }}>
                              <CatIcon size={8} /> SPEC {isOpen ? <ChevronUp size={8} /> : <ChevronDown size={8} />}
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: "13px 18px", fontWeight: 900, color: "#E8192C", fontSize: 14, whiteSpace: "nowrap" }}>
                          {product.price} ₼
                        </td>
                        <td style={{ padding: "13px 18px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 9px", borderRadius: 20, background: (product.salesCount || 0) > 0 ? "#f0fdf4" : "#fafafa", color: (product.salesCount || 0) > 0 ? "#16a34a" : "#bbb", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>
                            {product.salesCount || 0} ədəd
                          </span>
                        </td>
                        <td style={{ padding: "13px 18px" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "#fff0f1", color: "#E8192C", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                            <CatIcon size={10} />{cfg?.label || product.category}
                          </span>
                        </td>
                        <td style={{ padding: "13px 18px", textAlign: "center" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: 7 }}>
                            <button onClick={() => handleEdit(product._id)}
                              style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9, border: "1.5px solid #fdd", background: "#fff0f1", color: "#E8192C", cursor: "pointer" }}>
                              <FaRegEdit size={13} />
                            </button>
                            <button onClick={() => handleDelete(product._id)}
                              style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9, border: "none", background: "#E8192C", color: "white", cursor: "pointer", boxShadow: "0 3px 10px rgba(232,25,44,0.3)" }}>
                              <MdDeleteSweep size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isOpen && <SpecPanel product={product} />}
                    </React.Fragment>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "50px 20px", color: "#ccc" }}>
                      <Package size={44} style={{ margin: "0 auto 10px", opacity: 0.25, display: "block" }} />
                      <p style={{ fontWeight: 600, margin: "0 0 4px" }}>Heç bir məhsul tapılmadı</p>
                      <p style={{ fontSize: 13, margin: 0 }}>Yeni məhsul əlavə etmək üçün yuxarıdakı düyməyə basın</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobil kartlar ── */}
          <div className="adp-mobile">
            {products.length > 0 ? (
              products.map((product) => (
                <MobileProductCard
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  expandedId={expandedId}
                  toggleExpand={toggleExpand}
                />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#ccc" }}>
                <Package size={40} style={{ margin: "0 auto 10px", opacity: 0.25, display: "block" }} />
                <p style={{ fontWeight: 600, margin: "0 0 4px" }}>Heç bir məhsul tapılmadı</p>
                <p style={{ fontSize: 13, margin: 0 }}>Yeni məhsul əlavə etmək üçün yuxarıdakı düyməyə basın</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;