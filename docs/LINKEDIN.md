# טיוטות לפוסט ב-LinkedIn

## English
I built **Wavely**, a music player + social network, to practice shipping a complete product end to end.

What it does
🎧 Plays music from different countries (Apple previews) or full tracks from independent artists (Audius)
📃 Playlists, including "describe the vibe in one sentence and get a playlist"
👥 A social feed: share songs and playlists, like, comment, private profiles with follow requests
🌍 Hebrew (RTL) and English (LTR)
♿ Accessibility checked with axe-core, keyboard-friendly dialogs
📱 Installable PWA, works offline for the app shell

Under the hood: React + TypeScript, a single `MusicProvider` interface so new sources are one file, Postgres schema with row level security ready for Supabase.

A few things I learned
• A single `<audio>` element and a very careful state machine beat three "clever" ones
• When a play() promise rejects, it isn't always an error: aborted loads and unplayable files need different handling
• Using the Hebrew text itself as the i18n key made the translation work much faster, and a missing key degrades to Hebrew instead of breaking the UI

Live demo: <LINK>
Code: <GITHUB LINK>

Feedback welcome! #React #TypeScript #WebDev #PWA #Accessibility #Portfolio

---

## עברית
בניתי את **Wavely**, נגן מוזיקה עם רשת חברתית, כדי לתרגל בנייה של מוצר שלם מקצה לקצה.

מה יש בפנים
🎧 ניגון מוזיקה ממדינות שונות או שירים מלאים של אמנים עצמאיים
📃 פלייליסטים, כולל "תארו במשפט אחד ותקבלו פלייליסט"
👥 פיד חברתי: שיתוף שירים ופלייליסטים, לייקים, תגובות, פרופילים פרטיים
🌍 עברית (RTL) ואנגלית
♿ נגישות שנבדקה עם axe-core
📱 אפליקציית PWA להתקנה

הטכנולוגיה: React + TypeScript, ממשק אחד למקורות מוזיקה (מקור חדש = קובץ אחד), ו-schema של Postgres עם הרשאות ברמת שורה.

לינק לדמו: <LINK> | קוד: <GITHUB LINK>

## טיפים לפרסום
- שימו בפוסט **GIF או סרטון קצר של 20 שניות** (פתיחת האפליקציה, ניגון, יצירת פלייליסט חכם, מעבר לעברית). פוסט עם וידאו מקבל חשיפה גבוהה בהרבה מקישור.
- הצמידו את הקישור בתגובה הראשונה אם רוצים יותר חשיפה, או השאירו בפוסט כדי שתצוגת הקישור תופיע.
- הוסיפו את הפרויקט גם לאזור "Featured" ו"Projects" בפרופיל.
- אל תכתבו שה-Supabase "עובד" לפני שבדקתם אותו מול פרויקט אמיתי.
