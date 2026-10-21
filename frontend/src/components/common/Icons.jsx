import React from 'react';
export const LockIcon = ({ size = 16, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>);
export const CheckIcon = ({ size = 16, strokeWidth = 2.4, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5"/>
  </svg>);
export const ErrorCircleIcon = ({ size = 18, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7.5v5.5M12 16.5v.5"/>
  </svg>);
export const ClockIcon = ({ size = 16, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 2"/>
  </svg>);
export const SearchIcon = ({ size = 18, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...props}>
    <circle cx="11" cy="11" r="7"/>
    <path d="M20 20l-3.5-3.5"/>
  </svg>);
export const PlusIcon = ({ size = 18, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
    <path d="M12 5v14M5 12h14"/>
  </svg>);
export const MinusIcon = ({ size = 18, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
    <path d="M5 12h14"/>
  </svg>);
export const ChevronLeftIcon = ({ size = 18, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M15 18l-6-6 6-6"/>
  </svg>);
export const FileIcon = ({ size = 18, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>
    <path d="M14 3v5h5"/>
  </svg>);
export const DownloadIcon = ({ size = 18, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>
  </svg>);
export const UploadIcon = ({ size = 24, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>
  </svg>);
export const CloseIcon = ({ size = 18, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>);
export const SignOutIcon = ({ size = 20, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/>
    <path d="M10 16l-4-4 4-4M6 12h10"/>
  </svg>);
export const EmptyBoxIcon = ({ size = 24, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M4 7h16M4 12h10M4 17h6"/>
  </svg>);
export const PaymentCardIcon = ({ size = 24, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="3" y="6" width="18" height="13" rx="2"/>
    <path d="M3 10h18"/>
  </svg>);
export const TieIcon = ({ size = 22, ...props }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
    <path d="M4 9h16M4 15h16"/>
  </svg>);
export const StarBurstSvg = (props) => (<svg width="220" height="220" viewBox="0 0 220 220" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true" {...props}>
    <path d="M110 20v40M110 160v40M20 110h40M160 110h40M46 46l28 28M146 146l28 28M174 46l-28 28M74 146l-28 28"/>
    <circle cx="110" cy="110" r="22"/>
  </svg>);
export const DeliveryPreviewSvg = (props) => (<svg width="260" height="170" viewBox="0 0 260 170" fill="none" aria-hidden="true" {...props}>
    <rect x="1" y="1" width="118" height="168" rx="4" fill="#fff" stroke="#000"/>
    <rect x="141" y="1" width="118" height="168" rx="4" fill="#fff" stroke="#000"/>
    <circle cx="60" cy="62" r="30" stroke="#000" strokeWidth="2"/>
    <path d="M30 120h60M30 132h44M30 144h52" stroke="#000" strokeWidth="2"/>
    <rect x="156" y="18" width="88" height="70" fill="#000"/>
    <path d="M156 104h88M156 116h70M156 128h80M156 140h52" stroke="#000" strokeWidth="2"/>
  </svg>);
