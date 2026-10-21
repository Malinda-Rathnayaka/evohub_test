import React from 'react';
import { useHub } from '../../context/HubContext';
export const ApproveModal = () => {
    const { md, closeModal, approve } = useHub();
    const handleApprove = () => {
        if (md.pid) {
            approve(md.pid);
        }
    };
    return (<>
      <h2 className="h2">Approve version {md.v}?</h2>
      <p style={{ fontSize: '14px' }}>
        This completes the project. The final payment of <b>{md.finalF}</b> will be logged as due to {md.name}.
      </p>
      <div className="row end">
        <button type="button" className="btn btn-g" onClick={closeModal}>
          Cancel
        </button>
        <button type="button" className="btn btn-p" onClick={handleApprove}>
          Approve and complete
        </button>
      </div>
    </>);
};
