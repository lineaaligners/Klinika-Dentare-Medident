# Medident Academy — Doctor Portal setup

A private portal at **`/academy/portal`** where doctors see the courses assigned to them — videos, webinar recordings, live webinars, and PDFs. **Doctors create their own account** from the login screen ("Create account"); you decide what each one can see by ticking courses in **Admin → Assignments**. A doctor who registers sees nothing until you assign them a course, so access stays in your hands without you creating accounts.

It runs on a dedicated Supabase project and your existing Vercel deployment.

---

## Already done

- Supabase project **`medident-academy`** — Central EU (Frankfurt), `https://mmgjlptddzorminoprrz.supabase.co`, in the **medident academy** organization.
- `supabase/schema.sql` installed and verified: 5 `academy_*` tables (row-level security on), 10 table policies, the `academy_is_admin()` helper, 3 storage buckets (`academy-videos` + `academy-materials` private, `academy-covers` public) with 4 storage policies, and the **self-registration trigger** (every new login gets a profile with role `doctor` — never admin).
- Sign-ups are **on** and **Confirm email is off**: doctors register and sign in immediately, no email needed. A doctor who registers sees nothing until you assign a course, so strangers who sign up gain nothing.

---

## Remaining steps — in this order

### 1. Keys into Vercel (before deploying)
The two `VITE_` keys are baked into the site when Vercel builds it, so add them **first**. If you deploy before adding them, the portal shows "Portal not available yet" until you redeploy.

In Supabase: **Project Settings → API Keys** (and **Data API** for the URL). In Vercel: **klinika-dentare-medident → Settings → Environment Variables** — tick **Production** and **Preview**:

| Name | Value | Notes |
|------|-------|-------|
| `VITE_SUPABASE_URL` | `https://mmgjlptddzorminoprrz.supabase.co` | safe in browser |
| `VITE_SUPABASE_ANON_KEY` | **Publishable** key (`sb_publishable_…`) | safe in browser |
| `SUPABASE_URL` | `https://mmgjlptddzorminoprrz.supabase.co` | server function |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** key (`sb_secret_…`) | **secret** — mark it *Sensitive*, never prefix with `VITE_` |

Paste them straight from Supabase into Vercel — they never need to pass through chat.

### 2. Deploy (put the code on GitHub `main`)
Vercel deploys `main` to medident-ks.com automatically. Either:
- **In the browser:** unzip `medident-doctor-portal-files.zip`, open github.com/lineaaligners/Klinika-Dentare-Medident → **Add file → Upload files**, drag in everything that was inside the zip (the folders and the files — GitHub keeps the folder paths), choose **Commit directly to the `main` branch**, then **Commit changes**. Files with the same name (`App.tsx`, `package.json`, …) are replaced — that's intended.
- **Or with git:** see *Applying the changes* below, then push to `main`.

The build takes ~1 minute. Then `medident-ks.com/academy/portal` shows the login screen.

### 3. Make yourself admin
Open `medident-ks.com/academy/portal` → **Create account** with your email. Then in Supabase **SQL Editor** run (with that email):
```sql
insert into public.academy_profiles (id, email, full_name, role)
select id, email, '', 'admin' from auth.users where email = 'you@example.com'
on conflict (id) do update set role = 'admin';
```
Sign out and back in — the **Admin** tab appears.

---

## Day to day

