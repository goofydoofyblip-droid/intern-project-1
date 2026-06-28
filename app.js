Now I'll write the corrected & enhanced App.js with all syntax errors fixed plus localStorage cart persistence, working mobile menu, and global toast notifications.
Action: file_editor create /app/frontend/src/App.js --file-text "import {
  useState, useEffect, createContext, useContext,
  useReducer, useMemo, useCallback, useRef
} from \"react\";
import {
  ShoppingCart, Search, X, Heart, Star, Minus, Plus,
  Trash2, ArrowRight, Package, Shield, RefreshCw, Check,
  Filter, ChevronRight, Menu, Headphones, LayoutGrid,
  List, ChevronDown, ArrowLeft, Eye
} from \"lucide-react\";

// ─────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────
const T = {
  forest:       \"#0A3622\",
  forestHover:  \"#0d4529\",
  forestDeep:   \"#071f14\",
  sand:         \"#F5E6D0\",
  sandLight:    \"#FBF5EE\",
  copper:       \"#C4713A\",
  copperHover:  \"#a85e2f\",
  cream:        \"#FAFAF8\",
  dark:         \"#1A1A1A\",
  mist:         \"#E8DDD4\",
  gray:         \"#8A8580\",
  lightGray:    \"#F0EBE6\",
  divider:      \"#E2D9D0\",
};

// ─────────────────────────────────────────────────────────────────────
// PRODUCT DATA – 12 curated pieces across 4 categories
// ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: \"Arca Lounge Chair\", category: \"furniture\",
    price: 1290, originalPrice: 1690, rating: 4.9, reviews: 87,
    isNew: false, isSale: true, inStock: true,
    image: \"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=960&h=1140&fit=crop&q=85\",
    description: \"Hand-assembled by Portuguese artisans over 12 hours each. Sustainably sourced walnut meets full-grain aniline leather that deepens with age. Joints are mortise-and-tenon — no metal hardware, no shortcuts.\",
    materials: \"Walnut, Full-grain aniline leather\",
    dimensions: \"W 74 × D 82 × H 76 cm · Seat H 42 cm\",
  },
  {
    id: 2, name: \"Cove Pendant Light\", category: \"lighting\",
    price: 485, originalPrice: null, rating: 4.7, reviews: 53,
    isNew: true, isSale: false, inStock: true,
    image: \"https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=960&h=1140&fit=crop&q=85\",
    description: \"A ribbed borosilicate glass globe suspended on a brushed brass stem. The frosted interior diffuses Edison-filament warmth into an even ambient glow. Cable length adjustable 60–180 cm at installation.\",
    materials: \"Borosilicate glass, Brushed brass\",
    dimensions: \"Ø 28 × H adjustable 60–180 cm\",
  },
  {
    id: 3, name: \"Nomad Floor Lamp\", category: \"lighting\",
    price: 390, originalPrice: null, rating: 4.6, reviews: 42,
    isNew: false, isSale: false, inStock: true,
    image: \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=960&h=1140&fit=crop&q=85\",
    description: \"Minimal profile, maximal warmth. An articulated arm positions light exactly where you need it. The linen shade is replaceable — just the base stays forever.\",
    materials: \"Powder-coated steel, Natural linen shade\",
    dimensions: \"Base Ø 25 × H 160 cm\",
  },
  {
    id: 4, name: \"Terrain Side Table\", category: \"furniture\",
    price: 340, originalPrice: 420, rating: 4.8, reviews: 61,
    isNew: false, isSale: true, inStock: true,
    image: \"https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=960&h=1140&fit=crop&q=85\",
    description: \"Solid oak legs, honed Carrara marble top. Two materials in an honest conversation. No veneer, no MDF core, no edge banding. The marble varies batch to batch — every table is unique.\",
    materials: \"Solid oak, Honed Carrara marble\",
    dimensions: \"W 45 × D 45 × H 55 cm\",
  },
  {
    id: 5, name: \"Dune Ceramic Vase\", category: \"decor\",
    price: 145, originalPrice: null, rating: 4.9, reviews: 132,
    isNew: false, isSale: false, inStock: true,
    image: \"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=960&h=1140&fit=crop&q=85\",
    description: \"Wheel-thrown and hand-glazed in small batches. The reactive ash glaze shifts from stone to driftwood depending on the kiln. Yours will be singular.\",
    materials: \"Stoneware, Reactive ash glaze\",
    dimensions: \"Ø 14 × H 32 cm\",
  },
  {
    id: 6, name: \"Loom Merino Throw\", category: \"textiles\",
    price: 220, originalPrice: null, rating: 4.8, reviews: 95,
    isNew: true, isSale: false, inStock: true,
    image: \"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=960&h=1140&fit=crop&q=85\",
    description: \"100% New Zealand merino in a herringbone weave, produced at a 4th-generation mill in the Basque Country. Softer than cashmere blends. Machine washable at 30°C.\",
    materials: \"100% New Zealand merino wool\",
    dimensions: \"130 × 180 cm\",
  },
  {
    id: 7, name: \"Atoll Coffee Table\", category: \"furniture\",
    price: 890, originalPrice: null, rating: 4.7, reviews: 44,
    isNew: true, isSale: false, inStock: true,
    image: \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=960&h=1140&fit=crop&q=85\",
    description: \"An ovoid low-form in smoked bronze glass and blackened steel tube. At some angles it disappears into the floor; at others it anchors the whole room.\",
    materials: \"Smoked bronze glass, Blackened steel\",
    dimensions: \"W 120 × D 65 × H 38 cm\",
  },
  {
    id: 8, name: \"Mesa Linen Cushion\", category: \"textiles\",
    price: 85, originalPrice: 110, rating: 4.6, reviews: 78,
    isNew: false, isSale: true, inStock: true,
    image: \"https://images.unsplash.com/photo-1616627452500-3cffdd7a28e5?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1616627452500-3cffdd7a28e5?w=960&h=1140&fit=crop&q=85\",
    description: \"Stone-washed Belgian linen, feather-and-down filled. Develops the same patina as a good linen shirt — slightly rumpled, deeply comfortable.\",
    materials: \"Stone-washed Belgian linen, Feather & down fill\",
    dimensions: \"50 × 50 cm\",
  },
  {
    id: 9, name: \"Basin Wall Sconce\", category: \"lighting\",
    price: 265, originalPrice: null, rating: 4.5, reviews: 38,
    isNew: false, isSale: false, inStock: true,
    image: \"https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=960&h=1140&fit=crop&q=85\",
    description: \"A sculptural half-dome in spun aluminum. The upward wash creates soft ambient light without glare — perfect beside a bed or flanking a fireplace.\",
    materials: \"Spun aluminum, Brass hardware\",
    dimensions: \"W 22 × D 14 × H 18 cm\",
  },
  {
    id: 10, name: \"Strand Jute Rug 2×3m\", category: \"textiles\",
    price: 480, originalPrice: 560, rating: 4.7, reviews: 56,
    isNew: false, isSale: true, inStock: true,
    image: \"https://images.unsplash.com/photo-1503602642458-232111445657?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1503602642458-232111445657?w=960&h=1140&fit=crop&q=85\",
    description: \"Hand-braided by cooperatives in Bangladesh in a tight herringbone pattern. The tighter the braid, the longer it lasts. This one is very tight.\",
    materials: \"100% natural jute\",
    dimensions: \"200 × 300 cm · Pile height 6 mm\",
  },
  {
    id: 11, name: \"Folio Copper Mirror\", category: \"decor\",
    price: 595, originalPrice: null, rating: 4.9, reviews: 71,
    isNew: true, isSale: false, inStock: true,
    image: \"https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=960&h=1140&fit=crop&q=85\",
    description: \"An ovoid float glass mirror in a hand-beaten copper frame. The irregular hammer marks catch and scatter light differently at every hour. Will develop a natural patina.\",
    materials: \"Hand-beaten copper, Silvered float glass\",
    dimensions: \"W 65 × H 90 cm · Frame depth 4 cm\",
  },
  {
    id: 12, name: \"Monolith Bookshelf\", category: \"furniture\",
    price: 1450, originalPrice: null, rating: 4.8, reviews: 29,
    isNew: true, isSale: false, inStock: true,
    image: \"https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&h=720&fit=crop&q=80\",
    largeImage: \"https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=960&h=1140&fit=crop&q=85\",
    description: \"Black-stained solid ash in a wall-mounted or freestanding configuration. Shelves are adjustable. The surface is oiled, not lacquered — it accepts wax over decades.\",
    materials: \"Black-stained solid ash, Oiled finish\",
    dimensions: \"W 90 × D 30 × H 180 cm\",
  },
];

