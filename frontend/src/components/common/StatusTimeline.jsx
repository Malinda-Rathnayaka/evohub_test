import React from 'react';
import { tlFor } from '../../utils/formatters';
export const StatusTimeline = ({ status, items }) => {
    const tl = items || (status ? tlFor(status) : []);
    return (<ol className="tl">
      {tl.map((s) => (<li key={s.label} className={s.cls}>
          <span className="tl-dot">
            {s.done && (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5"/>
              </svg>)}
          </span>
          <span className="tl-lbl">{s.label}</span>
        </li>))}
    </ol>);
};