- **Doctors** open the portal → **Create account** (name, email, password) → they land on a welcome screen until you assign courses.
- **Admin → Doctors** lists everyone who registered, with their join date. You can also add a doctor yourself, reset a password, or delete an account.
- **Admin → Assignments** — tick which doctor gets which course. That's the on/off switch for access. While Confirm email is off, emails aren't verified — so only assign courses to accounts you recognise (e.g. the doctor told you they've registered).
- **Admin → Courses & Content** — create courses and add lessons: **Video** or **Webinar recording** (upload a file, or paste a YouTube/Vimeo link), **Live webinar** (date + join link), or **PDF**.
- Doctors can mark lessons complete (progress bars on their dashboard) and change their own password under **Account** (click their name, top right).

---

## Video uploads
Free plan: ~1 GB storage and ~5 GB/month of downloads, and single uploads are capped (default 50 MB — raise it in **Storage → Settings**). For long videos, paste an unlisted YouTube/Vimeo link instead. Uploaded files are private: only doctors assigned to the course can open them, through short-lived links.

---

## Later (optional): confirmation & password-reset emails
Supabase's built-in email only reaches members of your Supabase team (max 2 per hour), which is why **Confirm email** is off. To turn it on, first connect a real mailbox (e.g. a Hostinger address on your domain) under **Authentication → Emails → SMTP Settings**, set **Authentication → URL Configuration → Site URL** to `https://medident-ks.com`, and add `https://medident-ks.com/academy/portal` to the Redirect URLs. Then switch **Authentication → Sign In / Providers → Confirm email** on. The login screen already handles both modes.

---

## If you merge the blog/SEO branch later
The branch `fix/blog-academy-tourism-static-seo` rewrites `vercel.json` and adds a static `public/academy/index.html`. When you merge it after the portal:

1. **`vercel.json` will conflict — keep both sides.** The portal needs its two `/academy/portal` rules; the branch needs its `/tourism` redirect. The merged file should be exactly:
   ```json
   {
     "redirects": [
       { "source": "/tourism", "destination": "/dental-tourism.html", "permanent": true }
     ],
     "rewrites": [
       { "source": "/academy/portal", "destination": "/" },
       { "source": "/academy/portal/:path*", "destination": "/" },
       { "source": "/services", "destination": "/" },
       { "source": "/gallery", "destination": "/" },
       { "source": "/contact", "destination": "/" },
       { "source": "/faq", "destination": "/" },
       { "source": "/doctors", "destination": "/" },
       { "source": "/team", "destination": "/" }
     ]
   }
   ```
   Without the two portal rules, `medident-ks.com/academy/portal` returns a 404.
2. **Add a login link to the static academy page.** Once `public/academy/index.html` exists, visitors who open `/academy` directly get that page instead of the app's Academy page, so they won't see the "Doctor Login" button. Add one line after its intro paragraph:
   ```html
   <p>Already enrolled? <a href="/academy/portal"><strong>Doctor Login →</strong></a></p>
   ```

---

## Applying the changes
```bash
git checkout -b feature/doctor-portal
git apply medident-doctor-portal.patch     # or copy the files from the zip
npm install
npm run build
```

### Files added
```
supabase/schema.sql                    services/supabaseClient.ts
services/portalApi.ts                  api/portal-admin.ts
components/portal/types.ts             components/portal/DoctorPortal.tsx
components/portal/PortalHeader.tsx     components/portal/LoginScreen.tsx
components/portal/DashboardScreen.tsx  components/portal/CourseScreen.tsx
components/portal/LessonViewer.tsx     components/portal/AccountScreen.tsx
components/portal/admin/AdminScreen.tsx      components/portal/admin/CoursesAdmin.tsx
components/portal/admin/LessonsAdmin.tsx     components/portal/admin/DoctorsAdmin.tsx
components/portal/admin/AssignmentsAdmin.tsx PORTAL_SETUP.md
```
### Files changed
`App.tsx` (portal route, lazy-loaded) · `components/AcademyPage.tsx` ("Doctor Login" link) · `vercel.json` (explicit `/academy/portal` rewrites) · `package.json` + `package-lock.json` (+ `@supabase/supabase-js`) · `.env.example` (Supabase vars)

---

## Troubleshooting
- **"Portal not available yet"** → the `VITE_SUPABASE_*` variables weren't set when that deployment was built. Add them, then **Deployments → ⋯ → Redeploy**.
- **`/academy/portal` shows a 404** → `vercel.json` lost its `/academy/portal` rules (see *If you merge the blog/SEO branch later*).
- **"Please confirm your email first"** → Confirm email was switched on without an email server (see *Later (optional)*).
- **Doctor sees the welcome screen, no courses** → nothing assigned yet (Admin → Assignments), or the course is unpublished.
- **"Server not configured" when adding a doctor from Admin** → `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` missing in Vercel.
- **Video upload fails** → over the upload size limit or storage full — raise the limit or use a link.
