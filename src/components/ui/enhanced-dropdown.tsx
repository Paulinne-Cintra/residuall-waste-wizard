
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  value: string;
  label: string;
  selected?: boolean;
}

interface EnhancedDropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  className?: string;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  placeholder?: string;
}

export const EnhancedDropdown = ({
  trigger,
  options,
  onSelect,
  className,
  contentClassName,
  align = 'start',
  sideOffset = 4,
}: EnhancedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsOpen(false);
  };

  const getAlignmentClass = () => {
    switch (align) {
      case 'center':
        return 'left-1/2 transform -translate-x-1/2';
      case 'end':
        return 'right-0';
      default:
        return 'left-0';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          isOpen && "bg-gray-50 shadow-md border-blue-500",
          className
        )}
      >
        {trigger}
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200 ml-auto",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay para capturar cliques fora */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown content */}
          <div
            className={cn(
              "absolute z-20 min-w-full overflow-hidden rounded-md border bg-white shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
              getAlignmentClass(),
              contentClassName
            )}
            style={{
              top: `calc(100% + ${sideOffset}px)`,
              minWidth: triggerRef.current?.offsetWidth || 'auto',
            }}
          >
            <div className="p-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
                    option.selected && "bg-blue-50 text-blue-900",
                    selectedValue === option.value && "bg-blue-50 text-blue-900"
                  )}
                >
                  {(option.selected || selectedValue === option.value) && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  <span className={cn(
                    (option.selected || selectedValue === option.value) ? "ml-0" : "ml-6"
                  )}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
