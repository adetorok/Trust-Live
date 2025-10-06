# 🔧 DNS Fix Guide - Use GitHub Pages URL Instead of Custom Domain

## 🚨 **The Problem**
Your domain is loading content from Hostinger instead of GitHub Pages because:
1. **DNS Records** point to Hostinger IPs
2. **Custom domain** is configured in GitHub Pages
3. **Hostinger deployment** is overriding GitHub Pages

## ✅ **Solution Steps**

### **Step 1: Remove Custom Domain from GitHub Pages**

1. Go to your GitHub repository: https://github.com/adetorok/Trust-Live
2. Click **Settings** → **Pages**
3. Under **Custom domain**, **clear/remove** your domain name
4. Click **Save**
5. **Uncheck** "Enforce HTTPS" (if enabled)

**Result**: Your site will be available at https://adetorok.github.io/TRUST/

### **Step 2: Verify GitHub Pages Deployment**

1. Go to your repository: https://github.com/adetorok/Trust-Live
2. Click **Actions** tab
3. Look for "Deploy Frontend to GitHub Pages" workflow
4. Make sure it runs successfully
5. Check **Settings** → **Pages** to confirm deployment

### **Step 3: Test Your Site**

- **GitHub Pages URL**: https://adetorok.github.io/TRUST/
- **Your Custom Domain**: Will redirect to GitHub Pages (if configured)

## 🔍 **How to Verify It's Working**

### **Website Check**
- **GitHub Pages**: https://adetorok.github.io/TRUST/ (should load your site)
- **Custom Domain**: Should redirect to GitHub Pages URL

### **Deployment Check**
- Go to repository **Actions** tab
- Look for successful "Deploy Frontend to GitHub Pages" runs
- Check **Settings** → **Pages** for deployment status

## 🚀 **Current Deployment Setup**

After this fix, you'll have:
- **Main Site**: https://adetorok.github.io/TRUST/ (GitHub Pages)
- **Custom Domain**: Redirects to GitHub Pages (optional)
- **Hostinger**: Disabled (not used)

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
