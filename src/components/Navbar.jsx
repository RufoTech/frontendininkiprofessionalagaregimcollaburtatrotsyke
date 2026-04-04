import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/features/userSlice"
import { bloggerLogout } from "../slices/bloggerSlice"
import { useGetCartQuery, useGetFavoritesQuery } from "../redux/api/productsApi"
import { setLanguage } from "../slices/languageSlice"
import { useTranslation } from "react-i18next"
import {
  X, Home, User, Camera,
  MessageCircle, Search,
  ShoppingCart, Heart, ChevronDown,
  Monitor, Shirt, Flower2, Dumbbell, Car, Grid3X3,
  Sparkles, Baby, SlidersHorizontal, ArrowUpDown,
  Star, ChevronRight, Package, Bell,
  BookOpen, Cpu, Watch, Gamepad2,
  Sofa, Footprints, PawPrint,
  Tv, Headphones, Smartphone, Laptop, Printer,
  Refrigerator, Microwave, Wind, Lamp, Bath,
  Armchair, UtensilsCrossed, Glasses, Zap,
  Gift, TrendingUp, Tent, Bike,
  FlaskConical, Backpack, ChevronUp,
  Wifi, Plug, HardDrive, Bed, Droplets,
  Wrench, ShoppingBag,
} from "lucide-react"

import { fetchUnreadCount } from "../slices/notificationSlice"

/* ─────────────────────────────────────────────
   LOGO SVG
───────────────────────────────────────────── */
const BCartIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M6 6 L6 58 L34 58 Q52 58 52 46 Q52 38 42 35 Q50 31 50 22 Q50 6 32 6 Z
         M16 14 L30 14 Q40 14 40 22 Q40 30 30 30 L16 30 Z
         M16 38 L32 38 Q44 38 44 46 Q44 54 32 54 L16 54 Z" fill="#E8192C" />
    <path d="M22 42 L24 28 L46 28 L42 42 Z" fill="white" opacity="0.9" />
    <line x1="24" y1="35" x2="44" y2="35" stroke="#b8001e" strokeWidth="1.5" />
    <circle cx="28" cy="46" r="3.5" fill="#b8001e" />
    <circle cx="28" cy="46" r="1.5" fill="white" />
    <circle cx="39" cy="46" r="3.5" fill="#b8001e" />
    <circle cx="39" cy="46" r="1.5" fill="white" />
  </svg>
)

const SidebarBCartIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M6 6 L6 58 L34 58 Q52 58 52 46 Q52 38 42 35 Q50 31 50 22 Q50 6 32 6 Z
         M16 14 L30 14 Q40 14 40 22 Q40 30 30 30 L16 30 Z
         M16 38 L32 38 Q44 38 44 46 Q44 54 32 54 L16 54 Z" fill="rgba(255,255,255,0.88)" />
    <path d="M22 42 L24 28 L46 28 L42 42 Z" fill="rgba(232,25,44,0.85)" opacity="0.9" />
    <line x1="24" y1="35" x2="44" y2="35" stroke="white" strokeWidth="1.5" opacity="0.7" />
    <circle cx="28" cy="46" r="3.5" fill="#E8192C" />
    <circle cx="28" cy="46" r="1.5" fill="white" />
    <circle cx="39" cy="46" r="3.5" fill="#E8192C" />
    <circle cx="39" cy="46" r="1.5" fill="white" />
  </svg>
)

const BrendexLogoFull = ({ iconSize = 36 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <BCartIcon size={iconSize} />
    <span style={{ fontFamily: "'Sora','Segoe UI',sans-serif", fontWeight: 900, fontSize: Math.round(iconSize * 0.92), letterSpacing: "-0.03em", lineHeight: 1, display: "flex", alignItems: "center" }}>
      <span style={{ color: "#E8192C" }}>REND</span>
      <span style={{ color: "#1a1a1a" }}>EX</span>
    </span>
  </div>
)

const MobileLogoFull = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <BCartIcon size={32} />
    <span style={{ fontFamily: "'Sora','Segoe UI',sans-serif", fontWeight: 900, fontSize: 17, letterSpacing: "-0.02em", lineHeight: 1, display: "flex", alignItems: "center" }}>
      <span style={{ color: "#E8192C" }}>REND</span>
      <span style={{ color: "#1a1a1a" }}>EX</span>
    </span>
  </div>
)

const SidebarLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <SidebarBCartIcon size={32} />
    <div>
      <span style={{ color: "white", fontWeight: 900, fontSize: 15, fontFamily: "'Sora',sans-serif", letterSpacing: "-0.02em", display: "block", lineHeight: 1.1 }}>RENDEX</span>
      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Sora',sans-serif", display: "block" }}>Online Store</span>
    </div>
  </div>
)

/* ─────────────────────────────────────────────
   15 ANA KATEQORİYA + TAM SUBKATEQORİYALAR
───────────────────────────────────────────── */
function getMainCategories(t) {
  return [
  {
    label: t("navCategories.electronics_label"), sub: t("navCategories.electronics_sub"),
    icon: Tv, slug: "electronics", color: "#E8192C", bg: "#fff5f5",
    subcategories: [
      { key: "Electronics_TV",       label: t("navCategories.electronics_tv"),        icon: Tv        },
      { key: "Electronics_Photo",    label: t("navCategories.electronics_photo"),      icon: Camera    },
      { key: "Electronics_Console",  label: t("navCategories.electronics_console"),    icon: Gamepad2  },
      { key: "Electronics_SmartHome",label: t("navCategories.electronics_smarthome"),  icon: Wifi      },
      { key: "Electronics_Gadgets",  label: t("navCategories.electronics_gadgets"),    icon: Cpu       },
      { key: "Electronics_Acc",      label: t("navCategories.electronics_acc"),        icon: Plug      },
    ],
  },
  {
    label: t("navCategories.phones_label"), sub: t("navCategories.phones_sub"),
    icon: Smartphone, slug: "phones", color: "#c0112a", bg: "#fce4e4",
    subcategories: [
      { key: "Phones_Smartphone",  label: t("navCategories.phones_smartphone"),  icon: Smartphone },
      { key: "Phones_Basic",       label: t("navCategories.phones_basic"),       icon: Smartphone },
      { key: "Phones_Headphones",  label: t("navCategories.phones_headphones"),  icon: Headphones },
      { key: "Phones_Cables",      label: t("navCategories.phones_cables"),      icon: Zap        },
      { key: "Phones_Powerbank",   label: t("navCategories.phones_powerbank"),   icon: Zap        },
      { key: "Phones_Acc",         label: t("navCategories.phones_acc"),         icon: Package    },
    ],
  },
  {
    label: t("navCategories.computers_label"), sub: t("navCategories.computers_sub"),
    icon: Laptop, slug: "computers", color: "#0369a1", bg: "#e0f2fe",
    subcategories: [
      { key: "Computers_Laptop",     label: t("navCategories.computers_laptop"),     icon: Laptop   },
      { key: "Computers_Desktop",    label: t("navCategories.computers_desktop"),    icon: Monitor  },
      { key: "Computers_Monitor",    label: t("navCategories.computers_monitor"),    icon: Monitor  },
      { key: "Computers_Printer",    label: t("navCategories.computers_printer"),    icon: Printer  },
      { key: "Computers_OfficeAcc",  label: t("navCategories.computers_officeacc"), icon: Package  },
      { key: "Computers_Parts",      label: t("navCategories.computers_parts"),      icon: Cpu      },
    ],
  },
  {
    label: t("navCategories.appliances_label"), sub: t("navCategories.appliances_sub"),
    icon: Refrigerator, slug: "appliances", color: "#2e7d32", bg: "#e8f5e9",
    subcategories: [
      { key: "HomeAppliances_Large",   label: t("navCategories.appliances_large"),   icon: Refrigerator },
      { key: "HomeAppliances_Small",   label: t("navCategories.appliances_small"),   icon: Zap          },
      { key: "HomeAppliances_Kitchen", label: t("navCategories.appliances_kitchen"), icon: Microwave    },
      { key: "HomeAppliances_Climate", label: t("navCategories.appliances_climate"), icon: Wind         },
      { key: "HomeAppliances_Water",   label: t("navCategories.appliances_water"),   icon: Droplets     },
    ],
  },
  {
    label: t("navCategories.home_label"), sub: t("navCategories.home_sub"),
    icon: Flower2, slug: "home", color: "#0f766e", bg: "#ccfbf1",
    subcategories: [
      { key: "HomeDecor_Deco",    label: t("navCategories.home_deco"),    icon: Flower2         },
      { key: "HomeDecor_Light",   label: t("navCategories.home_light"),   icon: Lamp            },
      { key: "HomeDecor_Textile", label: t("navCategories.home_textile"), icon: Shirt           },
      { key: "HomeDecor_Kitchen", label: t("navCategories.home_kitchen"), icon: UtensilsCrossed },
      { key: "HomeDecor_Bath",    label: t("navCategories.home_bath"),    icon: Bath            },
    ],
  },
  {
    label: t("navCategories.furniture_label"), sub: t("navCategories.furniture_sub"),
    icon: Sofa, slug: "furniture", color: "#b45309", bg: "#fef3c7",
    subcategories: [
      { key: "Furniture_Living",  label: t("navCategories.furniture_living"),   icon: Sofa            },
      { key: "Furniture_Bedroom", label: t("navCategories.furniture_bedroom"),  icon: Bed             },
      { key: "Furniture_Kitchen", label: t("navCategories.furniture_kitchen"),  icon: UtensilsCrossed },
      { key: "Furniture_Office",  label: t("navCategories.furniture_office"),   icon: Laptop          },
      { key: "Furniture_Garden",  label: t("navCategories.furniture_garden"),   icon: Flower2         },
    ],
  },
  {
    label: t("navCategories.womenclothing_label"), sub: t("navCategories.womenclothing_sub"),
    icon: Shirt, slug: "womenclothing", color: "#db2777", bg: "#fdf2f8",
    subcategories: [
      { key: "WomenClothing_Outer",  label: t("navCategories.womenclothing_outer"),  icon: Shirt   },
      { key: "WomenClothing_Inner",  label: t("navCategories.womenclothing_inner"),  icon: Shirt   },
      { key: "WomenClothing_Casual", label: t("navCategories.womenclothing_casual"), icon: Shirt   },
      { key: "WomenClothing_Sport",  label: t("navCategories.womenclothing_sport"),  icon: Dumbbell},
      { key: "WomenClothing_Formal", label: t("navCategories.womenclothing_formal"), icon: Shirt   },
      { key: "WomenClothing_Under",  label: t("navCategories.womenclothing_under"),  icon: Shirt   },
    ],
  },
  {
    label: t("navCategories.menclothing_label"), sub: t("navCategories.menclothing_sub"),
    icon: Shirt, slug: "menclothing", color: "#1d4ed8", bg: "#eff6ff",
    subcategories: [
      { key: "MenClothing_Outer",  label: t("navCategories.menclothing_outer"),  icon: Shirt    },
      { key: "MenClothing_Inner",  label: t("navCategories.menclothing_inner"),  icon: Shirt    },
      { key: "MenClothing_Casual", label: t("navCategories.menclothing_casual"), icon: Shirt    },
      { key: "MenClothing_Sport",  label: t("navCategories.menclothing_sport"),  icon: Dumbbell },
      { key: "MenClothing_Formal", label: t("navCategories.menclothing_formal"), icon: Shirt    },
      { key: "MenClothing_Under",  label: t("navCategories.menclothing_under"),  icon: Shirt    },
    ],
  },
  {
    label: t("navCategories.shoes_label"), sub: t("navCategories.shoes_sub"),
    icon: Footprints, slug: "shoes", color: "#be185d", bg: "#fce7f3",
    subcategories: [
      { key: "Shoes_Sport",   label: t("navCategories.shoes_sport"),   icon: Footprints },
      { key: "Shoes_Classic", label: t("navCategories.shoes_classic"), icon: Footprints },
      { key: "Shoes_Casual",  label: t("navCategories.shoes_casual"),  icon: Footprints },
      { key: "Shoes_Sandal",  label: t("navCategories.shoes_sandals"), icon: Footprints },
    ],
  },
  {
    label: t("navCategories.accessories_label"), sub: t("navCategories.accessories_sub"),
    icon: Watch, slug: "accessories", color: "#7c3aed", bg: "#f5f3ff",
    subcategories: [
      { key: "Accessories_Bag",        label: t("navCategories.accessories_bags"),        icon: ShoppingBag },
      { key: "Accessories_Watch",      label: t("navCategories.accessories_watches"),     icon: Watch       },
      { key: "Accessories_Sunglasses", label: t("navCategories.accessories_sunglasses"),  icon: Glasses     },
      { key: "Accessories_Jewelry",    label: t("navCategories.accessories_jewelry"),     icon: Sparkles    },
      { key: "Accessories_Belt",       label: t("navCategories.accessories_belts"),       icon: Package     },
    ],
  },
  {
    label: t("navCategories.beauty_label"), sub: t("navCategories.beauty_sub"),
    icon: Sparkles, slug: "beauty", color: "#e11d48", bg: "#fff1f2",
    subcategories: [
      { key: "Beauty_Makeup",  label: t("navCategories.beauty_makeup"),  icon: Sparkles },
      { key: "Beauty_Skin",    label: t("navCategories.beauty_skin"),    icon: Sparkles },
      { key: "Beauty_Hair",    label: t("navCategories.beauty_hair"),    icon: Sparkles },
      { key: "Beauty_Perfume", label: t("navCategories.beauty_perfume"), icon: Sparkles },
      { key: "Beauty_Men",     label: t("navCategories.beauty_men"),     icon: User     },
      { key: "Beauty_Hygiene", label: t("navCategories.beauty_hygiene"), icon: Sparkles },
    ],
  },
  {
    label: t("navCategories.kids_label"), sub: t("navCategories.kids_sub"),
    icon: Baby, slug: "kids", color: "#f57c00", bg: "#fff3e0",
    subcategories: [
      { key: "KidsAndMom_Clothing", label: t("navCategories.kids_clothing"), icon: Baby     },
      { key: "KidsAndMom_Toys",     label: t("navCategories.kids_toys"),     icon: Gamepad2 },
      { key: "KidsAndMom_Stroller", label: t("navCategories.kids_strollers"),icon: Baby     },
      { key: "KidsAndMom_Food",     label: t("navCategories.kids_food"),     icon: Baby     },
      { key: "KidsAndMom_School",   label: t("navCategories.kids_school"),   icon: BookOpen },
    ],
  },
  {
    label: t("navCategories.sports_label"), sub: t("navCategories.sports_sub"),
    icon: Dumbbell, slug: "sport", color: "#15803d", bg: "#dcfce7",
    subcategories: [
      { key: "Sports_Fitness",  label: t("navCategories.sports_fitness"),  icon: Dumbbell },
      { key: "Sports_Camping",  label: t("navCategories.sports_camping"),  icon: Tent     },
      { key: "Sports_Bicycle",  label: t("navCategories.sports_bicycles"), icon: Bike     },
      { key: "Sports_Clothing", label: t("navCategories.sports_clothing"), icon: Shirt    },
      { key: "Sports_Acc",      label: t("navCategories.sports_acc"),      icon: Package  },
    ],
  },
  {
    label: t("navCategories.auto_label"), sub: t("navCategories.auto_sub"),
    icon: Car, slug: "automotive", color: "#374151", bg: "#f3f4f6",
    subcategories: [
      { key: "Automotive_Acc",         label: t("navCategories.auto_acc"),         icon: Car          },
      { key: "Automotive_Electronics", label: t("navCategories.auto_electronics"), icon: Monitor      },
      { key: "Automotive_Parts",       label: t("navCategories.auto_parts"),       icon: Wrench       },
      { key: "Automotive_Oils",        label: t("navCategories.auto_oils"),        icon: FlaskConical },
    ],
  },
  {
    label: t("navCategories.gifts_label"), sub: t("navCategories.gifts_sub"),
    icon: Gift, slug: "gifts", color: "#9333ea", bg: "#faf5ff",
    subcategories: [
      { key: "Gifts_Sets",     label: t("navCategories.gifts_sets"),      icon: Gift       },
      { key: "Gifts_Souvenir", label: t("navCategories.gifts_souvenirs"), icon: Sparkles   },
      { key: "Gifts_Trending", label: t("navCategories.gifts_trending"),  icon: TrendingUp },
      { key: "Gifts_Books",    label: t("navCategories.gifts_books"),     icon: BookOpen   },
    ],
  },
  ]
}

