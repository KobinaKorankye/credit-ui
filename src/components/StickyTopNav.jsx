import React from 'react';

const StickyTopNav = ({ navItems, selected, setSelected, className = "" }) => {
  return (
    <div className={`sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border ${className}`}>
      <div className="w-full">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <nav className="flex items-center justify-center px-4 py-3">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {navItems.map((item, index) => (
                <button
                  key={item}
                  onClick={() => setSelected(item)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                    selected === item
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Tablet Navigation */}
        <div className="hidden md:block lg:hidden">
          <nav className="px-4 py-3">
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1 bg-muted rounded-lg p-1 w-full max-w-2xl">
                {navItems.map((item, index) => (
                  <button
                    key={item}
                    onClick={() => setSelected(item)}
                    className={`px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 text-center ${
                      selected === item
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                  >
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="block md:hidden">
          <nav className="px-4 py-3">
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
              {navItems.map((item, index) => (
                <button
                  key={item}
                  onClick={() => setSelected(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors touch-target flex-shrink-0 ${
                    selected === item
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StickyTopNav;
