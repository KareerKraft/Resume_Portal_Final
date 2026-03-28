import { useState } from "react";
import { Link } from "react-router-dom";

const FAQS = [
  {
    question: "How do I start building my resume on Kareer Kraft?",
    answer:
      "Open the dashboard, create a new resume, and choose a template. From there you can add your personal details, education, projects, experience, and skills step by step.",
  },
  {
    question: "Can I edit my resume after saving it?",
    answer:
      "Yes. Your saved resumes can be reopened from the dashboard at any time, so you can update content, switch templates, and improve sections whenever you need.",
  },
  {
    question: "Can I preview the resume before downloading it?",
    answer:
      "Yes. The builder includes a preview flow so you can review formatting and content before exporting your final resume.",
  },
  {
    question: "Are the resume templates ATS friendly?",
    answer:
      "Yes. The platform is designed around clean, professional resume layouts that work well for ATS screening while still looking polished for recruiters.",
  },
  {
    question: "What should I do if something is not working correctly?",
    answer:
      "If you run into any issue, use the mail icon below to contact Kareer Kraft directly. You can also connect through LinkedIn or X for updates and support.",
  },
];

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
      <path
        fill="currentColor"
        d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.06-.25 6.37 4.73a1 1 0 0 0 1.2 0L19.01 6.5H5.06Zm13.44 2.24-5.27 3.92a2.75 2.75 0 0 1-3.28 0L4.5 8.74v8.51c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V8.74Z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
      <path
        fill="currentColor"
        d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56C7.16 3.87 6.4 3 5.26 3S3.37 3.87 3.37 4.94c0 1.05.73 1.94 1.85 1.94h.02c1.16 0 1.92-.89 1.92-1.94ZM20.63 20h-3.38v-6.15c0-1.54-.55-2.59-1.93-2.59-1.05 0-1.67.71-1.95 1.39-.1.24-.13.58-.13.91V20H9.86s.04-10.42 0-11.5h3.38v1.63c.45-.7 1.25-1.69 3.04-1.69 2.22 0 3.89 1.45 3.89 4.56V20Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
      <path
        fill="currentColor"
        d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.88-7.34L5.66 22H2.55l7.24-8.28L1.8 2h6.4l4.41 6.69L18.9 2Zm-1.09 18h1.72L7.26 3.9H5.42L17.81 20Z"
      />
    </svg>
  );
}

export default function Help() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-12 lg:px-20">
        <nav className="flex items-center justify-between gap-6 rounded-full border border-green-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Kareer Kraft
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
            <Link to="/" className="transition hover:text-green-600">
              Home
            </Link>
            <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
              Help
            </span>
          </div>
        </nav>

        <section className="grid gap-12 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-green-700">
              Help Center
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
              Answers to the questions people ask most.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Explore quick help for building resumes, editing sections, previewing
              your design, and getting in touch with Kareer Kraft when you need support.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kareerkraft24@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-green-200 bg-white px-5 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-green-400 hover:text-green-700"
                aria-label="Send an email to Kareer Kraft"
              >
                <MailIcon />
                Email Support
              </a>
              <Link
                to="/"
                className="inline-flex items-center rounded-full bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700"
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-green-100 bg-white p-4 shadow-[0_24px_80px_rgba(34,197,94,0.08)] md:p-6">
            <div className="space-y-4">
              {FAQS.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={item.question}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-semibold text-slate-900">
                        {item.question}
                      </span>
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-green-700 shadow-sm transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-200 px-5 pb-5 pt-4 md:px-6">
                        <p className="text-sm leading-7 text-slate-600">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-sm font-medium text-slate-600">
                Connect with Kareer Kraft
              </p>
              <div className="mt-4 flex items-center gap-4">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=kareerkraft24@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-green-400 hover:text-green-700"
                  aria-label="Email Kareer Kraft"
                >
                  <MailIcon />
                </a>
                <a
                  href="https://www.linkedin.com/in/kareer-kraft-917b663b6/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-green-400 hover:text-green-700"
                  aria-label="Open Kareer Kraft LinkedIn"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://x.com/KareerKraf35889"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-green-400 hover:text-green-700"
                  aria-label="Open Kareer Kraft X profile"
                >
                  <XIcon />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
