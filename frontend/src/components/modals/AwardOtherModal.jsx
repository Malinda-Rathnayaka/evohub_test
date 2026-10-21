import React from 'react';
import { useHub } from '../../context/HubContext';
import { ErrorCircleIcon } from '../common/Icons';
export const AwardOtherModal = () => {
    const { md, closeModal, doAward, reason, setReason, reasonErr } = useHub();
    const handleConfirm = () => {
        if (!reason.trim()) {
            return;
        }
        if (md.pid && md.did) {
            doAward(md.pid, md.did, reason.trim());
        }
    };
    return (<>
      <h2 className="h2">Award to a different designer?</h2>
      <p style={{ fontSize: '14px' }}>
        {md.name} is not the lowest eligible bidder. Please record why.
      </p>
      <div className="g g2">
        <div className="panel col gap4" style={{ padding: '14px' }}>
          <span className="eyebrow">Lowest eligible</span>
          <span className="w600">{md.lowestName}</span>
          <span className="num">{md.lowestF}</span>
        </div>
        <div className="col gap4" style={{ padding: '14px', border: '2px solid #000', borderRadius: '8px' }}>
          <span className="eyebrow" style={{ color: '#000' }}>
            Your choice
          </span>
          <span className="w600">{md.name}</span>
          <span className="num">{md.amountF}</span>
          <span className="help">{md.eligText}</span>
        </div>
      </div>
      <p className="help">{md.diffText}</p>
      <label className="field">
        <span className="lbl">Reason (required)</span>
        <textarea className={reasonErr ? 'inp inp-err' : 'inp'} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="For example: stronger hospitality portfolio and faster delivery"/>
        {reasonErr && (<span className="err">
            <ErrorCircleIcon size={16}/>
            Add a reason. It's saved in the project's activity log.
          </span>)}
      </label>
      <div className="row end">
        <button type="button" className="btn btn-g" onClick={closeModal}>
          Cancel
        </button>
        <button type="button" className="btn btn-p" onClick={handleConfirm}>
          Award to {md.first}
        </button>
      </div>
    </>);
};
