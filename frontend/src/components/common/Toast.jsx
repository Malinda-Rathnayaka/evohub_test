import React from 'react';
import { useHub } from '../../context/HubContext';
import { CheckIcon } from './Icons';
export const Toast = () => {
    const { toast } = useHub();
    if (!toast)
        return null;
    return (<div className="toast" role="status">
      <CheckIcon size={18} strokeWidth={2.4} style={{ flex: 'none' }}/>
      <span>{toast}</span>
    </div>);
};
