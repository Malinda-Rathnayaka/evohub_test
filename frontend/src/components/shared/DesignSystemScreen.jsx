import React from 'react';
import { ClockIcon, ErrorCircleIcon, SearchIcon, CheckIcon } from '../common/Icons';
import { StatusTimeline } from '../common/StatusTimeline';
export const DesignSystemScreen = () => {
    return (<>
      <header className="col gap8">
        <span className="eyebrow">Design system</span>
        <h1 className="h1">Designer Hub UI kit</h1>
        <p className="lead">
          Black and white only. Outfit everywhere. Light grey panels, thin grey borders, corners no larger than 8px. Status is always written in words, never shown by colour alone.
        </p>
      </header>

      <section className="sys-sec">
        <h2 className="h2">Colour</h2>
        <div className="g g5">
          <div className="sw">
            <div className="sw-b" style={{ background: '#000000', borderColor: '#000000' }}/>
            <span className="w600">Black · #000000</span>
            <span className="help">Text, primary buttons, filled badges</span>
          </div>
          <div className="sw">
            <div className="sw-b" style={{ background: '#FFFFFF' }}/>
            <span className="w600">White · #FFFFFF</span>
            <span className="help">Page and card background</span>
          </div>
          <div className="sw">
            <div className="sw-b" style={{ background: '#F2F2F2' }}/>
            <span className="w600">Panel · #F2F2F2</span>
            <span className="help">Panels, table headers, stats</span>
          </div>
          <div className="sw">
            <div className="sw-b" style={{ background: '#D9D9D9' }}/>
            <span className="w600">Border · #D9D9D9</span>
            <span className="help">Thin borders, grey badges</span>
          </div>
          <div className="sw">
            <div className="sw-b" style={{ background: '#595959', borderColor: '#595959' }}/>
            <span className="w600">Muted text · #595959</span>
            <span className="help">Help text · 7:1 on white</span>
          </div>
        </div>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Type scale · Outfit</h2>
        <div className="col gap16">
          <div className="row" style={{ alignItems: 'baseline', gap: '24px' }}>
            <span className="help" style={{ width: '160px' }}>Display · 56/600</span>
            <span className="display">Sealed bids</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: '24px' }}>
            <span className="help" style={{ width: '160px' }}>H1 · 40/600</span>
            <span className="h1">Boutique hotel identity</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: '24px' }}>
            <span className="help" style={{ width: '160px' }}>H2 · 24/600</span>
            <span className="h2">Open for bidding</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: '24px' }}>
            <span className="help" style={{ width: '160px' }}>H3 · 18/600</span>
            <span className="h3">Needs your action</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: '24px' }}>
            <span className="help" style={{ width: '160px' }}>Body · 15/400</span>
            <span className="p">Your bid is sealed. Other designers cannot see it.</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: '24px' }}>
            <span className="help" style={{ width: '160px' }}>Small · 13/400</span>
            <span className="help">Maximum LKR 35,000.00</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: '24px' }}>
            <span className="help" style={{ width: '160px' }}>Label · 12/600 caps</span>
            <span className="eyebrow">Bidding closes in</span>
          </div>
          <div className="row" style={{ alignItems: 'baseline', gap: '24px' }}>
            <span className="help" style={{ width: '160px' }}>Money</span>
            <span className="big-amt">LKR 118,000.00</span>
          </div>
        </div>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Spacing · 4px base</h2>
        <div className="col gap8">
          <div className="row">
            <span className="help" style={{ width: '60px' }}>4</span>
            <span className="sp" style={{ width: '4px' }}/>
          </div>
          <div className="row">
            <span className="help" style={{ width: '60px' }}>8</span>
            <span className="sp" style={{ width: '8px' }}/>
          </div>
          <div className="row">
            <span className="help" style={{ width: '60px' }}>12</span>
            <span className="sp" style={{ width: '12px' }}/>
          </div>
          <div className="row">
            <span className="help" style={{ width: '60px' }}>16</span>
            <span className="sp" style={{ width: '16px' }}/>
          </div>
          <div className="row">
            <span className="help" style={{ width: '60px' }}>24</span>
            <span className="sp" style={{ width: '24px' }}/>
          </div>
          <div className="row">
            <span className="help" style={{ width: '60px' }}>32</span>
            <span className="sp" style={{ width: '32px' }}/>
          </div>
          <div className="row">
            <span className="help" style={{ width: '60px' }}>48</span>
            <span className="sp" style={{ width: '48px' }}/>
          </div>
          <div className="row">
            <span className="help" style={{ width: '60px' }}>64</span>
            <span className="sp" style={{ width: '64px' }}/>
          </div>
        </div>
        <p className="help">
          Radius: 4px badges · 6px small controls · 8px buttons, inputs, cards, modals. Tap targets at least 44px.
        </p>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Buttons</h2>
        <div className="row gap12">
          <button type="button" className="btn btn-p">
            Primary
          </button>
          <button type="button" className="btn">
            Secondary
          </button>
          <button type="button" className="btn btn-g">
            Ghost
          </button>
          <button type="button" className="btn btn-s">
            Small
          </button>
          <button type="button" className="btn btn-p btn-l">
            Large primary
          </button>
          <button type="button" className="btn btn-p" disabled>
            Disabled
          </button>
          <button type="button" className="link">
            Text link
          </button>
        </div>
        <p className="help">Focus: 2px black outline, 2px offset, on every interactive element.</p>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Inputs</h2>
        <div className="g g3">
          <label className="field">
            <span className="lbl">Default</span>
            <input className="inp" placeholder="Placeholder" defaultValue=""/>
          </label>
          <label className="field">
            <span className="lbl">Focus</span>
            <input className="inp inp-focus" defaultValue="Typing"/>
          </label>
          <label className="field">
            <span className="lbl">Error</span>
            <input className="inp inp-err" defaultValue="38000"/>
            <span className="err">
              <ErrorCircleIcon size={16}/>
              Above the maximum of LKR 35,000.00.
            </span>
          </label>
          <label className="field">
            <span className="lbl">Money</span>
            <span className="pre">
              <span>LKR</span>
              <input className="inp" defaultValue="31,000.00"/>
            </span>
          </label>
          <label className="field">
            <span className="lbl">Select</span>
            <select className="inp" defaultValue="4.0 and above">
              <option>4.0 and above</option>
            </select>
          </label>
          <label className="field">
            <span className="lbl">Read only</span>
            <input className="inp" readOnly defaultValue="nethmi@example.com"/>
          </label>
        </div>
        <div className="row gap24">
          <label className="check">
            <input type="checkbox" defaultChecked/>
            <span>Checkbox</span>
          </label>
          <label className="radio">
            <input type="radio" name="sysr" defaultChecked/>
            <span>Radio</span>
          </label>
          <div className="seg">
            <button type="button" className="on">
              Segment
            </button>
            <button type="button">Segment</button>
          </div>
        </div>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Badges</h2>
        <div className="col gap12">
          <div className="row gap8">
            <span className="help" style={{ width: '120px' }}>
              Project status
            </span>
            <span className="bdg b-dash">Draft</span>
            <span className="bdg b-out">Open</span>
            <span className="bdg b-grey">Closed</span>
            <span className="bdg b-fill">Awarded</span>
            <span className="bdg b-out b-dot">In progress</span>
            <span className="bdg b-grey b-dot">In review</span>
            <span className="bdg b-fill">Completed</span>
          </div>
          <div className="row gap8">
            <span className="help" style={{ width: '120px' }}>
              Bid status
            </span>
            <span className="bdg b-out">Sealed</span>
            <span className="bdg b-grey b-dot">Awaiting decision</span>
            <span className="bdg b-fill">Won</span>
            <span className="bdg b-dash">Not selected</span>
          </div>
          <div className="row gap8">
            <span className="help" style={{ width: '120px' }}>
              Eligibility
            </span>
            <span className="bdg b-fill">Lowest eligible</span>
            <span className="bdg b-out">Eligible</span>
            <span className="bdg b-dash">Not eligible</span>
          </div>
          <div className="row gap8">
            <span className="help" style={{ width: '120px' }}>
              Payment
            </span>
            <span className="bdg b-fill">Paid</span>
            <span className="bdg b-dash">Due</span>
          </div>
        </div>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Countdown</h2>
        <div className="g g4">
          <span className="cdchip" style={{ alignSelf: 'start' }}>
            <ClockIcon size={16}/>
            Closes in 2d 05h 14m
          </span>
          <span className="cdchip cdchip-soon" style={{ alignSelf: 'start' }}>
            <span className="blink"/>
            Closing soon · 42m 18s
          </span>
          <div className="cdbox">
            <span className="cd-l">Closes in</span>
            <span className="cd-t">2d 05h 14m</span>
          </div>
          <div className="cdbox cdbox-soon">
            <span className="cd-l">
              <span className="blink"/>
              Closing soon
            </span>
            <span className="cd-t">42m 18s</span>
          </div>
        </div>
        <p className="help">
          Under one hour the countdown flips to solid black with a "Closing soon" label and a blinking dot (static when reduced motion is on).
        </p>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Table</h2>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th>
                <th>Designer</th>
                <th>Rating</th>
                <th className="r">Bid</th>
                <th>Eligibility</th>
                <th>
                  <span className="sr">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-x">
                <td>1</td>
                <td>Shanika de Silva</td>
                <td>3.6</td>
                <td className="amt">LKR 112,000.00</td>
                <td>
                  <span className="bdg b-dash">Not eligible</span>
                </td>
                <td />
              </tr>
              <tr className="row-hl">
                <td>2</td>
                <td>Nethmi Jayasekara</td>
                <td>4.8</td>
                <td className="amt">LKR 118,000.00</td>
                <td>
                  <span className="bdg b-fill">Lowest eligible</span>
                </td>
                <td className="r">
                  <button type="button" className="btn btn-s">
                    Award
                  </button>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Ishara Wickramasinghe</td>
                <td>4.2</td>
                <td className="amt">LKR 118,000.00</td>
                <td>
                  <span className="bdg b-out">Eligible</span>
                </td>
                <td className="r">
                  <button type="button" className="btn btn-s">
                    Award to this designer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Modal, empty state, error, toast</h2>
        <div className="g g2">
          <div className="panel" style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <div className="modal" style={{ maxHeight: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}>
              <h3 className="h2">Award this project?</h3>
              <p style={{ fontSize: '14px' }}>
                Nethmi Jayasekara will be notified and the client files will be shared with her.
              </p>
              <div className="row end">
                <button type="button" className="btn btn-g">
                  Cancel
                </button>
                <button type="button" className="btn btn-p">
                  Confirm award
                </button>
              </div>
            </div>
          </div>
          <div className="col gap16">
            <div className="empty" style={{ padding: '32px 24px' }}>
              <div className="empty-ic">
                <SearchIcon size={24}/>
              </div>
              <h3 className="h3">No projects match</h3>
              <p className="help">Try another status or clear the search.</p>
              <button type="button" className="btn btn-s">
                Clear filters
              </button>
            </div>
            <div className="errbox">
              <ErrorCircleIcon size={18}/>
              <span>That email and password don't match.</span>
            </div>
            <div className="toast toast-s">
              <CheckIcon size={18} strokeWidth={2.4}/>
              Bid sealed and submitted.
            </div>
          </div>
        </div>
      </section>

      <section className="sys-sec">
        <h2 className="h2">Status timeline</h2>
        <div className="card">
          <StatusTimeline status="progress"/>
        </div>
        <p className="help">Done: filled with a tick. Current: thick ring and bold label. Upcoming: grey outline.</p>
      </section>
    </>);
};
