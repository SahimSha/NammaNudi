import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-600 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl rounded-2xl p-4 flex items-center space-x-3 text-stone-800">
        {icons[toast.type || 'info']}
        <p className="text-sm font-medium flex-1">{toast.message}</p>
      </div>
    </div>
  );
};