/* local test products slug→category map */
const SLUG_TO_CATEGORIES = {
  electronics:    ["Electronics_TV","Electronics_Photo","Electronics_Console","Electronics_SmartHome","Electronics_Gadgets","Electronics_Acc"],
  phones:         ["Phones_Smartphone","Phones_Basic","Phones_Headphones","Phones_Cables","Phones_Powerbank","Phones_Acc"],
  computers:      ["Computers_Laptop","Computers_Desktop","Computers_Monitor","Computers_Printer","Computers_OfficeAcc","Computers_Parts"],
  appliances:     ["HomeAppliances_Large","HomeAppliances_Small","HomeAppliances_Kitchen","HomeAppliances_Climate","HomeAppliances_Water"],
  home:           ["HomeDecor_Deco","HomeDecor_Light","HomeDecor_Textile","HomeDecor_Kitchen","HomeDecor_Bath"],
  furniture:      ["Furniture_Living","Furniture_Bedroom","Furniture_Kitchen","Furniture_Office","Furniture_Garden"],
  womenclothing:  ["WomenClothing_Outer","WomenClothing_Inner","WomenClothing_Casual","WomenClothing_Sport","WomenClothing_Formal","WomenClothing_Under"],
  menclothing:    ["MenClothing_Outer","MenClothing_Inner","MenClothing_Casual","MenClothing_Sport","MenClothing_Formal","MenClothing_Under"],
  shoes:          ["Shoes_Sport","Shoes_Classic","Shoes_Casual","Shoes_Sandal"],
  accessories:    ["Accessories_Bag","Accessories_Watch","Accessories_Sunglasses","Accessories_Jewelry","Accessories_Belt"],
  beauty:         ["Beauty_Makeup","Beauty_Skin","Beauty_Hair","Beauty_Perfume","Beauty_Men","Beauty_Hygiene"],
  kids:           ["KidsAndMom_Clothing","KidsAndMom_Toys","KidsAndMom_Stroller","KidsAndMom_Food","KidsAndMom_School"],
  sport:          ["Sports_Fitness","Sports_Camping","Sports_Bicycle","Sports_Clothing","Sports_Acc"],
  automotive:     ["Automotive_Acc","Automotive_Electronics","Automotive_Parts","Automotive_Oils"],
  gifts:          ["Gifts_Sets","Gifts_Souvenir","Gifts_Trending","Gifts_Books"],
}

