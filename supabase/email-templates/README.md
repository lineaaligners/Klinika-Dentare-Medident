# Supabase auth email templates (Albanian + English)

Supabase → Authentication → Emails → Templates. For each template paste the
subject and the full HTML file:

| Template | Subject | File |
|---|---|---|
| Confirm signup | `Konfirmoni email-in · Confirm your email — Medident Academy` | `confirm-signup.html` |
| Reset password | `Fjalëkalim i ri · Reset your password — Medident Academy` | `reset-password.html` |
| Change email address | `Konfirmoni email-in e ri · Confirm your new email — Medident Academy` | `change-email.html` |

They use the same look as the portal's own notification emails. Supabase fills
in `{{ .ConfirmationURL }}`, `{{ .Email }}` and `{{ .NewEmail }}`.
