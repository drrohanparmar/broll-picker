# B-Roll Picker — Vercel pe Live Karna (Full Guide)

Ye guide bilkul step-by-step hai. Kahin bhi atko, exact step number bata dena.

**Final result:** Ek permanent link (jaise `https://broll-picker-rohan.vercel.app`),
jo kahin se bhi (ghar, bahar, Chromebook, laptop — sab jagah se) khul jayega.
Password se locked hoga. 100% free.

---

## PART 1 — GitHub account (agar pehle se nahi hai)

1. https://github.com kholo
2. "Sign up" pe click karo, email/password se account banao
3. Email verify karo (link aayega)

(Agar already GitHub account hai, ye part skip karo.)

---

## PART 2 — Code ko GitHub pe daalna

### Option A — Browser se hi (sabse simple, koi command line nahi)

1. GitHub pe login karke, top-right **"+"** → **"New repository"**
2. Name daalo: `broll-picker`
3. **"Public"** ya **"Private"** — dono chalega, Private rakho agar chaho (koi farak nahi padta, password-lock already hai)
4. **"Create repository"** dabao
5. Ab jo page khula, usme **"uploading an existing file"** link pe click karo
6. Is zip ko extract karke, **saari files aur folders** (`api`, `src`, `index.html`, `package.json`, `vite.config.js`, `.gitignore`, `.env.example`, `sample-plan.json`) ek saath **drag-drop** kar do us upload box mein

   ⚠️ **`node_modules` folder mat upload karna** agar kahin bana ho — wo nahi hona chahiye (zip mein already nahi hai, chinta mat karo)

7. Neeche **"Commit changes"** (green button) dabao

Ho gaya — code GitHub pe hai.

### Option B — Agar Git command-line chalana aata hai (faster, optional)

```bat
cd D:\medmotion-pro\broll-picker-vercel
git init
git add .
git commit -m "first version"
git branch -M main
git remote add origin https://github.com/<tumhara-username>/broll-picker.git
git push -u origin main
```

---

## PART 3 — Vercel account banao

1. https://vercel.com kholo
2. **"Sign Up"** → **"Continue with GitHub"** choose karo (same GitHub account se login karega, alag password nahi banana padega)
3. Permission maange to **"Authorize Vercel"** dabao

---

## PART 4 — Project import + deploy

1. Vercel dashboard mein **"Add New..."** → **"Project"**
2. Tumhari GitHub repos ki list dikhegi — `broll-picker` dhoondo, uske saamne **"Import"** dabao
3. Ek settings page khulega — **zyada kuch badalna nahi hai**, Vercel khud detect kar lega ki ye Vite project hai
4. Neeche **"Environment Variables"** section mein — **ye step sabse zaroori hai**:

   | Name | Value |
   |---|---|
   | `PEXELS_API_KEY` | tumhari real Pexels key |
   | `APP_PASSWORD` | `kashish1234` |

   Dono ko ek-ek karke "Name" aur "Value" box mein daalo, har ek ke baad **"Add"** dabao

5. Sab bharne ke baad, **"Deploy"** (bada button) dabao
6. 1-2 minute wait karo — build chalega
7. "Congratulations" page aayega, uspe tumhara **live link** dikhega (jaise `https://broll-picker-xyz.vercel.app`)

**Bas, ho gaya — tool live hai.**

---

## PART 5 — Test karo

1. Apna live link kisi bhi browser (laptop ya Chromebook, kisi bhi WiFi pe) mein kholo
2. Password screen aayega — `kashish1234` daalo
3. `sample-plan.json` (zip mein hai) upload karo, check karo scenes dikh rahe hain
4. Kisi scene pe click karo, thumbnail pe mouse le jao — chhota preview chalna chahiye
5. Ek clip pick karo, "Download JSON" try karo

Sab theek chale to real project JSON ke saath use karna shuru kar do.

---

## PART 6 — Aage se update kaise karein

Agar kabhi design/code change karna ho (mujhse naya version maangna ho):

1. Naya code mujhse lo
2. GitHub pe wahi repo kholo → purani files delete karke nayi upload karo (Option A wala tareeka) → Commit
3. Vercel **khud-ba-khud naya deploy kar dega** (2 min mein) — kuch aur karne ki zaroorat nahi

---

## Troubleshooting

- **"PEXELS_API_KEY is not set"** — Part 4, Step 4 mein env variable daalna miss ho gaya. Vercel dashboard → Project → Settings → Environment Variables mein jaake add karo, phir "Deployments" tab se latest deployment pe "..." → "Redeploy".
- **Password kaam nahi kar raha** — `APP_PASSWORD` env variable mein exact `kashish1234` hai ya nahi check karo (spaces na ho aage-peeche).
- **Build fail ho gaya** — error message ka screenshot bhej dena, dekh ke batata hoon.
- **Password badalna hai** — Vercel dashboard mein `APP_PASSWORD` value edit karo, "Redeploy" karo. Code mein kuch change nahi karna.
