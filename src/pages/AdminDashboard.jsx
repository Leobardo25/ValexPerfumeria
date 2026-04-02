import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Logo from '../components/ui/Logo';

export default function AdminDashboard() {
  const { userData, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Tablero Principal', path: '/admin', exact: true, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Catálogo de Productos', path: '/admin/inventory', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  ];

  return (
    <div className="min-h-screen bg-valex-negro flex">
      {/* Sidebar - Oculto en móviles temporalmente (Requiere botón hamburguesa para admin luego) */}
      <aside className="w-64 bg-[#1e1e1f] border-r border-valex-gris/10 flex-col hidden lg:flex">
        <div className="h-20 flex items-center justify-center border-b border-valex-gris/10 relative">
          <a href="/" className="flex items-baseline hover:text-valex-hueso transition-colors">
            <Logo className="text-xl text-valex-bronce" />
            <span className="text-xs font-sans tracking-widest text-valex-bronce ml-2 mt-1">ADMIN</span>
          </a>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          <div className="text-xs uppercase tracking-widest text-valex-gris mb-4 px-2">Gestión de Tienda</div>
          {navItems.map((item) => {
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive: isActiveRouter }) => 
                  `px-4 py-3 rounded-lg font-sans font-medium text-sm flex items-center gap-3 transition-colors ${
                    isActiveRouter || isActive
                      ? 'bg-valex-bronce/10 text-valex-bronce border border-valex-bronce/20'
                      : 'text-valex-gris hover:bg-white/5 hover:text-valex-hueso'
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-valex-gris/10">
          <div className="flex items-center gap-3 px-2 mb-4">
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="Admin" className="w-8 h-8 rounded-full border border-valex-bronce/30 shadow-[0_0_10px_rgba(166,137,102,0.3)]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-valex-bronce/20 flex items-center justify-center text-valex-bronce text-xs border border-valex-bronce/50">
                {userData?.nombre?.charAt(0) || 'A'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-valex-hueso text-sm font-medium truncate">{userData?.nombre || 'Administrador'}</p>
              <p className="text-valex-bronce text-xs uppercase tracking-wider">{userData?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-valex-gris hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 group"
          >
             <span className="group-hover:-translate-x-1 transition-transform">←</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Framework Content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto relative h-screen">
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
         >
            {/* Si estamos directamente en /admin, poner el Skeleton, sino, cargar Outlet (inventario o forms) */}
            {location.pathname === '/admin' ? (
              <>
                <header className="mb-10">
                  <h1 className="font-serif text-3xl sm:text-4xl text-valex-hueso font-bold">Resumen General</h1>
                  <p className="text-valex-gris mt-2 font-sans font-light">Bienvenido al panel central de gestión.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="bg-[#1e1e1f] border border-valex-gris/10 rounded-xl p-6 h-32 flex flex-col justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                      </div>
                      <div className="text-valex-gris/60 text-xs font-sans tracking-widest uppercase mb-2">Módulo en construcción</div>
                      <div className="w-12 h-1 bg-valex-bronce/30 rounded-full animate-pulse"></div>
                    </div>
                  ))}
                  <div className="bg-gradient-to-br from-valex-bronce/20 to-valex-negro border border-valex-bronce/30 rounded-xl p-6 h-32 flex flex-col justify-center shadow-[0_0_20px_rgba(166,137,102,0.1)] relative overflow-hidden">
                      <div className="text-valex-hueso font-serif text-xl mb-1">¡Todo Listo!</div>
                      <div className="text-valex-gris text-sm font-sans">El inventario está conectado.</div>
                      <div className="absolute -bottom-6 -right-6 text-valex-bronce/20">
                         <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                  </div>
                </div>
              </>
            ) : (
                <Outlet />
            )}
         </motion.div>
      </main>
    </div>
  );
}
