import React from 'react';
import { useHub } from '../../context/HubContext';
export const WithdrawModal = () => {
    const { closeModal, withdraw } = useHub();
    return (<>
      <h2 className="h2">Withdraw your bid?</h2>
      <p style={{ fontSize: '14px' }}>
        Your sealed bid will be removed. You can place a new one any time before bidding closes.
      </p>
      <div className="row end">
        <button type="button" className="btn btn-g" onClick={closeModal}>
          Keep my bid
        </button>
        <button type="button" className="btn btn-p" onClick={withdraw}>
          Withdraw bid
        </button>
      </div>
    </>);
};