const LOCAL_PRODUCTS = [
  { _id:"p1",  name:"Samsung 65\" 4K QLED TV",         price:1299.99, ratings:4.7, category:"Electronics_TV",          seller:"Samsung",     numOfReviews:89,   images:[{url:"https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739452191/1_org_zoom_oorv7q.webp"}] },
  { _id:"p2",  name:"Sony WH-1000XM5 Qulaqlıq",        price:349.99,  ratings:4.8, category:"Phones_Headphones",       seller:"Sony",        numOfReviews:234,  images:[{url:"https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739371207/Gaming_Heatds_zu8u8z.webp"}] },
  { _id:"p3",  name:"Canon EOS R50 Kamera",             price:879.99,  ratings:4.6, category:"Electronics_Photo",       seller:"Canon",       numOfReviews:67,   images:[{url:"https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739372538/1_org_zoom_7_yfrron.webp"}] },
  { _id:"p4",  name:"PlayStation 5 Konsol",             price:649.99,  ratings:4.9, category:"Electronics_Console",     seller:"Sony",        numOfReviews:412,  images:[{url:"https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739434190/1_org_zoom_hr08ir.webp"}] },
  { _id:"p5",  name:"Apple iPhone 15 Pro 256GB",        price:1199.99, ratings:4.8, category:"Phones_Smartphone",       seller:"Apple",       numOfReviews:891,  images:[{url:"https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739452191/1_org_zoom_oorv7q.webp"}] },
  { _id:"p6",  name:"Samsung Galaxy S24 Ultra",         price:1099.99, ratings:4.7, category:"Phones_Smartphone",       seller:"Samsung",     numOfReviews:543,  images:[{url:null}] },
  { _id:"p7",  name:"Anker 20000mAh Powerbank",         price:49.99,   ratings:4.5, category:"Phones_Powerbank",        seller:"Anker",       numOfReviews:189,  images:[{url:null}] },
  { _id:"p8",  name:"MacBook Pro M3 14-inch",           price:1999.99, ratings:4.9, category:"Computers_Laptop",        seller:"Apple",       numOfReviews:267,  images:[{url:"https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739378739/1_org_zoom_6_dii1wp.webp"}] },
  { _id:"p9",  name:"Dell UltraSharp 27\" Monitor",     price:549.99,  ratings:4.6, category:"Computers_Monitor",       seller:"Dell",        numOfReviews:134,  images:[{url:null}] },
  { _id:"p10", name:"HP LaserJet Pro Printer",          price:299.99,  ratings:4.3, category:"Computers_Printer",       seller:"HP",          numOfReviews:78,   images:[{url:null}] },
  { _id:"p11", name:"Samsung Side-by-Side Soyuducu",    price:1499.99, ratings:4.5, category:"HomeAppliances_Large",    seller:"Samsung",     numOfReviews:56,   images:[{url:null}] },
  { _id:"p12", name:"Dyson V15 Tozsoran",               price:699.99,  ratings:4.8, category:"HomeAppliances_Small",    seller:"Dyson",       numOfReviews:312,  images:[{url:null}] },
  { _id:"p13", name:"Nespresso Vertuo Qəhvə Maşını",    price:249.99,  ratings:4.7, category:"HomeAppliances_Kitchen",  seller:"Nespresso",   numOfReviews:445,  images:[{url:null}] },
  { _id:"p14", name:"Daikin 24000 BTU Kondisioner",     price:899.99,  ratings:4.6, category:"HomeAppliances_Climate",  seller:"Daikin",      numOfReviews:89,   images:[{url:null}] },
  { _id:"p15", name:"Modern Qonaq Divani (3-lük)",      price:799.99,  ratings:4.4, category:"Furniture_Living",        seller:"FurnitureAZ", numOfReviews:43,   images:[{url:null}] },
  { _id:"p16", name:"Yataq Dəsti 180x200 Premium",      price:349.99,  ratings:4.5, category:"Furniture_Bedroom",       seller:"SleepWell",   numOfReviews:67,   images:[{url:null}] },
  { _id:"p17", name:"IKEA Ofis Stolu Minimalist",       price:199.99,  ratings:4.3, category:"Furniture_Office",        seller:"IKEA",        numOfReviews:156,  images:[{url:null}] },
  { _id:"p18", name:"Zara Qadın Palto Qış 2024",        price:129.99,  ratings:4.6, category:"WomenClothing_Outer",     seller:"Zara",        numOfReviews:234,  images:[{url:null}] },
  { _id:"p19", name:"H&M Casual Qadın Donu",            price:49.99,   ratings:4.4, category:"WomenClothing_Casual",    seller:"H&M",         numOfReviews:189,  images:[{url:null}] },
  { _id:"p20", name:"Nike Air Force 1 '07",             price:109.99,  ratings:4.7, category:"Shoes_Sport",             seller:"Nike",        numOfReviews:789,  images:[{url:null}] },
  { _id:"p21", name:"Gucci GG Marmont Çanta",           price:899.99,  ratings:4.9, category:"Accessories_Bag",         seller:"Gucci",       numOfReviews:67,   images:[{url:null}] },
  { _id:"p22", name:"Ray-Ban Aviator Eynəyi",           price:159.99,  ratings:4.6, category:"Accessories_Sunglasses",  seller:"Ray-Ban",     numOfReviews:445,  images:[{url:null}] },
  { _id:"p23", name:"Chanel N°5 Parfüm 100ml",          price:249.99,  ratings:4.8, category:"Beauty_Perfume",          seller:"Chanel",      numOfReviews:234,  images:[{url:null}] },
  { _id:"p24", name:"La Mer Nəmləndirici Krem 60ml",    price:189.99,  ratings:4.7, category:"Beauty_Skin",             seller:"La Mer",      numOfReviews:178,  images:[{url:null}] },
  { _id:"p25", name:"LEGO Technic 42154 Set",           price:89.99,   ratings:4.8, category:"KidsAndMom_Toys",         seller:"LEGO",        numOfReviews:567,  images:[{url:null}] },
  { _id:"p26", name:"Uşaq Arabası 3-ü 1-də",           price:399.99,  ratings:4.5, category:"KidsAndMom_Stroller",     seller:"BabyStyle",   numOfReviews:89,   images:[{url:null}] },
  { _id:"p27", name:"Bowflex 552 Dumbell Dəsti",        price:349.99,  ratings:4.7, category:"Sports_Fitness",          seller:"Bowflex",     numOfReviews:234,  images:[{url:null}] },
  { _id:"p28", name:"Coleman Camping Çadırı 4-nəfər",   price:229.99,  ratings:4.5, category:"Sports_Camping",          seller:"Coleman",     numOfReviews:123,  images:[{url:null}] },
  { _id:"p29", name:"Trek Marlin 7 Velosiped",          price:799.99,  ratings:4.6, category:"Sports_Bicycle",          seller:"Trek",        numOfReviews:78,   images:[{url:null}] },
  { _id:"p30", name:"Pioneer DEH-S120UB Car Audio",     price:89.99,   ratings:4.4, category:"Automotive_Electronics",  seller:"Pioneer",     numOfReviews:167,  images:[{url:null}] },
  { _id:"p31", name:"Mobil 1 5W-30 Motor Yağı 4L",     price:54.99,   ratings:4.6, category:"Automotive_Oils",         seller:"Mobil",       numOfReviews:312,  images:[{url:null}] },
  { _id:"p32", name:"Hədiyyə Qutusu Premium Seçim",     price:79.99,   ratings:4.7, category:"Gifts_Sets",              seller:"GiftWorld",   numOfReviews:234,  images:[{url:null}] },
  { _id:"p33", name:"Apple Watch Series 9 45mm",        price:449.99,  ratings:4.8, category:"Accessories_Watch",       seller:"Apple",       numOfReviews:567,  images:[{url:null}] },
  { _id:"p34", name:"Gold Qızıl Boyunbağı 18K",         price:499.99,  ratings:4.9, category:"Accessories_Jewelry",     seller:"LuxJewels",   numOfReviews:89,   images:[{url:null}] },
  { _id:"p35", name:"Dyson Airwrap Saç Cihazı",         price:599.99,  ratings:4.7, category:"Beauty_Hair",             seller:"Dyson",       numOfReviews:456,  images:[{url:null}] },
  { _id:"p36", name:"Xiaomi Smart Home Hub",            price:79.99,   ratings:4.4, category:"Electronics_SmartHome",   seller:"Xiaomi",      numOfReviews:345,  images:[{url:null}] },
  { _id:"p37", name:"Stanley Termos 1L (Trending)",     price:44.99,   ratings:4.6, category:"Gifts_Trending",          seller:"Stanley",     numOfReviews:1234, images:[{url:null}] },
  { _id:"p38", name:"Python 2024 Kitabı",               price:34.99,   ratings:4.8, category:"Gifts_Books",             seller:"Atom",        numOfReviews:234,  images:[{url:null}] },
  { _id:"p39", name:"Gillette Fusion ProGlide",         price:29.99,   ratings:4.5, category:"Beauty_Men",              seller:"Gillette",    numOfReviews:789,  images:[{url:null}] },
  { _id:"p40", name:"Xiaomi Redmi Note 13 Pro",         price:399.99,  ratings:4.5, category:"Phones_Smartphone",       seller:"Xiaomi",      numOfReviews:678,  images:[{url:null}] },
]

const languages = [
  { code:"az", label:"Azərbaycan", flag:"🇦🇿", short:"AZ"  },
  { code:"en", label:"English",    flag:"🇬🇧", short:"EN"  },
  { code:"ru", label:"Русский",    flag:"🇷🇺", short:"RUS" },
  { code:"tr", label:"Türkçe",     flag:"🇹🇷", short:"TR"  },
]

const C = {
  primary:     "#E8192C",
  primarySoft: "#ff4d5e",
  rose50:      "#fff5f5",
  rose100:     "#ffe4e6",
  rose200:     "#fecdd3",
  dark:        "#1c1c1e",
  mid:         "#6b7280",
  light:       "#d1d5db",
}

