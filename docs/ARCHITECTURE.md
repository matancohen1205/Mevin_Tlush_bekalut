# Wavely – ארכיטקטורה

## בחירת טכנולוגיה (ונימוק)
- **Frontend:** React + TypeScript + Vite, אפליקציית ווב רספונסיבית (Mobile-first) שאפשר להתקין כ-PWA. נבחר כי זה הכי מהיר לראות תוצאה, RTL נתמך מובנית ב-CSS, וקל לעבור אחר כך ל-React Native (הלוגיקה ב-`state/` ו-`services/` לא תלויה ב-DOM).
- **עיצוב:** CSS עם Design Tokens (משתני CSS) – ללא תלות בספריית UI.
- **מקור מוזיקה:** שכבת `MusicProvider` מופשטת.
  - `itunes` – iTunes Search API + Apple RSS charts: חינמי, ללא מפתח, פריוויו חוקי של 30 שניות מכל העולם, כולל שמות מדינות. מוצגת הפניה למקור (Apple Music).
  - `demo` – נתוני דמה בלי רשת (ניגון מדומה), משמש כשאין חיבור.
  - ניתן להוסיף `jamendo` (שירים מלאים ברישיון CC) / `deezer` / `spotify` באותו ממשק.
- **Backend (שלב הבא):** Supabase (Postgres + Auth + Storage + Realtime). כרגע המצב נשמר ב-`localStorage` מאחורי ממשק `Store`.

## מבנה תיקיות (שכבות)
```
src/
├─ main.tsx                  # נקודת כניסה: mount + service worker
├─ app/                      # הרכבה בלבד: App, AppProviders, AuthGate, Shell, PageRouter
├─ pages/                    # מסכים דקים; מרכיבים רכיבים ומשתמשים ב-hooks של state
├─ components/               # UI תצוגתי, לפי תחום:
│  ├─ common/  layout/  player/  tracks/  home/  search/
│  ├─ playlists/  social/  profile/  settings/  onboarding/
├─ state/                    # חיבור React: Providers + hooks בלבד
│  ├─ player/  library/  social/  auth/  prefs/  ui/  theme/  catalog/
├─ hooks/                    # hooks כלליים (useDialog, useInstall)
├─ domain/                   # לוגיקה עסקית טהורה, ללא React/DOM/רשת (נבדקת ביחידות)
│  ├─ queue  playlists  social  socialState  posts  profile  onboarding  smartPlaylist  time
├─ services/                 # גבולות I/O: רשת, אחסון, API של הדפדפן
│  ├─ music/ (itunes, audius, demo, synth/…)  cloud/ (supabase, auth, library)
│  ├─ storage/localStore.ts   browser/ (audioElement, mediaSession, serviceWorker)
├─ data/seed/                # קהילה פיקטיבית לדמו
├─ i18n/                     # translate.ts, I18nProvider, en/<תחום>.ts
├─ styles/                   # tokens.css + קובץ לכל תחום, מיובאים ב-index.css
└─ types/                    # טיפוסים משותפים
scripts/dev/check-architecture.cjs   # אוכף את הכללים
scripts/promo/                       # יצירת סרטון התדמית (lib/ + tour/)
```

### כללי תלות (נאכפים אוטומטית)
תלויות מצביעות רק "מטה": `app → pages → components → state → (services | domain) → types`.

| שכבה | מותר לה לייבא |
|---|---|
| `domain` | `types` בלבד (אין React, אין רשת) |
| `services` | `types`, `domain` |
| `state` | `domain`, `services`, `data`, `i18n`, `hooks`, `types` |
| `components` | `state`, `hooks`, `domain`, `i18n`, `types` (לא `services` ישירות) |
| `pages` | `components`, `state`, `hooks`, `domain`, `i18n`, `types` |

עוד כללים: קובץ עד 150 שורות; הערה מעל כל פונקציה ברמה העליונה; גישה ל-`localStorage`, `fetch` ו-Supabase רק בתוך `services/`.

```bash
npm run check        # typecheck + בדיקות יחידה + בדיקת ארכיטקטורה
```

## סכמת מסד נתונים (Supabase / Postgres)
| טבלה | שדות עיקריים |
|---|---|
| `profiles` | id (=auth.uid), handle, display_name, avatar_url, bio, is_private, created_at |
| `liked_tracks` / `playlist_tracks` | שיר נשמר כ-snapshot ב-`track jsonb` (במקום טבלת tracks משותפת), כך שאין תלות בספק המוזיקה |
| `playlists` | id, owner_id, title, description, cover_url, visibility (`public`/`private`), is_collaborative |
| `playlist_tracks` | playlist_id, track_id, position, added_by, added_at |
| `liked_tracks` | user_id, track_id, created_at |
| `follows` | follower_id, followee_id, status (`accepted`/`pending`) |
| `posts` | id, author_id, kind (`track`/`playlist`/`now_playing`), track_id?, playlist_id?, caption |
| `post_likes` | post_id, user_id |
| `comments` | id, post_id, author_id, body, created_at |
| `notifications` | id, user_id, type, actor_id, ref_id, read_at |
| `blocks` / `reports` | blocker_id, blocked_id / reporter_id, target_type, target_id, reason |

אבטחה: Row Level Security על כל טבלה; פלייליסט פרטי נראה רק לבעלים ולשותפים; פרופיל פרטי דורש `follows.status='accepted'`.

## זרימת נגן
`PlayerProvider` מחזיק `<audio>` יחיד, תור (`queue`), אינדקס, shuffle/repeat, ומחבר ל-Media Session API (שליטה ממסך נעילה / ניגון ברקע). הנגן המינימלי והמלא קוראים מאותו קונטקסט.

## מפת דרכים
1. ✅ ארכיטקטורה, Design System, בית, נגן, לייקים, ספרייה בסיסית
2. ✅ חיפוש וגילוי, Onboarding, פלייליסטים (CRUD + גרירה), יצירה חכמה מבוססת מילות מפתח
3. ✅ רשת חברתית (פיד, עוקבים, תגובות, התראות, פרטיות, חסימה) על נתוני דמו מקומיים
4. חיבור Supabase: Auth (אימייל/Google/Apple), RLS, Realtime להתראות
5. פלייליסט AI אמיתי (מודל שפה), פלייליסטים שיתופיים, חדרי האזנה משותפת
6. ליטוש, נגישות, PWA
