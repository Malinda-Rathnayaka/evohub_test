import React from 'react';
import { useHub } from '../../context/HubContext';
import { CheckIcon } from '../common/Icons';
export const AwardDoneModal = () => {
    const { md, closeModal, setTab } = useHub();
    const handleGoPayments = () => {
        closeModal();
        setTab('payments');
    };
    return (<>
      <div className="col gap16" style={{ alignItems: 'center', textAlign: 'center', paddingTop: '8px' }}>
        <span className="okc">
          <CheckIcon size={30} strokeWidth={2.4}/>
        </span>
        <h2 className="h2">Project awarded</h2>
        <p style={{ fontSize: '15px' }}>
          {md.name} won <b>{md.title}</b> for <b>{md.amountF}</b>.
        </p>
      </div>

      <ul className="panel col gap8" style={{ listStyle: 'none', fontSize: '14px', margin: 0 }}>
        <li className="row gap8">
          <CheckIcon size={16} strokeWidth={2.4}/>
          {md.first} has been notified
        </li>
        <li className="row gap8">
          <CheckIcon size={16} strokeWidth={2.4}/>
          Client files are now visible to them
        </li>
        <li className="row gap8">
          <CheckIcon size={16} strokeWidth={2.4}/>
          Advance of {md.advF} logged as due
        </li>
        <li className="row gap8">
          <CheckIcon size={16} strokeWidth={2.4}/>
          Other bidders now see "Not selected"
        </li>
      </ul>

      <div className="g g2">
        <button type="button" className="btn" onClick={handleGoPayments}>
          View payments
        </button>
        <button type="button" className="btn btn-p" onClick={closeModal}>
          Done
        </button>
      </div>
    </>);
};
