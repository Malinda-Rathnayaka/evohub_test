import React from 'react';
export const Badge = ({ label, variant = 'out', dot = false, className = '', style, }) => {
    const variantClass = `b-${variant}`;
    const dotClass = dot ? 'b-dot' : '';
    return (<span className={`bdg ${variantClass} ${dotClass} ${className}`.trim()} style={style}>
      {label}
    </span>);
};
