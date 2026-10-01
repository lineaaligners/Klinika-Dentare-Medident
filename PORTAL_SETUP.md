# Medident Academy — Doctor Portal

A private portal at **`/academy/portal`** for the Academy's courses — videos, webinar recordings, live webinars and PDFs. Doctors create their own account, browse the course catalog and **request** a course; you approve with one click (or assign courses yourself). Doctors who finish a course and pass its quiz download a **certificate** that anyone can verify at **`/academy/verify`**.

It runs on the Supabase project **`medident-academy`** (`https://mmgjlptddzorminoprrz.supabase.co`, Frankfurt) and the Vercel project **klinika-dentare-medident** (deploys GitHub `main` to medident-ks.com).

---

## Upgrading to v4 — in this order
1. **Database first.** Supabase → **SQL Editor → New query** → paste all of `supabase/schema_v4.sql` → **Run** (after v3; safe to run again, removes nothing).
2. **Deploy the code** to GitHub `main` (Vercel builds it).
3. **Quick check:** Admin shows an **Announcements** tab; in Admin → Overview, comments marked *May be quoted* have **Show on website**; once one is shown, the public Academy page (`/academy`) gets a **What doctors say** section.

## Upgrading to v3 (done)
1. **Database first.** Supabase → **SQL Editor → New query** → paste all of `supabase/schema_v3.sql` → **Run** (after v2; safe to run again, removes nothing). The new code calls functions that only exist after this step.
2. **Account emails in Albanian + English.** Supabase → **Authentication → Emails → Templates** → for *Confirm signup*, *Reset password* and *Change email address* paste the subject and HTML from `supabase/email-templates/` (the table is in its `README.md`).
3. **Deploy the code** to GitHub `main` (Vercel builds it).
4. **Quick check:** Admin → Courses & Content shows **CPD hours**; Admin → Overview shows **Export to Excel** and a **Rating** column.

## Upgrading to v2 (done)

### 1. Database first
Supabase → **SQL Editor → New query** → paste all of `supabase/schema_v2.sql` → **Run**. It is safe to run again and removes nothing.
Run it **before** the new code goes live: the new course editor saves fields (instructor, quiz pass mark) that only exist after this step.

### 2. Email (sender: medident-ks@gmail.com)
1. **App password.** Sign in to the medident-ks@gmail.com Google account → **Security → 2-Step Verification** (must be on) → **App passwords** → create one named *Medident Portal*. Google shows a 16-letter password once — keep it for the next two steps.
2. **Vercel → klinika-dentare-medident → Settings → Environment Variables** (Production + Preview):

   | Name | Value |
   |------|-------|
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `465` |
   | `SMTP_USER` | `medident-ks@gmail.com` |
   | `SMTP_FROM` | `Medident Academy <medident-ks@gmail.com>` |
   | `SMTP_PASS` | the app password — mark it **Sensitive** |
   | `CRON_SECRET` | optional: any long random text, **Sensitive** (locks the daily reminder job to Vercel) |
   | `ADMIN_NOTIFY_EMAIL` | optional: extra addresses (comma separated) for admin alerts |

3. **Supabase → Authentication → Emails → SMTP Settings** → enable custom SMTP: host `smtp.gmail.com`, port `465`, username `medident-ks@gmail.com`, password = the same app password, sender email `medident-ks@gmail.com`, sender name `Medident Academy`. This is what sends **password-reset** (and later confirmation) emails.
4. **Supabase → Authentication → URL Configuration**: Site URL `https://medident-ks.com`; Redirect URLs `https://medident-ks.com/academy/portal` and `https://medident-ks.com/academy/portal/**`.
5. Test: portal → **Forgot password?** with your own email → the link opens the portal on "Set a new password".
6. When that works: **Authentication → Sign In / Providers → Confirm email → on**, so new sign-ups prove their address.

Without the SMTP variables everything still works — the portal simply sends no emails.

### 3. Deploy the code
Put this branch on GitHub `main`; Vercel builds it in about a minute. The daily reminder job (`vercel.json → crons`, 06:00 UTC) is picked up automatically.

### 4. Quick check
- `medident-ks.com/academy/verify` shows the certificate check page.
- Portal → **Admin → Overview** shows the numbers; **Courses & Content** shows the instructor + pass-mark fields, lesson **Edit**/reorder arrows and the **Final quiz** section.

---

