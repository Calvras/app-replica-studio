import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell, Search, Plus, ChevronLeft, Phone, Video, MoreHorizontal, Smile, Mic,
  Send, Play, CheckCheck, Check, CircleDashed, MessagesSquare, Settings,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chat — Messages" },
      { name: "description", content: "A clean mobile chat app with stories, conversations and voice notes." },
      { property: "og:title", content: "Chat — Messages" },
      { property: "og:description", content: "A clean mobile chat app with stories, conversations and voice notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const av = (g: "men" | "women", n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

const stories = [
  { name: "Khalid", img: av("men", 32) },
  { name: "Waren", img: av("men", 45) },
  { name: "Robert", img: av("men", 75) },
  { name: "Fisher", img: av("men", 22) },
];

const chats = [
  { name: "Marvin McKinney", msg: "Provide Me A New Project", time: "9:30 AM", unread: 1, img: av("men", 11) },
  { name: "Courtney Henry", msg: "Project is Done", time: "9:15 AM", unread: 1, img: av("women", 44) },
  { name: "Jsne Cooper", msg: "Typing...", time: "8:50 AM", img: av("women", 65) },
  { name: "Robert Fox", msg: "Provide Me A New Project", time: "8:00 AM", img: av("men", 75) },
  { name: "Arlene McCoy", msg: "Review The UI Updates ?", time: "7:40 AM", img: av("men", 52) },
  { name: "Dianne Russell", msg: "Didn't Get Your Point", time: "7:40 AM", img: av("women", 21) },
  { name: "Kevin Howard", msg: "See you tomorrow", time: "7:55 AM", img: av("women", 33) },
];

type Msg = { me: boolean; text?: string; time: string; voice?: boolean };

function Avatar({ src, size = 56, online }: { src: string; size?: number; online?: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <img src={src} alt="" className="h-full w-full rounded-full object-cover" />
      {online && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-online" />}
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mx-auto h-dvh max-w-2xl overflow-hidden bg-background">
      {open === null ? <ChatList onOpen={setOpen} /> : <Conversation c={chats[open]!} onBack={() => setOpen(null)} />}
    </div>
  );
}

function ChatList({ onOpen }: { onOpen: (i: number) => void }) {
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
        <Search className="h-5 w-5" /><input placeholder="Search" className="flex-1 bg-transparent text-lg outline-none" />
      </div>
      <div className="flex gap-4 overflow-x-auto px-5 pt-5 pb-3">
        <div className="flex flex-col items-center gap-2">
          <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Plus className="h-8 w-8" /></button>
          <span className="text-sm font-medium">New</span>
        </div>
        {stories.map((s) => (
          <div key={s.name} className="flex flex-col items-center gap-2">
            <Avatar src={s.img} size={64} online /><span className="text-sm font-medium">{s.name}</span>
          </div>
        ))}
      </div>
      <ul>
        {chats.map((c, i) => (
          <li key={c.name} onClick={() => onOpen(i)} className="flex cursor-pointer items-center gap-4 pl-5 hover:bg-muted/50">
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
      <nav className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/85 p-1.5 shadow-xl backdrop-blur-md">
        {[
          { l: "Updates", I: CircleDashed, dot: true },
          { l: "Calls", I: Phone },
          { l: "Chats", I: MessagesSquare, badge: 2, active: true },
          { l: "Settings", I: Settings },
        ].map(({ l, I, dot, badge, active }) => (
          <button key={l} className={`relative flex w-20 flex-col items-center gap-0.5 rounded-full py-2 text-xs font-medium ${active ? "bg-muted text-foreground" : "text-muted-foreground"}`}>
            <I className="h-6 w-6" />
            {dot && <span className="absolute right-6 top-1.5 h-2.5 w-2.5 rounded-full bg-online" />}
            {badge && <span className="absolute right-3 top-0.5 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{badge}</span>}
            {l}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Conversation({ c, onBack }: { c: (typeof chats)[number]; onBack: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { me: true, text: "Hi, Ready to Begin! Everything's set up and your tasks are in place. Jump in, stay motivated, and start making real progress on your goals today!", time: "10:29 AM" },
    { me: false, text: "That's right! Let's review the main ideas and organize the structure of the presentation.", time: "10:42 AM" },
    { me: false, voice: true, time: "11:15 AM" },
    { me: false, text: "Okay, let's organize the presentation into essential parts: Introduction, Product Overview, Features and Benefits, Use Cases, and Conclusion.", time: "11:16 AM" },
  ]);
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMsgs([...msgs, { me: true, text, time }]);
    setText("");
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur">
        <button onClick={onBack}><ChevronLeft className="h-7 w-7" /></button>
        <Avatar src={c.img} size={50} online />
        <div className="flex-1"><p className="text-lg font-medium">{c.name}</p><p className="text-sm text-muted-foreground">Online</p></div>
        <div className="flex items-center gap-1">{[Phone, Video, MoreHorizontal].map((I, k) => <button key={k} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"><I className="h-5 w-5" /></button>)}</div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <div className="flex justify-center"><span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Today</span></div>
        {msgs.map((m, i) =>
          m.voice ? (
            <div key={i} className="flex items-end gap-2">
              <Avatar src={c.img} size={32} />
              <div className="w-72 max-w-[75%] rounded-3xl rounded-bl-md bg-bubble px-3 py-2.5 text-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Play className="h-5 w-5 fill-current" /></span>
                  <div className="flex flex-1 items-center justify-between overflow-hidden">
                    {Array.from({ length: 28 }).map((_, k) => <span key={k} className="w-[3px] shrink-0 rounded bg-primary" style={{ height: 6 + ((k * 7) % 18) }} />)}
                  </div>
                </div>
                <div className="mt-1 flex justify-between pl-[52px] text-xs text-muted-foreground"><span>1:10</span><span className="flex items-center gap-1">{m.time}<Check className="h-4 w-4" /></span></div>
              </div>
            </div>
          ) : (
            <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-3xl px-4 py-2.5 text-[15px] leading-relaxed ${m.me ? "rounded-br-md bg-sent text-sent-foreground" : "rounded-bl-md bg-bubble text-foreground"}`}>
                {m.text}
                <div className={`mt-1 flex items-center justify-end gap-1 text-xs ${m.me ? "opacity-90" : "text-muted-foreground"}`}>{m.time}{m.me && <CheckCheck className="h-4 w-4" />}</div>
              </div>
            </div>
          ),
        )}
      </div>
      <div className="flex items-center gap-2 border-t bg-background px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <button className="flex h-12 w-12 items-center justify-center rounded-full border bg-muted"><Plus className="h-6 w-6" /></button>
        <div className="flex flex-1 items-center gap-2 rounded-full border bg-muted px-4 py-2.5">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message..." className="min-w-0 flex-1 bg-transparent text-lg outline-none" />
          <Smile className="h-6 w-6" /><span className="h-6 w-px bg-border" /><Mic className="h-6 w-6" />
        </div>
        <button onClick={send} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Send className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
