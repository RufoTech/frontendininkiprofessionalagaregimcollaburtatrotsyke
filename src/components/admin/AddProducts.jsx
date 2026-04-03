"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  useAddProductMutation,
  useGetProductsQuery,
} from "../../redux/api/productsApi";
import {
  Smartphone, Laptop, Camera, Headphones, Gamepad2, Tablet,
  Shirt, Home, Flower2, Dumbbell, Car, Upload, X,
  Store, ChevronRight, ChevronDown, ChevronUp,
  Tv, Wifi, Cpu, Plug, Package,
  Monitor, Printer, HardDrive, Sofa, Bed, UtensilsCrossed,
  Footprints, Watch, ShoppingBag, Baby, Bike, Gift,
  Wrench, Droplets, Lamp, Bath, BookOpen, Tent,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 15 ANA KATEQORİYA + SUBKATEQORIYALAR
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_TREE = [
  {
    parentValue: "Electronics", parentLabel: "Elektronika", parentIcon: Tv,
    subs: [
      { value: "Electronics_TV",       label: "TV və Audio Sistemlər", icon: Tv },
      { value: "Electronics_Photo",    label: "Foto və Video Texnika",  icon: Camera },
      { value: "Electronics_Console",  label: "Oyun Konsolları",        icon: Gamepad2 },
      { value: "Electronics_SmartHome",label: "Smart Home Cihazlar",    icon: Wifi },
      { value: "Electronics_Gadgets",  label: "Gadgetlər",              icon: Cpu },
      { value: "Electronics_Acc",      label: "Elektronik Aksesuarlar", icon: Plug },
    ],
  },
  {
    parentValue: "Phones", parentLabel: "Telefonlar", parentIcon: Smartphone,
    subs: [
      { value: "Phones_Smartphone",label: "Smartfonlar",           icon: Smartphone },
      { value: "Phones_Basic",     label: "Düyməli Telefonlar",    icon: Smartphone },
      { value: "Phones_Headphones",label: "Qulaqlıqlar",           icon: Headphones },
      { value: "Phones_Cables",    label: "Kabellər və Adapterlər",icon: Plug },
      { value: "Phones_Powerbank", label: "Powerbank",             icon: Package },
      { value: "Phones_Acc",       label: "Telefon Aksesuarları",  icon: Package },
    ],
  },
  {
    parentValue: "Computers", parentLabel: "Kompüter/Ofis", parentIcon: Laptop,
    subs: [
      { value: "Computers_Laptop",    label: "Noutbuklar",               icon: Laptop },
      { value: "Computers_Desktop",   label: "Stolüstü Kompüterlər",     icon: Monitor },
      { value: "Computers_Monitor",   label: "Monitorlar",               icon: Monitor },
      { value: "Computers_Printer",   label: "Printer və Skanerlər",     icon: Printer },
      { value: "Computers_OfficeAcc", label: "Ofis Aksesuarları",        icon: Package },
      { value: "Computers_Parts",     label: "Komponentlər (RAM, SSD…)", icon: HardDrive },
    ],
  },
  {
    parentValue: "HomeAppliances", parentLabel: "Məişət Texnikası", parentIcon: Home,
    subs: [
      { value: "HomeAppliances_Large",   label: "Böyük Məişət Texnikası", icon: Home },
      { value: "HomeAppliances_Small",   label: "Kiçik Məişət Texnikası", icon: Home },
      { value: "HomeAppliances_Kitchen", label: "Mətbəx Texnikası",       icon: UtensilsCrossed },
      { value: "HomeAppliances_Climate", label: "Kondisioner/İsitmə",     icon: Droplets },
      { value: "HomeAppliances_Water",   label: "Su Qızdırıcıları",       icon: Droplets },
    ],
  },
  {
    parentValue: "HomeDecor", parentLabel: "Ev və Dekor", parentIcon: Lamp,
    subs: [
      { value: "HomeDecor_Deco",    label: "Dekorasiya",          icon: Lamp },
      { value: "HomeDecor_Light",   label: "İşıqlandırma",        icon: Lamp },
      { value: "HomeDecor_Textile", label: "Ev Tekstili",         icon: Home },
      { value: "HomeDecor_Kitchen", label: "Mətbəx Qabları",      icon: UtensilsCrossed },
      { value: "HomeDecor_Bath",    label: "Hamam Aksesuarları",  icon: Bath },
    ],
  },
  {
    parentValue: "Furniture", parentLabel: "Mebel", parentIcon: Sofa,
    subs: [
      { value: "Furniture_Living",  label: "Qonaq Otağı Mebeli", icon: Sofa },
      { value: "Furniture_Bedroom", label: "Yataq Otağı Mebeli", icon: Bed },
      { value: "Furniture_Kitchen", label: "Mətbəx Mebeli",      icon: UtensilsCrossed },
      { value: "Furniture_Office",  label: "Ofis Mebeli",        icon: Monitor },
      { value: "Furniture_Garden",  label: "Bağ Mebeli",         icon: Tent },
    ],
  },
  {
    parentValue: "WomenClothing", parentLabel: "Qadın Geyimi", parentIcon: Shirt,
    subs: [
      { value: "WomenClothing_Outer",  label: "Üst Geyim",      icon: Shirt },
      { value: "WomenClothing_Inner",  label: "Alt Geyim",      icon: Shirt },
      { value: "WomenClothing_Casual", label: "Gündəlik Geyim", icon: Shirt },
      { value: "WomenClothing_Sport",  label: "İdman Geyimi",   icon: Shirt },
      { value: "WomenClothing_Formal", label: "Rəsmi Geyim",    icon: Shirt },
      { value: "WomenClothing_Under",  label: "Alt Paltarları", icon: Shirt },
    ],
  },
  {
    parentValue: "MenClothing", parentLabel: "Kişi Geyimi", parentIcon: Shirt,
    subs: [
      { value: "MenClothing_Outer",  label: "Üst Geyim",      icon: Shirt },
      { value: "MenClothing_Inner",  label: "Alt Geyim",      icon: Shirt },
      { value: "MenClothing_Casual", label: "Gündəlik Geyim", icon: Shirt },
      { value: "MenClothing_Sport",  label: "İdman Geyimi",   icon: Shirt },
      { value: "MenClothing_Formal", label: "Rəsmi Geyim",    icon: Shirt },
      { value: "MenClothing_Under",  label: "Alt Paltarları", icon: Shirt },
    ],
  },
  {
    parentValue: "Shoes", parentLabel: "Ayaqqabı", parentIcon: Footprints,
    subs: [
      { value: "Shoes_Sport",   label: "İdman Ayaqqabısı",  icon: Footprints },
      { value: "Shoes_Classic", label: "Klassik Ayaqqabı",  icon: Footprints },
      { value: "Shoes_Casual",  label: "Gündəlik Ayaqqabı", icon: Footprints },
      { value: "Shoes_Sandal",  label: "Sandalet/Yay",      icon: Footprints },
    ],
  },
  {
    parentValue: "Accessories", parentLabel: "Aksesuarlar", parentIcon: Watch,
    subs: [
      { value: "Accessories_Bag",        label: "Çantalar",       icon: ShoppingBag },
      { value: "Accessories_Watch",      label: "Saatlar",        icon: Watch },
      { value: "Accessories_Sunglasses", label: "Gün Eynəkləri", icon: Watch },
      { value: "Accessories_Jewelry",    label: "Zərgərlik",      icon: Watch },
      { value: "Accessories_Belt",       label: "Kəmərlər",       icon: Package },
    ],
  },
  {
    parentValue: "Beauty", parentLabel: "Gözəllik/Kosmetika", parentIcon: Flower2,
    subs: [
      { value: "Beauty_Makeup",  label: "Makiyaj",              icon: Flower2 },
      { value: "Beauty_Skin",    label: "Dəriyə Qulluq",       icon: Flower2 },
      { value: "Beauty_Hair",    label: "Saça Qulluq",         icon: Flower2 },
      { value: "Beauty_Perfume", label: "Parfümeriya",         icon: Flower2 },
      { value: "Beauty_Men",     label: "Kişi Baxım Məhsulları",icon: Flower2 },
      { value: "Beauty_Hygiene", label: "Gigiyena",             icon: Flower2 },
    ],
  },
  {
    parentValue: "KidsAndMom", parentLabel: "Uşaq və Ana", parentIcon: Baby,
    subs: [
      { value: "KidsAndMom_Clothing", label: "Uşaq Geyimləri",       icon: Baby },
      { value: "KidsAndMom_Toys",     label: "Oyuncaqlar",           icon: Baby },
      { value: "KidsAndMom_Stroller", label: "Uşaq Arabaları",       icon: Baby },
      { value: "KidsAndMom_Food",     label: "Qidalanma Məhsulları", icon: Baby },
      { value: "KidsAndMom_School",   label: "Məktəb Ləvazimatları", icon: BookOpen },
    ],
  },
  {
    parentValue: "Sports", parentLabel: "İdman/Outdoor", parentIcon: Dumbbell,
    subs: [
      { value: "Sports_Fitness",  label: "Fitness Avadanlıqları", icon: Dumbbell },
      { value: "Sports_Camping",  label: "Kampinq",               icon: Tent },
      { value: "Sports_Bicycle",  label: "Velosipedlər",          icon: Bike },
      { value: "Sports_Clothing", label: "İdman Geyimi",          icon: Shirt },
      { value: "Sports_Acc",      label: "İdman Aksesuarları",    icon: Package },
    ],
  },
  {
    parentValue: "Automotive", parentLabel: "Avto Məhsullar", parentIcon: Car,
    subs: [
      { value: "Automotive_Acc",         label: "Avto Aksesuarlar",   icon: Car },
      { value: "Automotive_Electronics", label: "Avto Elektronika",   icon: Cpu },
      { value: "Automotive_Parts",       label: "Ehtiyat Hissələri",  icon: Wrench },
      { value: "Automotive_Oils",        label: "Yağlar/Kimyəvi",     icon: Droplets },
    ],
  },
  {
    parentValue: "Gifts", parentLabel: "Hədiyyə/Lifestyle", parentIcon: Gift,
    subs: [
      { value: "Gifts_Sets",     label: "Hədiyyə Setləri",    icon: Gift },
      { value: "Gifts_Souvenir", label: "Suvenirlər",         icon: Gift },
      { value: "Gifts_Trending", label: "Trending Məhsullar", icon: Gift },
      { value: "Gifts_Books",    label: "Kitablar/Hobbi",     icon: BookOpen },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// KATEQORİYAYA GÖRƏ TEXNİKİ SAHƏLƏR
// ─────────────────────────────────────────────────────────────────────────────
const SPEC_FIELDS = {
  Electronics_TV: [
    { name: "screenSize",   placeholder: "Ekran Ölçüsü (məs. 55 inch)" },
    { name: "resolution",   placeholder: "Çözümlülük (məs. 4K UHD)" },
    { name: "panelType",    placeholder: "Panel Növü (məs. OLED, QLED)" },
    { name: "connectivity", placeholder: "Bağlantı (məs. HDMI, Wi-Fi)" },
    { name: "smartTv",      placeholder: "Smart TV", type: "checkbox" },
  ],
  Electronics_Photo: [
    { name: "resolution",         placeholder: "Çözümlülük (məs. 24MP)" },
    { name: "opticalZoom",        placeholder: "Optik Zoom (məs. 3x)" },
    { name: "sensorType",         placeholder: "Sensor Növü (məs. APS-C)" },
    { name: "imageStabilization", placeholder: "Sabitləşdirmə (məs. OIS)" },
    { name: "videoResolution",    placeholder: "Video (məs. 4K 60fps)" },
  ],
  Electronics_Console: [
    { name: "cpu",                 placeholder: "CPU (məs. AMD Zen 2)" },
    { name: "gpu",                 placeholder: "GPU (məs. AMD RDNA 2)" },
    { name: "storage",             placeholder: "Yaddaş (məs. 825GB SSD)" },
    { name: "memory",              placeholder: "RAM (məs. 16GB GDDR6)" },
    { name: "supportedResolution", placeholder: "Çözümlülük (məs. 4K 120fps)" },
    { name: "connectivity",        placeholder: "Bağlantı (məs. Wi-Fi 6)" },
    { name: "controllerIncluded",  placeholder: "Controller Daxildir", type: "checkbox" },
  ],
  Electronics_SmartHome: [
    { name: "connectivity",   placeholder: "Bağlantı (məs. Zigbee, Wi-Fi)" },
    { name: "compatibility",  placeholder: "Uyğunluq (məs. Alexa, Google)" },
    { name: "power",          placeholder: "Güc (məs. 10W)" },
  ],
  Electronics_Gadgets: [
    { name: "connectivity",  placeholder: "Bağlantı (məs. Bluetooth 5.3)" },
    { name: "batteryLife",   placeholder: "Batareya (məs. 18 saat)" },
    { name: "compatibility", placeholder: "Uyğunluq (məs. iOS/Android)" },
  ],
  Electronics_Acc: [
    { name: "compatibility", placeholder: "Uyğunluq" },
    { name: "material",      placeholder: "Material" },
    { name: "color",         placeholder: "Rəng" },
  ],
  Phones_Smartphone: [
    { name: "screenSize",      placeholder: "Ekran Ölçüsü (məs. 6.7 inch)" },
    { name: "storage",         placeholder: "Yaddaş (məs. 256GB)" },
    { name: "ram",             placeholder: "RAM (məs. 8GB)" },
    { name: "frontCamera",     placeholder: "Ön Kamera (məs. 12MP)" },
    { name: "backCamera",      placeholder: "Arxa Kamera (məs. 48MP)" },
    { name: "battery",         placeholder: "Batareya (məs. 4500mAh)" },
    { name: "processor",       placeholder: "Prosessor (məs. Snapdragon 8 Gen 3)" },
    { name: "operatingSystem", placeholder: "OS (məs. Android 14, iOS 17)" },
  ],
  Phones_Basic: [
    { name: "battery",  placeholder: "Batareya (məs. 1500mAh)" },
    { name: "storage",  placeholder: "Yaddaş (məs. 32MB)" },
    { name: "simCount", placeholder: "SIM sayı (məs. Dual SIM)" },
  ],
  Phones_Headphones: [
    { name: "connectivity",      placeholder: "Bağlantı (məs. Bluetooth 5.3)" },
    { name: "batteryLife",       placeholder: "Batareya Ömrü (məs. 30 saat)" },
    { name: "noiseCancellation", placeholder: "Səs Ləğvi (məs. ANC)" },
    { name: "driverSize",        placeholder: "Driver Ölçüsü (məs. 40mm)" },
  ],
  Phones_Cables: [
    { name: "length",        placeholder: "Uzunluq (məs. 1m, 2m)" },
    { name: "compatibility", placeholder: "Uyğunluq (məs. USB-C, Lightning)" },
    { name: "maxCharge",     placeholder: "Maks. Şarj (məs. 100W)" },
  ],
  Phones_Powerbank: [
    { name: "capacity",  placeholder: "Tutum (məs. 20000mAh)" },
    { name: "maxCharge", placeholder: "Maks. Şarj (məs. 65W)" },
    { name: "portCount", placeholder: "Port Sayı (məs. 3 port)" },
  ],
  Phones_Acc: [
    { name: "compatibility", placeholder: "Uyğunluq" },
    { name: "material",      placeholder: "Material" },
    { name: "color",         placeholder: "Rəng" },
  ],
  Computers_Laptop: [
    { name: "screenSize",      placeholder: "Ekran (məs. 15.6 inch)" },
    { name: "storage",         placeholder: "Yaddaş (məs. 512GB SSD)" },
    { name: "ram",             placeholder: "RAM (məs. 16GB)" },
    { name: "gpu",             placeholder: "GPU (məs. RTX 4060, M3 Pro)" },
    { name: "camera",          placeholder: "Kamera (məs. 1080p)" },
    { name: "processor",       placeholder: "Prosessor (məs. Intel i7-13700H)" },
    { name: "batteryLife",     placeholder: "Batareya Ömrü (məs. 10 saat)" },
    { name: "operatingSystem", placeholder: "OS (məs. Windows 11, macOS)" },
  ],
  Computers_Desktop: [
    { name: "processor",       placeholder: "Prosessor (məs. Intel i9-13900)" },
    { name: "ram",             placeholder: "RAM (məs. 32GB DDR5)" },
    { name: "storage",         placeholder: "Yaddaş (məs. 1TB NVMe SSD)" },
    { name: "gpu",             placeholder: "GPU (məs. RTX 4070)" },
    { name: "operatingSystem", placeholder: "OS (məs. Windows 11)" },
  ],
  Computers_Monitor: [
    { name: "screenSize",  placeholder: "Ekran (məs. 27 inch)" },
    { name: "resolution",  placeholder: "Çözümlülük (məs. 4K, QHD)" },
    { name: "refreshRate", placeholder: "Yenilənmə (məs. 165Hz)" },
    { name: "panelType",   placeholder: "Panel Növü (məs. IPS, VA)" },
    { name: "connectivity",placeholder: "Bağlantı (məs. HDMI, DisplayPort)" },
  ],
  Computers_Printer: [
    { name: "printType",   placeholder: "Çap Növü (məs. Laser, Inkjet)" },
    { name: "resolution",  placeholder: "Keyfiyyət (məs. 1200dpi)" },
    { name: "connectivity",placeholder: "Bağlantı (məs. Wi-Fi, USB)" },
    { name: "colorPrint",  placeholder: "Rəngli Çap", type: "checkbox" },
  ],
  Computers_OfficeAcc: [
    { name: "compatibility", placeholder: "Uyğunluq" },
    { name: "connectivity",  placeholder: "Bağlantı (məs. USB, Bluetooth)" },
    { name: "color",         placeholder: "Rəng" },
  ],
  Computers_Parts: [
    { name: "partType",    placeholder: "Hissə Növü (məs. RAM, SSD, CPU)" },
    { name: "capacity",    placeholder: "Tutum/Sürət (məs. 16GB, 3200MHz)" },
    { name: "compatibility",placeholder: "Uyğunluq (məs. DDR4, PCIe 4.0)" },
  ],
  HomeAppliances_Large: [
    { name: "capacity",    placeholder: "Tutum (məs. 300L, 7kg)" },
    { name: "energyClass", placeholder: "Enerji Sinfi (məs. A++)" },
    { name: "dimensions",  placeholder: "Ölçülər (məs. 60x60x85cm)" },
    { name: "color",       placeholder: "Rəng" },
  ],
  HomeAppliances_Small: [
    { name: "power",      placeholder: "Güc (məs. 1500W)" },
    { name: "capacity",   placeholder: "Tutum (məs. 2L)" },
    { name: "dimensions", placeholder: "Ölçülər" },
    { name: "color",      placeholder: "Rəng" },
  ],
  HomeAppliances_Kitchen: [
    { name: "power",    placeholder: "Güc (məs. 1000W)" },
    { name: "capacity", placeholder: "Tutum (məs. 5L)" },
    { name: "material", placeholder: "Material" },
    { name: "color",    placeholder: "Rəng" },
  ],
  HomeAppliances_Climate: [
    { name: "power",       placeholder: "Güc (məs. 12000 BTU)" },
    { name: "coverage",    placeholder: "Əhatə Sahəsi (məs. 30m²)" },
    { name: "energyClass", placeholder: "Enerji Sinfi (məs. A++)" },
    { name: "inverter",    placeholder: "İnverter Texnologiyası", type: "checkbox" },
  ],
  HomeAppliances_Water: [
    { name: "capacity",    placeholder: "Tutum (məs. 80L)" },
    { name: "power",       placeholder: "Güc (məs. 2000W)" },
    { name: "energyClass", placeholder: "Enerji Sinfi (məs. B)" },
  ],
  HomeDecor_Deco:    [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
  HomeDecor_Light:   [{ name: "power", placeholder: "Güc (məs. 10W)" }, { name: "lightType", placeholder: "İşıq Növü (məs. LED)" }, { name: "color", placeholder: "Rəng temperaturu (məs. 4000K)" }],
  HomeDecor_Textile: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər (məs. 200x220cm)" }, { name: "color", placeholder: "Rəng" }],
  HomeDecor_Kitchen: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "setCount", placeholder: "Dəst Sayı (məs. 5 parça)" }],
  HomeDecor_Bath:    [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
  Furniture_Living:  [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }, { name: "seatingCapacity", placeholder: "Oturacaq Sayı" }],
  Furniture_Bedroom: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər (məs. 160x200cm)" }, { name: "color", placeholder: "Rəng" }],
  Furniture_Kitchen: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
  Furniture_Office:  [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "adjustable", placeholder: "Hündürlük Tənzimlənir", type: "checkbox" }],
  Furniture_Garden:  [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "weatherResistant", placeholder: "Hava Şəraiti Davamlı", type: "checkbox" }],
  WomenClothing_Outer:  [{ name: "size", placeholder: "Ölçü (XS/S/M/L/XL/XXL)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }, { name: "season", placeholder: "Mövsüm" }],
  WomenClothing_Inner:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  WomenClothing_Casual: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }, { name: "season", placeholder: "Mövsüm" }],
  WomenClothing_Sport:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material (məs. Nylon, Spandex)" }, { name: "color", placeholder: "Rəng" }],
  WomenClothing_Formal: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }, { name: "occasion", placeholder: "Mərasim növü" }],
  WomenClothing_Under:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material (məs. Pambıq 100%)" }, { name: "color", placeholder: "Rəng" }],
  MenClothing_Outer:  [{ name: "size", placeholder: "Ölçü (XS/S/M/L/XL/XXL)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }, { name: "season", placeholder: "Mövsüm" }],
  MenClothing_Inner:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  MenClothing_Casual: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }, { name: "season", placeholder: "Mövsüm" }],
  MenClothing_Sport:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  MenClothing_Formal: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }, { name: "occasion", placeholder: "Mərasim növü" }],
  MenClothing_Under:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material (məs. Pambıq 95%)" }, { name: "color", placeholder: "Rəng" }],
  Shoes_Sport:   [{ name: "size", placeholder: "Ölçü (36–46)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }, { name: "gender", placeholder: "Cins (Kişi/Qadın/Uşaq)" }],
  Shoes_Classic: [{ name: "size", placeholder: "Ölçü (36–46)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  Shoes_Casual:  [{ name: "size", placeholder: "Ölçü (36–46)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  Shoes_Sandal:  [{ name: "size", placeholder: "Ölçü (36–46)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  Accessories_Bag:        [{ name: "material", placeholder: "Material (məs. Dəri, Süet)" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
  Accessories_Watch:      [{ name: "material", placeholder: "Qayış Materia" }, { name: "waterResistant", placeholder: "Su Keçirməz", type: "checkbox" }, { name: "color", placeholder: "Rəng/Kənar rəngi" }],
  Accessories_Sunglasses: [{ name: "frameType", placeholder: "Çərçivə Növü (məs. Aviator)" }, { name: "uvProtection", placeholder: "UV Qoruma (məs. UV400)" }, { name: "color", placeholder: "Çərçivə Rəngi" }],
  Accessories_Jewelry:    [{ name: "material", placeholder: "Material (məs. Gümüş 925)" }, { name: "size", placeholder: "Ölçü (məs. 45cm)" }, { name: "color", placeholder: "Rəng" }],
  Accessories_Belt:       [{ name: "material", placeholder: "Material (məs. Orijinal Dəri)" }, { name: "size", placeholder: "Ölçü (məs. 95cm)" }, { name: "color", placeholder: "Rəng" }],
  Beauty_Makeup:   [{ name: "volume", placeholder: "Həcm/Çəki (məs. 30ml, 5g)" }, { name: "color", placeholder: "Çalar/Rəng" }, { name: "ingredients", placeholder: "Əsas Tərkib" }],
  Beauty_Skin:     [{ name: "volume", placeholder: "Həcm (məs. 50ml)" }, { name: "skinType", placeholder: "Dəri Növü (məs. Quru, Yağlı)" }, { name: "ingredients", placeholder: "Əsas Tərkib" }],
  Beauty_Hair:     [{ name: "volume", placeholder: "Həcm (məs. 250ml)" }, { name: "hairType", placeholder: "Saç Növü (məs. Quru saç)" }, { name: "ingredients", placeholder: "Əsas Tərkib" }],
  Beauty_Perfume:  [{ name: "volume", placeholder: "Həcm (məs. 100ml EDP)" }, { name: "scentType", placeholder: "Qoxu Ailəsi (məs. Floral)" }, { name: "gender", placeholder: "Cins (Kişi/Qadın/Uniseks)" }],
  Beauty_Men:      [{ name: "volume", placeholder: "Həcm (məs. 200ml)" }, { name: "ingredients", placeholder: "Əsas Tərkib" }, { name: "skinType", placeholder: "Dəri Növü" }],
  Beauty_Hygiene:  [{ name: "volume", placeholder: "Həcm (məs. 250ml)" }, { name: "ingredients", placeholder: "Əsas Tərkib" }, { name: "quantity", placeholder: "Miqdar/Ədəd (məs. 3x250ml)" }],
  KidsAndMom_Clothing: [{ name: "size", placeholder: "Ölçü (məs. 74, 3-4 yaş)" }, { name: "material", placeholder: "Material (məs. Pambıq 100%)" }, { name: "color", placeholder: "Rəng" }, { name: "ageRange", placeholder: "Yaş həddi" }],
  KidsAndMom_Toys:     [{ name: "ageRange", placeholder: "Yaş həddi (məs. 3-8 yaş)" }, { name: "material", placeholder: "Material (məs. ABS plastik)" }, { name: "dimensions", placeholder: "Ölçülər" }],
  KidsAndMom_Stroller: [{ name: "maxWeight", placeholder: "Maks. çəki (məs. 22kg)" }, { name: "dimensions", placeholder: "Açıq/Qatlanmış ölçülər" }, { name: "foldable", placeholder: "Qatlanır", type: "checkbox" }],
  KidsAndMom_Food:     [{ name: "volume", placeholder: "Həcm/Miqdar" }, { name: "ageRange", placeholder: "Uyğun yaş (məs. 0-6 ay)" }, { name: "ingredients", placeholder: "Əsas Materiallar" }],
  KidsAndMom_School:   [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
  Sports_Fitness:  [{ name: "maxWeight", placeholder: "Maks. yük (məs. 150kg)" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "material", placeholder: "Material" }],
  Sports_Camping:  [{ name: "material", placeholder: "Material (məs. Polyester)" }, { name: "capacity", placeholder: "Tutum/Ölçü (məs. 4 nəfər)" }, { name: "weight", placeholder: "Çəki (məs. 6.5 kg)" }],
  Sports_Bicycle:  [{ name: "frameSize", placeholder: "Çərçivə ölçüsü (məs. 29 inch)" }, { name: "gearCount", placeholder: "Vites sayı (məs. 21)" }, { name: "material", placeholder: "Çərçivə materia" }],
  Sports_Clothing: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material (məs. Dri-FIT)" }, { name: "color", placeholder: "Rəng" }],
  Sports_Acc:      [{ name: "compatibility", placeholder: "İdman növü uyğunluğu" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  Automotive_Acc:         [{ name: "compatibility", placeholder: "Avtomobil uyğunluğu (marka/model)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  Automotive_Electronics: [{ name: "compatibility", placeholder: "Avtomobil uyğunluğu" }, { name: "connectivity", placeholder: "Bağlantı (məs. GPS, Wi-Fi)" }, { name: "resolution", placeholder: "Kamera/Ekran çözümlülüyü" }],
  Automotive_Parts:       [{ name: "compatibility", placeholder: "Avtomobil uyğunluğu (marka/model/il)" }, { name: "partNumber", placeholder: "Hissə nömrəsi (OEM)" }, { name: "material", placeholder: "Material" }],
  Automotive_Oils:        [{ name: "viscosity", placeholder: "Özlülük (məs. 5W-30)" }, { name: "volume", placeholder: "Həcm (məs. 5 litr)" }, { name: "compatibility", placeholder: "Mühərrik uyğunluğu" }],
  Gifts_Sets:     [{ name: "setCount", placeholder: "Dəst miqdarı (məs. 5 məhsul)" }, { name: "material", placeholder: "Material/Qablaşdırma" }, { name: "color", placeholder: "Rəng" }],
  Gifts_Souvenir: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
  Gifts_Trending: [{ name: "compatibility", placeholder: "Uyğunluq" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
  Gifts_Books:    [{ name: "pageCount", placeholder: "Səhifə sayı" }, { name: "language", placeholder: "Dil (məs. Azərbaycanca)" }, { name: "author", placeholder: "Müəllif" }],
};

// Bütün spec açarlarını bir yerə toplayırıq
const ALL_SPEC_KEYS = [...new Set(
  Object.values(SPEC_FIELDS).flatMap(fields =>
    fields.map(f => f.name)
  )
)];

const inputStyle = {
  width: "100%", padding: "11px 14px",
  border: "1.5px solid #eee", borderRadius: 10,
  fontSize: 14, color: "#1a1a1a", background: "white",
  outline: "none", transition: "border-color 0.2s",
  boxSizing: "border-box",
};
const labelStyle = {
  display: "block", fontSize: 10, fontWeight: 800,
  textTransform: "uppercase", letterSpacing: "0.08em",
  color: "#999", marginBottom: 5,
};

// ─────────────────────────────────────────────────────────────────────────────
// ANA KOMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const AddProduct = () => {
  const { user } = useSelector((state) => state.userSlice);
  const storeName = user?.user?.sellerInfo?.storeName || user?.user?.name || "";

  const buildInitialState = () => {
    const base = {
      name: "", price: "", description: "",
      category: "", seller: storeName, stock: "", ratings: "",
    };
    ALL_SPEC_KEYS.forEach((k) => { base[k] = ""; });
    ["controllerIncluded", "cellular", "smartTv", "adjustable",
      "weatherResistant", "waterResistant", "foldable", "inverter",
      "colorPrint"].forEach((k) => { base[k] = false; });
    return base;
  };

  const [formData, setFormData] = useState(buildInitialState);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [step, setStep] = useState(1);
  const [openParent, setOpenParent] = useState(null);

  const [addProduct] = useAddProductMutation();
  const { refetch } = useGetProductsQuery();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 15) {
      setImageError("Maksimum 15 şəkil yükləyə bilərsiniz.");
      setImages([]);
    } else {
      setImageError("");
      setImages(files);
    }
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageError) return;
    if (images.length === 0) {
      Swal.fire({ title: "Xəta!", text: "Ən az 1 şəkil əlavə edin.", icon: "error", confirmButtonColor: "#E8192C" });
      return;
    }
    const form = new FormData();
    for (const key in formData) form.append(key, formData[key]);
    form.set("seller", storeName);
    images.forEach((file) => form.append("newImages", file));
    try {
      await addProduct(form).unwrap();
      Swal.fire({ title: "Uğurla əlavə edildi! 🎉", icon: "success", confirmButtonColor: "#E8192C" });
      await refetch();
      navigate("/admin/products");
      setFormData({ ...buildInitialState(), seller: storeName });
      setImages([]);
    } catch (error) {
      Swal.fire({ title: "Xəta!", text: error?.data?.message || error?.error || "Xəta baş verdi.", icon: "error", confirmButtonColor: "#E8192C" });
    }
  };

  const specFields = SPEC_FIELDS[formData.category] || [];
  const selectedCatParent = CATEGORY_TREE.find(p => p.subs.some(s => s.value === formData.category));
  const selectedCatSub = selectedCatParent?.subs.find(s => s.value === formData.category);
  const step1Valid = formData.name && formData.price && formData.category && formData.description && formData.stock;

  const STEPS = [
    { n: 1, label: "Ümumi" },
    { n: 2, label: "Texniki" },
    { n: 3, label: "Şəkillər" },
  ];

  const toggleParent = (pv) => {
    setOpenParent(prev => prev === pv ? null : pv);
  };

  const selectCategory = (subValue, parentValue) => {
    setFormData(prev => ({ ...prev, category: subValue }));
    // keep parent open so user can see what they picked
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .ap-header {
          background: #E8192C; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; position: sticky; top: 0; z-index: 40;
          box-shadow: 0 2px 16px rgba(232,25,44,0.3);
        }
        .ap-content { max-width: 820px; margin: 0 auto; padding: 28px 16px; }
        .ap-card { background: white; border-radius: 20px; padding: 28px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); border: 1px solid #eee; }
        .ap-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ap-span2 { grid-column: 1 / -1; }
        .ap-spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* Category accordion */
        .cat-parent-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 11px 14px; border-radius: 10px; border: 1.5px solid #eee;
          background: white; cursor: pointer; transition: all 0.18s;
          font-size: 13px; font-weight: 700; color: #444;
          margin-bottom: 4px;
        }
        .cat-parent-btn:hover { border-color: #E8192C; background: #fff5f6; color: #E8192C; }
        .cat-parent-btn.active { border-color: #E8192C; background: #fff0f1; color: #E8192C; }
        .cat-subs-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 7px; padding: 10px 4px 14px;
          animation: slideDown 0.22s ease;
        }
        .cat-sub-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 12px; border-radius: 9px;
          border: 1.5px solid #eee; background: white;
          cursor: pointer; transition: all 0.15s;
          font-size: 12px; font-weight: 600; color: #555; text-align: left;
        }
        .cat-sub-btn:hover { border-color: #E8192C; background: #fff5f6; color: #E8192C; }
        .cat-sub-btn.selected { border-color: #E8192C; background: #E8192C; color: white; }

        .ap-input:focus  { border-color: #E8192C !important; box-shadow: 0 0 0 3px rgba(232,25,44,0.08) !important; }
        .ap-input { transition: border-color 0.18s, box-shadow 0.18s; }

        /* Steps */
        .steps-wrap { display: flex; align-items: center; justify-content: center; margin-bottom: 24px; gap: 0; }
        .step-dot { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; flex-shrink: 0; cursor: pointer; border: none; }
        .step-line { width: 52px; height: 2px; flex-shrink: 0; }
        .step-label { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; text-align: center; margin-top: 4px; }

        /* Buttons */
        .btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 11px 24px; border-radius: 10px; border: none; background: #E8192C; color: white; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(232,25,44,0.28); transition: opacity 0.15s; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-primary:hover:not(:disabled) { opacity: 0.88; }
        .btn-secondary { display: inline-flex; align-items: center; gap: 6px; padding: 11px 22px; border-radius: 10px; border: 1.5px solid #eee; background: white; color: #777; font-weight: 700; font-size: 14px; cursor: pointer; }

        .img-upload-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 40px 16px; border: 2px dashed #fcc; border-radius: 16px; cursor: pointer; background: #fafafa; transition: background 0.15s; }
        .img-upload-zone:hover { background: #fff5f6; border-color: #E8192C; }

        /* Responsive */
        @media (max-width: 768px) {
          .ap-header { padding: 0 16px; height: 54px; }
          .ap-brand-sub { display: none; }
          .ap-back-text { display: none; }
          .ap-content { padding: 16px 12px; }
          .ap-card { padding: 20px 16px; }
          .ap-grid2 { grid-template-columns: 1fr; }
          .ap-span2 { grid-column: 1; }
          .ap-spec-grid { grid-template-columns: 1fr; }
          .cat-subs-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
          .step-line { width: 32px; }
          .footer-row { flex-direction: column; }
          .footer-row .btn-primary, .footer-row .btn-secondary { width: 100%; justify-content: center; }
        }
        @media (max-width: 480px) {
          .cat-subs-grid { grid-template-columns: 1fr 1fr; }
          .steps-wrap .step-line { width: 20px; }
        }
      `}</style>

      {/* HEADER */}
      <div className="ap-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "white", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#E8192C", fontWeight: 900, fontSize: 17, lineHeight: 1 }}>B</span>
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 900, fontSize: 16, margin: 0, letterSpacing: "-0.01em" }}>BRENDEX</p>
            <p className="ap-brand-sub" style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Yeni Məhsul Əlavə Et</p>
          </div>
        </div>
        <button onClick={() => navigate("/admin/products")}
          style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 9, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          ←<span className="ap-back-text"> Geri</span>
        </button>
      </div>

      <div className="ap-content">
        {/* Mağaza banneri */}
        {storeName && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff0f1", borderRadius: 12, padding: "10px 14px", marginBottom: 20, border: "1.5px solid #fdd", flexWrap: "wrap" }}>
            <Store size={15} color="#E8192C" />
            <span style={{ fontSize: 12, color: "#999" }}>Satıcı:</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#E8192C" }}>{storeName}</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#ccc" }}>Avtomatik</span>
          </div>
        )}

        {/* Addım göstəricisi */}
        <div className="steps-wrap">
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <button type="button" onClick={() => setStep(s.n)} className="step-dot"
                  style={{ background: step >= s.n ? "#E8192C" : "#eee", color: step >= s.n ? "white" : "#bbb", boxShadow: step === s.n ? "0 3px 12px rgba(232,25,44,0.35)" : "none" }}>
                  {step > s.n ? "✓" : s.n}
                </button>
                <span className="step-label" style={{ color: step === s.n ? "#E8192C" : "#bbb" }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="step-line" style={{ background: step > s.n ? "#E8192C" : "#eee", marginBottom: 16 }} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── ADDIM 1: ÜMUMİ ── */}
          {step === 1 && (
            <div className="ap-card">
              <h2 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: "0 0 22px", paddingBottom: 14, borderBottom: "1px solid #f0f0f0" }}>
                Ümumi Məlumatlar
              </h2>

              <div className="ap-grid2">
                <div className="ap-span2">
                  <label style={labelStyle}>Məhsul Adı *</label>
                  <input className="ap-input" name="name" value={formData.name} onChange={handleInputChange}
                    placeholder="Məhsulun adını daxil edin" required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Qiymət (₼) *</label>
                  <input className="ap-input" name="price" type="number" value={formData.price}
                    onChange={handleInputChange} placeholder="0.00" required style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Stok *</label>
                  <input className="ap-input" name="stock" type="number" value={formData.stock}
                    onChange={handleInputChange} placeholder="0" required style={inputStyle} />
                </div>

                {/* KATEQORİYA — Accordion */}
                <div className="ap-span2">
                  <label style={labelStyle}>Kateqoriya *</label>

                  {/* Seçilmiş kateqoriya pill */}
                  {formData.category && selectedCatSub && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, background: "#E8192C", color: "white", fontSize: 12, fontWeight: 700 }}>
                        <selectedCatSub.icon size={11} />
                        {selectedCatParent?.parentLabel} → {selectedCatSub.label}
                        <button type="button" onClick={() => setFormData(p => ({ ...p, category: "" }))}
                          style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, marginLeft: 4 }}>
                          <X size={12} />
                        </button>
                      </span>
                    </div>
                  )}

                  <div style={{ border: "1.5px solid #eee", borderRadius: 12, overflow: "hidden" }}>
                    {CATEGORY_TREE.map(({ parentValue, parentLabel, parentIcon: PIcon, subs }) => {
                      const isOpen = openParent === parentValue;
                      const hasSelected = subs.some(s => s.value === formData.category);
                      return (
                        <div key={parentValue} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <button type="button"
                            className={`cat-parent-btn${isOpen || hasSelected ? " active" : ""}`}
                            onClick={() => toggleParent(parentValue)}
                            style={{
                              borderRadius: 0, border: "none", borderBottom: isOpen ? "1px solid #fde8ea" : "none",
                              background: hasSelected ? "#fff5f6" : isOpen ? "#fff8f8" : "white",
                              color: hasSelected || isOpen ? "#E8192C" : "#444",
                              marginBottom: 0,
                            }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <PIcon size={15} style={{ color: hasSelected || isOpen ? "#E8192C" : "#999" }} />
                              <span style={{ fontSize: 13, fontWeight: 700 }}>{parentLabel}</span>
                              {hasSelected && (
                                <span style={{ background: "#E8192C", color: "white", borderRadius: 20, padding: "1px 7px", fontSize: 9, fontWeight: 800 }}>✓</span>
                              )}
                            </span>
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>

                          {isOpen && (
                            <div style={{ background: "#fafafa", padding: "6px 10px 10px" }}>
                              <div className="cat-subs-grid">
                                {subs.map(({ value, label, icon: SIcon }) => (
                                  <button key={value} type="button"
                                    className={`cat-sub-btn${formData.category === value ? " selected" : ""}`}
                                    onClick={() => selectCategory(value, parentValue)}>
                                    <SIcon size={13} style={{ flexShrink: 0 }} />
                                    <span>{label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="ap-span2">
                  <label style={labelStyle}>Açıqlama *</label>
                  <textarea className="ap-input" name="description" value={formData.description}
                    onChange={handleInputChange} placeholder="Məhsulun ətraflı açıqlaması"
                    required rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                </div>

                <div>
                  <label style={labelStyle}>Satıcı (Avtomatik)</label>
                  <input value={storeName} readOnly style={{ ...inputStyle, background: "#fafafa", color: "#bbb", cursor: "not-allowed" }} />
                </div>

                <div>
                  <label style={labelStyle}>Rating (0–5)</label>
                  <input className="ap-input" name="ratings" type="number" step="0.1" min="0" max="5"
                    value={formData.ratings} onChange={handleInputChange} placeholder="4.5" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
                <button type="button" onClick={() => setStep(2)} disabled={!step1Valid} className="btn-primary">
                  Texniki <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── ADDIM 2: TEXNİKİ ── */}
          {step === 2 && (
            <div className="ap-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, paddingBottom: 14, borderBottom: "1px solid #f0f0f0" }}>
                {selectedCatSub && <selectedCatSub.icon size={18} color="#E8192C" />}
                <h2 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>
                  {selectedCatSub?.label || "Kateqoriya"} — Texniki Xüsusiyyətlər
                </h2>
              </div>

              {specFields.length > 0 ? (
                <div className="ap-spec-grid">
                  {specFields.map((field) => (
                    <div key={field.name} style={field.type === "checkbox" ? { gridColumn: "1 / -1" } : {}}>
                      {field.type === "checkbox" ? (
                        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "12px 14px", background: "#fafafa", borderRadius: 10, border: "1.5px solid #eee" }}>
                          <div onClick={() => setFormData(p => ({ ...p, [field.name]: !p[field.name] }))}
                            style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${formData[field.name] ? "#E8192C" : "#ddd"}`, background: formData[field.name] ? "#E8192C" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                            {formData[field.name] && <span style={{ color: "white", fontSize: 11, fontWeight: 900 }}>✓</span>}
                          </div>
                          <input type="checkbox" name={field.name} checked={!!formData[field.name]} onChange={handleInputChange} style={{ display: "none" }} />
                          <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 13 }}>{field.placeholder}</span>
                        </label>
                      ) : (
                        <>
                          <label style={labelStyle}>{field.placeholder.split(" (")[0]}</label>
                          <input className="ap-input" name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            style={inputStyle} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#ccc" }}>
                  <Package size={40} style={{ margin: "0 auto 10px", opacity: 0.3, display: "block" }} />
                  <p style={{ fontSize: 14 }}>Bu kateqoriya üçün əlavə texniki sahə yoxdur.</p>
                </div>
              )}

              <div className="footer-row" style={{ display: "flex", justifyContent: "space-between", marginTop: 22, gap: 10 }}>
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">← Geri</button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary">
                  Şəkillər <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── ADDIM 3: ŞƏKİLLƏR ── */}
          {step === 3 && (
            <div className="ap-card">
              <h2 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a1a", margin: "0 0 22px", paddingBottom: 14, borderBottom: "1px solid #f0f0f0" }}>
                Şəkillər
              </h2>

              <label htmlFor="img-upload" className="img-upload-zone"
                style={{ borderColor: imageError ? "#E8192C" : "#fcc" }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: "#fff0f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Upload size={22} color="#E8192C" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: 800, color: "#1a1a1a", fontSize: 14, margin: "0 0 4px" }}>Şəkilləri seçin</p>
                  <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>Maksimum 15 şəkil · JPG, PNG, WEBP</p>
                </div>
                <input id="img-upload" type="file" multiple accept="image/*"
                  onChange={handleFileChange} style={{ display: "none" }} />
              </label>

              {imageError && (
                <p style={{ color: "#E8192C", fontWeight: 700, fontSize: 13, marginTop: 8 }}>⚠ {imageError}</p>
              )}

              {images.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#bbb", marginBottom: 10 }}>
                    {images.length} şəkil seçildi
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {images.map((file, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img src={URL.createObjectURL(file)} alt={`preview-${idx}`}
                          style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 10, border: "2px solid #fdd", display: "block" }} />
                        <button type="button" onClick={() => removeImage(idx)}
                          style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#E8192C", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <X size={10} color="white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="footer-row" style={{ display: "flex", justifyContent: "space-between", marginTop: 22, gap: 10 }}>
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">← Geri</button>
                <button type="submit" className="btn-primary" style={{ padding: "12px 28px", fontSize: 15 }}>
                  ✓ Məhsulu Əlavə Et
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;