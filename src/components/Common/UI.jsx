import React from 'react';
export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  type = 'button', 
  className = '', 
  title = '',
  ...props 
}) {
  const baseStyles = 'font-semibold text-xs transition-all duration-200 cursor-pointer outline-none flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';
  
  const variants = {
    primary: 'bg-[#D0BCFF] hover:bg-[#CCC2DC] text-[#381E72] rounded-full shadow-sm py-2.5 px-5',
    secondary: 'bg-[#4A4458] hover:bg-[#5E576F] text-[#E8DEF8] rounded-full py-2.5 px-5',
    danger: 'bg-[#601410]/20 hover:bg-[#601410]/35 text-[#F2B8B5] border border-[#F2B8B5]/10 rounded-full py-2.5 px-5',
    outline: 'text-gray-300 border border-[#2B2930] hover:text-[#D0BCFF] hover:bg-[#D0BCFF]/10 rounded-full py-2.5 px-5',
    'primary-block': 'bg-[#D0BCFF] hover:bg-[#CCC2DC] text-[#381E72] rounded-[16px] py-3.5 px-4 w-full shadow-sm',
    'secondary-block': 'bg-[#4A4458] hover:bg-[#5E576F] text-[#E8DEF8] rounded-[16px] py-3.5 px-4 w-full',
    'danger-block': 'bg-[#601410]/20 hover:bg-[#601410]/35 text-[#F2B8B5] border border-[#F2B8B5]/10 rounded-[16px] py-3.5 px-4 w-full',
    'outline-block': 'text-gray-300 border border-[#2B2930] hover:text-[#D0BCFF] hover:bg-[#D0BCFF]/10 rounded-[16px] py-3.5 px-4 w-full',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function Switch({ 
  checked, 
  onChange, 
  disabled = false, 
  className = '',
  ...props 
}) {
  const getBgClass = () => {
    if (checked) {
      return 'bg-[#D0BCFF] border-transparent'; // Лавандовый фон при активации
    }
    return 'bg-[#2B2930] border-[#8F8B97]'; // Темный фон в выключенном состоянии
  };

  const getKnobClass = () => {
    if (checked) {
      return 'translate-x-6 bg-[#381E72]'; // Фиолетовый ползунок справа
    }
    return 'translate-x-1 bg-[#8F8B97]'; // Серый ползунок слева
  };

  const baseBtnStyles = 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none border cursor-pointer flex-shrink-0';
  const baseKnobStyles = 'inline-block h-4 w-4 transform rounded-full transition-transform duration-300 shadow-md';

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange && onChange(!checked)}
      disabled={disabled}
      className={`${baseBtnStyles} ${getBgClass()} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      {...props}
    >
      <span className={`${baseKnobStyles} ${getKnobClass()}`} />
    </button>
  );
}
export function IconButton({ 
  children, 
  onClick, 
  variant = 'secondary', 
  title = '', 
  className = '',
  ...props 
}) {
  const baseStyles = 'p-2 rounded-xl text-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 select-none';
  
  const variants = {
    primary: 'bg-[#D0BCFF] text-[#381E72] hover:bg-[#CCC2DC]',
    secondary: 'bg-[#4A4458] hover:bg-[#5E576F] text-[#E8DEF8]',
    ghost: 'text-gray-400 hover:text-[#D0BCFF] hover:bg-[#D0BCFF]/10',
    danger: 'text-[#F2B8B5] hover:bg-[#601410]/20',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`${baseStyles} ${variants[variant] || variants.secondary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}