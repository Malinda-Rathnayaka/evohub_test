import React from 'react';
import { useHub } from '../../context/HubContext';
export const AwardModal = () => {
    const { md, closeModal, doAward } = useHub();
    const handleConfirm = () => {
        if (md.pid && md.did) {
            doAward(md.pid, md.did, '');
        }
    };
    return (<>
      <h2 className="h2">Award this project?</h2>
      <div className="panel col">
        <div className="kv" style={{ borderTop: 0, paddingTop: 0 }}>
          <span>Project</span>
          <b>{md.title}</b>
        </div>
        <div className="kv">
          <span>Designer</span>
          <b>{md.name}</b>
        </div>
        <div className="kv">
          <span>Winning bid</span>
          <b className="num">{md.amountF}</b>
        </div>
        <div className="kv">
          <span>Delivery</span>
          <b>{md.days}</b>
        </div>
        <div className="kv">
          <span>Advance due now (50%)</span>
          <b className="num">{md.advF}</b>
        </div>
      </div>
      <p style={{ fontSize: '14px' }}>
        {md.first} will be notified and the client files will be shared with them. Other bidders will see "Not selected". Amounts stay private.
      </p>
      <div className="row end">
        <button type="button" className="btn btn-g" onClick={closeModal}>
          Cancel
        </button>
        <button type="button" className="btn btn-p" onClick={handleConfirm}>
          Confirm award
        </button>
      </div>
    </>);
};
