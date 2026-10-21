import React from 'react';
import { useHub } from '../../context/HubContext';
import { ErrorCircleIcon } from '../common/Icons';
export const RevisionModal = () => {
    const { md, closeModal, requestRevision, revNote, setRevNote, revErr } = useHub();
    return (<>
      <h2 className="h2">Request a revision</h2>
      <div className="row gap12">
        <span className="revbar" aria-hidden="true">
          {(md.dots || []).map((d, i) => (<i key={i} className={d.cls}/>))}
        </span>
        <span className="help">
          This uses revision {md.next} of {md.allowed}.
        </span>
      </div>
      <label className="field">
        <span className="lbl">What should change?</span>
        <textarea className={revErr ? 'inp inp-err' : 'inp'} rows={4} value={revNote} onChange={(e) => setRevNote(e.target.value)} placeholder="Be specific. The designer sees exactly this."/>
        {revErr && (<span className="err">
            <ErrorCircleIcon size={16}/>
            Tell the designer what to change.
          </span>)}
      </label>
      <div className="row end">
        <button type="button" className="btn btn-g" onClick={closeModal}>
          Cancel
        </button>
        <button type="button" className="btn btn-p" onClick={requestRevision}>
          Send revision request
        </button>
      </div>
    </>);
};
