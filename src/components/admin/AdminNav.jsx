'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const nav = [
  { label: 'Dashboard', href: '/admin',           icon: GridIcon     },
  { label: 'Projects',  href: '/admin/projects',  icon: FolderIcon   },
  { label: 'Inquiries', href: '/admin/inquiries', icon: InboxIcon    },
  { label: 'Reviews',   href: '/admin/reviews',   icon: StarIcon     },
  { label: 'Analytics', href: '/admin/analytics', icon: ChartIcon    },
  { label: 'Links',     href: '/admin/links',     icon: LinkIcon     },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();

  // Desktop Collapsed State (persisted)
  const [collapsed, setCollapsed] = useState(false);
  // Mobile Drawer State
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persisted = localStorage.getItem('admin_sidebar_collapsed') === 'true';
      setCollapsed(persisted);
    }
  }, []);

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('admin-collapsed');
    } else {
      document.body.classList.remove('admin-collapsed');
    }
    localStorage.setItem('admin_sidebar_collapsed', collapsed);
  }, [collapsed]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('admin-mobile-open');
    } else {
      document.body.classList.remove('admin-mobile-open');
    }
    return () => {
      document.body.classList.remove('admin-mobile-open');
    };
  }, [mobileOpen]);

  // Auto close mobile drawer on path changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <>
      {/* ── Mobile hamburger trigger button ───────────────────── */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[400] p-3 bg-[#0d0d0d] border border-white/5 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 md:hidden transition-all shadow-xl"
        aria-label="Open Menu"
      >
        <MenuIcon size={20} />
      </button>

      {/* ── Mobile menu background overlay ────────────────────── */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[450] md:hidden transition-opacity"
        />
      )}

      {/* ── Sidebar (unified for desktop & mobile) ────────────── */}
      <aside className="admin-sidebar fixed left-0 top-0 h-full bg-[#0d0d0d] border-r border-white/5 flex-col z-[500]">
        
        {/* Header container */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-baseline gap-2 overflow-hidden">
            <Link href="/" className="text-[#ff6b1a] font-black text-xl tracking-tight">
              S<span className="sidebar-label">arang</span>
            </Link>
            <p className="text-white/25 text-[10px] uppercase tracking-widest sidebar-subtext">Admin</p>
          </div>
          {/* Mobile close button inside header */}
          <button 
            onClick={() => setMobileOpen(false)} 
            className="md:hidden text-white/40 hover:text-white transition-colors"
            aria-label="Close Menu"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Scrollable navigation link list */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scroll">
          {nav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link 
                key={href} 
                href={href} 
                title={label}
                className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active ? 'bg-[#ff6b1a]/10 text-[#ff6b1a]' : 'text-white/45 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="shrink-0">
                  <Icon size={16} />
                </div>
                <span className="sidebar-label">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer controls container */}
        <div className="px-2 py-4 border-t border-white/5 space-y-1 shrink-0">
          <Link 
            href="/" 
            title="View Site"
            className="sidebar-link flex items-center gap-3 px-3 py-2.5 text-sm text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <div className="shrink-0">
              <ExternalIcon size={16} />
            </div>
            <span className="sidebar-label">View Site</span>
          </Link>
          
          <button 
            onClick={logout} 
            title="Sign Out"
            className="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-colors"
          >
            <div className="shrink-0">
              <LogoutIcon size={16} />
            </div>
            <span className="sidebar-label">Sign Out</span>
          </button>

          {/* Sidebar Collapse Toggle Button (for Desktop only) */}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            title={collapsed ? "Expand Menu" : "Collapse Menu"}
            className="sidebar-link hidden md:flex w-full items-center gap-3 px-3 py-2.5 text-sm text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-colors mt-2"
          >
            <div className="shrink-0">
              {collapsed ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
            </div>
            <span className="sidebar-label">Collapse Menu</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ── SVG Icon Components ──────────────────────────────────────────

function MenuIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="12" x2="14" y2="12" />
    </svg>
  );
}

function XIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="3" x2="13" y2="13" />
      <line x1="13" y1="3" x2="3" y2="13" />
    </svg>
  );
}

function ChevronLeftIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10 2 4 8 10 14" />
    </svg>
  );
}

function ChevronRightIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 2 12 8 6 14" />
    </svg>
  );
}

function FolderIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4a1 1 0 011-1h4l1.5 2H14a1 1 0 011 1v6a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function GridIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
    </svg>
  );
}

function StarIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.65 3.35 3.7.54-2.68 2.61.63 3.68L8 9.77l-3.3 1.91.63-3.68L2.65 5.39l3.7-.54L8 1.5z" fill="currentColor" opacity=".7"/>
    </svg>
  );
}

function InboxIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 7 8 11 14 7" />
      <rect x="2" y="3" width="12" height="10" rx="2" />
    </svg>
  );
}

function ChartIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="9" width="3" height="6" rx="1" fill="currentColor" opacity=".5"/>
      <rect x="6" y="5" width="3" height="10" rx="1" fill="currentColor" opacity=".7"/>
      <rect x="11" y="2" width="3" height="13" rx="1" fill="currentColor"/>
    </svg>
  );
}

function ExternalIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9M10 2h4m0 0v4m0-4L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LogoutIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3m0 0l-3-3m3 3H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LinkIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1"/>
      <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1"/>
    </svg>
  );
}

function FileTextIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 1.5H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5l-3.5-3.5z" />
      <path d="M10 1.5V5h3.5" />
      <path d="M5 8.5h6" />
      <path d="M5 11.5h6" />
      <path d="M5 5.5h1" />
    </svg>
  );
}

function MessageCircleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 10.5C14 12.433 12.433 14 10.5 14H5l-3 1.5V4.5C2 2.567 3.567 1 5.5 1h5C12.433 1 14 2.567 14 4.5v6z" />
    </svg>
  );
}
