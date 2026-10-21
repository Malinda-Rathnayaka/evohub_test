import React from 'react';
import { useHub } from '../../context/HubContext';
import { FLOW, TL } from '../../utils/formatters';
import { StatusTimeline } from '../common/StatusTimeline';
export const NavigationMapScreen = () => {
    const { go, signOut, openBrief, openWork, gotoStep, setProjects } = useHub();
    const handleWon = () => {
        setProjects((prev) => prev.map((x) => x.id === 'P3'
            ? {
                ...x,
                status: 'awarded',
                awardedTo: 'D1',
                award: { amount: 118000, at: Date.now(), reason: '' },
            }
            : x));
        openBrief('P3');
    };
    const tlAll = TL.map((x) => ({ label: x[1], done: true, cls: 'tl-done' }));
    return (<>
      <header className="col gap8">
        <span className="eyebrow">Navigation map</span>
        <h1 className="h1">How Designer Hub fits together</h1>
        <p className="lead">Two roles, one login. Every box opens that screen in the prototype.</p>
      </header>

      <div className="g g2">
        <section className="card col gap20">
          <div className="row between">
            <h2 className="h2">Admin</h2>
            <span className="bdg b-fill">EVO ART team</span>
          </div>
          <ol className="map">
            <li>
              <button type="button" className="node node-b" onClick={signOut}>
                Login <small>invite only</small>
              </button>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('a-dash', { role: 'admin' })}>
                Dashboard <small>tiles · needs action · activity</small>
              </button>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('a-projects', { role: 'admin' })}>
                Projects <small>filter · search · countdown</small>
              </button>
              <ol>
                <li>
                  <button type="button" className="node node-g" onClick={() => go('a-create', { role: 'admin', editingId: null })}>
                    Create / edit project
                  </button>
                </li>
                <li>
                  <button type="button" className="node node-g" onClick={() => go('a-project', { role: 'admin', pid: 'P1', tab: 'overview' })}>
                    Project detail
                  </button>
                  <ol>
                    <li>
                      <button type="button" className="node node-g" onClick={() => go('a-project', { role: 'admin', pid: 'P1', tab: 'overview' })}>
                        Overview
                      </button>
                    </li>
                    <li>
                      <button type="button" className="node node-g" onClick={() => go('a-project', { role: 'admin', pid: 'P3', tab: 'bids', bidsPreview: 'live' })}>
                        Bids → Award modal → Success
                      </button>
                    </li>
                    <li>
                      <button type="button" className="node node-g" onClick={() => go('a-project', { role: 'admin', pid: 'P5', tab: 'delivery', ver: null, fileIdx: 0 })}>
                        Delivery → Approve / Revision
                      </button>
                    </li>
                    <li>
                      <button type="button" className="node node-g" onClick={() => go('a-project', { role: 'admin', pid: 'P5', tab: 'payments' })}>
                        Payments
                      </button>
                    </li>
                    <li>
                      <button type="button" className="node node-g" onClick={() => go('a-project', { role: 'admin', pid: 'P3', tab: 'activity' })}>
                        Activity
                      </button>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('a-designers', { role: 'admin' })}>
                Designers
              </button>
              <ol>
                <li>
                  <button type="button" className="node node-g" onClick={() => go('a-designer', { role: 'admin', did: 'D1' })}>
                    Designer detail / edit
                  </button>
                </li>
                <li>
                  <button type="button" className="node node-g" onClick={() => go('a-add', { role: 'admin', ndDone: false })}>
                    Add designer → password → invite
                  </button>
                </li>
              </ol>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('a-payments', { role: 'admin' })}>
                All payments
              </button>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('password', { role: 'admin', pwFrom: 'a-dash' })}>
                Change password
              </button>
            </li>
          </ol>
        </section>

        <section className="card col gap20">
          <div className="row between">
            <h2 className="h2">Designer</h2>
            <span className="bdg b-out">Invited freelancer</span>
          </div>
          <ol className="map">
            <li>
              <button type="button" className="node node-b" onClick={signOut}>
                Login <small>no sign-up</small>
              </button>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('d-home', { role: 'designer' })}>
                Home <small>open for bidding · active · earnings</small>
              </button>
              <ol>
                <li>
                  <button type="button" className="node node-g" onClick={() => openBrief('P2')}>
                    Project brief + sealed bid form
                  </button>
                  <ol>
                    <li>
                      <button type="button" className="node node-g" onClick={() => openBrief('P1')}>
                        Bid placed → edit / withdraw
                      </button>
                    </li>
                    <li>
                      <button type="button" className="node node-g" onClick={() => openBrief('P3')}>
                        Closed: awaiting decision
                      </button>
                    </li>
                    <li>
                      <button type="button" className="node node-g" onClick={handleWon}>
                        Closed: you won
                      </button>
                    </li>
                    <li>
                      <button type="button" className="node node-g" onClick={() => openBrief('P4')}>
                        Closed: not selected
                      </button>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('d-bids', { role: 'designer' })}>
                My bids
              </button>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('d-projects', { role: 'designer' })}>
                My projects
              </button>
              <ol>
                <li>
                  <button type="button" className="node node-g" onClick={() => openWork('P5')}>
                    Workspace → upload → submit → revisions
                  </button>
                </li>
              </ol>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('d-earnings', { role: 'designer' })}>
                Earnings
              </button>
            </li>
            <li>
              <button type="button" className="node" onClick={() => go('d-profile', { role: 'designer' })}>
                Profile
              </button>
              <ol>
                <li>
                  <button type="button" className="node node-g" onClick={() => go('password', { role: 'designer', pwFrom: 'd-profile' })}>
                    Change password
                  </button>
                </li>
              </ol>
            </li>
          </ol>
        </section>
      </div>

      <section className="col gap16">
        <h2 className="h2">The core flow</h2>
        <div className="flowstrip">
          {FLOW.map((f, i) => (<button key={i} type="button" className="fcard" onClick={() => gotoStep(i)}>
              <b>{i + 1}</b>
              <span className="w600">{f[0]}</span>
              <span className="help">{f[1]}</span>
            </button>))}
        </div>
      </section>

      <section className="card col gap16">
        <h2 className="h3">Project status lifecycle</h2>
        <StatusTimeline items={tlAll}/>
      </section>
    </>);
};