## What doctors get
- **Sign-up with practice details** (name, clinic, city, country, phone) and **Forgot password** by email.
- **Course catalog** — every published course, with a **Request access** button (one pending request per course).
- **Announcements** — news from the academy at the top of the dashboard (for every doctor or one course), for 60 days or until the doctor closes it.
- **App icon** — on a phone the dashboard shows how to add *Medident Academy* to the home screen (Android/desktop Chrome get an **Install** button); the icon opens straight into the portal.
- **Continue where you left off** — the dashboard reopens the last lesson (or the next unfinished one), and uploaded videos resume at the second they stopped.
- **Dashboard** — their courses with progress, **upcoming live webinars** with *Add to calendar* (.ics) and a *Join* button that opens 30 minutes before the start, and their certificates.
- **Lessons** — video, webinar recording, live webinar, PDF; uploaded videos mark themselves complete at 90 %.
- **Q&A under every lesson** — everyone assigned to the course sees the questions; academy answers carry a verified badge.
- **Final quiz** (if the course has one) — pass mark per course, **5 tries per 24 hours**; which answers were wrong is shown only after passing.
- **Certificate** — once every lesson is done and the quiz passed: a PDF (A4 landscape, signed by the instructor and Dr. Lendita Islami Nallbani as Academy Director) with an ID like `MA-3F9A-1C2B`, the course's **CPD hours** (when set) and a QR code to its verification page; **Add to LinkedIn** fills in LinkedIn's "Licenses & certifications" form.
- **Rate the course** — 1–5 stars, an optional comment and a tick box allowing Medident to quote it (with name and city); doctors can edit it later.

