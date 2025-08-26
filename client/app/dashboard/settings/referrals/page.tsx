'use client';

import { useState } from 'react';

type Props = {
  referralLink: string;
  // Put your icon/illustration path here (SVG/PNG/GIF). Example: "/images/megaphone.svg"
  artSrc?: string;
  artAlt?: string;
};

export default function ReferralsCard({
  referralLink,
  artSrc = '/megaphone.svg',
  artAlt = 'Share & earn',
}: Props) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = referralLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const share = async () => {
    if (!navigator.share) {
      copy();
      return;
    }
    try {
      setSharing(true);
      await navigator.share({
        title: 'Join me on Synafare',
        text: 'Know any Installer, Distributor, or Supplier? Help them grow with Synafare and earn while you’re at it.',
        url: referralLink,
      });
    } catch {
      /* user cancelled or not supported */
    } finally {
      setSharing(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#2E5953] bg-[#305E57] p-4 text-white ">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold leading-tight">
            Refer & Earn with Synafare <span className="ml-1">🎁</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-white/90">
            Know any Installer, Distributor, or Supplier? Help them grow their
            business and get rewarded while you’re at it!{' '}
            <br className="hidden sm:block" />
            Invite them and enjoy the benefits of building a stronger solar
            ecosystem together.
          </p>

          {/* Link input + copy button */}
          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <div className="relative w-full">
              <input
                readOnly
                value={referralLink}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 pr-36 text-sm text-white placeholder:text-white/60 outline-none ring-0 focus:border-white/25"
              />
              <button
                onClick={copy}
                className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#FFC527] text-black hover:brightness-95'
                }`}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <button
              onClick={share}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC527] px-4 py-3 text-sm font-medium text-black hover:brightness-95 sm:w-32"
              disabled={sharing}
              title="Share"
            >
              {/* You can swap this emoji or use an SVG icon */}
              {sharing ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </div>

        {/* Right-side art (you'll replace src with your icon) */}
        <div className="hidden shrink-0 md:block">
          {/* Plain <img> tag as requested so you can drop in any asset */}
          <img
            src={artSrc}
            alt={artAlt}
            className="size-[135px] -mr-2 select-none object-contain opacity-95"
          />
        </div>
      </div>
    </section>
  );
}
