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
    Store, ChevronRight, Tv, Wifi, Cpu, Plug, Package,
    Monitor, Printer, HardDrive, Sofa, Bed, UtensilsCrossed,
    Footprints, Watch, ShoppingBag, Baby, Bike, Gift,
    Wrench, Droplets, Lamp, Bath, BookOpen, Tent,
} from "lucide-react";

// =====================================================================
// ANA KATEQORİYALAR + SUBKATEQORİYALAR
// ---------------------------------------------------------------------
// parentValue → ana kateqoriyanın dəyəri
// value       → subkateqoriyanın API dəyəri
// label       → Azərbaycanca ad
// icon        → Lucide ikon
// =====================================================================
const CATEGORY_TREE = [
    {
        parentValue: "Electronics",
        parentLabel: "Elektronika",
        parentIcon: Tv,
        subs: [
            { value: "Electronics_TV",        label: "TV və Audio",        icon: Tv        },
            { value: "Electronics_Photo",      label: "Foto/Video",         icon: Camera    },
            { value: "Electronics_Console",    label: "Oyun Konsolları",    icon: Gamepad2  },
            { value: "Electronics_SmartHome",  label: "Smart Home",         icon: Wifi      },
            { value: "Electronics_Gadgets",    label: "Gadgetlər",          icon: Cpu       },
            { value: "Electronics_Acc",        label: "Aksesuarlar",        icon: Plug      },
        ],
    },
    {
        parentValue: "Phones",
        parentLabel: "Telefonlar",
        parentIcon: Smartphone,
        subs: [
            { value: "Phones_Smartphone",   label: "Smartfonlar",         icon: Smartphone },
            { value: "Phones_Basic",        label: "Düyməli Telefonlar",  icon: Smartphone },
            { value: "Phones_Headphones",   label: "Qulaqlıqlar",         icon: Headphones },
            { value: "Phones_Cables",       label: "Kabel/Adapter",       icon: Plug       },
            { value: "Phones_Powerbank",    label: "Powerbank",           icon: Package    },
            { value: "Phones_Acc",          label: "Telefon Aksesuarları",icon: Package    },
        ],
    },
    {
        parentValue: "Computers",
        parentLabel: "Kompüter/Ofis",
        parentIcon: Laptop,
        subs: [
            { value: "Computers_Laptop",    label: "Noutbuklar",          icon: Laptop     },
            { value: "Computers_Desktop",   label: "Stolüstü Kompüterlər",icon: Monitor    },
            { value: "Computers_Monitor",   label: "Monitorlar",          icon: Monitor    },
            { value: "Computers_Printer",   label: "Printer/Skaner",      icon: Printer    },
            { value: "Computers_OfficeAcc", label: "Ofis Aksesuarları",   icon: Package    },
            { value: "Computers_Parts",     label: "Komponentlər",        icon: HardDrive  },
        ],
    },
    {
        parentValue: "HomeAppliances",
        parentLabel: "Məişət Texnikası",
        parentIcon: Home,
        subs: [
            { value: "HomeAppliances_Large",   label: "Böyük Məişət",       icon: Home      },
            { value: "HomeAppliances_Small",   label: "Kiçik Məişət",       icon: Home      },
            { value: "HomeAppliances_Kitchen", label: "Mətbəx Texnikası",   icon: UtensilsCrossed },
            { value: "HomeAppliances_Climate", label: "Kondisioner/İsitmə", icon: Droplets  },
            { value: "HomeAppliances_Water",   label: "Su Qızdırıcıları",   icon: Droplets  },
        ],
    },
    {
        parentValue: "HomeDecor",
        parentLabel: "Ev və Dekor",
        parentIcon: Lamp,
        subs: [
            { value: "HomeDecor_Deco",     label: "Dekorasiya",         icon: Lamp          },
            { value: "HomeDecor_Light",    label: "İşıqlandırma",       icon: Lamp          },
            { value: "HomeDecor_Textile",  label: "Ev Tekstili",        icon: Home          },
            { value: "HomeDecor_Kitchen",  label: "Mətbəx Qabları",     icon: UtensilsCrossed },
            { value: "HomeDecor_Bath",     label: "Hamam Aksesuarları", icon: Bath          },
        ],
    },
    {
        parentValue: "Furniture",
        parentLabel: "Mebel",
        parentIcon: Sofa,
        subs: [
            { value: "Furniture_Living",  label: "Qonaq Otağı",  icon: Sofa    },
            { value: "Furniture_Bedroom", label: "Yataq Otağı",  icon: Bed     },
            { value: "Furniture_Kitchen", label: "Mətbəx Mebeli",icon: UtensilsCrossed },
            { value: "Furniture_Office",  label: "Ofis Mebeli",  icon: Monitor },
            { value: "Furniture_Garden",  label: "Bağ Mebeli",   icon: Tent    },
        ],
    },
    {
        parentValue: "WomenClothing",
        parentLabel: "Qadın Geyimi",
        parentIcon: Shirt,
        subs: [
            { value: "WomenClothing_Outer",   label: "Üst Geyim",    icon: Shirt },
            { value: "WomenClothing_Inner",   label: "Alt Geyim",    icon: Shirt },
            { value: "WomenClothing_Casual",  label: "Gündəlik",     icon: Shirt },
            { value: "WomenClothing_Sport",   label: "İdman Geyimi", icon: Shirt },
            { value: "WomenClothing_Formal",  label: "Rəsmi Geyim",  icon: Shirt },
            { value: "WomenClothing_Under",   label: "Alt Paltarları",icon: Shirt },
        ],
    },
    {
        parentValue: "MenClothing",
        parentLabel: "Kişi Geyimi",
        parentIcon: Shirt,
        subs: [
            { value: "MenClothing_Outer",   label: "Üst Geyim",    icon: Shirt },
            { value: "MenClothing_Inner",   label: "Alt Geyim",    icon: Shirt },
            { value: "MenClothing_Casual",  label: "Gündəlik",     icon: Shirt },
            { value: "MenClothing_Sport",   label: "İdman Geyimi", icon: Shirt },
            { value: "MenClothing_Formal",  label: "Rəsmi Geyim",  icon: Shirt },
            { value: "MenClothing_Under",   label: "Alt Paltarları",icon: Shirt },
        ],
    },
    {
        parentValue: "Shoes",
        parentLabel: "Ayaqqabı",
        parentIcon: Footprints,
        subs: [
            { value: "Shoes_Sport",    label: "İdman Ayaqqabısı", icon: Footprints },
            { value: "Shoes_Classic",  label: "Klassik",          icon: Footprints },
            { value: "Shoes_Casual",   label: "Gündəlik",         icon: Footprints },
            { value: "Shoes_Sandal",   label: "Sandalet/Yay",     icon: Footprints },
        ],
    },
    {
        parentValue: "Accessories",
        parentLabel: "Aksesuarlar",
        parentIcon: Watch,
        subs: [
            { value: "Accessories_Bag",      label: "Çantalar",     icon: ShoppingBag },
            { value: "Accessories_Watch",    label: "Saatlar",      icon: Watch       },
            { value: "Accessories_Sunglasses",label: "Gün Eynəkləri",icon: Watch      },
            { value: "Accessories_Jewelry",  label: "Zərgərlik",    icon: Watch       },
            { value: "Accessories_Belt",     label: "Kəmərlər",     icon: Package     },
        ],
    },
    {
        parentValue: "Beauty",
        parentLabel: "Gözəllik/Kosmetika",
        parentIcon: Flower2,
        subs: [
            { value: "Beauty_Makeup",    label: "Makiyaj",            icon: Flower2 },
            { value: "Beauty_Skin",      label: "Dəriyə Qulluq",     icon: Flower2 },
            { value: "Beauty_Hair",      label: "Saça Qulluq",        icon: Flower2 },
            { value: "Beauty_Perfume",   label: "Parfümeriya",        icon: Flower2 },
            { value: "Beauty_Men",       label: "Kişi Baxım",         icon: Flower2 },
            { value: "Beauty_Hygiene",   label: "Gigiyena",           icon: Flower2 },
        ],
    },
    {
        parentValue: "KidsAndMom",
        parentLabel: "Uşaq və Ana",
        parentIcon: Baby,
        subs: [
            { value: "KidsAndMom_Clothing",  label: "Uşaq Geyimləri",     icon: Baby    },
            { value: "KidsAndMom_Toys",      label: "Oyuncaqlar",          icon: Baby    },
            { value: "KidsAndMom_Stroller",  label: "Uşaq Arabaları",      icon: Baby    },
            { value: "KidsAndMom_Food",      label: "Qidalanma Məhsulları",icon: Baby    },
            { value: "KidsAndMom_School",    label: "Məktəb Ləvazimatları",icon: BookOpen},
        ],
    },
    {
        parentValue: "Sports",
        parentLabel: "İdman və Outdoor",
        parentIcon: Dumbbell,
        subs: [
            { value: "Sports_Fitness",  label: "Fitness Avadanlıqları", icon: Dumbbell },
            { value: "Sports_Camping",  label: "Kampinq",               icon: Tent     },
            { value: "Sports_Bicycle",  label: "Velosipedlər",          icon: Bike     },
            { value: "Sports_Clothing", label: "İdman Geyimi",          icon: Shirt    },
            { value: "Sports_Acc",      label: "Aksesuarlar",           icon: Package  },
        ],
    },
    {
        parentValue: "Automotive",
        parentLabel: "Avto Məhsullar",
        parentIcon: Car,
        subs: [
            { value: "Automotive_Acc",       label: "Avto Aksesuarlar",     icon: Car     },
            { value: "Automotive_Electronics",label: "Avto Elektronika",    icon: Cpu     },
            { value: "Automotive_Parts",     label: "Ehtiyat Hissələri",    icon: Wrench  },
            { value: "Automotive_Oils",      label: "Yağlar/Kimyəvi",       icon: Droplets},
        ],
    },
    {
        parentValue: "Gifts",
        parentLabel: "Hədiyyə/Lifestyle",
        parentIcon: Gift,
        subs: [
            { value: "Gifts_Sets",      label: "Hədiyyə Setləri",   icon: Gift     },
            { value: "Gifts_Souvenir",  label: "Suvenirlər",        icon: Gift     },
            { value: "Gifts_Trending",  label: "Trending Məhsullar",icon: Gift     },
            { value: "Gifts_Books",     label: "Kitablar/Hobbi",    icon: BookOpen },
        ],
    },
];