/* ─────────────────────────────────────────────
   DİL SEÇİCİ
───────────────────────────────────────────── */
function LanguageSwitcher() {
  const dispatch    = useDispatch()
  const currentLang = useSelector((s) => s.language.currentLang)
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const active = languages.find(l => l.code === currentLang) || languages[0]

  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block" }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        height:36, padding:"0 12px", borderRadius:99,
        border:`1.5px solid ${isOpen ? C.rose200 : "#e5e7eb"}`,
        background:isOpen ? C.rose50 : "#fff",
        cursor:"pointer", display:"flex", alignItems:"center", gap:6,
        transition:"all .18s", fontFamily:"'Sora',sans-serif",
        fontSize:12, fontWeight:700,
        color:isOpen ? C.primary : C.mid,
        boxShadow:isOpen ? `0 0 0 3px ${C.rose100}` : "none",
      }}>
        <span style={{ fontSize:16 }}>{active.flag}</span>
        <span>{active.short}</span>
        <ChevronDown size={11} style={{ transition:"transform .2s", transform:isOpen ? "rotate(180deg)" : "rotate(0)" }} />
      </button>
      {isOpen && (
        <ul style={{
          position:"absolute", top:"calc(100% + 8px)", right:0,
          background:"#fff", border:"1.5px solid #f3f4f6",
          borderRadius:16, listStyle:"none", margin:0,
          padding:"6px", minWidth:140,
          boxShadow:"0 12px 40px rgba(0,0,0,0.10)", zIndex:1000,
          animation:"nbLangDrop .18s ease",
        }}>
          {languages.map((lang) => {
            const isAct = currentLang === lang.code
            return (
              <li key={lang.code}
                onClick={() => { dispatch(setLanguage(lang.code)); setIsOpen(false) }}
                style={{
                  display:"flex", alignItems:"center", gap:9,
                  padding:"8px 12px", cursor:"pointer", borderRadius:10,
                  fontFamily:"'Sora',sans-serif", fontSize:13,
                  fontWeight:isAct ? 700 : 500,
                  color:isAct ? C.primary : C.dark,
                  background:isAct ? C.rose50 : "transparent",
                  transition:"background .12s",
                }}
                onMouseEnter={e => { if (!isAct) e.currentTarget.style.background = "#f9fafb" }}
                onMouseLeave={e => { if (!isAct) e.currentTarget.style.background = "transparent" }}
              >
                <span style={{ fontSize:18 }}>{lang.flag}</span>
                <span>{lang.short}</span>
                {isAct && <span style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:C.primary }} />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   BİLDİRİŞ ZƏNGI
───────────────────────────────────────────── */
function NotificationBell({ isMobile = false }) {
  const { t }                        = useTranslation()
  const dispatch                     = useDispatch()
  const navigate                     = useNavigate()
  const { unreadCount }              = useSelector((s) => s.notifications)
  const { isAuthenticated }          = useSelector((s) => s.userSlice)
  const [shake, setShake]            = useState(false)
  const prevCount                    = useRef(unreadCount)

  useEffect(() => {
    if (unreadCount > prevCount.current) { setShake(true); setTimeout(() => setShake(false), 600) }
    prevCount.current = unreadCount
  }, [unreadCount])

  return (
    <button
      className={`${isMobile ? "" : "bib"} ${shake ? "nb-shake" : ""}`}
      style={isMobile
        ? { position:"relative", display:"flex", alignItems:"center", justifyContent:"center", width:40, height:40, borderRadius:13, border:"none", background:"transparent", cursor:"pointer", color:"#6b7280" }
        : { position:"relative", width:40, height:40, borderRadius:13, border:"none", background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#6b7280", transition:"all .2s ease" }
      }
      onClick={() => navigate("/notifications")}
      title={t("navbar.notifications") || "Bildirişlər"}
    >
      <Bell size={18} />
      {unreadCount > 0 && (
        <span className="bbd nb-badge-anim" style={{ top:2, right:2 }}>
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  )
}

/* ─────────────────────────────────────────────
   MƏHSUL KARTI
───────────────────────────────────────────── */
function ProductCard({ product, onClose }) {
  const navigate = useNavigate()
  const { t }    = useTranslation()
  const [hovered, setHovered] = useState(false)
  const hasImg = product.images?.[0]?.url

  return (
    <div
      onClick={() => { navigate(`/product/${product._id}`); onClose() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"#fff", borderRadius:16, overflow:"hidden", cursor:"pointer",
        border:`1.5px solid ${hovered ? C.rose200 : "#f3f4f6"}`,
        transition:"all .22s ease",
        transform:hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow:hovered ? `0 12px 32px rgba(232,25,44,0.10),0 2px 8px rgba(0,0,0,0.04)` : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ position:"relative", paddingTop:"75%", background:C.rose50 }}>
        {hasImg
          ? <img src={product.images[0].url} alt={product.name} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          : <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg,${C.rose50},${C.rose100})` }}><Camera size={26} color={C.rose200} /></div>
        }
      </div>
      <div style={{ padding:"11px 13px 13px" }}>
        <p style={{ margin:0, fontSize:12, fontWeight:600, color:C.dark, lineHeight:1.45, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", fontFamily:"'Sora',sans-serif" }}>{product.name}</p>
        {product.ratings > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:2, marginTop:6 }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={s <= Math.round(product.ratings) ? "#f59e0b" : "none"} color={s <= Math.round(product.ratings) ? "#f59e0b" : "#e5e7eb"} />)}
            <span style={{ fontSize:10, color:C.light, marginLeft:3, fontFamily:"'Sora',sans-serif" }}>({product.numOfReviews})</span>
          </div>
        )}
        <span style={{ display:"block", marginTop:7, fontSize:14, fontWeight:800, color:C.primary, fontFamily:"'Sora',sans-serif" }}>
          {product.price?.toLocaleString("az-AZ", { minimumFractionDigits:2 })} {t("common.currency")}
        </span>
        <p style={{ margin:"3px 0 0", fontSize:10, color:C.light, fontFamily:"'Sora',sans-serif" }}>{product.seller}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   KATEQORİYA MƏHSUL PANELİ (subkateqoriya tabları ilə)
───────────────────────────────────────────── */
function CategoryProductPanel({ cat, onClose, onCategoryNavigate }) {
  const { t } = useTranslation()
  const [sortBy, setSortBy]           = useState("default")
  const [priceRange, setPriceRange]   = useState(null)
  const [minRating, setMinRating]     = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [activeSub, setActiveSub]     = useState(null)

  const slugCats    = SLUG_TO_CATEGORIES[cat.slug] ?? []
  const allProducts = cat.slug
    ? LOCAL_PRODUCTS.filter(p => slugCats.includes(p.category))
    : LOCAL_PRODUCTS
  const baseProd    = activeSub ? allProducts.filter(p => p.category === activeSub) : allProducts
  const maxPrice    = baseProd.length > 0 
    ? Math.ceil(Math.max(...baseProd.map(p => Number(p.price) || 0)) / 50) * 50 
    : 1000

  useEffect(() => { setPriceRange(maxPrice) }, [maxPrice, activeSub])

  const displayed = (() => {
    let l = [...baseProd]
    if (sortBy === "price_asc")  l.sort((a, b) => a.price - b.price)
    if (sortBy === "price_desc") l.sort((a, b) => b.price - a.price)
    if (sortBy === "rating")     l.sort((a, b) => (b.ratings ?? 0) - (a.ratings ?? 0))
    if (sortBy === "reviews")    l.sort((a, b) => (b.numOfReviews ?? 0) - (a.numOfReviews ?? 0))
    if (priceRange !== null)     l = l.filter(p => (p.price ?? 0) <= priceRange)
    if (minRating > 0)           l = l.filter(p => (p.ratings ?? 0) >= minRating)
    return l
  })()

  const pct  = priceRange !== null ? Math.round((priceRange / maxPrice) * 100) : 100
  const Icon = cat.icon

  const SORT_OPTIONS = [
    { value:"default",    label:t("sort.default")   },
    { value:"price_asc",  label:t("sort.priceAsc")  },
    { value:"price_desc", label:t("sort.priceDesc") },
    { value:"rating",     label:t("sort.rating")    },
    { value:"reviews",    label:t("sort.reviews")   },
  ]

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex" }}>
      <style>{`
        @keyframes cpFd    { from{opacity:0} to{opacity:1} }
        @keyframes cpSl    { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes cpSlMob { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        .cps::-webkit-scrollbar{width:3px}
        .cps::-webkit-scrollbar-thumb{background:${C.rose200};border-radius:4px}
        .cpr{-webkit-appearance:none;width:100%;height:4px;border:none;outline:none;border-radius:99px;cursor:pointer;background:linear-gradient(90deg,${C.primary} 0%,${C.primary} var(--p),#f3f4f6 var(--p),#f3f4f6 100%);}
        .cpr::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,${C.primarySoft},${C.primary});cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(232,25,44,0.35);transition:transform .15s;}
        .cpr::-webkit-slider-thumb:hover{transform:scale(1.15)}
        .cpch{display:flex;align-items:center;gap:3px;padding:5px 10px;border-radius:99px;cursor:pointer;font-size:11px;font-weight:700;transition:all .15s;font-family:'Sora',sans-serif}
        .cat-panel{position:relative;margin-left:auto;width:min(920px,97vw);height:100%;background:#fff;display:flex;flex-direction:column;animation:cpSl 0.3s cubic-bezier(0.4,0,0.2,1);box-shadow:-16px 0 60px rgba(0,0,0,0.10);font-family:'Sora',sans-serif;border-radius:24px 0 0 24px;}
        @media(max-width:768px){.cat-panel{margin-left:0;margin-top:auto;width:100%;height:94vh;border-radius:24px 24px 0 0;animation:cpSlMob 0.3s cubic-bezier(0.34,1.10,0.64,1);box-shadow:0 -12px 60px rgba(0,0,0,0.12);}}
        .cat-filters-row{display:flex;flex-wrap:wrap;gap:16px;padding:14px 18px;border-bottom:1px solid #f3f4f6;background:${C.rose50};flex-shrink:0}
        .cat-prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));gap:14px;}
        @media(max-width:640px){.cat-prod-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important}}
        .sub-tab{padding:6px 14px;border-radius:99px;border:1.5px solid #e5e7eb;background:#fff;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;font-family:'Sora',sans-serif;white-space:nowrap;display:flex;align-items:center;gap:5px;}
        .sub-tab:hover{border-color:${C.rose200};color:${C.primary};background:${C.rose50}}
        .sub-tab.active{border-color:${C.primary};background:${C.primary};color:#fff}
        .sub-tabs-row{display:flex;gap:7px;overflow-x:auto;padding:10px 18px 6px;flex-shrink:0}
        .sub-tabs-row::-webkit-scrollbar{height:0}
      `}</style>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(15,10,10,0.40)", backdropFilter:"blur(6px)", animation:"cpFd 0.2s" }} />
      <div className="cat-panel">
        <div style={{ display:"flex", justifyContent:"center", paddingTop:10, paddingBottom:2 }}>
          <div style={{ width:44, height:5, background:C.rose200, borderRadius:3 }} />
        </div>
        <div style={{ padding:"14px 20px", borderBottom:`1px solid #f3f4f6`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <div style={{ width:44, height:44, borderRadius:14, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 4px 14px ${cat.color}22` }}>
            <Icon size={20} color={cat.color} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:C.dark }}>{cat.label}</h2>
            <p style={{ margin:0, fontSize:11, color:C.mid }}>
              {displayed.length} məhsul
              {allProducts.length !== displayed.length && <span style={{ color:C.primary }}> (filter)</span>}
            </p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
            <div style={{ position:"relative" }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ appearance:"none", padding:"7px 30px 7px 12px", borderRadius:12, border:`1.5px solid #e5e7eb`, background:"#fff", fontSize:12, fontWeight:600, color:C.mid, cursor:"pointer", fontFamily:"'Sora',sans-serif", outline:"none" }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ArrowUpDown size={11} color={C.light} style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
            </div>
            <button onClick={() => setShowFilters(p => !p)} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 13px", borderRadius:12, border:`1.5px solid ${showFilters ? C.primary : "#e5e7eb"}`, background:showFilters ? C.rose50 : "#fff", color:showFilters ? C.primary : C.mid, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s" }}>
              <SlidersHorizontal size={13} /> Filter
            </button>
            <button onClick={onClose} style={{ width:36, height:36, borderRadius:11, border:"none", background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <X size={15} color={C.mid} />
            </button>
          </div>
        </div>

        {/* Subkateqoriya tabları */}
        {cat.subcategories && cat.subcategories.length > 0 && (
          <div className="sub-tabs-row">
            <button className={`sub-tab ${activeSub === null ? "active" : ""}`} onClick={() => setActiveSub(null)}
              style={{ color:activeSub === null ? "#fff" : C.mid, borderColor:activeSub === null ? C.primary : "#e5e7eb", background:activeSub === null ? C.primary : "#fff" }}>
              Hamısı · {allProducts.length}
            </button>
            {cat.subcategories.map(sub => {
              const count = allProducts.filter(p => p.category === sub.key).length
              const SubIcon = sub.icon
              const isActive = activeSub === sub.key
              return (
                <button key={sub.key} className={`sub-tab ${isActive ? "active" : ""}`}
                  onClick={() => setActiveSub(isActive ? null : sub.key)}
                  style={{ color:isActive ? "#fff" : C.mid, borderColor:isActive ? C.primary : "#e5e7eb", background:isActive ? C.primary : "#fff" }}>
                  <SubIcon size={11} />
                  {sub.label} {count > 0 && `· ${count}`}
                </button>
              )
            })}
          </div>
        )}

        {showFilters && (
          <div className="cat-filters-row">
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:700, color:C.mid, textTransform:"uppercase", letterSpacing:0.8 }}>Qiymət aralığı</span>
                <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>0 – {priceRange} ₼</span>
              </div>
              <input type="range" className="cpr" min={0} max={maxPrice} value={priceRange ?? maxPrice} onChange={e => setPriceRange(Number(e.target.value))} style={{ "--p":`${pct}%` }} />
            </div>
            <div style={{ minWidth:160 }}>
              <p style={{ margin:"0 0 8px", fontSize:10, fontWeight:700, color:C.mid, textTransform:"uppercase", letterSpacing:0.8 }}>Min. Reytinq</p>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {[0, 3, 3.5, 4, 4.5].map(r => (
                  <button key={r} onClick={() => setMinRating(r)} className="cpch"
                    style={{ border:`1.5px solid ${minRating === r ? C.primary : "#e5e7eb"}`, background:minRating === r ? C.rose50 : "#fff", color:minRating === r ? C.primary : C.mid }}>
                    {r === 0 ? "Hamısı" : <><Star size={9} fill="#f59e0b" color="#f59e0b" />{r}+</>}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"flex-end" }}>
              <button onClick={() => { setPriceRange(maxPrice); setMinRating(0); setSortBy("default") }} style={{ padding:"7px 16px", borderRadius:12, border:"1.5px solid #e5e7eb", background:"#fff", color:C.mid, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                Sıfırla
              </button>
            </div>
          </div>
        )}

        <div className="cps" style={{ flex:1, overflowY:"auto", padding:"16px 18px 20px" }}>
          {displayed.length === 0 ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:260, gap:12 }}>
              <span style={{ fontSize:40 }}>🔍</span>
              <p style={{ color:C.mid, fontSize:14, fontFamily:"'Sora',sans-serif" }}>Nəticə tapılmadı</p>
              <button onClick={() => { setPriceRange(maxPrice); setMinRating(0); setActiveSub(null) }} style={{ padding:"10px 22px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${C.primarySoft},${C.primary})`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                Sıfırla
              </button>
            </div>
          ) : (
            <div className="cat-prod-grid">
              {displayed.map(p => <ProductCard key={p._id} product={p} onClose={onClose} />)}
            </div>
          )}
        </div>

        <div style={{ padding:"14px 18px", borderTop:"1px solid #f3f4f6", flexShrink:0 }}>
          <button onClick={() => onCategoryNavigate(cat)}
            style={{ width:"100%", padding:"14px", borderRadius:16, border:"none", background:`linear-gradient(135deg,${C.primarySoft},${C.primary})`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:`0 6px 20px rgba(232,25,44,0.28)`, transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 10px 28px rgba(232,25,44,0.36)` }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=`0 6px 20px rgba(232,25,44,0.28)` }}
          >
            Bütün {cat.label} məhsulları <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   DESKTOP KATEQORİYA DROPDOWN
   Hover → subkateqoriyalar sağda göstərilir
───────────────────────────────────────────── */
function CategoryDropdown({ onCategorySelect }) {
  const { t } = useTranslation()
  const MAIN_CATEGORIES = useMemo(() => getMainCategories(t), [t])
  const [hoveredCat, setHoveredCat] = useState(() => getMainCategories(t)[0])

  return (
    <div style={{
      position:"absolute", top:"calc(100% + 12px)", left:"50%", transform:"translateX(-50%)",
      background:"#fff", borderRadius:24,
      boxShadow:"0 20px 60px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.04)",
      zIndex:100, border:"1.5px solid #f3f4f6",
      animation:"nbCatDrop 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      display:"flex", overflow:"hidden",
      width:760, maxHeight:"82vh",
    }}>
      {/* Sol: ana kateqoriyalar */}
      <div style={{ width:240, flexShrink:0, borderRight:"1px solid #f3f4f6", overflowY:"auto", padding:"10px 8px" }}>
        <p style={{ fontSize:9, fontWeight:800, color:C.light, letterSpacing:1.6, margin:"0 0 8px 8px", textTransform:"uppercase" }}>Kateqoriyalar</p>
        {MAIN_CATEGORIES.map(cat => {
          const Icon = cat.icon
          const isHov = hoveredCat?.slug === cat.slug
          return (
            <div key={cat.slug}
              onMouseEnter={() => setHoveredCat(cat)}
              onClick={() => onCategorySelect(cat)}
              style={{
                display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                borderRadius:13, cursor:"pointer", transition:"all .15s",
                background:isHov ? cat.bg : "transparent",
                borderLeft:isHov ? `3px solid ${cat.color}` : "3px solid transparent",
              }}
            >
              <div style={{ width:32, height:32, borderRadius:9, background:isHov ? "#fff" : cat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:isHov ? `0 3px 10px ${cat.color}22` : "none", transition:"all .15s" }}>
                <Icon size={15} color={cat.color} />
              </div>
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:isHov ? cat.color : C.dark, fontFamily:"'Sora',sans-serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{cat.label}</div>
                <div style={{ fontSize:9, color:C.mid, fontFamily:"'Sora',sans-serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{cat.subcategories?.length} alt kateqoriya</div>
              </div>
              <ChevronRight size={11} color={isHov ? cat.color : C.light} />
            </div>
          )
        })}
      </div>

      {/* Sağ: subkateqoriyalar */}
      <div style={{ flex:1, padding:"14px 14px", overflowY:"auto" }}>
        {hoveredCat && (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, paddingBottom:10, borderBottom:"1px solid #f3f4f6" }}>
              <div style={{ width:36, height:36, borderRadius:11, background:hoveredCat.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {<hoveredCat.icon size={16} color={hoveredCat.color} />}
              </div>
              <div>
                <p style={{ margin:0, fontSize:13, fontWeight:800, color:C.dark, fontFamily:"'Sora',sans-serif" }}>{hoveredCat.label}</p>
                <p style={{ margin:0, fontSize:10, color:C.mid, fontFamily:"'Sora',sans-serif" }}>{hoveredCat.sub}</p>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
              {hoveredCat.subcategories?.map(sub => {
                const SubIcon = sub.icon
                return (
                  <div key={sub.key}
                    onClick={() => onCategorySelect({ ...hoveredCat, forceSub: sub.key })}
                    style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 12px", borderRadius:12, background:"#fafafa", border:"1.5px solid transparent", cursor:"pointer", transition:"all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background=hoveredCat.bg; e.currentTarget.style.borderColor=hoveredCat.color+"33"; e.currentTarget.style.transform="translateY(-1px)" }}
                    onMouseLeave={e => { e.currentTarget.style.background="#fafafa"; e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.transform="translateY(0)" }}
                  >
                    <div style={{ width:28, height:28, borderRadius:8, background:hoveredCat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <SubIcon size={13} color={hoveredCat.color} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:C.dark, fontFamily:"'Sora',sans-serif", lineHeight:1.3 }}>{sub.label}</span>
                  </div>
                )
              })}
            </div>
            <button onClick={() => onCategorySelect(hoveredCat)}
              style={{ marginTop:14, width:"100%", padding:"10px", borderRadius:12, border:`1.5px solid ${hoveredCat.color}33`, background:hoveredCat.bg, color:hoveredCat.color, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontFamily:"'Sora',sans-serif", transition:"all .15s" }}
              onMouseEnter={e => e.currentTarget.style.background=hoveredCat.color+"22"}
              onMouseLeave={e => e.currentTarget.style.background=hoveredCat.bg}
            >
              Bütün {hoveredCat.label} <ChevronRight size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ƏSAS NAVBAR
───────────────────────────────────────────── */
const Navbar = () => {
  const { t } = useTranslation()
  const MAIN_CATEGORIES = useMemo(() => getMainCategories(t), [t])
  const { isAuthenticated, user }   = useSelector(s => s.userSlice)
  const { profile: bloggerProfile } = useSelector(s => s.blogger)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchQuery,    setSearchQuery]    = useState("")
  const [showSearch,     setShowSearch]     = useState(false)
  const [isMenuOpen,     setIsMenuOpen]     = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [scrolled,       setScrolled]       = useState(false)
  const [activeCatPanel, setActiveCatPanel] = useState(null)
  // Mobil sidebar: hangi ana kateqoriya açıqdır
  const [expandedCatSlug, setExpandedCatSlug] = useState(null)

  const catRef  = useRef(null)
  const userRef = useRef(null)

  const isAdmin   = user?.user?.role === "admin"
  const isBlogger = !!bloggerProfile?.blogger

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // 🔔 BİLDİRİŞ POLLING (Yalnız Navbar-da 1 dəfə işləyir)
  // Bildiriş sayını çəkən effekt - hər 60 saniyədən bir yenilənir (limitli)
  useEffect(() => {
    if (!isAuthenticated) return;

    // İlk yüklənmədə dərhal çək (əgər loading deyilsə)
    dispatch(fetchUnreadCount());

    // İntervalı 60 saniyəyə qaldırırıq (daha optimal performans üçün)
    const intervalId = setInterval(() => {
      // Səhifə aktiv deyilsə sorğu göndərməyək (isteğe bağlı, amma faydalıdır)
      if (document.visibilityState === 'visible') {
        dispatch(fetchUnreadCount());
      }
    }, 60000); 

    return () => clearInterval(intervalId);
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const fn = e => {
      if (catRef.current  && !catRef.current.contains(e.target))  setIsCategoryOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setIsUserMenuOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || activeCatPanel) ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isMenuOpen, activeCatPanel])

  const hoverTimeout = useRef(null)
  const handleCatMouseEnter = useCallback(() => { clearTimeout(hoverTimeout.current); setIsCategoryOpen(true)  }, [])
  const handleCatMouseLeave = useCallback(() => { hoverTimeout.current = setTimeout(() => setIsCategoryOpen(false), 200) }, [])

  const handleLogout           = () => { dispatch(logout()); navigate("/login") }
  const handleBloggerLogout    = () => { dispatch(bloggerLogout()); navigate("/login") }
  const handleSearch           = e  => { e.preventDefault(); if (searchQuery.trim()) navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`); setShowSearch(false); setSearchQuery("") }
  const handleCategorySelect   = cat => { setIsCategoryOpen(false); setIsMenuOpen(false); setActiveCatPanel(cat) }
  const handleCategoryNavigate = cat => { setActiveCatPanel(null); navigate(cat.slug ? `/shop?category=${cat.slug}` : "/shop") }

  const { data:cartData,     isLoading:cartLd, error:cartErr } = useGetCartQuery()
  const { data:favoriteData, isLoading:favLd,  error:favErr  } = useGetFavoritesQuery()
  const cartCount = (!cartErr && !cartLd && cartData?.cart)           ? cartData.cart.length          : 0
  const favCount  = (!favErr  && !favLd  && favoriteData?.favorites)  ? favoriteData.favorites.length : 0

  const isAct = p => location.pathname === p

  const dropLink = {
    display:"block", padding:"8px 12px", borderRadius:10,
    fontSize:13, color:C.dark, textDecoration:"none",
    fontFamily:"'Sora',sans-serif", background:"transparent", transition:"background .12s",
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        @keyframes nbSlideDown   { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes nbLogoPop     { 0%{opacity:0;transform:scale(0.6)} 70%{opacity:1;transform:scale(1.07)} 100%{opacity:1;transform:scale(1)} }
        @keyframes nbLinkFade    { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nbActionSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes nbBadgePop    { from{transform:scale(0)} to{transform:scale(1)} }
        @keyframes nbLangDrop    { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nbCatDrop     { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes nbSearchDrop  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nbUserDrop    { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nbMobRise     { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes nbCartBounce  { 0%{transform:scale(0.5) translateY(20px);opacity:0} 70%{transform:scale(1.08) translateY(-4px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes nbFd          { from{opacity:0} to{opacity:1} }
        @keyframes nbBd          { from{transform:scale(0)} to{transform:scale(1)} }
        @keyframes nbMobTopSlide { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes nb-shake      { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-15deg)} 40%{transform:rotate(15deg)} 60%{transform:rotate(-10deg)} 80%{transform:rotate(8deg)} }
        @keyframes subSlide      { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

        .nb-nav-wrap     { animation: nbSlideDown 0.55s cubic-bezier(0.34,1.10,0.64,1) both; }
        .nb-logo-anim    { animation: nbLogoPop 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.25s both; }
        .nb-link-anim-1  { animation: nbLinkFade 0.45s ease 0.35s both; }
        .nb-link-anim-2  { animation: nbLinkFade 0.45s ease 0.45s both; }
        .nb-link-anim-3  { animation: nbLinkFade 0.45s ease 0.55s both; }
        .nb-actions-anim { animation: nbActionSlide 0.45s ease 0.50s both; }
        .nb-mob-anim     { animation: nbMobRise 0.55s cubic-bezier(0.34,1.10,0.64,1) 0.40s both; }
        .nb-mob-top-anim { animation: nbMobTopSlide 0.45s cubic-bezier(0.34,1.10,0.64,1) 0.20s both; }
        .nb-cart-bounce-anim { animation: nbCartBounce 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.80s both; }
        .nb-badge-anim   { animation: nbBadgePop 0.35s cubic-bezier(0.34,1.56,0.64,1) 1.0s both; }
        .nb-shake        { animation: nb-shake 0.6s ease; }

        .nb-logo-link { transition: transform 0.2s ease; display:inline-flex; align-items:center; text-decoration:none; }
        .nb-logo-link:hover { transform: translateY(-1px); }

        .bnl { position:relative;font-size:14px;font-weight:600;color:#374151;text-decoration:none;padding:6px 2px;transition:color 0.2s;font-family:'Sora',sans-serif;background:none;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:5px;letter-spacing:-0.01em; }
        .bnl::after { content:'';position:absolute;bottom:-4px;left:0;width:0;height:2.5px;background:linear-gradient(90deg,${C.primarySoft},${C.primary});border-radius:2px;transition:width 0.28s cubic-bezier(0.34,1.56,0.64,1); }
        .bnl:hover::after,.bnl.on::after { width:100% }
        .bnl:hover,.bnl.on { color:${C.primary} }

        .bib { position:relative;width:40px;height:40px;border-radius:13px;border:none;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6b7280;transition:all .2s ease;text-decoration:none; }
        .bib:hover { background:${C.rose50};color:${C.primary};transform:translateY(-1px); }

        .bbd { position:absolute;top:2px;right:2px;min-width:16px;height:16px;background:linear-gradient(135deg,${C.primarySoft},${C.primary});color:#fff;font-size:8px;font-weight:800;border-radius:99px;display:flex;align-items:center;justify-content:center;padding:0 3px;border:2px solid #fff;animation:nbBd 0.3s cubic-bezier(0.34,1.56,0.64,1); }

        .bmt { display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:3px;padding:5px 2px;border:none;background:transparent;cursor:pointer;color:#9ca3af;transition:color 0.2s;font-family:'Sora',sans-serif;font-size:9.5px;font-weight:600;text-decoration:none;-webkit-tap-highlight-color:transparent;white-space:nowrap;min-width:0; }
        .bmt.on { color:${C.primary}; }
        .bmt.on svg { filter:drop-shadow(0 2px 6px rgba(232,25,44,0.38)); }

        .bsi { display:flex;align-items:center;gap:12px;padding:11px 14px;color:#374151;font-size:14px;font-weight:600;text-decoration:none;border-radius:14px;margin:2px 8px;transition:all .15s;cursor:pointer;border:none;background:transparent;width:calc(100% - 16px);font-family:'Sora',sans-serif; }
        .bsi:hover { background:${C.rose50};color:${C.primary}; }
        .bsi.red { color:${C.primary}; }

        /* Mobil sidebar kateqoriya accordion */
        .mob-cat-item { display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:12px;margin:1px 8px;cursor:pointer;border:none;background:transparent;width:calc(100% - 16px);font-family:'Sora',sans-serif;transition:all .15s; }
        .mob-cat-item:hover { background:${C.rose50}; }
        .mob-cat-item.open { background:${C.rose50}; }
        .mob-sub-grid { display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:6px 10px 10px 18px;animation:subSlide 0.2s ease; }
        .mob-sub-btn { display:flex;align-items:center;gap:7px;padding:8px 10px;border-radius:10px;border:1.5px solid #f3f4f6;background:#fafafa;cursor:pointer;font-family:'Sora',sans-serif;font-size:11px;font-weight:600;color:${C.dark};transition:all .15s;text-align:left; }
        .mob-sub-btn:hover { border-color:var(--cat-color);background:var(--cat-bg);color:var(--cat-color); }
        .mob-sub-btn:active { transform:scale(0.97); }

        .bso { position:fixed;inset:0;background:rgba(15,5,5,0.45);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding-top:72px;animation:nbFd 0.18s; }
        .bsbx { background:#fff;border-radius:22px;width:100%;max-width:580px;margin:0 16px;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.18);animation:nbSearchDrop 0.24s cubic-bezier(0.34,1.56,0.64,1);border:1.5px solid #f3f4f6; }

        .bms { position:fixed;top:0;left:0;height:100%;width:316px;background:#fff;z-index:150;transform:translateX(-100%);transition:transform 0.32s cubic-bezier(0.4,0,0.2,1);overflow-y:auto;display:flex;flex-direction:column;box-shadow:8px 0 40px rgba(0,0,0,0.10);border-right:1.5px solid #f3f4f6; }
        .bms.open { transform:translateX(0); }
        .bms::-webkit-scrollbar { width:0; }

        @media(max-width:768px)  { .nb-nav-wrap{display:none!important} .mBN{display:flex!important} .mObTopBar{display:flex!important} }
        @media(min-width:769px)  { .nb-nav-wrap{display:block!important} .mBN{display:none!important} .mObTopBar{display:none!important} }
        @media(max-width:640px)  { .bso{padding-top:0!important;align-items:flex-end!important} .bsbx{border-radius:22px 22px 0 0!important;margin:0!important;max-width:100%!important} }
        .mob-bottom-nav { padding-bottom:env(safe-area-inset-bottom,0px); }

        @media(max-width:390px){.bmt{font-size:8px;gap:2px}.bmt svg{width:17px!important;height:17px!important}.nb-cart-box{width:40px!important;height:40px!important;margin-top:-10px!important}.nb-cart-lbl{font-size:8px!important}}
        @media(min-width:390px){.bmt{font-size:10px;gap:5px}.bmt svg{width:22px!important;height:22px!important}.nb-cart-box{width:52px!important;height:52px!important;margin-top:-20px!important;border-radius:18px!important}.nb-cart-lbl{font-size:10px!important}}
        @media(max-height:500px) and (orientation:landscape){.bmt span,.nb-cart-lbl{display:none!important}.bmt{gap:0!important}.nb-cart-box{margin-top:-4px!important;width:38px!important;height:38px!important}}
      `}</style>

      {activeCatPanel && (
        <CategoryProductPanel cat={activeCatPanel} onClose={() => setActiveCatPanel(null)} onCategoryNavigate={handleCategoryNavigate} />
      )}

      {/* ══ AXTARIŞ MODALİ ══ */}
      {showSearch && (
        <div className="bso" onClick={() => setShowSearch(false)}>
          <div className="bsbx" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"center", padding:"8px 0 3px" }}>
              <div style={{ width:40, height:4, background:C.rose100, borderRadius:3 }} />
            </div>
            <form onSubmit={handleSearch} style={{ display:"flex", alignItems:"center", padding:"4px 18px" }}>
              <Search size={18} color={C.primary} style={{ flexShrink:0 }} />
              <input autoFocus type="text" placeholder={t("search.placeholder")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ flex:1, border:"none", outline:"none", padding:"14px 13px", fontSize:15, fontFamily:"'Sora',sans-serif", color:C.dark, background:"transparent" }} />
              <button type="button" onClick={() => setShowSearch(false)} style={{ border:"none", background:"none", cursor:"pointer", color:C.light, padding:8 }}>
                <X size={18} />
              </button>
            </form>
            <div style={{ padding:"0 20px 22px", borderTop:`1px solid #f3f4f6` }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.light, letterSpacing:1.5, margin:"14px 0 10px", textTransform:"uppercase", fontFamily:"'Sora',sans-serif" }}>Populyar axtarışlar</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["iPhone","Nike","Samsung","Laptop","Geyim"].map(q => (
                  <button key={q} onClick={() => { setSearchQuery(q); navigate(`/search-results?query=${q}`); setShowSearch(false) }}
                    style={{ padding:"7px 16px", borderRadius:99, border:`1.5px solid #e5e7eb`, background:"#fafafa", color:C.mid, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=C.rose200; e.currentTarget.style.color=C.primary; e.currentTarget.style.background=C.rose50 }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.color=C.mid; e.currentTarget.style.background="#fafafa" }}
                  >{q}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MOBİL ÜST BAR ══ */}
      <div className="mObTopBar nb-mob-top-anim"
        style={{ display:"none", position:"sticky", top:0, zIndex:91, background:scrolled ? "rgba(255,255,255,0.97)" : "#fff", backdropFilter:scrolled ? "blur(20px)" : "none", borderBottom:"1px solid #f3f4f6", boxShadow:scrolled ? "0 4px 20px rgba(0,0,0,0.06)" : "none", transition:"all 0.3s ease", padding:"0 16px", height:56, alignItems:"center", justifyContent:"space-between", gap:8 }}
      >
        <Link to="/" className="nb-logo-link"><MobileLogoFull /></Link>
        <div style={{ display:"flex", alignItems:"center", gap:2 }}>
          <button className="bib" onClick={() => setShowSearch(true)} style={{ width:38, height:38, borderRadius:11 }}><Search size={17} /></button>
          <NotificationBell isMobile={true} />
          {isBlogger ? (
            <Link to="/blogger/dashboard" style={{ textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center", width:38, height:38 }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,#E8192C,#7a0010)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:800 }}>
                {bloggerProfile.blogger.firstName?.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : isAuthenticated ? (
            <Link to="/profile" style={{ textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center", width:38, height:38 }}>
              {user?.user?.avatar?.url
                ? <img src={user.user.avatar.url} alt="" style={{ width:30, height:30, borderRadius:"50%", objectFit:"cover", border:`2px solid ${C.rose200}` }} />
                : <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.primarySoft},${C.primary})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:800 }}>{user?.user?.name?.charAt(0).toUpperCase()}</div>}
            </Link>
          ) : (
            <Link to="/login" className="bib" style={{ textDecoration:"none", width:38, height:38 }}><User size={17} /></Link>
          )}
          <button className="bib" onClick={() => setIsMenuOpen(true)} style={{ width:38, height:38 }}>
            <svg width="18" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="0" y1="1" x2="18" y2="1" />
              <line x1="0" y1="7" x2="18" y2="7" />
              <line x1="0" y1="13" x2="18" y2="13" />
            </svg>
          </button>
        </div>
      </div>

      {/* ══ DESKTOP NAVBAR ══ */}
      <nav className="nb-nav-wrap" style={{
        position:"sticky", top:0, zIndex:90,
        background:scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter:scrolled ? "blur(20px)" : "none",
        borderBottom:scrolled ? "1px solid #f3f4f6" : "1px solid #f9fafb",
        boxShadow:scrolled ? "0 4px 28px rgba(0,0,0,0.06)" : "none",
        transition:"all 0.3s ease",
      }}>
        <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 24px", height:66, display:"flex", alignItems:"center", justifyContent:"space-between", gap:20 }}>
          <Link to="/" className="nb-logo-anim nb-logo-link">
            <BrendexLogoFull iconSize={36} />
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:40, flex:1, justifyContent:"center" }}>
            <span className="nb-link-anim-1">
              <Link to="/home" className={`bnl ${isAct("/home") ? "on" : ""}`}>{t("navbar.home")}</Link>
            </span>
            <span className="nb-link-anim-2" style={{ position:"relative" }} ref={catRef} onMouseEnter={handleCatMouseEnter} onMouseLeave={handleCatMouseLeave}>
              <button onClick={() => setIsCategoryOpen(p => !p)} className={`bnl ${isCategoryOpen ? "on" : ""}`}>
                {t("navbar.category")}
                <ChevronDown size={14} style={{ transition:"transform 0.2s", transform:isCategoryOpen ? "rotate(180deg)" : "rotate(0)" }} />
              </button>
              {isCategoryOpen && (
                <div onMouseEnter={handleCatMouseEnter} onMouseLeave={handleCatMouseLeave}>
                  <CategoryDropdown onCategorySelect={handleCategorySelect} />
                </div>
              )}
            </span>
            <span className="nb-link-anim-3">
              <Link to="/contact" className={`bnl ${isAct("/contact") ? "on" : ""}`}>{t("navbar.contact")}</Link>
            </span>
          </div>
          <div className="nb-actions-anim" style={{ display:"flex", alignItems:"center", gap:2, flexShrink:0 }}>
            <div style={{ marginRight:4 }}><LanguageSwitcher /></div>
            <button className="bib" onClick={() => setShowSearch(true)} title={t("navbar.search")}><Search size={18} /></button>
            <NotificationBell />
            <div ref={userRef} style={{ position:"relative" }}>
              {isBlogger ? (
                <>
                  <button className="bib" onClick={() => setIsUserMenuOpen(p => !p)}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,#E8192C,#7a0010)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:800, boxShadow:`0 2px 8px rgba(232,25,44,0.28)` }}>
                      {bloggerProfile.blogger.firstName?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  {isUserMenuOpen && (
                    <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"#fff", borderRadius:18, boxShadow:"0 16px 52px rgba(0,0,0,0.11)", border:"1.5px solid #f3f4f6", minWidth:230, padding:"10px 7px", zIndex:100, animation:"nbUserDrop 0.18s ease" }}>
                      <div style={{ padding:"8px 12px 11px" }}>
                        <p style={{ fontSize:13, fontWeight:700, color:"#111", margin:0, fontFamily:"'Sora',sans-serif" }}>{bloggerProfile.blogger.firstName} {bloggerProfile.blogger.lastName}</p>
                        <p style={{ fontSize:11, color:"#888", margin:"2px 0 0", fontFamily:"'Sora',sans-serif" }}>{bloggerProfile.blogger.email}</p>
                        <p style={{ fontSize:10, color:"#E8192C", margin:"4px 0 0", fontFamily:"'Sora',sans-serif", fontWeight:700 }}>Blogger · {bloggerProfile.blogger.commissionRate}%</p>
                      </div>
                      <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:5 }}>
                        <Link to="/blogger/dashboard" onClick={() => setIsUserMenuOpen(false)} style={dropLink} onMouseEnter={e => e.currentTarget.style.background="#f9fafb"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>📊 Blogger Paneli</Link>
                        <button onClick={() => { handleBloggerLogout(); setIsUserMenuOpen(false) }} style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", borderRadius:10, fontSize:13, color:"#E8192C", background:"none", border:"none", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"background .12s" }} onMouseEnter={e => e.currentTarget.style.background="#fff8f8"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>Çıxış</button>
                      </div>
                    </div>
                  )}
                </>
              ) : isAuthenticated ? (
                <>
                  <button className="bib" onClick={() => setIsUserMenuOpen(p => !p)}>
                    {user?.user?.avatar?.url
                      ? <img src={user.user.avatar.url} alt="" style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover", border:`2px solid ${C.rose200}` }} />
                      : <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.primarySoft},${C.primary})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:800, boxShadow:`0 2px 8px rgba(232,25,44,0.28)` }}>{user?.user?.name?.charAt(0).toUpperCase()}</div>}
                  </button>
                  {isUserMenuOpen && (
                    <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"#fff", borderRadius:18, boxShadow:"0 16px 52px rgba(0,0,0,0.11)", border:"1.5px solid #f3f4f6", minWidth:230, padding:"10px 7px", zIndex:100, animation:"nbUserDrop 0.18s ease" }}>
                      <div style={{ padding:"8px 12px 11px" }}>
                        <p style={{ fontSize:13, fontWeight:700, color:C.dark, margin:0, fontFamily:"'Sora',sans-serif" }}>{user?.user?.name}</p>
                        <p style={{ fontSize:11, color:C.mid, margin:"2px 0 0", fontFamily:"'Sora',sans-serif" }}>{user?.user?.email}</p>
                      </div>
                      <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:5 }}>
                        {isAdmin && (
                          <>
                            <Link to="/admin/products" onClick={() => setIsUserMenuOpen(false)} style={dropLink} onMouseEnter={e => e.currentTarget.style.background="#f9fafb"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>{t("navbar.adminProducts")}</Link>
                            <Link to="/admin/product"  onClick={() => setIsUserMenuOpen(false)} style={dropLink} onMouseEnter={e => e.currentTarget.style.background="#f9fafb"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>{t("navbar.addProduct")}</Link>
                            <Link to="/admin/orders"   onClick={() => setIsUserMenuOpen(false)} style={dropLink} onMouseEnter={e => e.currentTarget.style.background="#f9fafb"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>🏪 {t("navbar.storeOrders")}</Link>
                            <Link to="/seller/commission" onClick={() => setIsUserMenuOpen(false)} style={{ ...dropLink, color:C.primary, fontWeight:700 }} onMouseEnter={e => e.currentTarget.style.background=C.rose50} onMouseLeave={e => e.currentTarget.style.background="transparent"}>💰 {t("navbar.commissionPanel")}</Link>
                          </>
                        )}
                        <Link to="/my-orders" onClick={() => setIsUserMenuOpen(false)} style={dropLink} onMouseEnter={e => e.currentTarget.style.background="#f9fafb"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>📦 {t("navbar.myOrders")}</Link>
                        <Link to="/my-bonus" onClick={() => setIsUserMenuOpen(false)} style={dropLink} onMouseEnter={e => e.currentTarget.style.background="#f9fafb"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>⭐ Bonus Hesabım</Link>
                        <button onClick={handleLogout} style={{ display:"block", width:"100%", textAlign:"left", padding:"8px 12px", borderRadius:10, fontSize:13, color:C.primary, background:"none", border:"none", cursor:"pointer", fontFamily:"'Sora',sans-serif", transition:"background .12s" }} onMouseEnter={e => e.currentTarget.style.background=C.rose50} onMouseLeave={e => e.currentTarget.style.background="transparent"}>{t("navbar.logout")}</button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="bib" style={{ textDecoration:"none" }}><User size={18} /></Link>
              )}
            </div>
            <Link to="/favori" className="bib" style={{ textDecoration:"none" }} title={t("navbar.favorites")}>
              <Heart size={18} />
              {favCount > 0 && <span className="bbd nb-badge-anim">{favCount}</span>}
            </Link>
            <Link to="/cart" className="bib" style={{ textDecoration:"none" }} title={t("navbar.cart")}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="bbd nb-badge-anim">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ MOBİL SİDEBAR ══ */}
      {isMenuOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,5,5,0.42)", backdropFilter:"blur(5px)", zIndex:140, animation:"nbFd 0.2s" }} onClick={() => setIsMenuOpen(false)} />
      )}

      <div className={`bms ${isMenuOpen ? "open" : ""}`}>
        {/* Sidebar başlıq */}
        <div style={{ background:`linear-gradient(135deg,${C.primarySoft},${C.primary})`, padding:"22px 18px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <SidebarLogo />
          <button onClick={() => setIsMenuOpen(false)} style={{ border:"none", background:"rgba(255,255,255,0.16)", borderRadius:11, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <X size={16} color="white" />
          </button>
        </div>

        {/* İstifadəçi bloku */}
        <div style={{ padding:"14px 14px 12px", borderBottom:"1px solid #f3f4f6", flexShrink:0 }}>
          {isBlogger ? (
            <div style={{ display:"flex", alignItems:"center", gap:11 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,#E8192C,#7a0010)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:17, fontWeight:800, boxShadow:`0 4px 14px rgba(232,25,44,0.28)`, flexShrink:0 }}>
                {bloggerProfile.blogger.firstName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:C.dark, fontFamily:"'Sora',sans-serif" }}>{bloggerProfile.blogger.firstName} {bloggerProfile.blogger.lastName}</p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:"#E8192C", fontFamily:"'Sora',sans-serif", fontWeight:700 }}>Blogger · {bloggerProfile.blogger.commissionRate}%</p>
              </div>
            </div>
          ) : isAuthenticated && user ? (
            <div style={{ display:"flex", alignItems:"center", gap:11 }}>
              {user?.user?.avatar?.url
                ? <img src={user.user.avatar.url} alt="" style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover", border:`2px solid ${C.rose200}` }} />
                : <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${C.primarySoft},${C.primary})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:17, fontWeight:800, boxShadow:`0 4px 14px rgba(232,25,44,0.28)` }}>{user?.user?.name?.charAt(0).toUpperCase()}</div>}
              <div>
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:C.dark, fontFamily:"'Sora',sans-serif" }}>{user?.user?.name}</p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:C.mid, fontFamily:"'Sora',sans-serif" }}>{user?.user?.email}</p>
              </div>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ display:"flex", alignItems:"center", gap:9, textDecoration:"none", padding:"12px 16px", borderRadius:14, background:`linear-gradient(135deg,${C.primarySoft},${C.primary})`, color:"#fff", fontSize:14, fontWeight:700, fontFamily:"'Sora',sans-serif", boxShadow:`0 4px 14px rgba(232,25,44,0.28)` }}>
              <User size={15} /> {t("navbar.loginRegister")}
            </Link>
          )}
        </div>

        {/* Dil seçimi */}
        <div style={{ padding:"12px 16px", borderBottom:"1px solid #f3f4f6", flexShrink:0 }}>
          <p style={{ fontSize:10, fontWeight:700, color:C.light, letterSpacing:1.2, textTransform:"uppercase", margin:"0 0 9px", fontFamily:"'Sora',sans-serif" }}>{t("language.select")}</p>
          <LanguageSwitcher />
        </div>

        {/* Axtarış */}
        <div style={{ padding:"12px 12px 6px", flexShrink:0 }}>
          <button onClick={() => { setShowSearch(true); setIsMenuOpen(false) }}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:13, background:"#f9fafb", border:"1.5px solid #f3f4f6", cursor:"pointer", fontFamily:"'Sora',sans-serif", fontSize:13, color:C.light, fontWeight:500, transition:"all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=C.rose200; e.currentTarget.style.color=C.primary; e.currentTarget.style.background=C.rose50 }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#f3f4f6"; e.currentTarget.style.color=C.light; e.currentTarget.style.background="#f9fafb" }}
          >
            <Search size={15} color={C.rose200} /> {t("navbar.search")}
          </button>
        </div>

        {/* Nav linklər */}
        <nav style={{ padding:"6px 6px", flex:1 }}>
          <Link to="/home" className="bsi" onClick={() => setIsMenuOpen(false)}><Home size={17} color={C.primary} /> {t("navbar.home")}</Link>

          {/* ── 15 kateqoriya accordion ── */}
          <div>
            <div style={{ padding:"6px 14px 4px 16px" }}>
              <p style={{ fontSize:9, fontWeight:800, color:C.light, letterSpacing:1.4, textTransform:"uppercase", margin:0, fontFamily:"'Sora',sans-serif" }}>Kateqoriyalar</p>
            </div>
            {MAIN_CATEGORIES.map(cat => {
              const Icon   = cat.icon
              const isOpen = expandedCatSlug === cat.slug
              return (
                <div key={cat.slug}>
                  {/* Ana kateqoriya başlığı */}
                  <button
                    className={`mob-cat-item ${isOpen ? "open" : ""}`}
                    onClick={() => setExpandedCatSlug(isOpen ? null : cat.slug)}
                    style={{ justifyContent:"space-between" }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0, flex:1 }}>
                      <div style={{ width:32, height:32, borderRadius:9, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:`1.5px solid ${cat.color}22`, transition:"all .15s", boxShadow:isOpen ? `0 3px 10px ${cat.color}22` : "none" }}>
                        <Icon size={14} color={cat.color} />
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:isOpen ? cat.color : C.dark, fontFamily:"'Sora',sans-serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", transition:"color .15s" }}>{cat.label}</div>
                        <div style={{ fontSize:9, color:C.mid, fontFamily:"'Sora',sans-serif" }}>{cat.subcategories.length} alt kateqoriya</div>
                      </div>
                    </div>
                    <div style={{ flexShrink:0, transition:"transform .2s", transform:isOpen ? "rotate(180deg)" : "rotate(0)" }}>
                      <ChevronDown size={14} color={isOpen ? cat.color : C.light} />
                    </div>
                  </button>

                  {/* Subkateqoriyalar grid */}
                  {isOpen && (
                    <div className="mob-sub-grid">
                      {cat.subcategories.map(sub => {
                        const SubIcon = sub.icon
                        return (
                          <button key={sub.key}
                            className="mob-sub-btn"
                            style={{ "--cat-color":cat.color, "--cat-bg":cat.bg }}
                            onClick={() => {
                              handleCategorySelect({ ...cat, forceSub: sub.key })
                              setIsMenuOpen(false)
                            }}
                          >
                            <div style={{ width:22, height:22, borderRadius:6, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <SubIcon size={11} color={cat.color} />
                            </div>
                            <span style={{ fontSize:10, lineHeight:1.3 }}>{sub.label}</span>
                          </button>
                        )
                      })}
                      {/* Bütün kateqoriya düyməsi */}
                      <button
                        className="mob-sub-btn"
                        style={{ "--cat-color":cat.color, "--cat-bg":cat.bg, gridColumn:"1/-1", justifyContent:"center", background:cat.bg, borderColor:`${cat.color}33`, color:cat.color, fontWeight:700 }}
                        onClick={() => { handleCategoryNavigate(cat); setIsMenuOpen(false) }}
                      >
                        Bütün {cat.label} <ChevronRight size={11} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Link to="/contact" className="bsi" onClick={() => setIsMenuOpen(false)} style={{ marginTop:6 }}><MessageCircle size={17} color={C.primary} /> {t("navbar.contact")}</Link>
        </nav>

        {/* Admin & hesab linklər */}
        {(isAuthenticated || isBlogger) && (
          <div style={{ padding:"10px 6px 80px", borderTop:"1px solid #f3f4f6", flexShrink:0 }}>
            {isBlogger ? (
              <>
                <Link to="/blogger/dashboard" className="bsi" onClick={() => setIsMenuOpen(false)} style={{ color:C.primary, fontWeight:700 }}>📊 Blogger Paneli</Link>
                <button className="bsi red" onClick={() => { handleBloggerLogout(); setIsMenuOpen(false) }}>Çıxış</button>
              </>
            ) : (
              <>
                {isAdmin && (
                  <>
                    <Link to="/admin/products"    className="bsi" onClick={() => setIsMenuOpen(false)}>{t("navbar.adminProducts")}</Link>
                    <Link to="/admin/product"     className="bsi" onClick={() => setIsMenuOpen(false)}>{t("navbar.addProduct")}</Link>
                    <Link to="/admin/orders"      className="bsi" onClick={() => setIsMenuOpen(false)}>🏪 {t("navbar.storeOrders")}</Link>
                    <Link to="/seller/commission" className="bsi" onClick={() => setIsMenuOpen(false)} style={{ color:C.primary, fontWeight:700 }}>💰 {t("navbar.commissionPanel")}</Link>
                  </>
                )}
                <Link to="/my-orders" className="bsi" onClick={() => setIsMenuOpen(false)}><Package size={17} color={C.primary} /> {t("navbar.myOrders")}</Link>
                <button className="bsi red" onClick={() => { handleLogout(); setIsMenuOpen(false) }}>{t("navbar.logout")}</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ══ MOBİL ALT NAVİQASİYA ══ */}
      <div className="mBN mob-bottom-nav nb-mob-anim"
        style={{ display:"none", position:"fixed", bottom:0, left:0, right:0, zIndex:80, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)", borderTop:"1px solid #f3f4f6", boxShadow:"0 -4px 24px rgba(0,0,0,0.07)" }}
      >
        <div style={{ display:"flex", flexDirection:"row", alignItems:"stretch", width:"100%", height:62, minHeight:54, maxHeight:70 }}>
          <Link to="/home"  className={`bmt ${isAct("/home") ? "on" : ""}`}><Home size={21} /><span>{t("navbar.home")}</span></Link>
          <Link to="/shop"  className={`bmt ${isAct("/shop") ? "on" : ""}`}><Grid3X3 size={21} /><span>{t("navbar.category")}</span></Link>
          <Link to="/cart" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textDecoration:"none", WebkitTapHighlightColor:"transparent" }}>
            <div className="nb-cart-box nb-cart-bounce-anim"
              style={{ width:48, height:48, background:`linear-gradient(135deg,${C.primarySoft},${C.primary})`, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 6px 20px rgba(232,25,44,0.40)`, marginTop:-16, border:"3px solid #fff", position:"relative", flexShrink:0, transition:"transform .12s ease" }}
              onTouchStart={e => e.currentTarget.style.transform="scale(0.91)"}
              onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}
              onTouchCancel={e => e.currentTarget.style.transform="scale(1)"}
            >
              <ShoppingCart size={21} color="#fff" />
              {cartCount > 0 && (
                <span style={{ position:"absolute", top:-5, right:-5, minWidth:16, height:16, background:"#fff", color:C.primary, fontSize:8, fontWeight:800, lineHeight:1, borderRadius:99, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px", border:`1.5px solid ${C.rose100}`, fontFamily:"'Sora',sans-serif" }}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
            <span className="nb-cart-lbl" style={{ fontSize:9, fontWeight:700, color:C.primary, marginTop:4, fontFamily:"'Sora',sans-serif", lineHeight:1 }}>{t("navbar.cart")}</span>
          </Link>
          <Link to="/favori" className={`bmt ${isAct("/favori") ? "on" : ""}`} style={{ position:"relative" }}>
            <div style={{ position:"relative" }}>
              <Heart size={21} />
              {favCount > 0 && <span className="bbd" style={{ top:-5, right:-7 }}>{favCount > 9 ? "9+" : favCount}</span>}
            </div>
            <span>{t("navbar.favorites")}</span>
          </Link>
          {isAuthenticated ? (
            <Link to="/my-orders" className={`bmt ${isAct("/my-orders") ? "on" : ""}`}><Package size={21} /><span>{t("navbar.orders")}</span></Link>
          ) : (
            <Link to="/login" className={`bmt ${isAct("/login") ? "on" : ""}`}><User size={21} /><span>{t("navbar.profile")}</span></Link>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar