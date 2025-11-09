# 🧠 Twitter Avatar Day/Night Switcher

Automatically switches your Twitter avatar between day and night themes based on time.

## 🚀 Quick Setup

```bash
npm install  # Installs: twitter-api-v2, dotenv
cp .env.example .env
# Edit .env with your Twitter credentials
```

Add your avatar images to `assets/`:
- `avatar_day.png` - Day avatar (active 07:00-19:00) ☀️
- `avatar_night.png` - Night avatar (active 19:00-07:00) 🌙

## 🔑 Get Twitter Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create an app with **Read and Write** permissions
3. Get your credentials from the "Keys and tokens" tab:
   - API Key
   - API Key Secret
   - Access Token
   - Access Token Secret
4. Add them to `.env`

## 🧪 Test

```bash
node switch-avatar.js
```

Output:
```
🚀 Starting Twitter Avatar Switcher...
⏰ Current time: 11/9/2025, 3:45:00 PM
🎨 Current theme: ☀️  Day
📋 Last avatar: night
🖼️  Using image: avatar_day.png
📤 Uploading avatar to Twitter...
✅ Avatar updated successfully!
💾 Cache updated successfully
🎉 Avatar switch completed successfully!
```

## ⏰ Automate with Cron

```bash
crontab -e
```

Add (replace with your path):
```cron
0 * * * * cd /path/to/twitter && /usr/bin/node switch-avatar.js >> cron.log 2>&1
```

This runs every hour. For transitions only (7am & 7pm):
```cron
0 7,19 * * * cd /path/to/twitter && /usr/bin/node switch-avatar.js >> cron.log 2>&1
```

View logs: `tail -f cron.log`

## ⚙️ Configuration

Edit `config.js` to customize:
- Time ranges (default: 7am-7pm for day theme)
- Avatar filenames
- Cache and directory paths

---

⚠️ Never commit your `.env` file!
