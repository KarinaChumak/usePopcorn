import { useState } from 'react';

export default function TextExpander({
  children,
  buttonColor = '#1f09cd',
  collapsedNumWords = 15,
  expandButtonText = 'Show more',
  collapseButtonText = 'Show less',
  expanded = false,
  className = '',
}) {
  const buttonStyle = {
    color: buttonColor,
    border: 'none',
    background: 'none',
    font: 'inherit',
    cursor: 'pointer',
    marginLeft: '6px',
  };

  const [isOpen, setIsOpen] = useState(expanded);

  const displayText = isOpen
    ? children
    : children.split(' ').slice(0, collapsedNumWords).join(' ') +
      '...';

  function handleToggleButton() {
    setIsOpen(() => !isOpen);
  }
  return (
    <div className={className}>
      <span>{displayText}</span>
      <button onClick={handleToggleButton} style={buttonStyle}>
        {isOpen ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}
