# Complete Step-by-Step Guide: Publishing "Retro Snake" to Google Play Store

This guide walks you through the entire process of launching your app on the Google Play Store.

---

## Phase 1: Google Play Developer Account Setup

1. Go to the [Google Play Console](https://play.google.com/console/signup).
2. Sign in with your Google account.
3. Pay the **one-time $25 registration fee** (Google's standard developer fee).
4. Complete your identity verification (name, address, ID).
5. Once approved, your developer console dashboard will be active!

---

## Phase 2: Get Your App Bundle (.aab)

Google Play requires the **Android App Bundle (.aab)** format for all new app releases:

### Option A: Direct Download via AI Studio
1. In the AI Studio interface, open the **Project / Build Settings** menu (top right).
2. Select **Generate APK / AAB** or **Export Project as ZIP**.
3. Download the generated `.aab` file to your computer.

### Option B: Build via Android Studio or Terminal
1. Download or export the project ZIP.
2. Open it in Android Studio.
3. Click **Build > Generate Signed Bundle / APK > Android App Bundle**.
4. Create a keystore file (save the `.jks` file and passwords securely for future updates).
5. Android Studio will produce `app-release.aab`.

---

## Phase 3: Create the App in Google Play Console

1. In Play Console, click the blue **"Create app"** button.
2. Fill in:
   * **App name:** `Retro Snake: Classic 90s Game`
   * **Default language:** English (United States)
   * **App or game:** Game
   * **Free or paid:** Free
3. Accept the Developer Program Policies and US export laws, then click **Create app**.

---

## Phase 4: Upload Store Listing & Graphic Assets

Navigate to **Grow > Store presence > Main store listing** in the left sidebar:

1. **App Name:** `Retro Snake: Classic 90s Game` (from `play_store_assets/STORE_LISTING.md`)
2. **Short Description:** (from `play_store_assets/STORE_LISTING.md`)
3. **Full Description:** (from `play_store_assets/STORE_LISTING.md`)
4. **App Icon (512 x 512 px):**
   * Upload `play_store_assets/icon_512x512.png`
5. **Feature Graphic (1024 x 500 px):**
   * Upload `play_store_assets/feature_graphic_1024x500.png`
6. **Phone Screenshots:**
   * Take 2–4 screenshots of the game running in the emulator or on your phone (portrait mode showing the Nokia frame and LCD screen) and upload them.
7. Click **Save**.

---

## Phase 5: App Content & Policy Declarations

Go to **Policy > App content** in the sidebar:

1. **Privacy Policy:**
   * Host the file `play_store_assets/privacy_policy.html` on GitHub Pages, Google Sites, or your website.
   * Paste the public URL into the Privacy Policy field.
2. **Ads:**
   * Select *"No, my app does not contain ads"* (until you add AdMob).
3. **App Access:**
   * Select *"All functionality is available without special access"*.
4. **Content Rating (IARC):**
   * Click **Start questionnaire**.
   * Category: Game.
   * Answer **"No"** to violence, profanity, gambling, and user communications.
   * Summary result will be **PEGI 3 / Everyone (All Ages)**. Click **Save** and **Submit**.
5. **Target Audience:**
   * Select **13 and older** (or All Ages if targeting families).
6. **Data Safety Form:**
   * Answer **"No"** (the app does not collect or share user data, no user accounts required).

---

## Phase 6: Upload Your Bundle & Publish

1. Go to **Release > Production** (or **Internal testing** first if you want to test on your own device).
2. Click **Create new release**.
3. In **App bundles**, upload your `.aab` file.
4. **Release name:** e.g., `1.0.0 (First Release)`.
5. **Release notes:**
   ```
   Initial launch of Retro Snake!
   - Authentic Nokia 3310 phone frame and LCD display
   - 5 classic mazes and 9 speed levels
   - Bonus insect creatures and 8-bit sound effects
   ```
6. Click **Next** > **Save** > **Review release**.
7. Click **Start rollout to Production**!

---

## Review & Approval Time
* **First app review:** Typically takes **2 to 5 business days**.
* Once Google's automated checks and review team approve it, your app will be live worldwide on the Google Play Store!
