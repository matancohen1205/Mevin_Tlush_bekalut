# Wavely – ארכיטקטורה

## בחירת טכנולוגיה (ונימוק)
- **Frontend:** React + TypeScript + Vite, אפליקציית ווב רספונסיבית (Mobile-first) שאפשר להתקין כ-PWA. נבחר כי זה הכי מהיר לראות תוצאה, RTL נתמך מובנית ב-CSS, וקל לעבור אחר כך ל-React Native (הלוגיקה ב-`state/` ו-`services/` לא תלויה ב-DOM).
- **עיצוב:** CSS עם Design Tokens (משתני CSS) – ללא תלות בספריית UI.
- **מקור מוזיקה:** שכבת `MusicProvider` מופשטת.
  - `itunes` – iTunes Search API + Apple RSS charts: חינמי, ללא מפתח, פריוויו חוקי של 30 שניות מכל העולם, כולל שמות מדינות. מוצגת הפניה למקור (Apple Music).
  - `demo` – נתוני דמה בלי רשת (ניגון מדומה), משמש כשאין חיבור.
  - ניתן להוסיף `jamendo` (שירים מלאים ברישיון CC) / `deezer` / `spotify` באותו ממשק.
- **Backend (שלב הבא):** Supabase (Postgres + Auth + Storage + Realtime). כרגע המצב נשמר ב-`localStorage` מאחורי ממשק `Store`.

## מבנה תיקיות
```
src/
  styles/      tokens.css (Design System), global.css
  i18n/        he/en מחרוזות, כיוון RTL/LTR
  services/music/  provider.ts, itunes.ts, demo.ts
  state/       player.tsx (נגן+תור), library.tsx (לייקים/פלייליסטים)
  components/  Icon, BottomNav, MiniPlayer, FullPlayer, TrackRow, TrackCard, Skeleton, Waveform
  pages/       Home, Search, Library, Community, Profile
```

## סכמת מסד נתונים (Supabase / Postgres)
| טבלה | שדות עיקריים |
|---|---|
| `profiles` | id (=auth.uid), handle, display_name, avatar_url, bio, is_private, created_at |
| `tracks` | id, provider, provider_track_id, title, artist, album, artwork_url, preview_url, country, genre, duration_ms |
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