// Düz siyahı — seçim grid-i üçün bütün subkateqoriyaları birləşdirir
const CATEGORIES = CATEGORY_TREE.flatMap((parent) =>
    parent.subs.map((sub) => ({
        value:      sub.value,
        label:      sub.label,
        icon:       sub.icon,
        parentLabel: parent.parentLabel,
    }))
);

// =====================================================================
// KATEQORİYAYA GÖRƏ TEXNİKİ SAHƏLƏR — SPEC_FIELDS
// =====================================================================
const SPEC_FIELDS = {
    // ── ELEKTRONİKA ──────────────────────────────────────────────
    Electronics_TV: [
        { name: "screenSize",    placeholder: "Ekran Ölçüsü (məs. 55\")" },
        { name: "resolution",    placeholder: "Çözümlülük (məs. 4K UHD)" },
        { name: "panelType",     placeholder: "Panel Növü (məs. OLED)" },
        { name: "connectivity",  placeholder: "Bağlantı (məs. HDMI, Wi-Fi)" },
        { name: "smartTv",       placeholder: "Smart TV", type: "checkbox" },
    ],
    Electronics_Photo: [
        { name: "resolution",          placeholder: "Çözümlülük (məs. 24MP)" },
        { name: "opticalZoom",         placeholder: "Optik Zoom (məs. 3x)" },
        { name: "sensorType",          placeholder: "Sensor Növü (məs. APS-C)" },
        { name: "imageStabilization",  placeholder: "Sabitləşdirmə (məs. OIS)" },
        { name: "videoResolution",     placeholder: "Video (məs. 4K 60fps)" },
    ],
    Electronics_Console: [
        { name: "cpu",                 placeholder: "CPU (məs. AMD Zen 2)" },
        { name: "gpu",                 placeholder: "GPU (məs. AMD RDNA 2)" },
        { name: "storage",             placeholder: "Yaddaş (məs. 825GB SSD)" },
        { name: "memory",              placeholder: "RAM (məs. 16GB GDDR6)" },
        { name: "supportedResolution", placeholder: "Çözümlülük (məs. 4K)" },
        { name: "connectivity",        placeholder: "Bağlantı (məs. Wi-Fi 6)" },
        { name: "controllerIncluded",  placeholder: "Controller Daxildir", type: "checkbox" },
    ],
    Electronics_SmartHome: [
        { name: "connectivity",  placeholder: "Bağlantı (məs. Zigbee, Wi-Fi)" },
        { name: "compatibility",  placeholder: "Uyğunluq (məs. Alexa, Google)" },
        { name: "power",          placeholder: "Güc (məs. 10W)" },
    ],
    Electronics_Gadgets: [
        { name: "connectivity",  placeholder: "Bağlantı (məs. Bluetooth 5.3)" },
        { name: "batteryLife",   placeholder: "Batareya (məs. 10 saat)" },
        { name: "compatibility",  placeholder: "Uyğunluq (məs. iOS/Android)" },
    ],
    Electronics_Acc: [
        { name: "compatibility",  placeholder: "Uyğunluq" },
        { name: "material",       placeholder: "Material" },
        { name: "color",          placeholder: "Rəng" },
    ],

    // ── TELEFONLAR ────────────────────────────────────────────────
    Phones_Smartphone: [
        { name: "screenSize",      placeholder: "Ekran Ölçüsü (məs. 6.7\")" },
        { name: "storage",         placeholder: "Yaddaş (məs. 256GB)" },
        { name: "ram",             placeholder: "RAM (məs. 8GB)" },
        { name: "frontCamera",     placeholder: "Ön Kamera (məs. 12MP)" },
        { name: "backCamera",      placeholder: "Arxa Kamera (məs. 48MP)" },
        { name: "battery",         placeholder: "Batareya (məs. 4500mAh)" },
        { name: "processor",       placeholder: "Prosessor (məs. Snapdragon 8 Gen 3)" },
        { name: "operatingSystem", placeholder: "OS (məs. Android 14)" },
    ],
    Phones_Basic: [
        { name: "battery",     placeholder: "Batareya (məs. 1500mAh)" },
        { name: "storage",     placeholder: "Yaddaş (məs. 32MB)" },
        { name: "simCount",    placeholder: "SIM sayı (məs. Dual SIM)" },
    ],
    Phones_Headphones: [
        { name: "connectivity",      placeholder: "Bağlantı (məs. Bluetooth 5.3)" },
        { name: "batteryLife",       placeholder: "Batareya Ömrü (məs. 30 saat)" },
        { name: "noiseCancellation", placeholder: "Səs Ləğvi (məs. ANC)" },
        { name: "driverSize",        placeholder: "Driver Ölçüsü (məs. 40mm)" },
    ],
    Phones_Cables: [
        { name: "length",       placeholder: "Uzunluq (məs. 1m)" },
        { name: "compatibility", placeholder: "Uyğunluq (məs. USB-C)" },
        { name: "maxCharge",    placeholder: "Maks. Şarj (məs. 65W)" },
    ],
    Phones_Powerbank: [
        { name: "capacity",    placeholder: "Tutum (məs. 20000mAh)" },
        { name: "maxCharge",   placeholder: "Maks. Şarj (məs. 65W)" },
        { name: "portCount",   placeholder: "Port Sayı (məs. 3 port)" },
    ],
    Phones_Acc: [
        { name: "compatibility", placeholder: "Uyğunluq" },
        { name: "material",      placeholder: "Material" },
        { name: "color",         placeholder: "Rəng" },
    ],

    // ── KOMPÜTER ──────────────────────────────────────────────────
    Computers_Laptop: [
        { name: "screenSize",      placeholder: "Ekran (məs. 15.6\")" },
        { name: "storage",         placeholder: "Yaddaş (məs. 512GB SSD)" },
        { name: "ram",             placeholder: "RAM (məs. 16GB)" },
        { name: "gpu",             placeholder: "GPU (məs. RTX 4060)" },
        { name: "camera",          placeholder: "Kamera (məs. 1080p)" },
        { name: "processor",       placeholder: "Prosessor (məs. Intel i7-13700H)" },
        { name: "batteryLife",     placeholder: "Batareya Ömrü (məs. 10 saat)" },
        { name: "operatingSystem", placeholder: "OS (məs. Windows 11)" },
    ],
    Computers_Desktop: [
        { name: "processor",       placeholder: "Prosessor (məs. Intel i9)" },
        { name: "ram",             placeholder: "RAM (məs. 32GB)" },
        { name: "storage",         placeholder: "Yaddaş (məs. 1TB SSD)" },
        { name: "gpu",             placeholder: "GPU (məs. RTX 4080)" },
        { name: "operatingSystem", placeholder: "OS (məs. Windows 11)" },
    ],
    Computers_Monitor: [
        { name: "screenSize",   placeholder: "Ekran (məs. 27\")" },
        { name: "resolution",   placeholder: "Çözümlülük (məs. 4K)" },
        { name: "refreshRate",  placeholder: "Yenilənmə sürəti (məs. 165Hz)" },
        { name: "panelType",    placeholder: "Panel Növü (məs. IPS)" },
        { name: "connectivity", placeholder: "Bağlantı (məs. HDMI, DP)" },
    ],
    Computers_Printer: [
        { name: "printType",   placeholder: "Çap Növü (məs. Laser, Inkjet)" },
        { name: "resolution",  placeholder: "Çap Keyfiyyəti (məs. 1200dpi)" },
        { name: "connectivity",placeholder: "Bağlantı (məs. Wi-Fi, USB)" },
        { name: "color",       placeholder: "Rəngli Çap", type: "checkbox" },
    ],
    Computers_OfficeAcc: [
        { name: "compatibility", placeholder: "Uyğunluq" },
        { name: "connectivity",  placeholder: "Bağlantı" },
        { name: "color",         placeholder: "Rəng" },
    ],
    Computers_Parts: [
        { name: "partType",    placeholder: "Hissə Növü (məs. RAM, SSD, CPU)" },
        { name: "capacity",    placeholder: "Tutum/Sürət (məs. 16GB, 3200MHz)" },
        { name: "compatibility",placeholder: "Uyğunluq (məs. DDR4, PCIe 4.0)" },
    ],

    // ── MƏİŞƏT TEXNİKASI ─────────────────────────────────────────
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
        { name: "power",        placeholder: "Güc (məs. 12000 BTU)" },
        { name: "coverage",     placeholder: "Əhatə sahəsi (məs. 30m²)" },
        { name: "energyClass",  placeholder: "Enerji Sinfi (məs. A+)" },
        { name: "inverter",     placeholder: "İnverter", type: "checkbox" },
    ],
    HomeAppliances_Water: [
        { name: "capacity",    placeholder: "Tutum (məs. 80L)" },
        { name: "power",       placeholder: "Güc (məs. 2000W)" },
        { name: "energyClass", placeholder: "Enerji Sinfi" },
    ],

    // ── EV VƏ DEKOR ───────────────────────────────────────────────
    HomeDecor_Deco:    [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
    HomeDecor_Light:   [{ name: "power", placeholder: "Güc (məs. 10W)" }, { name: "lightType", placeholder: "İşıq Növü (məs. LED)" }, { name: "color", placeholder: "Rəng" }],
    HomeDecor_Textile: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
    HomeDecor_Kitchen: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "setCount", placeholder: "Dəst sayı" }],
    HomeDecor_Bath:    [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],

    // ── MEBEL ─────────────────────────────────────────────────────
    Furniture_Living:  [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }, { name: "seatingCapacity", placeholder: "Oturacaq Sayı" }],
    Furniture_Bedroom: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər (məs. 160x200cm)" }, { name: "color", placeholder: "Rəng" }],
    Furniture_Kitchen: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
    Furniture_Office:  [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "adjustable", placeholder: "Hündürlük tənzimlənir", type: "checkbox" }],
    Furniture_Garden:  [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "weatherResistant", placeholder: "Hava Davamlı", type: "checkbox" }],

    // ── QADIN GEYİMİ ─────────────────────────────────────────────
    WomenClothing_Outer:  [{ name: "size", placeholder: "Ölçü (XS/S/M/L/XL)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    WomenClothing_Inner:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    WomenClothing_Casual: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    WomenClothing_Sport:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    WomenClothing_Formal: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    WomenClothing_Under:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],

    // ── KİŞİ GEYİMİ ──────────────────────────────────────────────
    MenClothing_Outer:  [{ name: "size", placeholder: "Ölçü (XS/S/M/L/XL)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    MenClothing_Inner:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    MenClothing_Casual: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    MenClothing_Sport:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    MenClothing_Formal: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    MenClothing_Under:  [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],

    // ── AYAQQABI ─────────────────────────────────────────────────
    Shoes_Sport:   [{ name: "size", placeholder: "Ölçü (36-46)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }, { name: "gender", placeholder: "Cins (Kişi/Qadın/Uşaq)" }],
    Shoes_Classic: [{ name: "size", placeholder: "Ölçü (36-46)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    Shoes_Casual:  [{ name: "size", placeholder: "Ölçü (36-46)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    Shoes_Sandal:  [{ name: "size", placeholder: "Ölçü (36-46)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],

    // ── AKSESUARLAR ───────────────────────────────────────────────
    Accessories_Bag:       [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
    Accessories_Watch:     [{ name: "material", placeholder: "Qayış Materia" }, { name: "waterResistant", placeholder: "Su Keçirməz", type: "checkbox" }, { name: "color", placeholder: "Rəng" }],
    Accessories_Sunglasses:[{ name: "frameType", placeholder: "Çərçivə Növü" }, { name: "uvProtection", placeholder: "UV Qoruma" }, { name: "color", placeholder: "Rəng" }],
    Accessories_Jewelry:   [{ name: "material", placeholder: "Material (məs. Gümüş, Qızıl)" }, { name: "size", placeholder: "Ölçü/Ölçü" }, { name: "color", placeholder: "Rəng" }],
    Accessories_Belt:      [{ name: "material", placeholder: "Material" }, { name: "size", placeholder: "Ölçü" }, { name: "color", placeholder: "Rəng" }],

    // ── GÖZƏLLİK ─────────────────────────────────────────────────
    Beauty_Makeup:   [{ name: "volume", placeholder: "Həcm (məs. 30ml)" }, { name: "color", placeholder: "Çalar/Rəng" }, { name: "ingredients", placeholder: "Əsas Tərkib" }],
    Beauty_Skin:     [{ name: "volume", placeholder: "Həcm (məs. 50ml)" }, { name: "skinType", placeholder: "Dəri Növü (məs. Quru, Yağlı)" }, { name: "ingredients", placeholder: "Əsas Tərkib" }],
    Beauty_Hair:     [{ name: "volume", placeholder: "Həcm (məs. 250ml)" }, { name: "hairType", placeholder: "Saç Növü" }, { name: "ingredients", placeholder: "Əsas Tərkib" }],
    Beauty_Perfume:  [{ name: "volume", placeholder: "Həcm (məs. 100ml)" }, { name: "scentType", placeholder: "Qoxu Ailəsi" }, { name: "gender", placeholder: "Cins (Kişi/Qadın/Uniseks)" }],
    Beauty_Men:      [{ name: "volume", placeholder: "Həcm" }, { name: "ingredients", placeholder: "Əsas Tərkib" }, { name: "skinType", placeholder: "Dəri Növü" }],
    Beauty_Hygiene:  [{ name: "volume", placeholder: "Həcm" }, { name: "ingredients", placeholder: "Əsas Tərkib" }, { name: "quantity", placeholder: "Miqdar/Ədəd" }],

    // ── UŞAQ VƏ ANA ──────────────────────────────────────────────
    KidsAndMom_Clothing: [{ name: "size", placeholder: "Ölçü (məs. 3-4 yaş)" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    KidsAndMom_Toys:     [{ name: "ageRange", placeholder: "Yaş həddi (məs. 3-8 yaş)" }, { name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }],
    KidsAndMom_Stroller: [{ name: "maxWeight", placeholder: "Maks. çəki (məs. 22kg)" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "foldable", placeholder: "Qatlanır", type: "checkbox" }],
    KidsAndMom_Food:     [{ name: "volume", placeholder: "Həcm/Miqdar" }, { name: "ageRange", placeholder: "Uyğun yaş" }, { name: "ingredients", placeholder: "Tərkib" }],
    KidsAndMom_School:   [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],

    // ── İDMAN VƏ OUTDOOR ─────────────────────────────────────────
    Sports_Fitness:  [{ name: "maxWeight", placeholder: "Maks. yük (məs. 150kg)" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "material", placeholder: "Material" }],
    Sports_Camping:  [{ name: "material", placeholder: "Material" }, { name: "capacity", placeholder: "Tutum/Ölçü" }, { name: "weight", placeholder: "Çəki" }],
    Sports_Bicycle:  [{ name: "frameSize", placeholder: "Çərçivə ölçüsü (məs. 26\")" }, { name: "gearCount", placeholder: "Vites sayı" }, { name: "material", placeholder: "Material" }],
    Sports_Clothing: [{ name: "size", placeholder: "Ölçü" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    Sports_Acc:      [{ name: "compatibility", placeholder: "Uyğunluq" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],

    // ── AVTO ──────────────────────────────────────────────────────
    Automotive_Acc:        [{ name: "compatibility", placeholder: "Avtomobil uyğunluğu" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    Automotive_Electronics:[{ name: "compatibility", placeholder: "Avtomobil uyğunluğu" }, { name: "connectivity", placeholder: "Bağlantı (məs. GPS, Wi-Fi)" }, { name: "resolution", placeholder: "Kamera/Ekran çözümlülüyü" }],
    Automotive_Parts:      [{ name: "compatibility", placeholder: "Avtomobil uyğunluğu (marka/model)" }, { name: "partNumber", placeholder: "Hissə nömrəsi" }, { name: "material", placeholder: "Material" }],
    Automotive_Oils:       [{ name: "viscosity", placeholder: "Özlülük (məs. 5W-30)" }, { name: "volume", placeholder: "Həcm (məs. 4L)" }, { name: "compatibility", placeholder: "Uyğunluq" }],

    // ── HƏDİYYƏ / LİFESTYLE ──────────────────────────────────────
    Gifts_Sets:     [{ name: "setCount", placeholder: "Dəst miqdarı" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    Gifts_Souvenir: [{ name: "material", placeholder: "Material" }, { name: "dimensions", placeholder: "Ölçülər" }, { name: "color", placeholder: "Rəng" }],
    Gifts_Trending: [{ name: "compatibility", placeholder: "Uyğunluq" }, { name: "material", placeholder: "Material" }, { name: "color", placeholder: "Rəng" }],
    Gifts_Books:    [{ name: "pageCount", placeholder: "Səhifə sayı" }, { name: "language", placeholder: "Dil" }, { name: "author", placeholder: "Müəllif" }],
};

// ── Bütün mümkün sahələrin ilkin dəyərləri ──────────────────────────
const ALL_SPEC_KEYS = [
    "screenSize","storage","ram","battery","processor","operatingSystem",
    "frontCamera","backCamera","gpu","camera","batteryLife","resolution",
    "opticalZoom","sensorType","imageStabilization","connectivity",
    "noiseCancellation","cpu","memory","supportedResolution","size",
    "material","color","power","dimensions","volume","ingredients",
    "weight","compatibility","panelType","videoResolution","smartTv",
    "refreshRate","capacity","energyClass","seatingCapacity","adjustable",
    "weatherResistant","gender","waterResistant","uvProtection","frameType",
    "skinType","hairType","scentType","ageRange","maxWeight","foldable",
    "frameSize","gearCount","partNumber","viscosity","setCount","pageCount",
    "language","author","simCount","driverSize","maxCharge","portCount",
    "lightType","printType","color","inverter","partType","quantity",
    "coverage","lightType",
];

const inputStyle = {
    width: "100%", padding: "12px 16px", border: "1.5px solid #f0f0f0",
    borderRadius: 12, fontSize: 14, color: "#1a1a1a", background: "white",
    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};
const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase",
    letterSpacing: "0.08em", color: "#999", marginBottom: 6,
};

// =====================================================================
// ANA KOMPONENT
// =====================================================================
const AddProduct = () => {
    const { user } = useSelector((state) => state.userSlice);
    const storeName = user?.user?.sellerInfo?.storeName || user?.user?.name || "";

    const buildInitialState = () => {
        const base = {
            name: "", price: "", description: "", category: "",
            seller: storeName, stock: "", ratings: "",
        };
        ALL_SPEC_KEYS.forEach((k) => { base[k] = ""; });
        // boolean sahələr
        ["controllerIncluded","cellular","smartTv","adjustable",
         "weatherResistant","waterResistant","foldable","color",
         "inverter"].forEach((k) => { base[k] = false; });
        return base;
    };

    const initialState = buildInitialState();

    const [formData, setFormData]     = useState(initialState);
    const [images, setImages]         = useState([]);
    const [imageError, setImageError] = useState("");
    const [step, setStep]             = useState(1);
    // Ana kateqoriya filtri üçün seçilmiş parent
    const [activeParent, setActiveParent] = useState(null);

    const [addProduct] = useAddProductMutation();
    const { refetch }  = useGetProductsQuery();
    const navigate     = useNavigate();

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
            Swal.fire({ title: "Uğurla əlavə edildi! 🎉", text: "Məhsul əlavə edildi.", icon: "success", confirmButtonColor: "#E8192C" });
            await refetch();
            navigate("/admin/products");
            setFormData({ ...buildInitialState(), seller: storeName });
            setImages([]);
        } catch (error) {
            Swal.fire({ title: "Xəta!", text: error?.data?.message || error?.error || "Xəta baş verdi.", icon: "error", confirmButtonColor: "#E8192C" });
        }
    };

    const specFields   = SPEC_FIELDS[formData.category] || [];
    const selectedCat  = CATEGORIES.find((c) => c.value === formData.category);
    const step1Valid   = formData.name && formData.price && formData.category && formData.description && formData.stock;
    const STEPS        = [{ n: 1, label: "Ümumi" }, { n: 2, label: "Texniki" }, { n: 3, label: "Şəkillər" }];

    // Göstəriləcək subkateqoriyalar: activeParent seçilibsə yalnız onun subs-ları
    const visibleSubs = activeParent
        ? CATEGORY_TREE.find((p) => p.parentValue === activeParent)?.subs || []
        : CATEGORIES;

    return (
        <div style={{ minHeight: "100vh", background: "#f6f6f7", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; }
        .addp-header { background: #E8192C; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 30; box-shadow: 0 4px 20px rgba(232,25,44,0.25); }
        .addp-content { max-width: 860px; margin: 0 auto; padding: 32px 20px; width: 100%; }
        .addp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .addp-span2 { grid-column: 1 / -1; }
        .addp-spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .addp-parent-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; margin-bottom: 14px; }
        .addp-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 7px; }
        .addp-card { background: white; border-radius: 24px; padding: 32px; box-shadow: 0 2px 16px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; width: 100%; }
        .addp-footer-between { display: flex; justify-content: space-between; margin-top: 28px; gap: 10px; flex-wrap: wrap; }
        .addp-footer-end { display: flex; justify-content: flex-end; margin-top: 28px; }
        .addp-img-previews { display: flex; flex-wrap: wrap; gap: 10px; }
        .addp-img-preview { width: 80px; height: 80px; object-fit: cover; border-radius: 12px; border: 2px solid #fdd; display: block; }
        .addp-steps-wrapper { display: flex; align-items: center; justify-content: center; margin-bottom: 28px; }
        .addp-step-btn { width: 44px; height: 44px; border-radius: 50%; border: none; font-weight: 900; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .addp-step-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
        .addp-step-connector { width: 60px; height: 2px; margin: 0 10px; margin-bottom: 18px; border-radius: 2px; flex-shrink: 0; }
        .addp-input:focus { border-color: #E8192C !important; }
        .addp-textarea:focus { border-color: #E8192C !important; }
        .addp-parent-btn { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px 6px; border-radius:12px; cursor:pointer; gap:5px; transition:all 0.18s; border:2px solid #f0f0f0; background:white; }
        .addp-sub-btn { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:9px 5px; border-radius:11px; cursor:pointer; gap:4px; transition:all 0.18s; border:2px solid #f0f0f0; background:white; }
        @media (max-width: 1024px) { .addp-header{padding:0 24px;} .addp-content{padding:24px 16px;} .addp-card{padding:28px 24px;} }
        @media (max-width: 768px) {
          .addp-header{padding:0 16px;height:56px;} .addp-brand-sub{display:none;} .addp-back-btn-text{display:none;}
          .addp-back-btn{padding:7px 12px !important;} .addp-content{padding:16px 12px;} .addp-card{padding:20px 16px;border-radius:18px;}
          .addp-grid2{grid-template-columns:1fr !important;} .addp-span2{grid-column:1 !important;}
          .addp-spec-grid{grid-template-columns:1fr 1fr;gap:12px;} .addp-parent-grid{grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:6px;}
          .addp-cat-grid{grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:5px;}
          .addp-step-connector{width:36px !important;margin:0 6px;margin-bottom:18px;}
          .addp-step-label{font-size:9px !important;} .addp-step-btn{width:38px !important;height:38px !important;font-size:13px !important;}
          .addp-img-preview{width:72px !important;height:72px !important;}
          .addp-store-banner{flex-wrap:wrap;gap:6px;} .addp-store-auto{margin-left:0 !important;width:100%;}
        }
        @media (max-width: 600px) { .addp-spec-grid{grid-template-columns:1fr !important;} .addp-cat-grid{grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:5px;} }
        @media (max-width: 420px) {
          .addp-header{padding:0 10px;height:52px;} .addp-brand-title{font-size:14px !important;}
          .addp-content{padding:12px 8px;} .addp-card{padding:16px 12px;border-radius:16px;}
          .addp-parent-grid{grid-template-columns:repeat(3,1fr) !important;gap:5px;}
          .addp-cat-grid{grid-template-columns:repeat(3,1fr) !important;gap:5px;}
          .addp-step-connector{width:20px !important;margin:0 4px;margin-bottom:18px;}
          .addp-step-btn{width:34px !important;height:34px !important;font-size:12px !important;}
          .addp-step-label{font-size:8px !important;} .addp-img-preview{width:60px !important;height:60px !important;}
          .addp-footer-between{flex-direction:column;} .addp-footer-between button,.addp-footer-end button{width:100%;justify-content:center;}
        }
        @media (max-width: 360px) { .addp-parent-grid{grid-template-columns:repeat(3,1fr) !important;} .addp-cat-grid{grid-template-columns:repeat(3,1fr) !important;} .addp-header-logo{width:30px !important;height:30px !important;} .addp-brand-title{font-size:13px !important;} }
      `}</style>

            {/* HEADER */}
            <div className="addp-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="addp-header-logo" style={{ width: 36, height: 36, background: "white", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#E8192C", fontWeight: 900, fontSize: 18, lineHeight: 1 }}>B</span>
                    </div>
                    <div>
                        <p className="addp-brand-title" style={{ color: "white", fontWeight: 900, fontSize: 17, letterSpacing: "-0.01em", lineHeight: 1, margin: 0 }}>BRENDEX</p>
                        <p className="addp-brand-sub" style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Yeni Məhsul Əlavə Et</p>
                    </div>
                </div>
                <button className="addp-back-btn" onClick={() => navigate("/admin/products")}
                    style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "7px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    ←<span className="addp-back-btn-text"> Geri</span>
                </button>
            </div>

            <div className="addp-content">
                {/* Mağaza banneri */}
                {storeName && (
                    <div className="addp-store-banner" style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff0f1", borderRadius: 14, padding: "12px 16px", marginBottom: 24, border: "1.5px solid #fdd" }}>
                        <Store size={16} color="#E8192C" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "#999" }}>Satıcı mağazası:</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#E8192C" }}>{storeName}</span>
                        <span className="addp-store-auto" style={{ marginLeft: "auto", fontSize: 11, color: "#ccc" }}>Avtomatik təyin edilir</span>
                    </div>
                )}

                {/* Addım göstəricisi */}
                <div className="addp-steps-wrapper">
                    {STEPS.map((s, i) => (
                        <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <button type="button" onClick={() => setStep(s.n)} className="addp-step-btn"
                                    style={{ background: step >= s.n ? "#E8192C" : "#f0f0f0", color: step >= s.n ? "white" : "#bbb", boxShadow: step === s.n ? "0 4px 14px rgba(232,25,44,0.35)" : "none" }}>
                                    {step > s.n ? "✓" : s.n}
                                </button>
                                <span className="addp-step-label" style={{ color: step === s.n ? "#E8192C" : "#bbb" }}>{s.label}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="addp-step-connector" style={{ background: step > s.n ? "#E8192C" : "#f0f0f0" }} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>

                    {/* ── ADDIM 1: ÜMUMİ ── */}
                    {step === 1 && (
                        <div className="addp-card">
                            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginTop: 0, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f5f5f5" }}>Ümumi Məlumatlar</h2>
                            <div className="addp-grid2">

                                <div className="addp-span2">
                                    <label style={labelStyle}>Məhsul Adı *</label>
                                    <input className="addp-input" name="name" value={formData.name} onChange={handleInputChange} placeholder="Məhsulun adını daxil edin" required style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = "#E8192C"} onBlur={(e) => e.target.style.borderColor = "#f0f0f0"} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Qiymət (₼) *</label>
                                    <input className="addp-input" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="0.00" required style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = "#E8192C"} onBlur={(e) => e.target.style.borderColor = "#f0f0f0"} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Stok *</label>
                                    <input className="addp-input" name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="0" required style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = "#E8192C"} onBlur={(e) => e.target.style.borderColor = "#f0f0f0"} />
                                </div>

                                {/* KATEQORİYA SEÇİMİ — 2 sətir: ana kateqoriya + subkateqoriya */}
                                <div className="addp-span2">
                                    <label style={labelStyle}>Kateqoriya *</label>

                                    {/* Ana kateqoriyalar */}
                                    <div className="addp-parent-grid">
                                        {CATEGORY_TREE.map(({ parentValue, parentLabel, parentIcon: Icon }) => {
                                            const isActive = activeParent === parentValue;
                                            return (
                                                <button key={parentValue} type="button" className="addp-parent-btn"
                                                    onClick={() => {
                                                        setActiveParent(isActive ? null : parentValue);
                                                        // Seçilmiş subkateqoriya bu parent-a aid deyilsə sıfırla
                                                        const parentSubs = CATEGORY_TREE.find(p => p.parentValue === parentValue)?.subs || [];
                                                        const belongs = parentSubs.some(s => s.value === formData.category);
                                                        if (!belongs) setFormData(p => ({ ...p, category: "" }));
                                                    }}
                                                    style={{
                                                        border: `2px solid ${isActive ? "#E8192C" : "#f0f0f0"}`,
                                                        background: isActive ? "#fff0f1" : "white",
                                                        color: isActive ? "#E8192C" : "#999",
                                                    }}>
                                                    <Icon size={15} />
                                                    <span style={{ fontSize: 9, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{parentLabel}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Subkateqoriyalar — activeParent seçilibsə yalnız onun subları */}
                                    <div style={{ background: "#fafafa", borderRadius: 14, padding: "10px", border: "1px solid #f0f0f0" }}>
                                        {activeParent ? (
                                            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#bbb", margin: "0 0 8px" }}>
                                                {CATEGORY_TREE.find(p => p.parentValue === activeParent)?.parentLabel} — Subkateqoriyalar
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#bbb", margin: "0 0 8px" }}>
                                                Bütün subkateqoriyalar (ana kateqoriya seçin ki, filtrlənsin)
                                            </p>
                                        )}
                                        <div className="addp-cat-grid">
                                            {visibleSubs.map(({ value, label, icon: Icon }) => (
                                                <button key={value} type="button" className="addp-sub-btn"
                                                    onClick={() => setFormData((p) => ({ ...p, category: value }))}
                                                    style={{
                                                        border: `2px solid ${formData.category === value ? "#E8192C" : "#e8e8e8"}`,
                                                        background: formData.category === value ? "#fff0f1" : "white",
                                                        color: formData.category === value ? "#E8192C" : "#999",
                                                    }}>
                                                    <Icon size={14} />
                                                    <span style={{ fontSize: 8.5, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Seçilmiş kateqoriya pill */}
                                    {formData.category && (
                                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ fontSize: 11, color: "#bbb" }}>Seçildi:</span>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "#E8192C", color: "white", fontSize: 11, fontWeight: 700 }}>
                                                ✓ {selectedCat?.label}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="addp-span2">
                                    <label style={labelStyle}>Açıqlama *</label>
                                    <textarea className="addp-textarea" name="description" value={formData.description} onChange={handleInputChange}
                                        placeholder="Məhsulun ətraflı açıqlaması" required rows={4}
                                        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                                        onFocus={(e) => e.target.style.borderColor = "#E8192C"} onBlur={(e) => e.target.style.borderColor = "#f0f0f0"} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Satıcı (Avtomatik)</label>
                                    <input value={storeName} readOnly style={{ ...inputStyle, background: "#fafafa", color: "#bbb", cursor: "not-allowed" }} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Rating (0-5)</label>
                                    <input className="addp-input" name="ratings" type="number" step="0.1" min="0" max="5"
                                        value={formData.ratings} onChange={handleInputChange} placeholder="4.5" style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = "#E8192C"} onBlur={(e) => e.target.style.borderColor = "#f0f0f0"} />
                                </div>
                            </div>

                            <div className="addp-footer-end">
                                <button type="button" onClick={() => setStep(2)} disabled={!step1Valid}
                                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, border: "none", background: "#E8192C", color: "white", fontWeight: 800, fontSize: 14, cursor: step1Valid ? "pointer" : "not-allowed", opacity: step1Valid ? 1 : 0.4, boxShadow: "0 4px 14px rgba(232,25,44,0.3)" }}>
                                    Texniki <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── ADDIM 2: TEXNİKİ ── */}
                    {step === 2 && (
                        <div className="addp-card">
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f5f5f5" }}>
                                {selectedCat && <selectedCat.icon size={20} color="#E8192C" />}
                                <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>
                                    {selectedCat?.label || "Kateqoriya"} — Texniki
                                </h2>
                            </div>

                            {specFields.length > 0 ? (
                                <div className="addp-spec-grid">
                                    {specFields.map((field) => (
                                        <div key={field.name} style={field.type === "checkbox" ? { gridColumn: "1 / -1" } : {}}>
                                            {field.type === "checkbox" ? (
                                                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "14px 16px", background: "#fafafa", borderRadius: 12, border: "1.5px solid #f0f0f0" }}>
                                                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${formData[field.name] ? "#E8192C" : "#ddd"}`, background: formData[field.name] ? "#E8192C" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        {formData[field.name] && <span style={{ color: "white", fontSize: 12, fontWeight: 900 }}>✓</span>}
                                                    </div>
                                                    <input type="checkbox" name={field.name} checked={!!formData[field.name]} onChange={handleInputChange} style={{ display: "none" }} />
                                                    <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 14 }}>{field.placeholder}</span>
                                                </label>
                                            ) : (
                                                <>
                                                    <label style={labelStyle}>{field.placeholder.split(" (")[0]}</label>
                                                    <input className="addp-input" name={field.name}
                                                        value={formData[field.name] || ""}
                                                        onChange={handleInputChange}
                                                        placeholder={field.placeholder}
                                                        style={inputStyle}
                                                        onFocus={(e) => e.target.style.borderColor = "#E8192C"}
                                                        onBlur={(e) => e.target.style.borderColor = "#f0f0f0"} />
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ textAlign: "center", color: "#ccc", padding: "40px 0", fontSize: 14 }}>
                                    Bu kateqoriya üçün əlavə sahə yoxdur.
                                </p>
                            )}

                            <div className="addp-footer-between">
                                <button type="button" onClick={() => setStep(1)} style={{ padding: "12px 24px", borderRadius: 12, border: "1.5px solid #f0f0f0", background: "white", color: "#999", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Geri</button>
                                <button type="button" onClick={() => setStep(3)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, border: "none", background: "#E8192C", color: "white", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(232,25,44,0.3)" }}>
                                    Şəkillər <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── ADDIM 3: ŞƏKİLLƏR ── */}
                    {step === 3 && (
                        <div className="addp-card">
                            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a1a", marginTop: 0, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f5f5f5" }}>Şəkillər</h2>

                            <label htmlFor="img-upload" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "36px 16px", border: `2px dashed ${imageError ? "#E8192C" : "#fcc"}`, borderRadius: 18, cursor: "pointer", background: images.length > 0 ? "#fff8f8" : "#fafafa" }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#fff0f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Upload size={24} color="#E8192C" />
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <p style={{ fontWeight: 800, color: "#1a1a1a", fontSize: 15, margin: "0 0 4px" }}>Şəkilləri seçin</p>
                                    <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>Maks. 15 şəkil · JPG, PNG, WEBP</p>
                                </div>
                                <input id="img-upload" type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                            </label>

                            {imageError && <p style={{ color: "#E8192C", fontWeight: 700, fontSize: 13, marginTop: 8 }}>⚠ {imageError}</p>}

                            {images.length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                    <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#bbb", marginBottom: 12 }}>
                                        {images.length} şəkil seçildi
                                    </p>
                                    <div className="addp-img-previews">
                                        {images.map((file, idx) => (
                                            <div key={idx} style={{ position: "relative" }}>
                                                <img src={URL.createObjectURL(file)} alt={`Preview ${idx + 1}`} className="addp-img-preview" />
                                                <button type="button" onClick={() => removeImage(idx)}
                                                    style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#E8192C", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                                    <X size={11} color="white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="addp-footer-between">
                                <button type="button" onClick={() => setStep(2)} style={{ padding: "12px 24px", borderRadius: 12, border: "1.5px solid #f0f0f0", background: "white", color: "#999", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Geri</button>
                                <button type="submit" style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #E8192C 0%, #ff4f61 100%)", color: "white", fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(232,25,44,0.35)" }}>
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