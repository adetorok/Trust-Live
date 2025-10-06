# 🔧 DNS Fix Guide - Stop GitHub Pages from Loading on Your Domain

## 🚨 **The Problem**
Your domain is loading content from GitHub Pages instead of Hostinger because:
1. **DNS Records** point to GitHub Pages IPs
2. **GitHub Pages** has a custom domain configured
3. **Multiple deployment workflows** are running simultaneously

## ✅ **Solution Steps**

### **Step 1: Disable GitHub Pages Custom Domain**

1. Go to your GitHub repository: https://github.com/adetorok/Trust-Live
2. Click **Settings** → **Pages**
3. Under **Custom domain**, **clear/remove** your domain name
4. Click **Save**
5. **Uncheck** "Enforce HTTPS" (if enabled)

### **Step 2: Fix DNS Records at Hostinger**

#### **A. Login to Hostinger hPanel**
- Go to your Hostinger account
- Navigate to **Domains** → **DNS Zone Editor**

#### **B. Remove GitHub Pages DNS Records**
Delete these records if they exist:
```
Type: A
Name: @
Value: 185.199.108.153

Type: A  
Name: @
Value: 185.199.109.153

Type: A
Name: @  
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: adetorok.github.io
```

#### **C. Add Hostinger DNS Records**
Add these records (get exact values from Hostinger):
```
Type: A
Name: @
Value: [YOUR_HOSTINGER_IP] (e.g., 192.168.1.100)

Type: CNAME  
Name: www
Value: @ (or your Hostinger domain)
```

### **Step 3: Verify Nameservers**

Make sure your domain uses Hostinger nameservers:
- **Hostinger Nameservers** (check in hPanel):
  - `ns1.dns-parking.com`
  - `ns2.dns-parking.com`
- If not, update them at your domain registrar

### **Step 4: Wait for DNS Propagation**

- **Time**: 5-30 minutes (up to 24 hours)
- **Test**: Use online DNS checker tools
- **Check**: `nslookup yourdomain.com` should show Hostinger IP

### **Step 5: Clear Browser Cache**

- Clear browser cache and cookies
- Try incognito/private browsing
- Test on different devices/networks

## 🔍 **How to Verify It's Fixed**

### **DNS Check**
Run these commands or use online tools:
```bash
# Should show Hostinger IP, NOT GitHub IPs
nslookup yourdomain.com
nslookup www.yourdomain.com
```

### **Website Check**
- **Your Domain**: Should load Hostinger content
- **GitHub Pages**: https://adetorok.github.io/TRUST/ (for previews only)

## 🚀 **Current Deployment Setup**

After this fix, you'll have:
- **Production**: Your domain → Hostinger (main site)
- **Preview**: https://adetorok.github.io/TRUST/ (GitHub Pages for testing)

## 📋 **Quick Checklist**

- [ ] Disabled GitHub Pages custom domain
- [ ] Removed GitHub Pages DNS records
- [ ] Added Hostinger DNS records  
- [ ] Verified nameservers point to Hostinger
- [ ] Waited for DNS propagation
- [ ] Cleared browser cache
- [ ] Tested domain loads Hostinger content

## 🆘 **Still Not Working?**

### **Check These:**
1. **Nameservers**: Must be Hostinger's
2. **DNS Propagation**: Use https://dnschecker.org
3. **Browser Cache**: Clear completely
4. **CDN**: Clear any CDN cache (Cloudflare, etc.)

### **Common Issues:**
- **Wrong IP**: Get correct Hostinger IP from hPanel
- **Caching**: Wait longer or clear all caches
- **Nameservers**: Update at domain registrar, not Hostinger

## 📞 **Need Help?**

- **Hostinger Support**: Check hPanel → Support
- **Domain Registrar**: Contact them for nameserver changes
- **DNS Tools**: Use https://dnschecker.org for verification

---

**After completing these steps, your domain will load from Hostinger instead of GitHub Pages! 🎉**
