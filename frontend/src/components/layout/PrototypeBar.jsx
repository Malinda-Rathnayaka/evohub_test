import React from 'react';
import { useHub } from '../../context/HubContext';
import { FLOW } from '../../utils/formatters';
export const PrototypeBar = () => {
    const { role, setRole, flowStep, gotoStep, go, resetAll, } = useHub();
    const isAdmin = role === 'admin';
    const isDesigner = role === 'designer';
    const flowTitle = flowStep >= 0
        ? FLOW[flowStep][0]
        : 'Post → bid → close → award → deliver → approve';
    const flowNextLabel = flowStep < 0 ? 'Start flow' : flowStep >= 5 ? 'Restart' : 'Next step';
    const handleFlowNext = () => {
        gotoStep(flowStep < 0 || flowStep >= 5 ? 0 : flowStep + 1);
    };
    return (<div className="pbar" role="region" aria-label="Prototype controls">
      <span className="pbar-t">Prototype</span>

      <div className="pseg" role="group" aria-label="View as">
        <button type="button" className={isAdmin ? 'on' : ''} aria-pressed={isAdmin} onClick={() => setRole('admin')}>
          Admin
        </button>
        <button type="button" className={isDesigner ? 'on' : ''} aria-pressed={isDesigner} onClick={() => setRole('designer')}>
          Designer
        </button>
      </div>

      <div className="row gap8">
        <span className="pbar-l">Flow</span>
        {FLOW.map((f, i) => {
            const isCurrent = i === flowStep;
            return (<button key={i} type="button" className={isCurrent ? 'fstep fstep-on' : 'fstep'} aria-label={`Step ${i + 1}: ${f[0]}`} title={`Step ${i + 1}: ${f[0]}`} onClick={() => gotoStep(i)}>
              {i + 1}
            </button>);
        })}
        <span className="pbar-cur">{flowTitle}</span>
        <button type="button" className="pbtn" onClick={handleFlowNext}>
          {flowNextLabel}
        </button>
      </div>

      <div className="row gap8 pright">
        <button type="button" className="pbtn" onClick={() => go('map')}>
          Map
        </button>
        <button type="button" className="pbtn" onClick={() => go('system')}>
          System
        </button>
        <button type="button" className="pbtn" onClick={resetAll}>
          Reset
        </button>
      </div>
    </div>);
};
