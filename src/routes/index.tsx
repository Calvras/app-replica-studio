import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Bell, Search, Plus, ChevronLeft, Phone, Video, MoreHorizontal, Smile, Mic,
  Send, Play, CheckCheck, Check, CircleDashed, MessagesSquare, Settings,
  PhoneCall, PhoneIncoming, PhoneMissed, PhoneOutgoing, Clock,
  ChevronRight, Moon, Bell as BellIcon, Shield, Lock, HelpCircle,
  LogOut, Palette, Globe, MessageSquare, Camera, Edit2, Star, Archive,
  Volume2, Vibrate, BellOff, Fingerprint, Eye, Database,
  Info, QrCode, Zap, Users, Laptop, Heart, Key,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chat — Messages" },
      { name: "description", content: "A clean mobile chat app." },
      { property: "og:title", content: "Chat — Messages" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const av = (g: "men" | "women", n: number) =>
  `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

const stories = [
  { name: "Khalid", img: av("men", 32) },
  { name: "Waren",  img: av("men", 45) },
  { name: "Robert", img: av("men", 75) },
  { name: "Fisher", img: av("men", 22) },
];

const chats = [
  { name: "Marvin McKinney", msg: "Provide Me A New Project", time: "9:30 AM", unread: 1, img: av("men", 11) },
  { name: "Courtney Henry",  msg: "Project is Done",          time: "9:15 AM", unread: 1, img: av("women", 44) },
  { name: "Jsne Cooper",     msg: "Typing...",                time: "8:50 AM",             img: av("women", 65) },
  { name: "Robert Fox",      msg: "Provide Me A New Project", time: "8:00 AM",             img: av("men", 75) },
  { name: "Arlene McCoy",    msg: "Review The UI Updates ?",  time: "7:40 AM",             img: av("men", 52) },
  { name: "Dianne Russell",  msg: "Didn't Get Your Point",    time: "7:40 AM",             img: av("women", 21) },
  { name: "Kevin Howard",    msg: "See you tomorrow",         time: "7:55 AM",             img: av("women", 33) },
];

type CallEntry = {
  name: string; img: string;
  type: "incoming" | "outgoing" | "missed";
  kind: "voice" | "video";
  date: string; duration?: string;
};

const calls: CallEntry[] = [
  { name: "Marvin McKinney", img: av("men", 11),    type: "incoming", kind: "voice",  date: "Today",        duration: "12:34" },
  { name: "Courtney Henry",  img: av("women", 44),  type: "outgoing", kind: "video",  date: "Today",        duration: "4:02"  },
  { name: "Robert Fox",      img: av("men", 75),    type: "missed",   kind: "voice",  date: "Yesterday"                       },
  { name: "Arlene McCoy",    img: av("men", 52),    type: "outgoing", kind: "voice",  date: "Yesterday",    duration: "28:11" },
  { name: "Jsne Cooper",     img: av("women", 65),  type: "incoming", kind: "video",  date: "Yesterday",    duration: "7:55"  },
  { name: "Dianne Russell",  img: av("women", 21),  type: "missed",   kind: "voice",  date: "Mon, Oct 28"                     },
  { name: "Kevin Howard",    img: av("women", 33),  type: "outgoing", kind: "voice",  date: "Mon, Oct 28",  duration: "3:18"  },
  { name: "Waren",           img: av("men", 45),    type: "incoming", kind: "voice",  date: "Sun, Oct 27",  duration: "1:05"  },
];

type Msg = { me: boolean; text?: string; time: string; voice?: boolean };
type Tab = "updates" | "calls" | "chats" | "settings";

// ─── Page transition wrapper ──────────────────────────────────────────────────
// "tab"  → fade + tiny slide up  (switching between bottom-nav tabs)
// "push" → slide in from the right (drilling into a sub-page)
// "pop"  → slide in from the left  (going back)
type TransitionKind = "tab" | "push" | "pop";

function Animated({ children, id, kind }: { children: React.ReactNode; id: string; kind: TransitionKind }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const anim =
      kind === "push" ? "slideInRight 0.28s cubic-bezier(0.32,0.72,0,1) both" :
      kind === "pop"  ? "slideInLeft  0.28s cubic-bezier(0.32,0.72,0,1) both" :
                        "fadeUp       0.22s ease both";
    el.style.animation = anim;
    return () => { el.style.animation = ""; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div ref={ref} className="h-full w-full">
      {children}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, size = 56, online }: { src: string; size?: number; online?: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <img src={src} alt="" className="h-full w-full rounded-full object-cover" />
      {online && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-online" />}
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/85 p-1.5 shadow-xl backdrop-blur-md">
      {([
        { id: "updates"  as Tab, l: "Updates",  I: CircleDashed,  dot: true  },
        { id: "calls"    as Tab, l: "Calls",    I: Phone                      },
        { id: "chats"    as Tab, l: "Chats",    I: MessagesSquare, badge: 2   },
        { id: "settings" as Tab, l: "Settings", I: Settings                   },
      ] as const).map(({ id, l, I, dot, badge }) => (
        <button
          key={id}
          onClick={() => onTab(id)}
          className={`relative flex w-20 flex-col items-center gap-0.5 rounded-full py-2 text-xs font-medium transition-colors ${tab === id ? "bg-muted text-foreground" : "text-muted-foreground"}`}
        >
          <I className="h-6 w-6" />
          {dot   && <span className="absolute right-6 top-1.5 h-2.5 w-2.5 rounded-full bg-online" />}
          {badge && <span className="absolute right-3 top-0.5 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{badge}</span>}
          {l}
        </button>
      ))}
    </nav>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [prevTab, setPrevTab] = useState<Tab>("chats");
  const [open, setOpen] = useState<number | null>(null);

  const handleTab = (t: Tab) => { setPrevTab(tab); setTab(t); };

  return (
    <>
      {/* Keyframes injected once as a style tag */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
      `}</style>

      <div className="mx-auto h-dvh max-w-2xl overflow-hidden bg-background">
        {tab === "chats" && open === null && (
          <Animated id="chats" kind="tab">
            <ChatList onOpen={(i) => setOpen(i)} tab={tab} onTab={handleTab} />
          </Animated>
        )}
        {tab === "chats" && open !== null && (
          <Animated id={`conv-${open}`} kind="push">
            <Conversation c={chats[open]!} onBack={() => setOpen(null)} />
          </Animated>
        )}
        {tab === "calls" && (
          <Animated id="calls" kind="tab">
            <CallsPage tab={tab} onTab={handleTab} />
          </Animated>
        )}
        {tab === "settings" && (
          <Animated id="settings" kind="tab">
            <SettingsPage tab={tab} onTab={handleTab} />
          </Animated>
        )}
        {tab === "updates" && (
          <Animated id="updates" kind="tab">
            <UpdatesPage tab={tab} onTab={handleTab} />
          </Animated>
        )}
      </div>
    </>
  );
}

