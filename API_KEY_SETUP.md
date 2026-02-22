# 🎯 EASY API KEY SETUP - Follow These Steps!

## You're on the right page! Now do this:

### **Step 1: Create Your API Key** (You're here!)

On the Google AI Studio page you have open, you should see:

```
┌─────────────────────────────────────┐
│ Google AI Studio - API Keys         │
│                                     │
│ [Create API key] or [Get API key]   │
└─────────────────────────────────────┘
```

**Click the "Create API key" button**

---

### **Step 2: Choose Project**

You'll see two options:

```
○ Create API key in new project  ← Click this one!
○ Create API key in existing project
```

**Click "Create API key in new project"** (easier!)

---

### **Step 3: Copy Your Key**

You'll see:
```
┌─────────────────────────────────────┐
│ ✓ API key created                   │
│                                     │
│ AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXX │
│                                     │
│ [📋 Copy]                           │
└─────────────────────────────────────┘
```

**Click the "Copy" button** (or select and copy the key)

---

### **Step 4: Run the Setup Script**

I've created an easy setup script for you!

**Open a NEW PowerShell terminal and run:**

```powershell
cd C:\Users\rashm\Downloads\chemi\chemimind_extracted
.\setup-api-key.ps1
```

**Then paste your API key when prompted!**

---

### **Alternative: Manual Setup**

If you prefer to do it manually:

```powershell
# Open the file
notepad .env.local

# You'll see:
VITE_API_KEY=PLACEHOLDER_API_KEY

# Replace with your copied key:
VITE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Save (Ctrl+S) and close
```

---

### **Step 5: Restart Server**

In your terminal where `npm run dev` is running:

```powershell
# Stop the server
Press: Ctrl + C

# Start it again
npm run dev

# Wait for:
"Local: http://localhost:3000/"
```

---

### **Step 6: Hard Refresh Browser**

```
Press: Ctrl + Shift + R
```

This clears the cache and loads the new code!

---

### **Step 7: Test It!**

1. Go to http://localhost:3000/
2. Click "Quiz" tab
3. Select "Organic" chemistry
4. Click "Create Simulation"
5. ✅ Should generate quiz (no error!)
6. Select wrong answer → See roast! 🔥

---

## 🎉 That's It!

**Total time: 3 minutes**

Once done, you'll have:
- ✅ Working quiz generation
- ✅ Roast mode with sassy feedback
- ✅ Diagram generator
- ✅ Question organizer
- ✅ All features functional!

---

## 🆘 Need Help?

**If setup script doesn't work:**
Just manually edit `.env.local` as shown in "Alternative: Manual Setup" above.

**If quiz still fails:**
1. Check API key starts with `AIzaSy`
2. No extra spaces in `.env.local`
3. Server was restarted
4. Browser was hard refreshed

---

**You're almost there! Just follow the steps above!** 🚀
