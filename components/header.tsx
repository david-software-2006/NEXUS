'use client';

import Image from "next/image";
import { User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/app-context";
import { useTheme } from "@/contexts/theme-context";
import { useState, useEffect } from "react";

interface HeaderProps {
  onLoginClick: () => void;
  onNavigate: (page: "home" | "sales" | "purchases" | "products" | "profile") => void;
}

export default function Header({ onLoginClick, onNavigate }: HeaderProps) {
  const { user, logout } = useApp();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    onNavigate("home");
  };

  return (
    <>
      {/* HEADER CON FORMA DE ONDA */}
      <div className="relative">
        <header className="bg-[#532D1C] text-white relative">
          <div className="container mx-auto px-4 pt-8 md:pt-20 pb-20 md:pb-32">
            {/* Mobile header */}
            {isMobile && (
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => onNavigate("home")}
                >
                  <div className="relative w-16 h-16 mr-1">
                    <Image
                      src="/images/logo.png" 
                      alt="NEXUS Logo"
                      fill
                      className="object-contain"
                      style={{ transform: 'translateY(-10%)' }}
                    />
                  </div>
                  <h1 className="text-2xl font-bold tracking-wide relative z-10 text-white">
                    NEXUS
                  </h1>
                </div>

                <Button 
                  variant="ghost" 
                  className="text-white"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <Menu size={24} />
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            {isMobile && showMobileMenu && (
              <div className="bg-[#6b4423] rounded-lg p-4 mb-6 animate-in">
                {user ? (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-amber-200 text-sm">¡Bienvenido!</p>
                      <p className="text-white font-semibold text-lg">{user.name}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => {
                          onNavigate("home");
                          setShowMobileMenu(false);
                        }}
                        variant="ghost"
                        className="text-white justify-start"
                      >
                        Inicio
                      </Button>
                      <Button
                        onClick={() => {
                          onNavigate("profile");
                          setShowMobileMenu(false);
                        }}
                        variant="ghost"
                        className="text-white justify-start"
                      >
                        Perfil
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-amber-900 flex items-center justify-start space-x-2 bg-transparent"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={onLoginClick}
                    className="bg-amber-600 hover:bg-amber-700 text-white w-full py-3 rounded-full font-semibold transition-all duration-300 shadow-lg"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Iniciar sesión
                  </Button>
                )}
              </div>
            )}

            {/* Desktop header */}
            <div className={`items-center justify-between ${isMobile ? 'hidden' : 'flex'}`}>
              {/* Logo y título */}
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => onNavigate("home")}
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 mr-1">
                  <Image
                    src="/images/logo.png" 
                    alt="NEXUS Logo"
                    fill
                    className="object-contain"
                    style={{ transform: 'translateY(-10%)' }}
                  />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-wide relative z-10 text-white">
                  NEXUS
                </h1>
              </div>

              {/* Usuario y logout */}
              {user ? (
                <div className="absolute top-8 md:top-20 right-4 flex items-center space-x-4 md:translate-x-[-72%]">
                  <div className="text-right">
                    <p className="text-amber-200 text-sm">¡Bienvenido!</p>
                    <p className="text-white font-semibold text-lg">{user.name}</p>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-amber-900 flex items-center space-x-2 bg-transparent"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Cerrar sesión</span>
                  </Button>
                </div>
              ) : (
                <div className="absolute top-8 md:top-20 right-4 md:translate-x-[-150%]">
                  <Button
                    onClick={onLoginClick}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 shadow-lg"
                  >
                    <User className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    <span className="text-sm md:text-base">Iniciar sesión</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Imagen de taza de café */}
          <div className="absolute right-[-30px] bottom-[-15px] hidden md:block z-20">
            <Image
              src="/images/taza_de_cafe2.png"
              alt="Taza de café"
              width={384}
              height={384}
              className="w-64 h-64 md:w-80 md:h-70 lg:w-80 lg:h-80 object-contain opacity-90"
            />
          </div>

          {/* Onda inferior con cambio de tema */}
          <div className="wave-bottom-gradient z-10">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={theme === 'dark' ? '#1f2937' : '#fefce8'} />
                  <stop offset="50%" stopColor={theme === 'dark' ? '#111827' : '#fefce8'} />
                  <stop offset="100%" stopColor={theme === 'dark' ? '#111827' : '#fefce8'} />
                </linearGradient>
              </defs>
              <path 
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                fill="url(#waveGradient)"
              ></path>
            </svg>
          </div>
        </header>
      </div>

      <style jsx>{`
        .wave-bottom-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }
        
        .wave-bottom-gradient svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 100px;
        }

        @media (max-width: 768px) {
          .wave-bottom-gradient svg {
            height: 60px;
          }
        }
      `}</style>
    </>
  );
}