// ─── Updates ──────────────────────────────────────────────────────────────────
function UpdatesPage({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const statuses = [
    { name: "Marvin McKinney", img: av("men", 11),   time: "2 min ago",  seen: false },
    { name: "Courtney Henry",  img: av("women", 44), time: "15 min ago", seen: false },
    { name: "Robert Fox",      img: av("men", 75),   time: "1 hr ago",   seen: true  },
    { name: "Arlene McCoy",    img: av("men", 52),   time: "3 hrs ago",  seen: true  },
    { name: "Jsne Cooper",     img: av("women", 65), time: "5 hrs ago",  seen: true  },
  ];
  return (
    <div className="relative h-full overflow-y-auto pb-32">
      <div className="flex items-center justify-between px-5 pt-5">
        <h1 className="text-3xl font-semibold">Updates</h1>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"><Camera className="h-5 w-5" /></button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"><Edit2 className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="mx-5 mt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">My Status</p>
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar src={av("men", 86)} size={56} />
            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus className="h-3 w-3" /></span>
          </div>
          <div>
            <p className="font-medium">My status</p>
            <p className="text-sm text-muted-foreground">Tap to add status update</p>
          </div>
        </div>
      </div>
      <div className="mt-6 px-5"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Updates</p></div>
      <ul>
        {statuses.filter(s => !s.seen).map((s) => (
          <li key={s.name} className="flex cursor-pointer items-center gap-4 pl-5 hover:bg-muted/50">
            <div className="h-14 w-14 shrink-0 rounded-full p-[3px]" style={{ background: "conic-gradient(var(--color-primary) 0%, var(--color-primary) 70%, var(--color-muted) 70%)" }}>
              <img src={s.img} alt="" className="h-full w-full rounded-full object-cover" />
            </div>
            <div className="flex flex-1 items-center border-b py-4 pr-5">
              <div className="flex-1"><p className="font-medium">{s.name}</p><p className="text-sm text-muted-foreground">{s.time}</p></div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-2 px-5"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Viewed Updates</p></div>
      <ul>
        {statuses.filter(s => s.seen).map((s) => (
          <li key={s.name} className="flex cursor-pointer items-center gap-4 pl-5 hover:bg-muted/50">
            <div className="h-14 w-14 shrink-0 rounded-full p-[3px]" style={{ background: "conic-gradient(var(--color-muted-foreground) 0%, var(--color-muted-foreground) 100%)" }}>
              <img src={s.img} alt="" className="h-full w-full rounded-full object-cover ring-2 ring-background" />
            </div>
            <div className="flex flex-1 items-center border-b py-4 pr-5">
              <div className="flex-1"><p className="font-medium text-muted-foreground">{s.name}</p><p className="text-sm text-muted-foreground">{s.time}</p></div>
            </div>
          </li>
        ))}
      </ul>
      <BottomNav tab={tab} onTab={onTab} />
    </div>
  );
}

// ─── Calls ────────────────────────────────────────────────────────────────────
function CallsPage({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const [filter, setFilter] = useState<"all" | "missed">("all");
  const filtered = filter === "missed" ? calls.filter(c => c.type === "missed") : calls;
  const grouped = filtered.reduce<Record<string, CallEntry[]>>((acc, c) => {
    (acc[c.date] ??= []).push(c); return acc;
  }, {});

  const CallIcon = ({ type }: { type: CallEntry["type"] }) =>
    type === "incoming" ? <PhoneIncoming className="h-4 w-4 text-online" /> :
    type === "outgoing" ? <PhoneOutgoing className="h-4 w-4 text-muted-foreground" /> :
                          <PhoneMissed className="h-4 w-4 text-destructive" />;

  return (
    <div className="relative h-full overflow-y-auto pb-32">
      <div className="flex items-center justify-between px-5 pt-5">
        <h1 className="text-3xl font-semibold">Calls</h1>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"><Search className="h-5 w-5" /></button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"><PhoneCall className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="flex gap-2 px-5 pt-4">
        {(["all", "missed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {f === "all" ? "All" : "Missed"}
          </button>
        ))}
      </div>
      <div className="mt-5 px-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Favourites</p>
        <div className="flex gap-5 overflow-x-auto pb-1">
          {chats.slice(0, 4).map((c) => (
            <button key={c.name} className="flex flex-col items-center gap-1.5">
              <Avatar src={c.img} size={54} online />
              <span className="w-14 truncate text-center text-xs font-medium">{c.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5">
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date}>
            <p className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{date}</p>
            <ul>
              {entries.map((c, i) => (
                <li key={i} className="flex items-center gap-4 pl-5 hover:bg-muted/50">
                  <Avatar src={c.img} size={50} />
                  <div className="flex flex-1 items-center border-b py-3.5 pr-5">
                    <div className="flex-1">
                      <p className={`font-medium ${c.type === "missed" ? "text-destructive" : ""}`}>{c.name}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <CallIcon type={c.type} />
                        <span className="text-sm text-muted-foreground capitalize">{c.kind} call</span>
                        {c.duration && <><span className="text-muted-foreground">·</span><Clock className="h-3 w-3 text-muted-foreground" /><span className="text-sm text-muted-foreground">{c.duration}</span></>}
                      </div>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
                      {c.kind === "voice" ? <Phone className="h-5 w-5 text-primary" /> : <Video className="h-5 w-5 text-primary" />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <BottomNav tab={tab} onTab={onTab} />
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
type SettingsSection = "main" | "notifications" | "privacy" | "appearance";

// Scoped tokens for the settings warm-light surface
const S = {
  page:    "bg-[#f0ebe4]",
  card:    "bg-white",
  divider: "divide-[#ebebeb]",
  border:  "border-[#e4e0db]",
  icon:    "text-[#444]",
  label:   "text-[#111]",
  sub:     "text-[#888]",
  chevron: "text-[#bbb]",
};

function SettingsPage({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const [section,    setSection]    = useState<SettingsSection>("main");
  const [notifSound, setNotifSound] = useState(true);
  const [notifVib,   setNotifVib]   = useState(true);
  const [notifPrev,  setNotifPrev]  = useState(true);
  const [muteAll,    setMuteAll]    = useState(false);
  const [lastSeen,   setLastSeen]   = useState(true);
  const [receipts,   setReceipts]   = useState(true);
  const [onlineSt,   setOnlineSt]   = useState(true);
  const [biometric,  setBiometric]  = useState(false);
  const [darkMode,   setDarkMode]   = useState(false);

  const goTo   = (s: SettingsSection) => setSection(s);
  const goBack = () => setSection("main");
  const kind: TransitionKind = section === "main" ? "pop" : "push";

  return (
    <Animated id={section} kind={kind}>

      {/* ── Notifications ── */}
      {section === "notifications" && (
        <SPage title="Notifications" onBack={goBack} tab={tab} onTab={onTab}>
          <SWCard>
            <SWTRow icon={Volume2} label="Message sound"   value={notifSound} onChange={setNotifSound} />
            <SWTRow icon={Vibrate} label="Vibration"        value={notifVib}   onChange={setNotifVib}   />
            <SWTRow icon={Eye}     label="Show preview"     value={notifPrev}  onChange={setNotifPrev}  />
            <SWTRow icon={BellOff} label="Mute all"         value={muteAll}    onChange={setMuteAll}    />
          </SWCard>
          <SWCard>
            <SWTRow icon={Phone}   label="Ringtone"         value={true}       onChange={() => {}}      />
            <SWTRow icon={Vibrate} label="Vibrate on call"  value={true}       onChange={() => {}}      />
          </SWCard>
        </SPage>
      )}

      {/* ── Privacy ── */}
      {section === "privacy" && (
        <SPage title="Privacy" onBack={goBack} tab={tab} onTab={onTab}>
          <SWCard>
            <SWTRow icon={Clock}       label="Last seen"             value={lastSeen}  onChange={setLastSeen}  />
            <SWTRow icon={CheckCheck}  label="Read receipts"         value={receipts}  onChange={setReceipts}  />
            <SWTRow icon={Eye}         label="Online status"         value={onlineSt}  onChange={setOnlineSt}  />
          </SWCard>
          <SWCard>
            <SWTRow icon={Fingerprint} label="Biometric lock"        value={biometric} onChange={setBiometric} />
            <SWLRow icon={Lock}        label="Two-step verification" />
            <SWLRow icon={Shield}      label="Blocked contacts"      badge="3" />
          </SWCard>
          <SWCard>
            <SWLRow icon={Database} label="Manage storage" />
            <SWLRow icon={Archive}  label="Chat backup" />
          </SWCard>
        </SPage>
      )}

      {/* ── Appearance ── */}
      {section === "appearance" && (
        <SPage title="Appearance" onBack={goBack} tab={tab} onTab={onTab}>
          <SWCard>
            <SWTRow icon={Moon} label="Dark mode" value={darkMode} onChange={setDarkMode} />
          </SWCard>
          <p className="px-1 pt-1 pb-2 text-xs font-semibold uppercase tracking-wider text-[#888]">Chat wallpaper</p>
          <SWCard>
            <div className="grid grid-cols-4 gap-3 p-4">
              {[
                "#f2ede8","#ddeaf5","#f5ddf5","#ddf5e2",
                "#f5eedd","#e0ddf5","#f5dddd","#ddf5f0",
              ].map((bg, i) => (
                <button key={i}
                  className={`h-14 rounded-xl transition-all ${i === 0 ? "ring-2 ring-[#208060] ring-offset-2 scale-105" : "hover:scale-105"}`}
                  style={{ background: bg }} />
              ))}
            </div>
          </SWCard>
          <p className="px-1 pt-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#888]">Font size</p>
          <SWCard>
            <div className="flex items-center gap-4 px-4 py-4">
              <span className="text-xs font-medium text-[#888]">A</span>
              <div className="relative flex-1">
                <div className="h-1 w-full rounded-full bg-[#e4e0db]">
                  <div className="h-1 w-1/2 rounded-full bg-[#111]" />
                </div>
                <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111] shadow" />
              </div>
              <span className="text-lg font-medium text-[#888]">A</span>
            </div>
          </SWCard>
          <SWCard>
            <SWLRow icon={Globe} label="App language" value="English" />
          </SWCard>
        </SPage>
      )}

      {/* ── Main ── */}
      {section === "main" && (
        <div className={`relative h-full overflow-y-auto pb-32 ${S.page}`}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-6 pb-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5">
              <Search className={`h-5 w-5 ${S.icon}`} />
            </button>
            <h1 className={`text-[17px] font-semibold ${S.label}`}>Settings</h1>
            <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5">
              <QrCode className={`h-5 w-5 ${S.icon}`} />
            </button>
          </div>

          <div className="space-y-4 px-4">

            {/* Profile card */}
            <button className={`flex w-full items-center gap-3.5 rounded-2xl ${S.card} px-4 py-3.5 shadow-sm transition-colors active:bg-black/5`}>
              <div className="relative shrink-0">
                <img src={av("men", 86)} alt="" className="h-[54px] w-[54px] rounded-full object-cover" />
                <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-online" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className={`text-[16px] font-semibold leading-tight ${S.label}`}>Alex Johnson</p>
                <p className={`text-[13px] ${S.sub}`}>@alexjohnson</p>
              </div>
              <ChevronRight className={`h-4 w-4 shrink-0 ${S.chevron}`} />
            </button>

            {/* Group 1 */}
            <SWCard>
              <SWLRow icon={Star}          label="Starred" />
              <SWLRow icon={MessageSquare} label="Broadcast messages" />
              <SWLRow icon={Users}         label="Communities" />
              <SWLRow icon={Laptop}        label="Linked devices" />
            </SWCard>

            {/* Group 2 */}
            <SWCard>
              <SWLRow icon={Key}      label="Account"          onPress={() => {}}                    />
              <SWLRow icon={Lock}     label="Privacy"          onPress={() => goTo("privacy")}        />
              <SWLRow icon={MessageSquare} label="Chats"       onPress={() => {}}                    />
              <SWLRow icon={Palette}  label="Appearance"       onPress={() => goTo("appearance")}    />
              <SWLRow icon={BellIcon} label="Notifications"    onPress={() => goTo("notifications")} />
              <SWLRow icon={Database} label="Storage and data" onPress={() => {}}                    />
            </SWCard>

            {/* Group 3 */}
            <SWCard>
              <SWLRow icon={HelpCircle} label="Help and feedback" />
              <SWLRow icon={Heart}      label="Invite a contact" />
            </SWCard>

            {/* Log out */}
            <SWCard>
              <button className="flex w-full items-center gap-4 px-4 py-3.5 transition-colors active:bg-black/5">
                <LogOut className="h-5 w-5 shrink-0 text-red-500" />
                <span className="flex-1 text-left text-[15px] text-red-500">Log out</span>
              </button>
            </SWCard>

          </div>

          <BottomNav tab={tab} onTab={onTab} />
        </div>
      )}

    </Animated>
  );
}

// ─── Settings sub-page shell ──────────────────────────────────────────────────
function SPage({ title, onBack, tab, onTab, children }: {
  title: string; onBack: () => void; tab: Tab; onTab: (t: Tab) => void; children: React.ReactNode;
}) {
  return (
    <div className={`relative h-full overflow-y-auto pb-32 ${S.page}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 flex items-center justify-between ${S.page}/95 px-4 py-3 backdrop-blur`}>
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5">
          <ChevronLeft className={`h-5 w-5 ${S.icon}`} />
        </button>
        <h1 className={`text-[17px] font-semibold ${S.label}`}>{title}</h1>
        <div className="w-9" />
      </div>
      <div className="space-y-4 px-4 pt-3">{children}</div>
      <BottomNav tab={tab} onTab={onTab} />
    </div>
  );
}

// ─── Settings primitives (warm-surface versions) ──────────────────────────────
function SWCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={`overflow-hidden rounded-2xl ${S.card} shadow-sm ${S.divider} divide-y`}>
      {children}
    </div>
  );
}

function SWLRow({ icon: Icon, label, value, badge, onPress }: {
  icon: React.ElementType; label: string; value?: string; badge?: string; onPress?: () => void;
}) {
  return (
    <button onClick={onPress} className="flex w-full items-center gap-4 px-4 py-3.5 transition-colors active:bg-black/5">
      <Icon className={`h-[19px] w-[19px] shrink-0 ${S.icon}`} strokeWidth={1.8} />
      <span className={`flex-1 text-left text-[15px] ${S.label}`}>{label}</span>
      {badge && <span className="mr-0.5 rounded-full bg-[#208060] px-2 py-0.5 text-[11px] font-bold text-white">{badge}</span>}
      {value && <span className={`text-sm ${S.sub}`}>{value}</span>}
      <ChevronRight className={`h-[15px] w-[15px] shrink-0 ${S.chevron}`} />
    </button>
  );
}

function SWTRow({ icon: Icon, label, value, onChange }: {
  icon: React.ElementType; label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex w-full items-center gap-4 px-4 py-3.5">
      <Icon className={`h-[19px] w-[19px] shrink-0 ${S.icon}`} strokeWidth={1.8} />
      <span className={`flex-1 text-[15px] ${S.label}`}>{label}</span>
      <button role="switch" aria-checked={value} onClick={() => onChange(!value)}
        className={`relative inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${value ? "bg-[#34c759]" : "bg-[#d1d1d6]"}`}>
        <span className={`absolute top-[2px] h-[26px] w-[26px] rounded-full bg-white shadow-md transition-all duration-200 ${value ? "left-[23px]" : "left-[2px]"}`} />
      </button>
    </div>
  );
}

// ─── Chat List ────────────────────────────────────────────────────────────────
function ChatList({ onOpen, tab, onTab }: { onOpen: (i: number) => void; tab: Tab; onTab: (t: Tab) => void }) {
  return (
    <div className="relative h-full overflow-y-auto pb-32">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-4">
          <Avatar src={av("men", 86)} size={50} />
          <h1 className="text-3xl font-semibold">Chat</h1>
        </div>
        <Bell className="h-6 w-6" />
      </div>
      <div className="mx-5 mt-5 flex items-center gap-3 rounded-full bg-muted px-4 py-3 text-muted-foreground">
        <Search className="h-5 w-5" />
        <input placeholder="Search" className="flex-1 bg-transparent text-lg outline-none" />
      </div>
      <div className="flex gap-4 overflow-x-auto px-5 pt-5 pb-3">
        <div className="flex flex-col items-center gap-2">
          <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus className="h-8 w-8" /></button>
          <span className="text-sm font-medium">New</span>
        </div>
        {stories.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-2">
            <Avatar src={s.img} size={64} online />
            <span className="text-sm font-medium">{s.name}</span>
          </div>
        ))}
      </div>
      <ul>
        {chats.map((c, i) => (
          <li key={c.name} onClick={() => onOpen(i)} className="flex cursor-pointer items-center gap-4 pl-5 hover:bg-muted/50 active:bg-muted/70 transition-colors">
            <Avatar src={c.img} size={56} online />
            <div className="flex flex-1 items-center border-b py-4 pr-5">
              <div className="flex-1">
                <p className="text-lg font-medium">{c.name}</p>
                <p className="text-muted-foreground">{c.msg}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm text-muted-foreground">{c.time}</span>
                {c.unread ? <span className="rounded bg-primary px-1.5 text-xs font-semibold text-primary-foreground">{c.unread}</span> : <span className="h-4" />}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <BottomNav tab={tab} onTab={onTab} />
    </div>
  );
}

// ─── Conversation ─────────────────────────────────────────────────────────────
function Conversation({ c, onBack }: { c: (typeof chats)[number]; onBack: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { me: true,  text: "Hi, Ready to Begin! Everything's set up and your tasks are in place. Jump in, stay motivated, and start making real progress on your goals today!", time: "10:29 AM" },
    { me: false, text: "That's right! Let's review the main ideas and organize the structure of the presentation.", time: "10:42 AM" },
    { me: false, voice: true, time: "11:15 AM" },
    { me: false, text: "Okay, let's organize the presentation into essential parts: Introduction, Product Overview, Features and Benefits, Use Cases, and Conclusion.", time: "11:16 AM" },
  ]);
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMsgs(m => [...m, { me: true, text, time }]);
    setText("");
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur">
        <button onClick={onBack}><ChevronLeft className="h-7 w-7" /></button>
        <Avatar src={c.img} size={50} online />
        <div className="flex-1"><p className="text-lg font-medium">{c.name}</p><p className="text-sm text-muted-foreground">Online</p></div>
        <div className="flex items-center gap-1">
          {[Phone, Video, MoreHorizontal].map((I, k) => (
            <button key={k} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"><I className="h-5 w-5" /></button>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <div className="flex justify-center"><span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Today</span></div>
        {msgs.map((m, i) =>
          m.voice ? (
            <div key={i} className="flex items-end gap-2">
              <div className="w-72 max-w-[75%] rounded-3xl rounded-bl-md bg-bubble px-3 py-2.5 text-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Play className="h-5 w-5 fill-current" /></span>
                  <div className="flex flex-1 items-center justify-between overflow-hidden">
                    {Array.from({ length: 28 }).map((_, k) => <span key={k} className="w-[3px] shrink-0 rounded bg-primary" style={{ height: 6 + ((k * 7) % 18) }} />)}
                  </div>
                </div>
                <div className="mt-1 flex justify-between pl-[52px] text-xs text-muted-foreground">
                  <span>1:10</span><span className="flex items-center gap-1">{m.time}<Check className="h-4 w-4" /></span>
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-3xl px-4 py-2.5 text-[15px] leading-relaxed ${m.me ? "rounded-br-md bg-sent text-sent-foreground" : "rounded-bl-md bg-bubble text-foreground"}`}>
                {m.text}
                <div className={`mt-1 flex items-center justify-end gap-1 text-xs ${m.me ? "opacity-90" : "text-muted-foreground"}`}>
                  {m.time}{m.me && <CheckCheck className="h-4 w-4" />}
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <div className="flex items-center gap-2 border-t bg-background px-3 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] pt-3">
        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-muted"><Plus className="h-6 w-6" /></button>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border bg-muted px-3 py-2.5">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message..." className="min-w-0 flex-1 bg-transparent text-base outline-none" />
          <Smile className="h-5 w-5 shrink-0" /><span className="h-5 w-px shrink-0 bg-border" /><Mic className="h-5 w-5 shrink-0" />
        </div>
        <button onClick={send} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Send className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
