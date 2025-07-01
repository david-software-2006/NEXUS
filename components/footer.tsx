'use client';

import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { FaTwitter } from 'react-icons/fa';
import { useTheme } from '@/contexts/theme-context';

export function Footer() {
  const { theme } = useTheme();

  return (
    <div className="relative bg-[#532D1C] text-white">
      {/* Onda superior con cambio de tema */}
      <div className="wave-top-white">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={theme === 'dark' ? '#1f2937' : '#fefce8'} />
                  <stop offset="50%" stopColor={theme === 'dark' ? '#111827' : '#fefce8'} />
                  <stop offset="100%" stopColor={theme === 'dark' ? '#030712' : '#fefce8'} />
                </linearGradient>
              </defs>
              <path 
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                fill="url(#waveGradient)"
              ></path>
            </svg>
      </div>
      
      <footer className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logo.png" 
                  alt="Local NEXUS"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">
                  NEXUS
                </h3>
                <p className="text-amber-100">
                  Café premium para los verdaderos amantes del café
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">
                Contáctanos
              </h4>
              <div className="space-y-2">
                <p className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>servicio.cliente@nexus.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>51111 ext 3332</span>
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  <FaTwitter className="w-4 h-4" />
                  <span>@NexusCafe</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end">
              <p className="text-amber-100 text-sm">
                © 2025 NEXUS. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .wave-top-white {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        
        .wave-top-white svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 100px;
        }
      `}</style>
    </div>
  );
}