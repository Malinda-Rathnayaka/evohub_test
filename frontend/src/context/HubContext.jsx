import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { seed, mkProject, } from '../utils/seedData';
import { REF_SAMPLES, CLIENT_SAMPLES, WORK_SAMPLES, TEMP_PW, H, D, localStr, money, first, MONS, } from '../utils/formatters';
import { rankBids } from '../utils/bidRanking';
const HubContext = createContext(null);
function blankDraft(t0) {
    return {
        title: 'Ayurveda Spa Brochure',
        category: 'Print',
        skill: 'Print & layout',
        brief: 'A 12-page A5 brochure for a wellness spa on the south coast. Calm, airy layouts with plenty of white space. It needs a treatment menu, a price list and a short story about the spa.',
        max: '45000',
        opens: localStr(t0),
        closes: localStr(t0 + 3 * D),
        days: '10',
        revisions: '2',
        minRating: '4.0',
        visibility: 'all',
        selected: [],
        client: 'Lotus Bay Spa',
        refs: [REF_SAMPLES[0]],
        clientFiles: [CLIENT_SAMPLES[0]],
    };
}
function blankBid() {
    return { amount: '', days: '', note: '', portfolio: '', ip: false };
}
export const HubProvider = ({ children }) => {
    const q = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const propRole = (q.get('role') === 'designer' ? 'designer' : 'admin');
    const propScreen = (q.get('screen') || 'login');
    const propProject = q.get('project') || 'P3';
    const propTab = (q.get('tab') || 'overview');
    const propPreset = q.get('preset') || '';
    const propDesigner = q.get('designer') || 'D1';
    const propMobile = q.has('mobile') ? q.get('mobile') === '1' || q.get('mobile') === 'true' : null;
    const propFrozen = q.has('frozen') ? q.get('frozen') === '1' || q.get('frozen') === 'true' : false;
    const propChrome = q.has('chrome') ? q.get('chrome') !== '0' && q.get('chrome') !== 'false' : true;
    const t0Ref = useRef(Date.now());
    const t0 = t0Ref.current;
    const seedData = useRef(seed(t0));
    const [now, setNow] = useState(t0);
    const [isNarrow, setIsNarrow] = useState(false);
    const [role, setRoleState] = useState(propRole);
    const [screen, setScreenState] = useState(propScreen === 'login' ? (propRole === 'admin' ? 'a-dash' : 'd-home') : propScreen);
    const [loggedIn, setLoggedIn] = useState(propScreen !== 'login');
    const [pid, setPid] = useState(propProject);
    const [tab, setTab] = useState(propTab);
    const [meId] = useState('D1');
    const [did, setDid] = useState(propDesigner);
    const [designers, setDesigners] = useState(seedData.current.designers);
    const [projects, setProjects] = useState(seedData.current.projects);
    const [payments, setPayments] = useState(seedData.current.payments);
    const [login, setLogin] = useState({
        email: propRole === 'admin' ? 'admin@evoart.lk' : 'nethmi@example.com',
        pw: '',
        err: '',
    });
    const [showForgot, setShowForgot] = useState(false);
    const [pf, setPf] = useState({ q: '', status: 'all', cat: 'all' });
    const [draft, setDraft] = useState(() => blankDraft(t0));
    const [draftErr, setDraftErr] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [bidsPreview, setBidsPreview] = useState('live');
    const [modal, setModal] = useState(null);
    const [md, setMd] = useState({});
    const [reason, setReason] = useState('');
    const [reasonErr, setReasonErr] = useState(false);
    const [revNote, setRevNote] = useState('');
    const [revErr, setRevErr] = useState(false);
    const [ver, setVer] = useState(null);
    const [fileIdx, setFileIdx] = useState(0);
    const [comment, setComment] = useState('');
    const [bid, setBid] = useState(blankBid());
    const [bidErr, setBidErr] = useState({});
    const [editingBid, setEditingBid] = useState(false);
    const [justPlaced, setJustPlaced] = useState(false);
    const [pending, setPending] = useState([]);
    const [nd, setNd] = useState({
        name: '',
        email: '',
        phone: '',
        skills: [],
        limit: '2',
        rating: '4.0',
        invite: true,
        pw: TEMP_PW[0],
    });
    const [ndErr, setNdErr] = useState({});
    const [ndDone, setNdDone] = useState(false);
    const [ndPwI, setNdPwI] = useState(0);
    const [ndNewId, setNdNewId] = useState(null);
    const [pw, setPw] = useState({ cur: '', nw: '', cf: '' });
    const [pwErr, setPwErr] = useState({});
    const [pwFrom, setPwFrom] = useState(null);
    const [prof, setProf] = useState({ phone: '+94 77 214 6630', portfolio: 'portfolio.example/nethmi' });
    const [payF, setPayF] = useState('all');
    const [toast, setToast] = useState(null);
    const [flowId, setFlowId] = useState(null);
    const [flowStep, setFlowStep] = useState(-1);
    const toastTimer = useRef(null);
    const isMobile = propMobile === true || (propMobile !== false && isNarrow);
    // Resize listener
    useEffect(() => {
        const measure = () => {
            const w = window.innerWidth || 1280;
            setIsNarrow(w < 760);
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);
    // Timer
    useEffect(() => {
        if (propFrozen)
            return;
        const iv = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(iv);
    }, [propFrozen]);
    const top = useCallback(() => {
        try {
            window.scrollTo(0, 0);
        }
        catch {
            // ignore
        }
    }, []);
    const toastMsg = useCallback((t) => {
        if (toastTimer.current)
            clearTimeout(toastTimer.current);
        setToast(t);
        toastTimer.current = window.setTimeout(() => setToast(null), 3400);
    }, []);
    const mdFor = useCallback((targetPid, targetDid) => {
        const p = projects.find((x) => x.id === targetPid) || projects[0];
        const d = designers.find((x) => x.id === targetDid) || designers[0];
        const b = p.bids.find((x) => x.d === targetDid) || { amount: 0, days: 0 };
        const r = rankBids(p, designers, bidsPreview);
        const row = r.rows.find((x) => x.d.id === targetDid);
        const low = r.lowest;
        const diff = low ? b.amount - low.amount : 0;
        return {
            pid: targetPid,
            did: targetDid,
            name: d.name,
            first: first(d.name),
            title: p.title,
            amount: b.amount,
            amountF: money(b.amount),
            days: b.days + ' days',
            advF: money(b.amount / 2),
            lowestName: low ? low.d.name : 'No eligible bids',
            lowestF: low ? money(low.amount) : '—',
            diffText: low
                ? diff > 0
                    ? 'This costs ' + money(diff) + ' more than the lowest eligible bid.'
                    : 'Same amount as the lowest eligible bid.'
                : 'There are no eligible bids on this project.',
            eligText: row && !row.elig ? 'Not eligible: ' + row.reason : 'Eligible',
        };
    }, [projects, designers, bidsPreview]);
    // Apply Presets
    useEffect(() => {
        if (!propPreset)
            return;
        const award3 = () => {
            setProjects((prev) => prev.map((p) => p.id === 'P3'
                ? { ...p, status: 'awarded', awardedTo: 'D1', award: { amount: 118000, at: t0 - H, reason: '' } }
                : p));
        };
        switch (propPreset) {
            case 'p3won':
                award3();
                break;
            case 'tie':
            case 'none':
            case 'inelig':
                setBidsPreview(propPreset);
                break;
            case 'award':
                setModal('award');
                setMd(mdFor('P3', 'D1'));
                break;
            case 'awardOther':
                setModal('awardOther');
                setMd(mdFor('P3', 'D3'));
                setReasonErr(true);
                break;
            case 'awardDone':
                setMd(mdFor('P3', 'D1'));
                award3();
                setModal('awardDone');
                break;
            case 'bidErrors':
                setBid({ amount: '38000', days: '', note: '', portfolio: '', ip: false });
                setBidErr({
                    amount: 'Your bid is above the maximum of LKR 35,000.00.',
                    days: 'Enter the number of days you need.',
                    ip: 'Please accept the IP terms to place a bid.',
                });
                break;
            case 'justPlaced':
                setJustPlaced(true);
                break;
            case 'loginError':
                setLogin((l) => ({
                    ...l,
                    err: 'That email and password don’t match. Try again or contact EVO ART.',
                    pw: 'evoart2025',
                }));
                break;
            case 'forgot':
                setShowForgot(true);
                break;
            case 'revision':
                setModal('revision');
                setMd({ pid: 'P5', next: 2, allowed: 2, dots: [{ cls: 'on' }, { cls: 'on' }] });
                setRevNote('Swap the reel cover photo for the cinnamon close-up.');
                break;
            case 'withdraw':
                setModal('withdraw');
                break;
            case 'ndDone':
                setNd({
                    name: 'Tharindu Gamage',
                    email: 'tharindu@example.com',
                    phone: '+94 77 900 1122',
                    skills: ['Motion', 'Illustration'],
                    limit: '2',
                    rating: '4.0',
                    invite: true,
                    pw: TEMP_PW[0],
                });
                setNdDone(true);
                break;
            case 'ndFill':
                setNd({
                    name: 'Tharindu Gamage',
                    email: 'tharindu@example.com',
                    phone: '+94 77 900 1122',
                    skills: ['Motion', 'Illustration'],
                    limit: '2',
                    rating: '4.0',
                    invite: true,
                    pw: TEMP_PW[0],
                });
                break;
            case 'emptyFilter':
                setPf({ q: '', status: 'draft', cat: 'all' });
                break;
            case 'workRevision': {
                setProjects((prev) => prev.map((p) => {
                    if (p.id === 'P5') {
                        const updatedDels = [...p.deliveries];
                        if (updatedDels[1]) {
                            updatedDels[1] = { ...updatedDels[1], status: 'Revision requested' };
                        }
                        const comments = [
                            ...p.comments,
                            {
                                by: 'admin',
                                text: 'Nearly there. Please swap the reel cover photo for the cinnamon close-up and tighten the logo lock-up.',
                                at: t0 - 2 * H,
                            },
                        ];
                        return { ...p, status: 'progress', revUsed: 2, deliveries: updatedDels, comments };
                    }
                    return p;
                }));
                setPending([
                    { name: 'Reel_cover_v3.png', size: '1.3 MB' },
                    { name: 'SpiceCampaign_Carousel_v3.pdf', size: '6.5 MB' },
                ]);
                break;
            }
            case 'toastBid':
                setJustPlaced(true);
                setToast('Bid sealed and submitted.');
                break;
            case 'pwErrors':
                setPw({ cur: '', nw: 'abc', cf: 'abd' });
                setPwErr({
                    cur: 'Enter your current password.',
                    nw: 'Use at least 8 characters, including a number.',
                    cf: 'The passwords don’t match.',
                });
                break;
            case 'draftErrors':
                setDraft((d) => ({ ...d, title: '', brief: '', max: '' }));
                setDraftErr({ title: true, brief: true, max: true });
                break;
            default:
                break;
        }
    }, [propPreset, t0, mdFor]);
    const go = useCallback((targetScreen, extra) => {
        setScreenState(targetScreen);
        setModal(null);
        setLoggedIn(true);
        if (extra) {
            if (extra.role)
                setRoleState(extra.role);
            if (extra.pid)
                setPid(extra.pid);
            if (extra.tab)
                setTab(extra.tab);
            if (extra.did)
                setDid(extra.did);
            if (extra.editingId !== undefined)
                setEditingId(extra.editingId);
            if (extra.draft)
                setDraft(extra.draft);
            if (extra.draftErr)
                setDraftErr(extra.draftErr);
            if (extra.bidsPreview)
                setBidsPreview(extra.bidsPreview);
            if (extra.ver !== undefined)
                setVer(extra.ver);
            if (extra.fileIdx !== undefined)
                setFileIdx(extra.fileIdx);
            if (extra.comment !== undefined)
                setComment(extra.comment);
            if (extra.editingBid !== undefined)
                setEditingBid(extra.editingBid);
            if (extra.justPlaced !== undefined)
                setJustPlaced(extra.justPlaced);
            if (extra.bid)
                setBid(extra.bid);
            if (extra.bidErr)
                setBidErr(extra.bidErr);
            if (extra.pending)
                setPending(extra.pending);
            if (extra.ndDone !== undefined)
                setNdDone(extra.ndDone);
            if (extra.ndErr)
                setNdErr(extra.ndErr);
            if (extra.nd)
                setNd(extra.nd);
            if (extra.pwFrom)
                setPwFrom(extra.pwFrom);
            if (extra.payF)
                setPayF(extra.payF);
            if (extra.flowStep !== undefined)
                setFlowStep(extra.flowStep);
        }
        top();
    }, [top]);
    const setRole = useCallback((newRole) => {
        setRoleState(newRole);
        setModal(null);
        setLogin((l) => ({
            ...l,
            email: newRole === 'admin' ? 'admin@evoart.lk' : 'nethmi@example.com',
            err: '',
        }));
        setScreenState(newRole === 'admin' ? 'a-dash' : 'd-home');
    }, []);
    const signOut = useCallback(() => {
        setLoggedIn(false);
        setModal(null);
    }, []);
    const signIn = useCallback((e) => {
        if (e)
            e.preventDefault();
        if (!login.email.trim() || !login.pw) {
            setLogin((l) => ({ ...l, err: 'Enter your email and password.' }));
            return;
        }
        setLoggedIn(true);
        setLogin((l) => ({ ...l, err: '', pw: '' }));
        setScreenState(role === 'admin' ? 'a-dash' : 'd-home');
        top();
    }, [login, role, top]);
    const toggleForgot = useCallback(() => setShowForgot((f) => !f), []);
    const onLoginEmail = useCallback((v) => setLogin((l) => ({ ...l, email: v })), []);
    const onLoginPw = useCallback((v) => setLogin((l) => ({ ...l, pw: v })), []);
    const openProject = useCallback((projId, targetTab) => {
        go('a-project', {
            pid: projId,
            tab: targetTab || 'overview',
            bidsPreview: 'live',
            ver: null,
            fileIdx: 0,
            comment: '',
            role: 'admin',
        });
    }, [go]);
    const openBrief = useCallback((projId) => {
        go('d-brief', {
            pid: projId,
            editingBid: false,
            justPlaced: false,
            bid: blankBid(),
            bidErr: {},
            role: 'designer',
        });
    }, [go]);
    const openWork = useCallback((projId) => {
        go('d-work', {
            pid: projId,
            pending: [],
            comment: '',
            role: 'designer',
        });
    }, [go]);
    const clearFilters = useCallback(() => setPf({ q: '', status: 'all', cat: 'all' }), []);
    const addDraftRef = useCallback(() => {
        setDraft((d) => ({
            ...d,
            refs: d.refs.concat([REF_SAMPLES[d.refs.length % REF_SAMPLES.length]]),
        }));
    }, []);
    const removeDraftRef = useCallback((index) => {
        setDraft((d) => ({
            ...d,
            refs: d.refs.filter((_, i) => i !== index),
        }));
    }, []);
    const addDraftClientFile = useCallback(() => {
        setDraft((d) => ({
            ...d,
            clientFiles: d.clientFiles.concat([CLIENT_SAMPLES[d.clientFiles.length % CLIENT_SAMPLES.length]]),
        }));
    }, []);
    const removeDraftClientFile = useCallback((index) => {
        setDraft((d) => ({
            ...d,
            clientFiles: d.clientFiles.filter((_, i) => i !== index),
        }));
    }, []);
    const toggleDraftDesigner = useCallback((id) => {
        setDraft((d) => ({
            ...d,
            selected: d.selected.includes(id) ? d.selected.filter((y) => y !== id) : d.selected.concat([id]),
        }));
    }, []);
    const publish = useCallback((asDraft) => {
        const err = {};
        if (!draft.title.trim())
            err.title = true;
        if (!asDraft && !draft.brief.trim())
            err.brief = true;
        const maxVal = parseFloat(String(draft.max).replace(/,/g, ''));
        if (!asDraft && !(maxVal > 0))
            err.max = true;
        if (Object.keys(err).length > 0) {
            top();
            setDraftErr(err);
            return;
        }
        const currNow = Date.now();
        let closes = Date.parse(draft.closes);
        if (isNaN(closes) || closes <= currNow)
            closes = currNow + 3 * D;
        let opens = Date.parse(draft.opens);
        if (isNaN(opens))
            opens = currNow;
        const fields = {
            title: draft.title.trim(),
            category: draft.category,
            skill: draft.skill,
            brief: draft.brief.trim(),
            max: maxVal || 0,
            opens: opens,
            closes: closes,
            days: parseInt(draft.days, 10) || 10,
            revisions: parseInt(draft.revisions, 10) || 2,
            minRating: parseFloat(draft.minRating) || 4,
            visibility: (draft.visibility === 'all' ? 'All designers' : 'Selected designers'),
            visibleTo: draft.selected.slice(),
            client: draft.client,
            refs: draft.refs.slice(),
            clientFiles: draft.clientFiles.slice(),
        };
        let newPid = '';
        if (editingId) {
            newPid = editingId;
            setProjects((prev) => prev.map((p) => p.id === editingId
                ? {
                    ...p,
                    ...fields,
                    status: !asDraft && p.status === 'draft' ? 'open' : p.status,
                    activity: [{ at: currNow, text: 'Project details updated' }, ...p.activity],
                }
                : p));
        }
        else {
            newPid = 'P' + (projects.length + 1);
            const newProj = mkProject({
                id: newPid,
                code: 'EVO-' + (1043 + projects.length - 6),
                status: asDraft ? 'draft' : 'open',
                deliverables: [
                    'Print-ready artwork (PDF)',
                    'Editable source files',
                    'Mockups for client approval',
                ],
                activity: [
                    {
                        at: currNow,
                        text: asDraft ? 'Saved as a draft' : 'Published. Eligible designers notified.',
                    },
                ],
                ...fields,
            });
            setProjects((prev) => [newProj, ...prev]);
        }
        if (!asDraft && !editingId) {
            setFlowId(newPid);
        }
        setDraftErr({});
        setEditingId(null);
        openProject(newPid, 'overview');
        toastMsg(asDraft
            ? 'Saved as a draft. Designers can’t see it yet.'
            : editingId
                ? 'Changes saved.'
                : 'Project published. Eligible designers have been notified.');
    }, [draft, editingId, projects.length, top, openProject, toastMsg]);
    const editProject = useCallback((targetPid) => {
        const p = projects.find((x) => x.id === targetPid);
        if (!p)
            return;
        go('a-create', {
            editingId: targetPid,
            draftErr: {},
            draft: {
                title: p.title,
                category: p.category,
                skill: p.skill,
                brief: p.brief,
                max: String(p.max),
                opens: localStr(p.opens),
                closes: localStr(p.closes),
                days: String(p.days),
                revisions: String(p.revisions),
                minRating: p.minRating.toFixed(1),
                visibility: p.visibility === 'All designers' ? 'all' : 'selected',
                selected: (p.visibleTo || []).slice(),
                client: p.client,
                refs: p.refs.slice(),
                clientFiles: p.clientFiles.slice(),
            },
        });
    }, [projects, go]);
    const endBidding = useCallback((targetPid) => {
        const currNow = Date.now();
        setProjects((prev) => prev.map((p) => {
            if (p.id === targetPid) {
                let updatedBids = p.bids;
                if (targetPid === flowId) {
                    const extra = [
                        {
                            d: 'D3',
                            amount: p.max,
                            days: p.days,
                            note: 'Clean editorial layout.',
                            portfolio: 'portfolio.example/ishara',
                            at: currNow - 2 * H,
                        },
                        {
                            d: 'D2',
                            amount: p.max - 2000,
                            days: p.days - 1,
                            note: 'Print production included.',
                            portfolio: 'portfolio.example/kavindu',
                            at: currNow - 3 * H,
                        },
                        {
                            d: 'D5',
                            amount: Math.round((p.max * 0.82) / 500) * 500,
                            days: p.days,
                            note: 'Type-led layout.',
                            portfolio: 'portfolio.example/shanika',
                            at: currNow - 4 * H,
                        },
                    ];
                    updatedBids = p.bids.filter((b) => !extra.some((e) => e.d === b.d)).concat(extra);
                }
                return {
                    ...p,
                    status: 'closed',
                    closes: currNow - 1000,
                    bids: updatedBids,
                    activity: [{ at: currNow, text: 'Bidding closed with ' + updatedBids.length + ' bids' }, ...p.activity],
                };
            }
            return p;
        }));
        setBidsPreview('live');
        toastMsg('Bidding closed. Sealed bids are now visible to you.');
    }, [flowId, toastMsg]);
    const reopen = useCallback((targetPid) => {
        const currNow = Date.now();
        setProjects((prev) => prev.map((p) => p.id === targetPid
            ? {
                ...p,
                status: 'open',
                closes: currNow + 3 * D,
                activity: [{ at: currNow, text: 'Bidding reopened for 3 days' }, ...p.activity],
            }
            : p));
        setBidsPreview('live');
        setTab('overview');
        toastMsg('Bidding reopened for 3 days. Designers have been notified.');
    }, [toastMsg]);
    const doAward = useCallback((targetPid, targetDid, awardReason) => {
        const currNow = Date.now();
        const modalData = mdFor(targetPid, targetDid);
        const d = designers.find((x) => x.id === targetDid) || designers[0];
        const amount = modalData.amount || 0;
        setProjects((prev) => prev.map((p) => p.id === targetPid
            ? {
                ...p,
                status: 'awarded',
                awardedTo: targetDid,
                award: { amount: amount, at: currNow, reason: awardReason },
                activity: [
                    {
                        at: currNow,
                        text: 'Awarded to ' +
                            d.name +
                            ' for ' +
                            money(amount) +
                            (awardReason ? '. Reason: ' + awardReason : ''),
                    },
                    ...p.activity,
                ],
            }
            : p));
        setDesigners((prev) => prev.map((x) => (x.id === targetDid ? { ...x, load: x.load + 1 } : x)));
        setPayments((prev) => [
            ...prev,
            {
                id: 'PAY-' + (2260 + prev.length),
                p: targetPid,
                d: targetDid,
                type: 'Advance (50%)',
                amount: amount / 2,
                at: null,
                status: 'due',
                ref: '',
            },
        ]);
        setModal('awardDone');
        setMd(modalData);
        setBidsPreview('live');
        setReason('');
        setReasonErr(false);
    }, [designers, mdFor]);
    const approve = useCallback((targetPid) => {
        const currNow = Date.now();
        const proj = projects.find((p) => p.id === targetPid);
        if (!proj)
            return;
        setProjects((prev) => prev.map((p) => {
            if (p.id === targetPid) {
                const deliveries = p.deliveries.map((v, i) => i === p.deliveries.length - 1 ? { ...v, status: 'Approved' } : v);
                return {
                    ...p,
                    status: 'completed',
                    deliveries: deliveries,
                    activity: [
                        {
                            at: currNow,
                            text: 'Version ' + p.deliveries.length + ' approved. Project completed.',
                        },
                        ...p.activity,
                    ],
                };
            }
            return p;
        }));
        setDesigners((prev) => prev.map((x) => x.id === proj.awardedTo ? { ...x, load: Math.max(0, x.load - 1) } : x));
        const hasFinal = payments.some((x) => x.p === targetPid && x.type.indexOf('Final') === 0);
        if (!hasFinal && proj.award) {
            setPayments((prev) => [
                ...prev,
                {
                    id: 'PAY-' + (2260 + prev.length),
                    p: targetPid,
                    d: proj.awardedTo || '',
                    type: 'Final (50%)',
                    amount: proj.award.amount / 2,
                    at: null,
                    status: 'due',
                    ref: '',
                },
            ]);
        }
        setModal(null);
        setVer(null);
        toastMsg('Approved. The project is complete and the final payment is logged as due.');
    }, [projects, payments, toastMsg]);
    const requestRevision = useCallback(() => {
        if (!revNote.trim()) {
            setRevErr(true);
            return;
        }
        const currPid = md.pid;
        if (!currPid)
            return;
        const currNow = Date.now();
        setProjects((prev) => prev.map((p) => {
            if (p.id === currPid) {
                const revUsed = p.revUsed + 1;
                const deliveries = p.deliveries.map((v, i) => i === p.deliveries.length - 1 ? { ...v, status: 'Revision requested' } : v);
                const comments = p.comments.concat([{ by: 'admin', text: revNote.trim(), at: currNow }]);
                return {
                    ...p,
                    revUsed,
                    status: 'progress',
                    deliveries,
                    comments,
                    activity: [{ at: currNow, text: 'Revision ' + revUsed + ' of ' + p.revisions + ' requested' }, ...p.activity],
                };
            }
            return p;
        }));
        setModal(null);
        setRevNote('');
        setRevErr(false);
        toastMsg('Revision requested. The designer has been notified.');
    }, [revNote, md.pid, toastMsg]);
    const markPaid = useCallback((payId) => {
        setPayments((prev) => prev.map((x) => x.id === payId
            ? {
                ...x,
                status: 'paid',
                at: Date.now(),
                ref: 'BOC-' + (89700 + Math.floor(Math.random() * 280)),
            }
            : x));
        toastMsg('Payment marked as paid.');
    }, [toastMsg]);
    const submitBid = useCallback((e) => {
        if (e)
            e.preventDefault();
        const p = projects.find((x) => x.id === pid);
        if (!p)
            return;
        const err = {};
        const amt = parseFloat(String(bid.amount).replace(/,/g, ''));
        if (!String(bid.amount).trim())
            err.amount = 'Enter your bid amount.';
        else if (isNaN(amt) || amt <= 0)
            err.amount = 'Enter a valid amount, for example 30000.';
        else if (amt > p.max)
            err.amount = 'Your bid is above the maximum of ' + money(p.max) + '.';
        const daysVal = parseInt(bid.days, 10);
        if (!String(bid.days).trim())
            err.days = 'Enter the number of days you need.';
        else if (isNaN(daysVal) || daysVal < 1)
            err.days = 'Enter a whole number of days.';
        else if (daysVal > p.days)
            err.days = 'EVO ART needs delivery within ' + p.days + ' days.';
        if (bid.note.length > 300)
            err.note = 'Keep your note under 300 characters.';
        if (!bid.ip)
            err.ip = 'Please accept the IP terms to place a bid.';
        if (Object.keys(err).length > 0) {
            setBidErr(err);
            return;
        }
        const wasEditing = editingBid;
        const currNow = Date.now();
        setProjects((prev) => prev.map((x) => {
            if (x.id === p.id) {
                const filteredBids = x.bids.filter((y) => y.d !== meId);
                const newBid = {
                    d: meId,
                    amount: amt,
                    days: daysVal,
                    note: bid.note.trim(),
                    portfolio: bid.portfolio.trim(),
                    at: currNow,
                };
                return {
                    ...x,
                    bids: [...filteredBids, newBid],
                    activity: [
                        {
                            at: currNow,
                            text: wasEditing ? 'A sealed bid was updated' : 'A sealed bid was received',
                        },
                        ...x.activity,
                    ],
                };
            }
            return x;
        }));
        setBidErr({});
        setEditingBid(false);
        setJustPlaced(true);
        setBid(blankBid());
        toastMsg(wasEditing ? 'Bid updated. It’s still sealed.' : 'Bid sealed and submitted.');
    }, [projects, pid, bid, editingBid, meId, toastMsg]);
    const editBid = useCallback(() => {
        const p = projects.find((x) => x.id === pid);
        if (!p)
            return;
        const mine = p.bids.find((b) => b.d === meId);
        if (!mine)
            return;
        setEditingBid(true);
        setJustPlaced(false);
        setBidErr({});
        setBid({
            amount: String(mine.amount),
            days: String(mine.days),
            note: mine.note || '',
            portfolio: mine.portfolio || '',
            ip: true,
        });
    }, [projects, pid, meId]);
    const cancelEditBid = useCallback(() => {
        setEditingBid(false);
        setBidErr({});
        setBid(blankBid());
    }, []);
    const withdraw = useCallback(() => {
        const currNow = Date.now();
        setProjects((prev) => prev.map((x) => {
            if (x.id === pid) {
                return {
                    ...x,
                    bids: x.bids.filter((y) => y.d !== meId),
                    activity: [{ at: currNow, text: 'A sealed bid was withdrawn' }, ...x.activity],
                };
            }
            return x;
        }));
        setModal(null);
        setJustPlaced(false);
        setEditingBid(false);
        setBid(blankBid());
        toastMsg('Bid withdrawn. You can bid again before it closes.');
    }, [pid, meId, toastMsg]);
    const addPending = useCallback(() => {
        const p = projects.find((x) => x.id === pid);
        if (!p)
            return;
        const n = p.deliveries.length + 1;
        const w = WORK_SAMPLES[pending.length % WORK_SAMPLES.length];
        const f = { name: w[0] + '_v' + n + '.' + w[1], size: w[2] };
        if (p.status === 'awarded') {
            const currNow = Date.now();
            setProjects((prev) => prev.map((x) => x.id === p.id
                ? {
                    ...x,
                    status: 'progress',
                    activity: [{ at: currNow, text: 'Designer started work' }, ...x.activity],
                }
                : x));
        }
        setPending((prev) => [...prev, f]);
    }, [projects, pid, pending.length]);
    const removePending = useCallback((index) => {
        setPending((prev) => prev.filter((_, i) => i !== index));
    }, []);
    const submitWork = useCallback(() => {
        if (!pending.length)
            return;
        const currNow = Date.now();
        setProjects((prev) => prev.map((x) => {
            if (x.id === pid) {
                const v = x.deliveries.length + 1;
                const newDel = {
                    v: v,
                    at: currNow,
                    note: v === 1 ? 'First version, ready for your review.' : 'Updated with your revision notes.',
                    status: 'In review',
                    files: pending.slice(),
                };
                return {
                    ...x,
                    deliveries: [...x.deliveries, newDel],
                    status: 'review',
                    activity: [{ at: currNow, text: 'Version ' + v + ' submitted for review' }, ...x.activity],
                };
            }
            return x;
        }));
        setPending([]);
        toastMsg('Submitted for review. EVO ART usually replies within 2 working days.');
    }, [pending, pid, toastMsg]);
    const sendComment = useCallback(() => {
        if (!comment.trim())
            return;
        const currNow = Date.now();
        const by = role === 'admin' ? 'admin' : meId;
        setProjects((prev) => prev.map((x) => x.id === pid
            ? {
                ...x,
                comments: [...x.comments, { by, text: comment.trim(), at: currNow }],
            }
            : x));
        setComment('');
        toastMsg('Comment sent.');
    }, [comment, role, meId, pid, toastMsg]);
    const toggleDesignerActive = useCallback((targetDid) => {
        const d = designers.find((x) => x.id === targetDid);
        if (!d)
            return;
        const willBeActive = !d.active;
        setDesigners((prev) => prev.map((x) => (x.id === targetDid ? { ...x, active: willBeActive } : x)));
        toastMsg(willBeActive ? d.name + ' is active again.' : d.name + ' can no longer sign in or bid.');
    }, [designers, toastMsg]);
    const adjustDesignerLimit = useCallback((targetDid, delta) => {
        setDesigners((prev) => prev.map((x) => x.id === targetDid ? { ...x, limit: Math.max(1, Math.min(6, x.limit + delta)) } : x));
    }, []);
    const resetDesignerPw = useCallback((email) => {
        toastMsg('A new temporary password was emailed to ' + email + '.');
    }, [toastMsg]);
    const toggleNdSkill = useCallback((skill) => {
        setNd((prev) => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter((x) => x !== skill)
                : [...prev.skills, skill],
        }));
        setNdErr((e) => ({ ...e, skills: '' }));
    }, []);
    const regenNdPw = useCallback(() => {
        setNdPwI((prev) => {
            const next = prev + 1;
            setNd((n) => ({ ...n, pw: TEMP_PW[next % TEMP_PW.length] }));
            return next;
        });
    }, []);
    const copyNdPw = useCallback(() => {
        try {
            navigator.clipboard.writeText(nd.pw);
        }
        catch {
            // ignore
        }
        toastMsg('Temporary password copied.');
    }, [nd.pw, toastMsg]);
    const submitNd = useCallback(() => {
        const err = {};
        if (!nd.name.trim())
            err.name = 'Enter the designer’s full name.';
        if (!/^\S+@\S+\.\S+$/.test(nd.email))
            err.email = 'Enter a valid email address.';
        if (!nd.skills.length)
            err.skills = 'Pick at least one skill.';
        if (Object.keys(err).length > 0) {
            setNdErr(err);
            return;
        }
        const newId = 'D' + (designers.length + 1);
        const ini = nd.name
            .trim()
            .split(/\s+/)
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
        const tnow = new Date();
        const newDes = {
            id: newId,
            name: nd.name.trim(),
            ini: ini,
            email: nd.email.trim(),
            phone: nd.phone,
            skills: nd.skills.slice(),
            rating: parseFloat(nd.rating),
            active: true,
            limit: parseInt(nd.limit, 10),
            load: 0,
            joined: MONS[tnow.getMonth()] + ' ' + tnow.getFullYear(),
            earned: 0,
            bids: 0,
            won: 0,
            portfolio: '',
        };
        setDesigners((prev) => [...prev, newDes]);
        setNdDone(true);
        setNdErr({});
        setNdNewId(newId);
        toastMsg(nd.invite ? 'Login created. Invite sent to ' + nd.email.trim() + '.' : 'Login created.');
    }, [nd, designers.length, toastMsg]);
    const ndAnother = useCallback(() => {
        setNdPwI((prev) => {
            const next = prev + 1;
            setNd({
                name: '',
                email: '',
                phone: '',
                skills: [],
                limit: '2',
                rating: '4.0',
                invite: true,
                pw: TEMP_PW[next % TEMP_PW.length],
            });
            return next;
        });
        setNdDone(false);
    }, []);
    const savePw = useCallback((e) => {
        if (e)
            e.preventDefault();
        const err = {};
        if (!pw.cur)
            err.cur = 'Enter your current password.';
        if (pw.nw.length < 8 || !/\d/.test(pw.nw))
            err.nw = 'Use at least 8 characters, including a number.';
        if (pw.cf !== pw.nw)
            err.cf = 'The passwords don’t match.';
        if (Object.keys(err).length > 0) {
            setPwErr(err);
            return;
        }
        setPw({ cur: '', nw: '', cf: '' });
        setPwErr({});
        const backTo = pwFrom && pwFrom !== 'password' ? pwFrom : role === 'admin' ? 'a-dash' : 'd-profile';
        go(backTo);
        toastMsg('Password updated.');
    }, [pw, pwFrom, role, go, toastMsg]);
    const saveProfile = useCallback(() => {
        toastMsg('Profile saved.');
    }, [toastMsg]);
    const openAwardModal = useCallback((targetPid, targetDid) => {
        setModal('award');
        setMd(mdFor(targetPid, targetDid));
    }, [mdFor]);
    const openAwardOtherModal = useCallback((targetPid, targetDid) => {
        setModal('awardOther');
        setMd(mdFor(targetPid, targetDid));
        setReason('');
        setReasonErr(false);
    }, [mdFor]);
    const openApproveModal = useCallback(() => {
        const p = projects.find((x) => x.id === pid);
        if (!p)
            return;
        const winner = designers.find((d) => d.id === p.awardedTo);
        const cv = p.deliveries[p.deliveries.length - 1];
        setModal('approve');
        setMd({
            pid: p.id,
            v: cv ? cv.v : 1,
            finalF: money(p.award ? p.award.amount / 2 : 0),
            name: winner ? winner.name : '',
        });
    }, [projects, pid, designers]);
    const openRevisionModal = useCallback(() => {
        const p = projects.find((x) => x.id === pid);
        if (!p)
            return;
        setModal('revision');
        setMd({
            pid: p.id,
            next: p.revUsed + 1,
            allowed: p.revisions,
            dots: Array.from({ length: p.revisions }, (_, i) => ({ cls: i <= p.revUsed ? 'on' : '' })),
        });
        setRevNote('');
        setRevErr(false);
    }, [projects, pid]);
    const openWithdrawModal = useCallback(() => {
        setModal('withdraw');
    }, []);
    const closeModal = useCallback(() => {
        setModal(null);
    }, []);
    const gotoStep = useCallback((i) => {
        let curStep = i;
        if (curStep > 0 && !flowId) {
            toastMsg('Start with step 1: publish the sample project.');
            curStep = 0;
        }
        setLoggedIn(true);
        setFlowStep(curStep);
        setModal(null);
        if (curStep === 0) {
            setRoleState('admin');
            setScreenState('a-create');
            setEditingId(null);
            setDraft(blankDraft(Date.now()));
            setDraftErr({});
        }
        else if (curStep === 1) {
            setRoleState('designer');
            setScreenState('d-brief');
            if (flowId)
                setPid(flowId);
            setEditingBid(false);
            setJustPlaced(false);
            setBid(blankBid());
            setBidErr({});
        }
        else if (curStep === 2) {
            setRoleState('admin');
            setScreenState('a-project');
            if (flowId)
                setPid(flowId);
            setTab('overview');
        }
        else if (curStep === 3) {
            setRoleState('admin');
            setScreenState('a-project');
            if (flowId)
                setPid(flowId);
            setTab('bids');
            setBidsPreview('live');
        }
        else if (curStep === 4) {
            setRoleState('designer');
            setScreenState('d-work');
            if (flowId)
                setPid(flowId);
            setPending([]);
        }
        else if (curStep === 5) {
            setRoleState('admin');
            setScreenState('a-project');
            if (flowId)
                setPid(flowId);
            setTab('delivery');
            setVer(null);
            setFileIdx(0);
        }
        top();
    }, [flowId, toastMsg, top]);
    const resetAll = useCallback(() => {
        const freshSeed = seed(Date.now());
        setDesigners(freshSeed.designers);
        setProjects(freshSeed.projects);
        setPayments(freshSeed.payments);
        setScreenState(role === 'admin' ? 'a-dash' : 'd-home');
        setModal(null);
        setPid('P3');
        setTab('overview');
        setBidsPreview('live');
        setDraft(blankDraft(Date.now()));
        setDraftErr({});
        setEditingId(null);
        setBid(blankBid());
        setBidErr({});
        setEditingBid(false);
        setJustPlaced(false);
        setPending([]);
        setFlowId(null);
        setFlowStep(-1);
        toastMsg('Prototype state reset to default.');
        top();
    }, [role, toastMsg, top]);
    return (<HubContext.Provider value={{
            role,
            screen,
            loggedIn,
            isNarrow,
            isMobile,
            chrome: propChrome,
            pid,
            tab,
            meId,
            did,
            now,
            t0,
            designers,
            projects,
            setProjects,
            payments,
            login,
            showForgot,
            pf,
            draft,
            draftErr,
            editingId,
            bidsPreview,
            modal,
            md,
            reason,
            reasonErr,
            revNote,
            revErr,
            ver,
            fileIdx,
            comment,
            bid,
            bidErr,
            editingBid,
            justPlaced,
            pending,
            nd,
            ndErr,
            ndDone,
            ndPwI,
            ndNewId,
            pw,
            pwErr,
            pwFrom,
            prof,
            payF,
            toast,
            flowId,
            flowStep,
            go,
            toastMsg,
            setRole,
            setScreen: setScreenState,
            signOut,
            signIn,
            toggleForgot,
            onLoginEmail,
            onLoginPw,
            openProject,
            openBrief,
            openWork,
            setPf,
            clearFilters,
            setDraft,
            addDraftRef,
            removeDraftRef,
            addDraftClientFile,
            removeDraftClientFile,
            toggleDraftDesigner,
            publish,
            editProject,
            setBidsPreview,
            setTab,
            setVer,
            setFileIdx,
            setComment,
            sendComment,
            endBidding,
            reopen,
            doAward,
            approve,
            requestRevision,
            markPaid,
            setBid,
            submitBid,
            editBid,
            cancelEditBid,
            withdraw,
            addPending,
            removePending,
            submitWork,
            setDid,
            toggleDesignerActive,
            adjustDesignerLimit,
            resetDesignerPw,
            setNd,
            toggleNdSkill,
            regenNdPw,
            copyNdPw,
            submitNd,
            ndAnother,
            setPw,
            savePw,
            setProf,
            saveProfile,
            setPayF,
            openAwardModal,
            openAwardOtherModal,
            openApproveModal,
            openRevisionModal,
            openWithdrawModal,
            closeModal,
            setReason,
            setRevNote,
            gotoStep,
            resetAll,
        }}>
      {children}
    </HubContext.Provider>);
};
export const useHub = () => {
    const context = useContext(HubContext);
    if (!context) {
        throw new Error('useHub must be used within a HubProvider');
    }
    return context;
};
