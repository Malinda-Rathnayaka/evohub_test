import React from 'react';
import { useHub } from '../../context/HubContext';
import { AwardModal } from './AwardModal';
import { AwardOtherModal } from './AwardOtherModal';
import { AwardDoneModal } from './AwardDoneModal';
import { ApproveModal } from './ApproveModal';
import { RevisionModal } from './RevisionModal';
import { WithdrawModal } from './WithdrawModal';
export const ModalContainer = () => {
    const { modal } = useHub();
    if (!modal)
        return null;
    const modalLabels = {
        award: 'Award this project',
        awardOther: 'Award to a different designer',
        awardDone: 'Project awarded',
        approve: 'Approve delivery',
        revision: 'Request a revision',
        withdraw: 'Withdraw your bid',
    };
    const label = modalLabels[modal] || 'Dialog';
    return (<div className="scrim">
      <div className="modal" role="dialog" aria-modal="true" aria-label={label}>
        {modal === 'award' && <AwardModal />}
        {modal === 'awardOther' && <AwardOtherModal />}
        {modal === 'awardDone' && <AwardDoneModal />}
        {modal === 'approve' && <ApproveModal />}
        {modal === 'revision' && <RevisionModal />}
        {modal === 'withdraw' && <WithdrawModal />}
      </div>
    </div>);
};
