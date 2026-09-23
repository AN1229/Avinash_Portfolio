"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Download,
  ExternalLink,
  FileText,
  Mail,
  SendHorizontal,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LinkedinIcon } from "@/components/icons";
import { personal } from "@/lib/data";

const EMPTY = { name: "", email: "", subject: "", message: "", company: "" };

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  // Which address was just copied, so only that one says so.
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  // Typing again means they are writing a second message, so the confirmation
  // for the first one gets out of the way.
  const set = (field: keyof typeof EMPTY) => (value: string) => {
    setStatus((prev) => (prev === "sending" ? prev : "idle"));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const copyEmail = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(address);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.location.assign(`mailto:${address}`);
    }
  };

  /** Hands the message to the visitor's own mail client, filled in. */
  const composeInMailClient = () => {
    const subject = form.subject || `Portfolio enquiry from ${form.name}`;
    const body = `${form.message}\n\n— ${form.name}\n${form.email}`;
    window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  /**
   * Posts the message, and falls back to composing it if the send cannot
   * happen — no API key configured, provider down, offline. A contact form that
   * silently fails is worse than one that hands the visitor a draft.
   */
  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus("sent");
        setForm(EMPTY);
        // The confirmation is a message, not a state to be left in: without
        // this the button read "Message sent" for the rest of the visit.
        clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setStatus("idle"), 6000);
        return;
      }

      // Too many messages is the one failure where handing them a draft would
      // just route around the limit.
      if (response.status === 429) {
        setStatus("error");
        return;
      }

      composeInMailClient();
      setStatus("idle");
    } catch {
      composeInMailClient();
      setStatus("idle");
    }
  };

  const links = [
    personal.linkedin && {
      href: personal.linkedin,
      label: "LinkedIn",
      detail: "Connect",
      Icon: LinkedinIcon,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    detail: string;
    Icon: typeof Mail;
  }[];

  return (
    <section
      id="contact"
      className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:pb-32 md:pt-24"
    >
      {/* The heading sits inside the left column rather than above both, so the
          form starts level with it instead of a heading's height further down —
          which was leaving the left column short and the space under the links
          uneven against the box. */}
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <BlurFade inView delay={0.1}>
          <div className="flex flex-col gap-8">
            <div>
              <SectionHeading>Contact</SectionHeading>
              <p className="mt-5 max-w-md text-body text-muted-foreground">
                {personal.seeking}
              </p>
            </div>

            {/* Click to copy. The main address leads; the alternate sits under
                it, a step quieter. */}
            <div>
              <p className="text-meta font-semibold text-foreground">Email</p>
              <ul className="mt-2 space-y-1.5">
                {[personal.email, personal.altEmail].map((address, index) => (
                  <li key={address}>
                    <button
                      type="button"
                      onClick={() => copyEmail(address)}
                      title="Copy to clipboard"
                      className={
                        index === 0
                          ? "inline-flex items-center gap-2 break-all text-left text-body text-brand transition-colors hover:text-brand-hover"
                          : "inline-flex items-center gap-2 break-all text-left text-meta text-muted-foreground transition-colors hover:text-foreground"
                      }
                    >
                      {copied === address ? (
                        <Check className="size-4 shrink-0" />
                      ) : (
                        <Mail className="size-4 shrink-0" />
                      )}
                      {copied === address ? "Copied to clipboard" : address}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-meta font-semibold text-foreground">Résumé</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {/* View and download are genuinely different intents: most
                    people want to read it now, some want the file. */}
                <a
                  href={personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <FileText className="size-4" />
                  View
                </a>
                <a
                  href={personal.resumeUrl}
                  download={personal.resumeFilename}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
                >
                  <Download className="size-4" />
                  Download
                </a>
              </div>
            </div>

            <div>
              <p className="text-meta font-semibold text-foreground">
                Elsewhere
              </p>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {links.map(({ href, label, detail, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 py-3 text-meta transition-colors hover:text-brand"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
                      <span className="font-medium text-foreground transition-colors group-hover:text-brand">
                        {label}
                      </span>
                      <span className="text-muted-foreground">{detail}</span>
                      <ExternalLink className="ml-auto size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </BlurFade>

        <BlurFade inView delay={0.2}>
          <form
            onSubmit={send}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 md:p-8"
          >
            <p className="text-meta font-semibold text-foreground">
              Send me a message
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                value={form.name}
                onChange={(event) => set("name")(event.target.value)}
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="name"
                required
              />
              <Input
                type="email"
                value={form.email}
                onChange={(event) => set("email")(event.target.value)}
                placeholder="Your email"
                aria-label="Your email"
                autoComplete="email"
                required
              />
            </div>

            <Input
              value={form.subject}
              onChange={(event) => set("subject")(event.target.value)}
              placeholder="Subject"
              aria-label="Subject"
            />

            <Textarea
              value={form.message}
              onChange={(event) => set("message")(event.target.value)}
              placeholder="What would you like to talk about?"
              aria-label="Your message"
              rows={9}
              required
              className="min-h-52 resize-y"
            />

            {/* Honeypot. Bots fill in every field they can find; nobody using
                the page can see or tab to this one. */}
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={(event) => set("company")(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <ShimmerButton
              background="var(--brand-solid)"
              borderRadius="0.625rem"
              className="text-sm font-medium"
              disabled={status === "sending"}
            >
              {status === "sent" ? (
                <>
                  <Check className="mr-1.5 size-4" />
                  Message sent
                </>
              ) : (
                <>
                  <SendHorizontal className="mr-1.5 size-4" />
                  {status === "sending" ? "Sending…" : "Send message"}
                </>
              )}
            </ShimmerButton>

            <p
              className="text-label text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              {status === "sent"
                ? "Thanks — I'll get back to you soon."
                : status === "error"
                  ? "That's a few messages already. Try again shortly, or email me directly."
                  : "Goes straight to my inbox. I usually reply within a day."}
            </p>
          </form>
        </BlurFade>
      </div>
    </section>
  );
}