const CATEGORIES = [\"all\", \"furniture\", \"lighting\", \"decor\", \"textiles\"];

const CATEGORY_META = {
  furniture: { img: \"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&q=80\", count: 4 },
  lighting:  { img: \"https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=400&fit=crop&q=80\", count: 3 },
  decor:     { img: \"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=400&fit=crop&q=80\", count: 2 },
  textiles:  { img: \"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&q=80\", count: 3 },
};

// ─────────────────────────────────────────────────────────────────────
// TOAST CONTEXT
// ─────────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

function ToastProvider({ children }) {
  const [toast, setToast] = useState({ msg: \"\", visible: false });
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast msg={toast.msg} visible={toast.visible} />
    </ToastContext.Provider>
  );
}

const useToast = () => useContext(ToastContext);

// ─────────────────────────────────────────────────────────────────────
// CART CONTEXT  (useReducer-based state management + localStorage)
// ─────────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

const CART_STORAGE_KEY = \"verdant_cart_v1\";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) return parsed;
    return { items: [] };
  } catch {
    return { items: [] };
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case \"ADD\": {
      const exists = state.items.find(i => i.id === action.product.id);
      return {
        ...state,
        items: exists
          ? state.items.map(i => i.id === action.product.id ? { ...i, qty: i.qty + action.qty } : i)
          : [...state.items, { ...action.product, qty: action.qty }],
      };
    }
    case \"REMOVE\":   return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case \"SET_QTY\":  return {
      ...state,
      items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i).filter(i => i.qty > 0),
    };
    case \"CLEAR\":    return { ...state, items: [] };
    default:         return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [isOpen, setIsOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch {
      /* ignore */
    }
  }, [state.items]);

  const cartTotal = useMemo(() => state.items.reduce((s, i) => s + i.price * i.qty, 0), [state.items]);
  const cartCount = useMemo(() => state.items.reduce((s, i) => s + i.qty, 0), [state.items]);

  const addItem = useCallback((product, qty = 1) => {
    dispatch({ type: \"ADD\", product, qty });
  }, []);

  return (
    <CartContext.Provider value={{ items: state.items, dispatch, addItem, isOpen, setIsOpen, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => useContext(CartContext);

// ─────────────────────────────────────────────────────────────────────
// CLIENT-SIDE ROUTER  (in-memory, with history)
// ─────────────────────────────────────────────────────────────────────
const RouterContext = createContext(null);

function RouterProvider({ children }) {
  const [route, setRoute] = useState({ page: \"home\", params: {} });
  const history = useRef([{ page: \"home\", params: {} }]);
  const historyIdx = useRef(0);

  const navigate = useCallback((page, params = {}) => {
    const entry = { page, params };
    history.current = history.current.slice(0, historyIdx.current + 1);
    history.current.push(entry);
    historyIdx.current = history.current.length - 1;
    setRoute(entry);
    window.scrollTo({ top: 0, behavior: \"smooth\" });
  }, []);

  const goBack = useCallback(() => {
    if (historyIdx.current > 0) {
      historyIdx.current -= 1;
      setRoute(history.current[historyIdx.current]);
      window.scrollTo({ top: 0, behavior: \"smooth\" });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}

const useRouter = () => useContext(RouterContext);

// ─────────────────────────────────────────────────────────────────────
// GLOBAL STYLES  (fonts + keyframes injected once)
// ─────────────────────────────────────────────────────────────────────
function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement(\"link\");
    link.href = \"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap\";
    link.rel = \"stylesheet\";
    document.head.appendChild(link);

    const style = document.createElement(\"style\");
    style.id = \"verdant-global\";
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #FBF5EE; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; overflow-x: hidden; color: #1A1A1A; line-height: 1.6; }
      button { cursor: pointer; border: none; background: none; font-family: inherit; color: inherit; }
      img { display: block; }
      input, select { font-family: inherit; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #F5E6D0; }
      ::-webkit-scrollbar-thumb { background: #C4713A; border-radius: 4px; }
      input[type=range] { accent-color: #C4713A; cursor: pointer; }
      @keyframes slideRight   { from { transform: translateX(110%); } to { transform: translateX(0); } }
      @keyframes slideDown    { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeUp       { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn       { from { opacity: 0; } to { opacity: 1; } }
      @keyframes toastIn      { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      @keyframes toastOut     { from { opacity: 1; } to { opacity: 0; } }
      @keyframes spin         { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes heroFloat    { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      @keyframes pulse        { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
      .card-reveal { animation: fadeUp 0.45s ease both; }
      .cart-slide  { animation: slideRight 0.38s cubic-bezier(0.33, 1, 0.68, 1) both; }
      .hero-float  { animation: heroFloat 6s ease-in-out infinite; }
      .mobile-menu { animation: slideDown 0.25s ease both; }

      @media (max-width: 880px) {
        .desktop-only { display: none !important; }
        .responsive-grid-3 { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
        .responsive-grid-4 { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
        .responsive-stack { grid-template-columns: 1fr !important; gap: 32px !important; }
        .responsive-flex-col { flex-direction: column !important; align-items: flex-start !important; }
        .responsive-hide { display: none !important; }
      }
      @media (max-width: 560px) {
        .responsive-grid-3 { grid-template-columns: 1fr !important; }
        .responsive-grid-4 { grid-template-columns: 1fr 1fr !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      const el = document.getElementById(\"verdant-global\");
      if (el) document.head.removeChild(el);
    };
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────────────────────────────
function Toast({ msg, visible }) {
  return (
    <div
      data-testid=\"global-toast\"
      style={{
        position: \"fixed\", bottom: 28, left: \"50%\",
        transform: \"translateX(-50%)\",
        background: T.forest, color: T.cream,
        padding: \"11px 22px\", borderRadius: 100,
        display: visible ? \"flex\" : \"none\",
        alignItems: \"center\", gap: 9,
        fontSize: 13, fontWeight: 500, zIndex: 9999,
        boxShadow: \"0 8px 28px rgba(10,54,34,0.35)\",
        pointerEvents: \"none\",
        animation: visible ? \"toastIn 0.3s ease both\" : \"toastOut 0.3s ease both\",
        opacity: visible ? 1 : 0,
        transition: \"opacity 0.3s ease\",
      }}
    >
      <Check size={15} color={T.copper} strokeWidth={3} />
      {msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const { navigate } = useRouter();
  const { cartCount, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener(\"scroll\", onScroll);
    return () => window.removeEventListener(\"scroll\", onScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 400);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  const navStyle = {
    position: \"fixed\", top: 0, left: 0, right: 0, zIndex: 1000,
    background: scrolled ? \"rgba(7,31,20,0.97)\" : T.forest,
    backdropFilter: scrolled ? \"blur(16px)\" : \"none\",
    borderBottom: scrolled ? \"1px solid rgba(196,113,58,0.2)\" : \"1px solid transparent\",
    transition: \"all 0.35s ease\",
  };

  const go = (page) => { setMobileOpen(false); navigate(page); };

  return (
    <nav style={navStyle} data-testid=\"main-navbar\">
      <div style={{ maxWidth: 1320, margin: \"0 auto\", padding: \"0 28px\", display: \"flex\", alignItems: \"center\", justifyContent: \"space-between\", height: 74 }}>

        {/* LOGO */}
        <button onClick={() => go(\"home\")} style={{ lineHeight: 1.1 }} data-testid=\"nav-logo\">
          <div style={{ fontFamily: \"'Cormorant Garamond', Georgia, serif\", fontSize: 23, fontWeight: 600, color: T.cream, letterSpacing: \"0.08em\" }}>
            VERDANT
          </div>
          <div style={{ fontSize: 8.5, letterSpacing: \"0.35em\", color: T.copper, fontWeight: 500, textTransform: \"uppercase\", marginTop: 1 }}>
            Home Studio
          </div>
        </button>

        {/* CENTER NAV (desktop) */}
        <div className=\"desktop-only\" style={{ display: \"flex\", gap: 36, alignItems: \"center\" }}>
          <NavLink onClick={() => navigate(\"home\")} label=\"Home\" testid=\"nav-home\" />
          <NavLink onClick={() => navigate(\"shop\")} label=\"Shop\" testid=\"nav-shop\" />
          <NavLink onClick={() => navigate(\"shop\")} label=\"Collections\" testid=\"nav-collections\" />
          <NavLink onClick={() => navigate(\"home\")} label=\"About\" testid=\"nav-about\" />
        </div>

        {/* ACTIONS */}
        <div style={{ display: \"flex\", alignItems: \"center\", gap: 18 }}>
          <button
            onClick={() => navigate(\"shop\")}
            data-testid=\"nav-search-btn\"
            style={{ color: \"rgba(250,250,248,0.75)\", display: \"flex\", transition: \"color 0.2s\" }}
            onMouseEnter={e => e.currentTarget.style.color = T.cream}
            onMouseLeave={e => e.currentTarget.style.color = \"rgba(250,250,248,0.75)\"}
          >
            <Search size={19} />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            data-testid=\"nav-cart-btn\"
            style={{
              position: \"relative\", color: \"rgba(250,250,248,0.85)\", display: \"flex\",
              transition: \"color 0.2s, transform 0.2s\",
              transform: cartBounce ? \"scale(1.25)\" : \"scale(1)\",
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.cream}
            onMouseLeave={e => e.currentTarget.style.color = \"rgba(250,250,248,0.85)\"}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span
                data-testid=\"nav-cart-count\"
                style={{
                  position: \"absolute\", top: -7, right: -8,
                  background: T.copper, color: T.cream,
                  borderRadius: \"50%\", width: 18, height: 18,
                  fontSize: 10, fontWeight: 700,
                  display: \"flex\", alignItems: \"center\", justifyContent: \"center\",
                  border: `2px solid ${T.forest}`,
                  transition: \"transform 0.15s ease\",
                }}
              >
                {cartCount > 9 ? \"9+\" : cartCount}
              </span>
            )}
          </button>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            data-testid=\"mobile-menu-toggle\"
            style={{ display: \"none\", color: T.cream }}
            className=\"mobile-only\"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <style>{`
            @media (max-width: 880px) {
              .mobile-only { display: flex !important; }
            }
          `}</style>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className=\"mobile-menu\"
          data-testid=\"mobile-menu\"
          style={{
            background: T.forestDeep,
            borderTop: \"1px solid rgba(196,113,58,0.2)\",
            padding: \"16px 28px 24px\",
          }}
        >
          {[[\"Home\", \"home\"], [\"Shop\", \"shop\"], [\"Collections\", \"shop\"], [\"About\", \"home\"]].map(([label, page]) => (
            <button
              key={label}
              onClick={() => go(page)}
              data-testid={`mobile-nav-${label.toLowerCase()}`}
              style={{
                display: \"block\", width: \"100%\", textAlign: \"left\",
                padding: \"12px 0\",
                color: \"rgba(250,250,248,0.85)\",
                fontSize: 14, letterSpacing: \"0.12em\", textTransform: \"uppercase\",
                borderBottom: \"1px solid rgba(245,230,208,0.08)\",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function NavLink({ label, onClick, testid }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 12.5, letterSpacing: \"0.12em\", textTransform: \"uppercase\",
        fontWeight: 400, color: hov ? T.cream : \"rgba(250,250,248,0.72)\",
        transition: \"color 0.18s\",
        paddingBottom: 2,
        borderBottom: hov ? `1px solid ${T.copper}` : \"1px solid transparent\",
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────────────────────────────
function CartDrawer() {
  const { items, dispatch, isOpen, setIsOpen, cartTotal } = useCart();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const drawerWidth = typeof window !== \"undefined\" ? Math.min(460, window.innerWidth) : 460;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        data-testid=\"cart-backdrop\"
        style={{
          position: \"fixed\", inset: 0, background: \"rgba(0,0,0,0.48)\",
          zIndex: 2000, backdropFilter: \"blur(5px)\",
          animation: \"fadeIn 0.2s ease both\",
        }}
      />

      {/* Drawer */}
      <aside
        className=\"cart-slide\"
        data-testid=\"cart-drawer\"
        style={{
          position: \"fixed\", top: 0, right: 0, bottom: 0,
          width: drawerWidth,
          background: T.cream, zIndex: 2001,
          display: \"flex\", flexDirection: \"column\",
          boxShadow: \"-24px 0 80px rgba(0,0,0,0.18)\",
        }}
      >
        {/* Header */}
        <div style={{ padding: \"26px 28px 22px\", borderBottom: `1px solid ${T.mist}`, display: \"flex\", justifyContent: \"space-between\", alignItems: \"flex-start\" }}>
          <div>
            <h2 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 26, fontWeight: 600, color: T.dark }}>Your Cart</h2>
            <p style={{ fontSize: 12, color: T.gray, marginTop: 3 }}>
              {items.length === 0 ? \"Empty\" : `${items.reduce((s, i) => s + i.qty, 0)} ${items.reduce((s, i) => s + i.qty, 0) === 1 ? \"item\" : \"items\"}`}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            data-testid=\"cart-close-btn\"
            style={{
              width: 38, height: 38, borderRadius: 19, background: T.lightGray,
              display: \"flex\", alignItems: \"center\", justifyContent: \"center\", color: T.dark,
              transition: \"background 0.15s\",
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: \"auto\", padding: \"8px 28px 16px\" }}>
          {items.length === 0 ? (
            <div data-testid=\"cart-empty-state\" style={{ textAlign: \"center\", paddingTop: 90 }}>
              <div style={{ width: 80, height: 80, borderRadius: 40, background: T.lightGray, display: \"flex\", alignItems: \"center\", justifyContent: \"center\", margin: \"0 auto 20px\" }}>
                <ShoppingCart size={36} color={T.mist} />
              </div>
              <p style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 22, color: T.dark }}>Nothing here yet</p>
              <p style={{ fontSize: 13, color: T.gray, marginTop: 6 }}>Add something that earns its place.</p>
              <button
                onClick={() => { navigate(\"shop\"); setIsOpen(false); }}
                data-testid=\"cart-browse-collection-btn\"
                style={{ marginTop: 24, background: T.forest, color: T.cream, padding: \"12px 26px\", borderRadius: 6, fontSize: 12.5, fontWeight: 500, letterSpacing: \"0.08em\", textTransform: \"uppercase\" }}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div data-testid=\"cart-items-list\" style={{ paddingTop: 8 }}>
              {items.map((item, idx) => (
                <CartItem key={item.id} item={item} dispatch={dispatch} delay={idx * 60} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: \"20px 28px 28px\", borderTop: `1px solid ${T.mist}`, background: T.sandLight }}>
            <div style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"baseline\", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: T.gray }}>Subtotal</span>
              <span data-testid=\"cart-subtotal\" style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 28, fontWeight: 600, color: T.dark }}>
                £{cartTotal.toLocaleString()}
              </span>
            </div>
            <p style={{ fontSize: 11, color: T.gray, marginBottom: 18, textAlign: \"right\" }}>
              Free shipping · Taxes at checkout
            </p>
            <CheckoutButton onClick={() => showToast(\"Checkout is coming soon — stay tuned\")} />
            <button
              onClick={() => dispatch({ type: \"CLEAR\" })}
              data-testid=\"cart-clear-btn\"
              style={{ width: \"100%\", marginTop: 10, fontSize: 11.5, color: T.gray, textAlign: \"center\", textDecoration: \"underline\", textUnderlineOffset: 3 }}
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function CartItem({ item, dispatch, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      data-testid={`cart-item-${item.id}`}
      style={{
        display: \"flex\", gap: 16, padding: \"18px 0\",
        borderBottom: `1px solid ${T.mist}`,
        animation: `fadeUp 0.35s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ width: 84, height: 96, borderRadius: 8, overflow: \"hidden\", flexShrink: 0, background: T.mist }}>
        <img src={item.image} alt={item.name} style={{ width: \"100%\", height: \"100%\", objectFit: \"cover\" }} loading=\"lazy\" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 17, fontWeight: 600, color: T.dark, lineHeight: 1.25 }}>{item.name}</p>
        <p style={{ fontSize: 11.5, color: T.copper, marginTop: 2, textTransform: \"capitalize\", letterSpacing: \"0.05em\" }}>{item.category}</p>
        <div style={{ display: \"flex\", alignItems: \"center\", justifyContent: \"space-between\", marginTop: 14 }}>
          {/* Qty */}
          <div style={{ display: \"flex\", alignItems: \"center\", border: `1px solid ${T.divider}`, borderRadius: 6, overflow: \"hidden\" }}>
            <QtyBtn onClick={() => dispatch({ type: \"SET_QTY\", id: item.id, qty: item.qty - 1 })} icon={<Minus size={13} />} testid={`cart-item-${item.id}-decrease`} />
            <span data-testid={`cart-item-${item.id}-qty`} style={{ width: 32, textAlign: \"center\", fontSize: 13.5, fontWeight: 600, color: T.dark }}>{item.qty}</span>
            <QtyBtn onClick={() => dispatch({ type: \"SET_QTY\", id: item.id, qty: item.qty + 1 })} icon={<Plus size={13} />} testid={`cart-item-${item.id}-increase`} />
          </div>
          {/* Price + remove */}
          <div style={{ display: \"flex\", alignItems: \"center\", gap: 14 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: T.dark }}>£{(item.price * item.qty).toLocaleString()}</span>
            <button
              onClick={() => dispatch({ type: \"REMOVE\", id: item.id })}
              data-testid={`cart-item-${item.id}-remove`}
              onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
              style={{ color: hov ? \"#d94040\" : T.gray, transition: \"color 0.15s\", display: \"flex\" }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QtyBtn({ onClick, icon, testid }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: \"7px 10px\", background: hov ? T.lightGray : \"transparent\", color: T.gray, transition: \"background 0.15s\", display: \"flex\" }}
    >
      {icon}
    </button>
  );
}

function CheckoutButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      data-testid=\"cart-checkout-btn\"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: \"100%\", background: hov ? T.forestHover : T.forest, color: T.cream,
        padding: \"15px\", borderRadius: 6, fontSize: 13, fontWeight: 600,
        letterSpacing: \"0.1em\", textTransform: \"uppercase\",
        display: \"flex\", alignItems: \"center\", justifyContent: \"center\", gap: 8,
        transition: \"background 0.2s\",
      }}
    >
      Checkout <ArrowRight size={15} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PRODUCT CARD  (the signature reveal component)
// ─────────────────────────────────────────────────────────────────────
function ProductCard({ product, delay = 0 }) {
  const { navigate } = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [hov, setHov] = useState(false);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <article
      className=\"card-reveal\"
      data-testid={`product-card-${product.id}`}
      style={{ animationDelay: `${delay}ms`, cursor: \"pointer\" }}
      onClick={() => navigate(\"product\", { id: product.id })}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* — IMAGE BLOCK — */}
      <div style={{
        position: \"relative\", borderRadius: 14, overflow: \"hidden\",
        aspectRatio: \"4/5\", background: T.mist,
      }}>
        <img
          src={product.image}
          alt={product.name}
          loading=\"lazy\"
          style={{
            width: \"100%\", height: \"100%\", objectFit: \"cover\",
            transition: \"transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)\",
            transform: hov ? \"scale(1.07)\" : \"scale(1)\",
          }}
        />

        {/* Badges */}
        <div style={{ position: \"absolute\", top: 13, left: 13, display: \"flex\", gap: 6 }}>
          {product.isNew && (
            <span style={{ background: T.forest, color: T.cream, fontSize: 9.5, fontWeight: 700, padding: \"4px 10px\", borderRadius: 100, letterSpacing: \"0.12em\" }}>NEW</span>
          )}
          {product.isSale && (
            <span style={{ background: T.copper, color: T.cream, fontSize: 9.5, fontWeight: 700, padding: \"4px 10px\", borderRadius: 100, letterSpacing: \"0.12em\" }}>−{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          data-testid={`product-card-${product.id}-wishlist`}
          style={{
            position: \"absolute\", top: 13, right: 13,
            width: 36, height: 36, borderRadius: 18,
            background: liked ? \"rgba(196,113,58,0.15)\" : \"rgba(255,255,255,0.92)\",
            display: \"flex\", alignItems: \"center\", justifyContent: \"center\",
            boxShadow: \"0 2px 10px rgba(0,0,0,0.12)\",
            opacity: hov || liked ? 1 : 0,
            transition: \"opacity 0.2s, background 0.2s\",
          }}
        >
          <Heart size={15} fill={liked ? T.copper : \"none\"} color={liked ? T.copper : T.gray} strokeWidth={2} />
        </button>

        {/* THE SIGNATURE REVEAL — forest sweep with copper CTA */}
        <div style={{
          position: \"absolute\", bottom: 0, left: 0, right: 0,
          background: \"linear-gradient(to top, rgba(10,54,34,0.96) 0%, rgba(10,54,34,0.5) 60%, transparent 100%)\",
          padding: \"52px 14px 14px\",
          transform: hov ? \"translateY(0)\" : \"translateY(102%)\",
          transition: \"transform 0.42s cubic-bezier(0.33, 1, 0.68, 1)\",
        }}>
          <button
            onClick={handleAdd}
            data-testid={`product-card-${product.id}-add-to-cart`}
            style={{
              width: \"100%\", padding: \"11px\",
              background: added ? T.copper : T.cream,
              color: added ? T.cream : T.dark,
              borderRadius: 7, fontSize: 12.5, fontWeight: 600,
              letterSpacing: \"0.05em\",
              display: \"flex\", alignItems: \"center\", justifyContent: \"center\", gap: 7,
              transition: \"all 0.22s ease\",
              boxShadow: \"0 2px 12px rgba(0,0,0,0.25)\",
            }}
          >
            {added
              ? <><Check size={14} strokeWidth={3} /> In Cart</>
              : <><Plus size={14} strokeWidth={2.5} /> Add to Cart</>}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(\"product\", { id: product.id }); }}
            data-testid={`product-card-${product.id}-quick-view`}
            style={{
              width: \"100%\", marginTop: 6, padding: \"8px\",
              color: \"rgba(250,250,248,0.85)\", fontSize: 11.5,
              display: \"flex\", alignItems: \"center\", justifyContent: \"center\", gap: 5,
            }}
          >
            <Eye size={12} /> Quick View
          </button>
        </div>
      </div>

      {/* — INFO BLOCK — */}
      <div style={{ padding: \"13px 2px 0\" }}>
        <p style={{ fontSize: 10.5, color: T.copper, fontWeight: 600, textTransform: \"uppercase\", letterSpacing: \"0.12em\", marginBottom: 5 }}>
          {product.category}
        </p>
        <h3 style={{
          fontFamily: \"'Cormorant Garamond', serif\", fontSize: 20, fontWeight: 600,
          color: T.dark, lineHeight: 1.2,
          textDecoration: hov ? \"underline\" : \"none\",
          textUnderlineOffset: 3, textDecorationColor: T.copper,
          transition: \"text-decoration 0.2s\",
        }}>
          {product.name}
        </h3>
        <div style={{ display: \"flex\", alignItems: \"center\", justifyContent: \"space-between\", marginTop: 9 }}>
          <div style={{ display: \"flex\", alignItems: \"center\", gap: 9 }}>
            <span style={{ fontSize: 17, fontWeight: 600, color: product.isSale ? T.copper : T.dark }}>
              £{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 13, color: T.gray, textDecoration: \"line-through\" }}>
                £{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div style={{ display: \"flex\", alignItems: \"center\", gap: 4 }}>
            <Star size={11} fill={T.copper} color={T.copper} />
            <span style={{ fontSize: 11.5, color: T.gray }}>{product.rating}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────
// LIST CARD  (alternative compact view for shop page)
// ─────────────────────────────────────────────────────────────────────
function ListCard({ product, delay }) {
  const { navigate } = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <div
      className=\"card-reveal\"
      data-testid={`product-list-${product.id}`}
      style={{
        animationDelay: `${delay}ms`,
        display: \"flex\", gap: 20, background: T.cream,
        borderRadius: 12, overflow: \"hidden\", cursor: \"pointer\",
        border: `1px solid ${hov ? T.copper : T.divider}`,
        transition: \"border-color 0.2s, box-shadow 0.2s\",
        boxShadow: hov ? \"0 4px 20px rgba(196,113,58,0.12)\" : \"none\",
      }}
      onClick={() => navigate(\"product\", { id: product.id })}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 130, height: 150, flexShrink: 0, overflow: \"hidden\" }}>
        <img src={product.image} alt={product.name}
          style={{ width: \"100%\", height: \"100%\", objectFit: \"cover\", transition: \"transform 0.5s ease\", transform: hov ? \"scale(1.06)\" : \"scale(1)\" }}
          loading=\"lazy\" />
      </div>
      <div style={{ flex: 1, padding: \"18px 20px 18px 0\", display: \"flex\", alignItems: \"center\", justifyContent: \"space-between\", gap: 16 }}>
        <div>
          <p style={{ fontSize: 10.5, color: T.copper, fontWeight: 600, textTransform: \"uppercase\", letterSpacing: \"0.1em\", marginBottom: 4 }}>{product.category}</p>
          <h3 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 22, fontWeight: 600, color: T.dark, lineHeight: 1.2 }}>{product.name}</h3>
          <p style={{ fontSize: 13, color: T.gray, marginTop: 6, lineHeight: 1.55, maxWidth: 340 }}>{product.description.slice(0, 110)}…</p>
          <div style={{ display: \"flex\", alignItems: \"center\", gap: 6, marginTop: 10 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < Math.round(product.rating) ? T.copper : \"none\"} color={T.copper} />)}
            <span style={{ fontSize: 11.5, color: T.gray }}>{product.rating} ({product.reviews})</span>
          </div>
        </div>
        <div style={{ textAlign: \"right\", flexShrink: 0, paddingLeft: 12 }}>
          <div style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 26, fontWeight: 600, color: product.isSale ? T.copper : T.dark }}>
            £{product.price.toLocaleString()}
          </div>
          {product.originalPrice && (
            <div style={{ fontSize: 13, color: T.gray, textDecoration: \"line-through\", marginTop: 2 }}>
              £{product.originalPrice.toLocaleString()}
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); addItem(product); showToast(`${product.name} added to cart`); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
            data-testid={`product-list-${product.id}-add-to-cart`}
            style={{
              marginTop: 14, background: added ? T.copper : T.forest, color: T.cream,
              padding: \"10px 20px\", borderRadius: 6, fontSize: 12, fontWeight: 600,
              display: \"flex\", alignItems: \"center\", gap: 6,
              transition: \"background 0.2s\", whiteSpace: \"nowrap\",
            }}
          >
            {added ? <><Check size={13} /> Added!</> : <><Plus size={13} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────
function HomePage() {
  const { navigate } = useRouter();
  const featured = useMemo(() => PRODUCTS.filter(p => p.isSale || p.isNew).slice(0, 6), []);

  return (
    <div data-testid=\"home-page\" style={{ paddingTop: 74 }}>
      {/* ── HERO ── */}
      <section style={{
        minHeight: \"calc(100vh - 74px)\", background: T.forest,
        display: \"flex\", alignItems: \"center\",
        position: \"relative\", overflow: \"hidden\",
      }}>
        {/* Dot-grid texture */}
        <div style={{
          position: \"absolute\", inset: 0,
          backgroundImage: \"radial-gradient(circle, rgba(245,230,208,0.07) 1px, transparent 1px)\",
          backgroundSize: \"38px 38px\",
          pointerEvents: \"none\",
        }} />

        {/* Full-bleed room image (right half) */}
        <div className=\"responsive-hide\" style={{ position: \"absolute\", right: 0, top: 0, bottom: 0, width: \"58%\" }}>
          <img
            src=\"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&h=1000&fit=crop&q=85\"
            alt=\"Curated living room\"
            style={{ width: \"100%\", height: \"100%\", objectFit: \"cover\", opacity: 0.6 }}
          />
          <div style={{ position: \"absolute\", inset: 0, background: \"linear-gradient(to right, #0A3622 0%, rgba(10,54,34,0.35) 55%, transparent 100%)\" }} />
        </div>

        {/* Hero copy */}
        <div style={{ maxWidth: 1320, margin: \"0 auto\", padding: \"80px 28px\", position: \"relative\", zIndex: 1, width: \"100%\" }}>
          <div style={{ maxWidth: 560 }}>
            <div className=\"card-reveal\" style={{ animationDelay: \"0ms\" }}>
              <p style={{ fontSize: 10, letterSpacing: \"0.4em\", color: T.copper, textTransform: \"uppercase\", fontWeight: 600, marginBottom: 24 }}>
                Curated · Crafted · Considered
              </p>
            </div>
            <div className=\"card-reveal\" style={{ animationDelay: \"80ms\" }}>
              <h1 style={{
                fontFamily: \"'Cormorant Garamond', serif\",
                fontSize: \"clamp(52px, 6.5vw, 88px)\",
                fontWeight: 600, color: T.cream, lineHeight: 1.04, marginBottom: 28,
              }}>
                Objects that<br />
                <em style={{ color: T.copper, fontStyle: \"italic\" }}>earn their</em>
                <br />place.
              </h1>
            </div>
            <div className=\"card-reveal\" style={{ animationDelay: \"160ms\" }}>
              <p style={{ fontSize: 15.5, color: \"rgba(250,250,248,0.72)\", lineHeight: 1.75, maxWidth: 420, marginBottom: 40 }}>
                We select home furnishings the way a good editor selects words — with ruthless intention. Every piece in our collection has earned its existence.
              </p>
            </div>
            <div className=\"card-reveal\" style={{ animationDelay: \"240ms\" }}>
              <div style={{ display: \"flex\", gap: 14, flexWrap: \"wrap\" }}>
                <HeroButton primary onClick={() => navigate(\"shop\")} testid=\"hero-shop-btn\">
                  Shop Collection <ArrowRight size={16} />
                </HeroButton>
                <HeroButton onClick={() => navigate(\"shop\")} testid=\"hero-new-btn\">
                  New Arrivals
                </HeroButton>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className=\"responsive-hide\" style={{
          position: \"absolute\", bottom: 0, left: 0, right: 0,
          borderTop: \"1px solid rgba(245,230,208,0.12)\",
          background: \"rgba(7,31,20,0.6)\", backdropFilter: \"blur(8px)\",
        }}>
          <div style={{ maxWidth: 1320, margin: \"0 auto\", padding: \"20px 28px\", display: \"flex\", gap: \"6%\" }}>
            {[[\"240+\", \"Curated pieces\"], [\"12\", \"Countries sourced\"], [\"100%\", \"Responsibly made\"], [\"4.85 ★\", \"Average rating\"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 26, fontWeight: 600, color: T.cream }}>{val}</div>
                <div style={{ fontSize: 10.5, color: \"rgba(250,250,248,0.6)\", letterSpacing: \"0.1em\", textTransform: \"uppercase\", marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID ── */}
      <section style={{ background: T.sand, padding: \"56px 28px\" }}>
        <div style={{ maxWidth: 1320, margin: \"0 auto\" }}>
          <div className=\"responsive-flex-col\" style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"flex-end\", marginBottom: 32, gap: 16 }}>
            <div>
              <p style={{ fontSize: 10, color: T.copper, letterSpacing: \"0.3em\", textTransform: \"uppercase\", fontWeight: 600, marginBottom: 8 }}>Browse by room</p>
              <h2 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 34, fontWeight: 600, color: T.dark }}>Four Categories</h2>
            </div>
            <button onClick={() => navigate(\"shop\")} data-testid=\"categories-view-all\" style={{ fontSize: 12.5, color: T.forest, display: \"flex\", alignItems: \"center\", gap: 5, fontWeight: 500 }}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className=\"responsive-grid-4\" style={{ display: \"grid\", gridTemplateColumns: \"repeat(4, 1fr)\", gap: 18 }}>
            {Object.entries(CATEGORY_META).map(([cat, meta], i) => (
              <CategoryCard key={cat} cat={cat} meta={meta} delay={i * 80} onClick={() => navigate(\"shop\")} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: \"72px 28px 80px\", background: T.sandLight }}>
        <div style={{ maxWidth: 1320, margin: \"0 auto\" }}>
          <div className=\"responsive-flex-col\" style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"flex-end\", marginBottom: 48, gap: 16 }}>
            <div>
              <p style={{ fontSize: 10, color: T.copper, letterSpacing: \"0.3em\", textTransform: \"uppercase\", fontWeight: 600, marginBottom: 8 }}>Handpicked</p>
              <h2 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 40, fontWeight: 600, color: T.dark }}>Sale & New Arrivals</h2>
            </div>
            <button onClick={() => navigate(\"shop\")} data-testid=\"featured-see-all\" style={{ fontSize: 13, color: T.forest, display: \"flex\", alignItems: \"center\", gap: 5, fontWeight: 500, textDecoration: \"underline\", textUnderlineOffset: 4 }}>
              See everything <ArrowRight size={14} />
            </button>
          </div>
          <div className=\"responsive-grid-3\" data-testid=\"featured-grid\" style={{ display: \"grid\", gridTemplateColumns: \"repeat(3, 1fr)\", gap: 28 }}>
            {featured.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL BAND ── */}
      <section style={{ background: T.forest, padding: \"0 28px\" }}>
        <div style={{ maxWidth: 1320, margin: \"0 auto\" }}>
          <div className=\"responsive-stack\" style={{ display: \"grid\", gridTemplateColumns: \"1fr 1fr\", minHeight: 420, alignItems: \"center\", gap: 40 }}>
            <div style={{ padding: \"64px 0 64px\" }}>
              <p style={{ fontSize: 10, letterSpacing: \"0.35em\", color: T.copper, textTransform: \"uppercase\", fontWeight: 600, marginBottom: 20 }}>Our Philosophy</p>
              <h2 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 42, fontWeight: 600, color: T.cream, lineHeight: 1.1, marginBottom: 24 }}>
                No fast furniture.<br /><em style={{ color: T.copper }}>Ever.</em>
              </h2>
              <p style={{ fontSize: 15, color: \"rgba(250,250,248,0.78)\", lineHeight: 1.75, maxWidth: 380, marginBottom: 32 }}>
                We stock only pieces we'd put in our own homes. That means natural materials, ethical production, and no vendor relationships that compromise our editorial judgement.
              </p>
              <button
                onClick={() => navigate(\"shop\")}
                data-testid=\"philosophy-cta\"
                style={{ display: \"inline-flex\", alignItems: \"center\", gap: 8, fontSize: 12.5, color: T.cream, letterSpacing: \"0.12em\", textTransform: \"uppercase\", fontWeight: 500, borderBottom: `1px solid ${T.copper}`, paddingBottom: 4 }}
              >
                Meet the makers <ArrowRight size={14} />
              </button>
            </div>
            <div style={{ display: \"flex\", justifyContent: \"flex-end\", padding: \"32px 0\" }}>
              <div className=\"hero-float\" style={{ width: 340, height: 420, borderRadius: 16, overflow: \"hidden\", boxShadow: \"0 32px 64px rgba(0,0,0,0.4)\" }}>
                <img src=\"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=680&h=840&fit=crop&q=85\"
                  alt=\"Studio interior\" style={{ width: \"100%\", height: \"100%\", objectFit: \"cover\" }} loading=\"lazy\" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: T.dark, padding: \"52px 28px\" }}>
        <div style={{ maxWidth: 1320, margin: \"0 auto\" }}>
          <div className=\"responsive-grid-4\" style={{ display: \"grid\", gridTemplateColumns: \"repeat(4, 1fr)\", gap: 24 }}>
            {[
              { icon: <Package size={22} />, title: \"Free Shipping\", sub: \"On all orders over £200\" },
              { icon: <RefreshCw size={22} />, title: \"60-Day Returns\", sub: \"No conditions, no questions\" },
              { icon: <Shield size={22} />, title: \"5-Year Warranty\", sub: \"On all solid furniture\" },
              { icon: <Headphones size={22} />, title: \"Design Advice\", sub: \"Book a free consultation\" },
            ].map(item => (
              <div key={item.title} style={{ textAlign: \"center\" }}>
                <div style={{ color: T.copper, margin: \"0 auto 14px\", display: \"flex\", justifyContent: \"center\" }}>{item.icon}</div>
                <h4 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 19, fontWeight: 600, color: T.cream, marginBottom: 5 }}>{item.title}</h4>
                <p style={{ fontSize: 12.5, color: \"rgba(250,250,248,0.65)\", lineHeight: 1.5 }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function HeroButton({ primary, onClick, children, testid }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: primary ? (hov ? T.copperHover : T.copper) : \"transparent\",
        color: T.cream,
        padding: \"15px 30px\", borderRadius: 5,
        border: primary ? \"1px solid transparent\" : `1px solid ${hov ? \"rgba(250,250,248,0.6)\" : \"rgba(250,250,248,0.3)\"}`,
        fontSize: 12.5, fontWeight: primary ? 600 : 400,
        letterSpacing: \"0.1em\", textTransform: \"uppercase\",
        display: \"flex\", alignItems: \"center\", gap: 8,
        transition: \"background 0.2s, border-color 0.2s\",
      }}
    >
      {children}
    </button>
  );
}

function CategoryCard({ cat, meta, delay, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      className=\"card-reveal\"
      data-testid={`category-card-${cat}`}
      style={{ animationDelay: `${delay}ms`, position: \"relative\", borderRadius: 12, overflow: \"hidden\", aspectRatio: \"4/3\", border: \"none\", cursor: \"pointer\", display: \"block\", width: \"100%\", textAlign: \"left\" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <img src={meta.img} alt={cat}
        style={{ width: \"100%\", height: \"100%\", objectFit: \"cover\", transition: \"transform 0.5s ease\", transform: hov ? \"scale(1.06)\" : \"scale(1)\" }}
        loading=\"lazy\" />
      <div style={{ position: \"absolute\", inset: 0, background: `linear-gradient(to top, rgba(10,54,34,${hov ? \"0.88\" : \"0.65\"}) 0%, transparent 65%)`, transition: \"background 0.3s\" }} />
      <div style={{ position: \"absolute\", bottom: 16, left: 16 }}>
        <p style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 21, fontWeight: 600, color: T.cream, lineHeight: 1.1, textTransform: \"capitalize\" }}>{cat}</p>
        <p style={{ fontSize: 10.5, color: hov ? T.copper : \"rgba(250,250,248,0.75)\", marginTop: 3, letterSpacing: \"0.08em\", textTransform: \"uppercase\", transition: \"color 0.2s\" }}>
          {meta.count} pieces
        </p>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SHOP PAGE  (filters + sorting + grid/list toggle)
// ─────────────────────────────────────────────────────────────────────
function ShopPage() {
  const [query, setQuery] = useState(\"\");
  const [cat, setCat] = useState(\"all\");
  const [sort, setSort] = useState(\"default\");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [view, setView] = useState(\"grid\");
  const [showFilters, setShowFilters] = useState(true);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySale, setOnlySale] = useState(false);

  const results = useMemo(() => {
    let list = PRODUCTS;
    if (cat !== \"all\") list = list.filter(p => p.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    list = list.filter(p => p.price <= maxPrice);
    if (onlyNew)  list = list.filter(p => p.isNew);
    if (onlySale) list = list.filter(p => p.isSale);
    if (sort === \"asc\")    return [...list].sort((a, b) => a.price - b.price);
    if (sort === \"desc\")   return [...list].sort((a, b) => b.price - a.price);
    if (sort === \"rating\") return [...list].sort((a, b) => b.rating - a.rating);
    if (sort === \"new\")    return [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [cat, query, sort, maxPrice, onlyNew, onlySale]);

  return (
    <div data-testid=\"shop-page\" style={{ paddingTop: 74, minHeight: \"100vh\", background: T.sandLight }}>
      {/* Shop Header */}
      <div style={{ background: T.forest, padding: \"52px 28px 44px\" }}>
        <div style={{ maxWidth: 1320, margin: \"0 auto\" }}>
          <p style={{ fontSize: 10, color: T.copper, letterSpacing: \"0.4em\", textTransform: \"uppercase\", fontWeight: 600, marginBottom: 12 }}>The Entire Range</p>
          <h1 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 50, fontWeight: 600, color: T.cream, lineHeight: 1.05 }}>
            The Collection
          </h1>
          <p style={{ fontSize: 14, color: \"rgba(250,250,248,0.7)\", marginTop: 10, marginBottom: 26, maxWidth: 440 }}>
            {PRODUCTS.length} carefully considered pieces. Nothing here by accident.
          </p>
          {/* Search */}
          <div style={{ position: \"relative\", maxWidth: 420 }}>
            <Search size={15} style={{ position: \"absolute\", left: 15, top: \"50%\", transform: \"translateY(-50%)\", color: \"rgba(250,250,248,0.55)\", pointerEvents: \"none\" }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              data-testid=\"shop-search-input\"
              placeholder=\"Search by name, category, material…\"
              style={{
                width: \"100%\", padding: \"13px 14px 13px 42px\", borderRadius: 7,
                border: \"1px solid rgba(250,250,248,0.25)\", background: \"rgba(255,255,255,0.09)\",
                color: T.cream, fontSize: 13.5, outline: \"none\",
                backdropFilter: \"blur(6px)\",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery(\"\")}
                data-testid=\"shop-search-clear\"
                style={{ position: \"absolute\", right: 12, top: \"50%\", transform: \"translateY(-50%)\", color: \"rgba(250,250,248,0.6)\" }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className=\"responsive-stack\" style={{ maxWidth: 1320, margin: \"0 auto\", padding: \"28px 28px 72px\", display: \"flex\", gap: 32 }}>

        {/* ── FILTER SIDEBAR ── */}
        {showFilters && (
          <aside style={{ width: 230, flexShrink: 0 }} data-testid=\"shop-filter-sidebar\">
            <div style={{ background: T.cream, borderRadius: 12, padding: \"24px 20px\", position: \"sticky\", top: 94, border: `1px solid ${T.divider}` }}>
              <h3 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 20, fontWeight: 600, color: T.dark, marginBottom: 24 }}>Filter</h3>

              {/* Category */}
              <FilterSection title=\"Category\">
                {CATEGORIES.map(c => (
                  <FilterPill key={c} active={cat === c} onClick={() => setCat(c)} testid={`filter-category-${c}`}>
                    {c === \"all\" ? \"All Products\" : c}
                  </FilterPill>
                ))}
              </FilterSection>

              {/* Max Price */}
              <FilterSection title=\"Max Price\">
                <input
                  type=\"range\" min={80} max={1500} step={10} value={maxPrice}
                  onChange={e => setMaxPrice(+e.target.value)}
                  data-testid=\"filter-price-range\"
                  style={{ width: \"100%\", marginBottom: 8 }}
                />
                <div style={{ display: \"flex\", justifyContent: \"space-between\", fontSize: 12, color: T.gray }}>
                  <span>£80</span>
                  <span style={{ fontWeight: 600, color: T.dark }}>£{maxPrice.toLocaleString()}</span>
                </div>
              </FilterSection>

              {/* Tags */}
              <FilterSection title=\"Availability\">
                <FilterToggle label=\"New Arrivals\" active={onlyNew} onClick={() => setOnlyNew(!onlyNew)} testid=\"filter-only-new\" />
                <FilterToggle label=\"On Sale\" active={onlySale} onClick={() => setOnlySale(!onlySale)} testid=\"filter-only-sale\" />
              </FilterSection>

              {/* Reset */}
              {(cat !== \"all\" || query || onlyNew || onlySale || maxPrice !== 1500) && (
                <button
                  onClick={() => { setCat(\"all\"); setQuery(\"\"); setOnlyNew(false); setOnlySale(false); setMaxPrice(1500); }}
                  data-testid=\"filter-reset-btn\"
                  style={{ width: \"100%\", marginTop: 8, padding: \"9px\", borderRadius: 6, border: `1px solid ${T.divider}`, fontSize: 12, color: T.gray, textAlign: \"center\" }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </aside>
        )}

        {/* ── PRODUCT GRID ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{ display: \"flex\", alignItems: \"center\", justifyContent: \"space-between\", marginBottom: 24, flexWrap: \"wrap\", gap: 12 }}>
            <div style={{ display: \"flex\", alignItems: \"center\", gap: 10 }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                data-testid=\"shop-toggle-filters\"
                style={{ display: \"flex\", alignItems: \"center\", gap: 6, padding: \"9px 14px\", border: `1px solid ${T.divider}`, borderRadius: 7, fontSize: 12.5, color: T.dark, background: T.cream }}
              >
                <Filter size={13} /> {showFilters ? \"Hide Filters\" : \"Show Filters\"}
              </button>
              <span data-testid=\"shop-results-count\" style={{ fontSize: 13, color: T.gray }}>
                {results.length} {results.length === 1 ? \"product\" : \"products\"}
              </span>
            </div>
            <div style={{ display: \"flex\", alignItems: \"center\", gap: 10 }}>
              <div style={{ display: \"flex\", border: `1px solid ${T.divider}`, borderRadius: 7, overflow: \"hidden\" }}>
                <ViewBtn active={view === \"grid\"} onClick={() => setView(\"grid\")} testid=\"shop-view-grid\"><LayoutGrid size={15} /></ViewBtn>
                <ViewBtn active={view === \"list\"} onClick={() => setView(\"list\")} testid=\"shop-view-list\"><List size={15} /></ViewBtn>
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                data-testid=\"shop-sort-select\"
                style={{ padding: \"9px 13px\", borderRadius: 7, border: `1px solid ${T.divider}`, background: T.cream, fontSize: 12.5, color: T.dark, outline: \"none\", cursor: \"pointer\" }}
              >
                <option value=\"default\">Sort: Featured</option>
                <option value=\"asc\">Price: Low → High</option>
                <option value=\"desc\">Price: High → Low</option>
                <option value=\"rating\">Top Rated</option>
                <option value=\"new\">New Arrivals First</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(cat !== \"all\" || onlyNew || onlySale) && (
            <div style={{ display: \"flex\", gap: 8, marginBottom: 18, flexWrap: \"wrap\" }}>
              {cat !== \"all\" && <ActiveTag label={cat} onRemove={() => setCat(\"all\")} />}
              {onlyNew && <ActiveTag label=\"New\" onRemove={() => setOnlyNew(false)} />}
              {onlySale && <ActiveTag label=\"Sale\" onRemove={() => setOnlySale(false)} />}
            </div>
          )}

          {results.length === 0 ? (
            <div data-testid=\"shop-no-results\" style={{ textAlign: \"center\", padding: \"100px 0\" }}>
              <p style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 28, color: T.dark }}>No products match</p>
              <p style={{ fontSize: 13.5, color: T.gray, marginTop: 8 }}>Try broadening your search or removing filters.</p>
            </div>
          ) : view === \"grid\" ? (
            <div className=\"responsive-grid-3\" data-testid=\"shop-grid\" style={{ display: \"grid\", gridTemplateColumns: \"repeat(3, 1fr)\", gap: 24 }}>
              {results.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 55} />)}
            </div>
          ) : (
            <div data-testid=\"shop-list\" style={{ display: \"flex\", flexDirection: \"column\", gap: 16 }}>
              {results.map((p, i) => <ListCard key={p.id} product={p} delay={i * 55} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontSize: 9.5, color: T.gray, letterSpacing: \"0.22em\", textTransform: \"uppercase\", fontWeight: 700, marginBottom: 10 }}>{title}</p>
      <div style={{ display: \"flex\", flexDirection: \"column\", gap: 3 }}>{children}</div>
    </div>
  );
}

function FilterPill({ active, onClick, children, testid }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        textAlign: \"left\", padding: \"7px 10px\", borderRadius: 6, fontSize: 13,
        background: active ? T.forest : (hov ? T.lightGray : \"transparent\"),
        color: active ? T.cream : T.dark,
        fontWeight: active ? 500 : 400,
        textTransform: \"capitalize\", transition: \"all 0.15s\",
      }}
    >
      {children}
    </button>
  );
}

function FilterToggle({ label, active, onClick, testid }) {
  return (
    <button onClick={onClick} data-testid={testid} style={{ display: \"flex\", alignItems: \"center\", gap: 10, padding: \"6px 0\", cursor: \"pointer\" }}>
      <div style={{
        width: 17, height: 17, borderRadius: 4, border: `2px solid ${active ? T.copper : T.divider}`,
        background: active ? T.copper : \"transparent\",
        display: \"flex\", alignItems: \"center\", justifyContent: \"center\",
        flexShrink: 0, transition: \"all 0.15s\",
      }}>
        {active && <Check size={11} color={T.cream} strokeWidth={3} />}
      </div>
      <span style={{ fontSize: 13, color: T.dark }}>{label}</span>
    </button>
  );
}

function ViewBtn({ active, onClick, children, testid }) {
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      style={{ padding: \"9px 11px\", background: active ? T.forest : \"transparent\", color: active ? T.cream : T.gray, display: \"flex\", transition: \"all 0.15s\" }}
    >
      {children}
    </button>
  );
}

function ActiveTag({ label, onRemove }) {
  return (
    <span style={{
      display: \"inline-flex\", alignItems: \"center\", gap: 6,
      background: T.forest, color: T.cream,
      padding: \"5px 12px\", borderRadius: 100, fontSize: 11.5, fontWeight: 500,
      textTransform: \"capitalize\", letterSpacing: \"0.05em\",
    }}>
      {label}
      <button onClick={onRemove} style={{ color: \"rgba(250,250,248,0.85)\", display: \"flex\", lineHeight: 0 }}>
        <X size={12} />
      </button>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PRODUCT DETAIL PAGE
// ─────────────────────────────────────────────────────────────────────
function ProductPage({ id }) {
  const { navigate, goBack } = useRouter();
  const { addItem, setIsOpen } = useCart();
  const { showToast } = useToast();
  const product = useMemo(() => PRODUCTS.find(p => p.id === id), [id]);
  const related  = useMemo(() => PRODUCTS.filter(p => p.category === product?.category && p.id !== id).slice(0, 3), [product, id]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return (
    <div data-testid=\"product-not-found\" style={{ paddingTop: 120, textAlign: \"center\", minHeight: \"60vh\", display: \"flex\", flexDirection: \"column\", alignItems: \"center\", justifyContent: \"center\" }}>
      <p style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 28, color: T.dark }}>Product not found</p>
      <button onClick={() => navigate(\"shop\")} style={{ marginTop: 20, color: T.copper, fontSize: 14, textDecoration: \"underline\", textUnderlineOffset: 3 }}>
        Back to Shop
      </button>
    </div>
  );

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAdd = () => {
    addItem(product, qty);
    showToast(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => { setAdded(false); setIsOpen(true); }, 900);
  };

  return (
    <div data-testid=\"product-page\" style={{ paddingTop: 74, minHeight: \"100vh\", background: T.sandLight }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1320, margin: \"0 auto\", padding: \"22px 28px 0\" }}>
        <div style={{ display: \"flex\", alignItems: \"center\", gap: 7, flexWrap: \"wrap\" }}>
          <button onClick={goBack} data-testid=\"product-back-btn\" style={{ display: \"flex\", alignItems: \"center\", gap: 4, color: T.gray, fontSize: 12.5 }}>
            <ArrowLeft size={13} /> Back
          </button>
          <span style={{ color: T.mist }}>·</span>
          <button onClick={() => navigate(\"home\")} style={{ fontSize: 12.5, color: T.gray }}>Home</button>
          <ChevronRight size={11} color={T.gray} />
          <button onClick={() => navigate(\"shop\")} style={{ fontSize: 12.5, color: T.gray }}>Shop</button>
          <ChevronRight size={11} color={T.gray} />
          <span style={{ fontSize: 12.5, color: T.dark, fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      {/* Main layout */}
      <div className=\"responsive-stack\" style={{ maxWidth: 1320, margin: \"0 auto\", padding: \"40px 28px 64px\", display: \"grid\", gridTemplateColumns: \"1.05fr 0.95fr\", gap: 64 }}>

        {/* IMAGE */}
        <div style={{ position: \"relative\" }}>
          <div style={{ borderRadius: 18, overflow: \"hidden\", aspectRatio: \"4/5\", background: T.mist }}>
            <img
              src={product.largeImage || product.image}
              alt={product.name}
              style={{ width: \"100%\", height: \"100%\", objectFit: \"cover\" }}
            />
          </div>
          {product.isSale && (
            <div style={{ position: \"absolute\", top: 18, left: 18, background: T.copper, color: T.cream, padding: \"6px 16px\", borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: \"0.08em\" }}>
              SAVE {discount}% · £{(product.originalPrice - product.price).toLocaleString()} off
            </div>
          )}
          {product.isNew && !product.isSale && (
            <div style={{ position: \"absolute\", top: 18, left: 18, background: T.forest, color: T.cream, padding: \"6px 16px\", borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: \"0.08em\" }}>
              NEW ARRIVAL
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div style={{ paddingTop: 12 }}>
          <p style={{ fontSize: 10.5, color: T.copper, fontWeight: 700, textTransform: \"uppercase\", letterSpacing: \"0.2em\", marginBottom: 10 }}>{product.category}</p>
          <h1 data-testid=\"product-name\" style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: \"clamp(34px, 3.5vw, 48px)\", fontWeight: 600, color: T.dark, lineHeight: 1.1, marginBottom: 18 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: \"flex\", alignItems: \"center\", gap: 10, paddingBottom: 22, borderBottom: `1px solid ${T.divider}` }}>
            <div style={{ display: \"flex\", gap: 3 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.round(product.rating) ? T.copper : \"none\"} color={T.copper} strokeWidth={1.5} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: T.gray }}>{product.rating} · {product.reviews} reviews</span>
          </div>

          {/* Price */}
          <div style={{ display: \"flex\", alignItems: \"baseline\", gap: 14, margin: \"22px 0 24px\" }}>
            <span data-testid=\"product-price\" style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 40, fontWeight: 600, color: product.isSale ? T.copper : T.dark }}>
              £{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 20, color: T.gray, textDecoration: \"line-through\" }}>
                £{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: 15, color: \"#4A4540\", lineHeight: 1.82, marginBottom: 26 }}>{product.description}</p>

          {/* Specs */}
          <div style={{ background: T.cream, borderRadius: 10, padding: \"18px 20px\", display: \"grid\", gridTemplateColumns: \"1fr 1fr\", gap: \"14px 20px\", marginBottom: 28, border: `1px solid ${T.divider}` }}>
            {[[\"Materials\", product.materials], [\"Dimensions\", product.dimensions]].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontSize: 9.5, color: T.gray, letterSpacing: \"0.2em\", textTransform: \"uppercase\", fontWeight: 700, marginBottom: 5 }}>{k}</p>
                <p style={{ fontSize: 13.5, color: T.dark, lineHeight: 1.45 }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Quantity + CTA */}
          <div style={{ display: \"flex\", gap: 12, marginBottom: 24, flexWrap: \"wrap\" }}>
            <div style={{ display: \"flex\", alignItems: \"center\", gap: 0, border: `1px solid ${T.divider}`, borderRadius: 8, overflow: \"hidden\", background: T.cream }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                data-testid=\"product-qty-decrease\"
                style={{ padding: \"15px 14px\", color: qty <= 1 ? T.mist : T.gray, display: \"flex\", transition: \"color 0.15s\" }}
              >
                <Minus size={15} />
              </button>
              <span data-testid=\"product-qty\" style={{ width: 44, textAlign: \"center\", fontSize: 16, fontWeight: 600, color: T.dark }}>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                data-testid=\"product-qty-increase\"
                style={{ padding: \"15px 14px\", color: T.gray, display: \"flex\" }}
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              data-testid=\"product-add-to-cart\"
              style={{
                flex: 1, minWidth: 220, background: added ? T.copper : T.forest, color: T.cream,
                borderRadius: 8, padding: \"15px 24px\", fontSize: 13.5, fontWeight: 600,
                letterSpacing: \"0.07em\", display: \"flex\", alignItems: \"center\", justifyContent: \"center\", gap: 9,
                transition: \"background 0.25s\",
                boxShadow: added ? `0 4px 20px rgba(196,113,58,0.4)` : `0 4px 20px rgba(10,54,34,0.25)`,
              }}
            >
              {added ? <><Check size={17} strokeWidth={3} /> Added to Cart!</> : <><ShoppingCart size={17} /> Add to Cart · £{(product.price * qty).toLocaleString()}</>}
            </button>
          </div>

          {/* Trust */}
          <div style={{ display: \"flex\", gap: 22, flexWrap: \"wrap\" }}>
            {[
              [\"Free shipping\", \"orders over £200\"],
              [\"60-day returns\", \"no questions\"],
              [\"5-yr warranty\", \"furniture\"],
            ].map(([b, s]) => (
              <div key={b} style={{ fontSize: 12, color: T.gray, lineHeight: 1.4 }}>
                <span style={{ color: T.dark, fontWeight: 600 }}>{b}</span><br />{s}
              </div>
            ))}
          </div>

          {/* In stock */}
          <div style={{ display: \"flex\", alignItems: \"center\", gap: 7, marginTop: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: \"#3CB371\" }} />
            <span style={{ fontSize: 12.5, color: T.gray }}>In stock · Usually ships in 2–3 weeks</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ background: T.sand, padding: \"56px 28px 72px\" }}>
          <div style={{ maxWidth: 1320, margin: \"0 auto\" }}>
            <h2 style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 34, fontWeight: 600, color: T.dark, marginBottom: 36, textTransform: \"capitalize\" }}>
              More from {product.category}
            </h2>
            <div className=\"responsive-grid-3\" data-testid=\"product-related-grid\" style={{ display: \"grid\", gridTemplateColumns: \"repeat(3, 1fr)\", gap: 24 }}>
              {related.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 80} />)}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────
function Footer() {
  const { navigate } = useRouter();
  const shopLinks = new Set([\"All Products\", \"New Arrivals\", \"On Sale\", \"Furniture\", \"Lighting\"]);

  return (
    <footer data-testid=\"site-footer\" style={{ background: T.dark, padding: \"52px 28px 32px\" }}>
      <div style={{ maxWidth: 1320, margin: \"0 auto\" }}>
        <div className=\"responsive-grid-4\" style={{ display: \"grid\", gridTemplateColumns: \"1.6fr 1fr 1fr 1fr\", gap: 40, paddingBottom: 44, borderBottom: \"1px solid rgba(255,255,255,0.08)\" }}>
          <div>
            <div style={{ fontFamily: \"'Cormorant Garamond', serif\", fontSize: 24, fontWeight: 600, color: T.cream, letterSpacing: \"0.08em\" }}>VERDANT</div>
            <p style={{ fontSize: 12, color: T.gray, marginTop: 4, letterSpacing: \"0.2em\" }}>HOME STUDIO · EST. 2019</p>
            <p style={{ fontSize: 13, color: \"rgba(255,255,255,0.65)\", marginTop: 18, lineHeight: 1.65, maxWidth: 260 }}>
              Curating home objects that outlast trends, support makers, and earn their place.
            </p>
          </div>
          {[
            [\"Shop\", [\"All Products\", \"New Arrivals\", \"On Sale\", \"Furniture\", \"Lighting\"]],
            [\"Company\", [\"About\", \"Makers\", \"Sustainability\", \"Press\"]],
            [\"Support\", [\"Delivery\", \"Returns\", \"Care Guides\", \"Contact\"]],
          ].map(([title, links]) => (
            <div key={title}>
              <p style={{ fontSize: 10, color: T.copper, letterSpacing: \"0.3em\", textTransform: \"uppercase\", fontWeight: 700, marginBottom: 18 }}>{title}</p>
              <div style={{ display: \"flex\", flexDirection: \"column\", gap: 10 }}>
                {links.map(l => (
                  <button
                    key={l}
                    onClick={() => navigate(shopLinks.has(l) ? \"shop\" : \"home\")}
                    style={{ textAlign: \"left\", fontSize: 13, color: \"rgba(255,255,255,0.65)\", transition: \"color 0.15s\" }}
                    onMouseEnter={e => e.currentTarget.style.color = T.cream}
                    onMouseLeave={e => e.currentTarget.style.color = \"rgba(255,255,255,0.65)\"}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className=\"responsive-flex-col\" style={{ display: \"flex\", justifyContent: \"space-between\", alignItems: \"center\", paddingTop: 24, gap: 8 }}>
          <p style={{ fontSize: 12, color: \"rgba(255,255,255,0.45)\" }}>© 2026 Verdant Home Studio. All rights reserved.</p>
          <p style={{ fontSize: 12, color: \"rgba(255,255,255,0.45)\" }}>Built with React</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────
function AppShell() {
  const { route } = useRouter();
  const page = route.page;

  return (
    <div>
      <GlobalStyles />
      <Navbar />
      <CartDrawer />
      <main>
        {page === \"home\"    && <HomePage />}
        {page === \"shop\"    && <ShopPage />}
        {page === \"product\" && <ProductPage id={route.params.id} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </ToastProvider>
    </RouterProvider>
  );
}
"
Observation: Overwrite successful: /app/frontend/src/App.js
