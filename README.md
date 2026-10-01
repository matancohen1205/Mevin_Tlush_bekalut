# Wavely 🌊

אפליקציית מוזיקה עולמית עם פלייליסטים ורשת חברתית, בעיצוב של גווני כחול ותכלת.

```bash
npm install
npm run dev      # פיתוח
npm run build    # בדיקת טיפוסים + build
```

- ארכיטקטורה, סכמת DB ומפת דרכים: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Design System: [`src/styles/tokens.css`](src/styles/tokens.css)
- מקור מוזיקה: iTunes Search/Charts (תצוגה מקדימה של 30 שניות), עם נפילה אוטומטית לנתוני דמה כשאין רשת.

## מה כבר עובד (שלב 1)
בית עם מצעדים לפי מדינה ומצבי רוח, נגן מינימלי ומלא (ערבוב, חזרה, תור עם גרירה, עוצמה, Media Session), שירים אהובים (נשמרים מקומית), מצב כהה/בהיר ו-RTL.