## What you get (Admin)
- **Overview** — doctors, active in the last 7 days, enrolments, pending requests, unanswered questions, certificates; per-course progress, quiz passes, certificates and **average rating**; each doctor's progress; the **latest feedback** (with a *May be quoted* badge); recent certificates with **Withdraw / Restore**.
- **Announcements** — write in Albanian and/or English, send to all doctors or one course's doctors, optionally by email (sent once; **Send by email** later if email wasn't set up yet), delete any time.
- **Testimonials** — in Overview → Latest feedback, **Show on website** puts a quotable comment on the public Academy page (name, city, course, stars, comment). If the doctor edits it or withdraws permission, it comes off until you choose it again.
- **Export to Excel** (Overview) — one `.xlsx` with four tabs: Doctors, Progress, Certificates (with CPD hours and verification links) and Feedback.
- **Courses & Content** — course details (instructor printed on the certificate, quiz pass mark, **CPD hours**, published), lessons (**add, edit, replace file, reorder**, viewers/completions per lesson), live webinars (**Email invitation** to the course's doctors), and the **quiz editor** (2–6 answers, English + Albanian).
- **Requests** — approve (assigns the course) or decline; the doctor is emailed either way.
- **Q&A** — every unanswered question across courses, answer in place.
- **Doctors** — search, practice details, joined / last active, reset password, delete. **Assignments** — tick courses per doctor.

## Emails the portal sends

| When | Who gets it |
|------|-------------|
| A doctor requests a course | admins |
| You approve / decline a request, or assign a course | the doctor |
| You create a live webinar (or press **Email invitation**) | doctors in that course, with a calendar file |
| Day before a live webinar (daily job) | doctors in that course |
| A doctor asks or replies in Q&A | admins (at most one alert per doctor every 2 minutes) |
| The academy answers a question | the doctor who asked |
| You publish an announcement with *Also send it by email* | every doctor, or the doctors of that course |

Each email goes out once (the portal records it), replies go to medident-ks@gmail.com, and Gmail allows about 500 emails a day — plenty at this size.

## Rules worth knowing
- **Drafts are invisible to doctors** — unpublish a course to hide it (and its lessons, webinars and Q&A) without unassigning anyone.
- **Changing a webinar's date/time** re-arms its reminder and shows **Email invitation** again so you can tell doctors the new time.
- **Doctors can't use a staff name** (an admin's or an instructor's) — so nobody can post or earn a certificate under your names.
- **Withdrawn certificates** stop verifying and can't be claimed again until you restore them.
- While **Confirm email** is off, addresses aren't verified — approve requests only from doctors you recognise.

---

## Video uploads
Free plan: ~1 GB storage and ~5 GB/month of downloads, and single uploads are capped at 50 MB. The lesson editor refuses bigger files straight away and suggests **Use a link** with an unlisted YouTube/Vimeo link (on a paid plan with a higher limit, change `MAX_UPLOAD_MB` in `components/portal/admin/LessonsAdmin.tsx`). Uploaded files are private: only doctors assigned to the course can open them, through short-lived links. Replacing or deleting a lesson's file removes the old upload.

---

## If you merge the blog/SEO branch later
`fix/blog-academy-tourism-static-seo` rewrites `vercel.json`. Keep both sides — the merged file should be:
```json
{
  "redirects": [
    { "source": "/tourism", "destination": "/dental-tourism.html", "permanent": true }
  ],
  "rewrites": [
    { "source": "/academy/portal", "destination": "/" },
    { "source": "/academy/portal/:path*", "destination": "/" },
    { "source": "/academy/verify", "destination": "/" },
    { "source": "/academy/verify/:path*", "destination": "/" },
    { "source": "/services", "destination": "/" },
    { "source": "/gallery", "destination": "/" },
    { "source": "/contact", "destination": "/" },
    { "source": "/faq", "destination": "/" },
    { "source": "/doctors", "destination": "/" },
    { "source": "/team", "destination": "/" }
  ],
  "crons": [
    { "path": "/api/portal-notify", "schedule": "0 6 * * *" }
  ]
}
```
That branch also adds a static `public/academy/index.html`; add a login link after its intro paragraph:
`<p>Already enrolled? <a href="/academy/portal"><strong>Doctor Login →</strong></a></p>`

---

## Files (v4)
New: `supabase/schema_v4.sql`, `services/academyPublic.ts`, `components/AcademyTestimonials.tsx`, `public/academy-app/*` (manifest + icons), and in `components/portal/`: `Announcements`, `InstallAppCard`, `pwa.ts`, `admin/AnnouncementsAdmin`.
Changed: `App.tsx`, `components/AcademyPage.tsx`, `api/portal-notify.ts` (announcement emails), `services/portalApi.ts`, `components/portal/types.ts`, `DoctorPortal`, `DashboardScreen`, `admin/AdminScreen`, `admin/OverviewAdmin`.

## Files (v3)
New: `supabase/schema_v3.sql`, `supabase/email-templates/*`, and in `components/portal/`: `ContinueCard`, `FeedbackForm`, `admin/xlsx.ts` (small Excel writer, no new packages).
Changed: `services/portalApi.ts`, `components/portal/types.ts`, the dashboard, course, lesson and certificate screens, the verify page, and `admin/CoursesAdmin`, `admin/LessonsAdmin`, `admin/OverviewAdmin`.

## Files (v2)
New: `supabase/schema_v2.sql`, `api/portal-notify.ts`, `public/fonts/certificate/*` (OFL fonts for the PDF), and in `components/portal/`: `CourseCatalog`, `UpcomingWebinars`, `LessonQA`, `QuizPanel`, `CertificatePanel`, `CertificateActions`, `certificatePdf.ts`, `ics.ts`, `ProfileFields`, `SetPasswordScreen`, `VerifyCertificatePage`, `admin/OverviewAdmin`, `admin/RequestsAdmin`, `admin/QAAdmin`, `admin/QuizAdmin`.
Changed: `App.tsx` (verify route, keeps the email-link hash), `vercel.json` (verify rewrites + daily cron), `package.json` (+ `jspdf`, `qrcode-generator`, `nodemailer`), `.env.example`, `services/*`, and the existing portal screens.

---

## Troubleshooting
- **"Portal not available yet"** → the `VITE_SUPABASE_*` variables weren't set when that deployment was built. Add them, then **Deployments → ⋯ → Redeploy**.
- **Saving a course fails / new tabs are empty** → `schema_v2.sql` hasn't been run yet (step 1).
- **No "Continue" card, ratings don't save, or saving a course with CPD hours fails** → `schema_v3.sql` hasn't been run yet.
- **Announcements tab shows an error / "Show on website" fails** → `schema_v4.sql` hasn't been run yet.
- **No emails** → check the `SMTP_*` variables in Vercel (then redeploy) and that the Google app password is still valid; **Vercel → Logs** shows `portal-notify` errors.
- **Password-reset email never arrives** → Supabase SMTP settings (step 2.3) and the Redirect URLs (step 2.4).
- **"That email link is invalid or has expired"** → links are single-use and short-lived; request a new one.
- **`/academy/portal` or `/academy/verify` shows a 404** → `vercel.json` lost its rewrites (see above).
- **Doctor sees no courses** → nothing assigned yet, a pending request, or the course is a draft.
- **Video upload fails** → over the upload size limit or storage full — raise the limit or use a link.
