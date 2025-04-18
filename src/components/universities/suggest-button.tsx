'use client';

interface SuggestUniversityButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SuggestUniversityButton({ 
  className = "btn btn-primary", 
  children = "Suggest a University" 
}: SuggestUniversityButtonProps) {
  const handleClick = () => {
    // Dispatch custom event that the UniversityList component listens for
    document.dispatchEvent(
      new CustomEvent('open-university-suggestion-modal')
    );
  };

  return (
    <button 
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}