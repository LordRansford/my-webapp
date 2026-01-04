# About & Pricing Pages - Final Checklist

Use this checklist to verify everything is complete and working properly.

---

## Pre-Deployment Checklist

### 📸 Images

- [ ] Professional photo added to `/workspace/public/images/ransford-amponsah.jpg`
  - [ ] Size: At least 512x512px (ideally 1024x1024px)
  - [ ] Format: JPEG
  - [ ] Quality: Optimized for web (~100-200KB)
  - [ ] Content: Professional headshot, square crop

- [ ] IMechE logo/card added to `/workspace/public/images/imeche-logo.jpg` or `.png`
  - [ ] Size: At least 200x200px
  - [ ] Format: PNG preferred (transparent background)
  - [ ] Content: Shows Council Member status

- [ ] TOGAF badge added to `/workspace/public/images/togaf-badge.png`
  - [ ] Downloaded from Credly (link in docs)
  - [ ] Format: PNG
  - [ ] Size: At least 200x200px

- [ ] Placeholder images removed:
  - [ ] Deleted `placeholder-photo.svg`
  - [ ] Deleted `imeche-placeholder.svg`
  - [ ] Deleted `togaf-placeholder.svg`

### 💻 Code Updates

- [ ] Updated `/workspace/src/pages/about.js` line ~18
  - Changed `placeholder-photo.svg` to `ransford-amponsah.jpg`

- [ ] Updated `/workspace/src/pages/about.js` line ~85
  - Changed `imeche-placeholder.svg` to `imeche-logo.jpg` (or `.png`)

- [ ] Updated `/workspace/src/pages/about.js` line ~96
  - Changed `togaf-placeholder.svg` to `togaf-badge.png`

---

## Testing Checklist

### 🔍 Visual Testing

#### About Page (`/about`)

- [ ] Page loads without errors
- [ ] Professional photo displays correctly
- [ ] Photo is not distorted or stretched
- [ ] IMechE badge displays correctly
- [ ] TOGAF badge displays correctly
- [ ] All sections render properly:
  - [ ] Hero section with photo and credentials
  - [ ] Professional badges (LinkedIn, TOGAF links work)
  - [ ] "Why This Site Exists" section
  - [ ] "Who I Am" section with background box
  - [ ] "Outside of Work" grid (4 cards)
  - [ ] Gratitude section (amber background)
  - [ ] "The Short Version" (dark background)
  - [ ] Call-to-action buttons

- [ ] Gradient backgrounds display correctly
- [ ] Text is readable on all backgrounds
- [ ] Icons display properly
- [ ] Hover effects work on buttons and links

#### Pricing Page (`/pricing`)

- [ ] Page loads without errors
- [ ] Hero section with gradient background
- [ ] Three pricing tiers display correctly:
  - [ ] Free tier (left)
  - [ ] Supporter tier (center, with "Recommended" badge)
  - [ ] Pro tier (right, greyed out)
- [ ] "Credits and compute" section
- [ ] "CPD certificates" section
  - [ ] Link to About page works
- [ ] "Trust & Transparency" section
  - [ ] Creator name and credentials visible
  - [ ] Links to About and LinkedIn work
- [ ] All CTAs (call-to-action buttons) work

#### Home Page (`/`)

- [ ] Trust section mentions creator
- [ ] Link to About page works
- [ ] Creator credentials visible (CEng MIMechE, TOGAF®)

### 📱 Responsive Testing

Test at these breakpoints:

**Mobile (375px - 767px)**
- [ ] About page: Single column layout
- [ ] About page: Images scale properly
- [ ] About page: Cards stack vertically
- [ ] About page: Text is readable
- [ ] Pricing page: Cards stack vertically
- [ ] Pricing page: Text is readable
- [ ] Navigation menu works (mobile drawer)

**Tablet (768px - 1023px)**
- [ ] About page: 2-column grid for "Outside of Work"
- [ ] About page: Images scale properly
- [ ] Pricing page: 2-column grid (or scrollable)
- [ ] Navigation menu works

**Desktop (1024px+)**
- [ ] About page: 2-column grid for "Outside of Work"
- [ ] About page: All sections use full width properly
- [ ] Pricing page: 3-column grid for tiers
- [ ] Pricing page: 2-column grid for CPD section
- [ ] Navigation menu in header (not drawer)

### 🔗 Link Testing

Test all links work correctly:

**About Page**
- [ ] LinkedIn link opens in new tab
- [ ] LinkedIn URL is correct
- [ ] TOGAF Credly link opens in new tab
- [ ] TOGAF URL is correct
- [ ] "Explore Courses" button goes to `/courses`
- [ ] "Support This Work" button goes to `/support/donate`

**Pricing Page**
- [ ] "About the Creator" link goes to `/about`
- [ ] "Explore Free Courses" link goes to `/courses`
- [ ] "Start Learning Free" button goes to `/courses`
- [ ] "Browse templates" link goes to `/templates`
- [ ] "Donate" link goes to `/support/donate`
- [ ] "How compute works" link goes to `/compute`
- [ ] "Read full background" link goes to `/about`
- [ ] LinkedIn link in Trust section opens in new tab

**Navigation**
- [ ] Header "About" link goes to `/about`
- [ ] Footer "About" link goes to `/about`
- [ ] Home page "Learn about the creator" link goes to `/about`

### ♿ Accessibility Testing

- [ ] Tab through all interactive elements
- [ ] Focus indicators are visible (blue outline)
- [ ] All images have meaningful alt text
- [ ] Links describe their destination
- [ ] Buttons have clear labels
- [ ] Colour contrast is sufficient (no red/yellow flags in DevTools)
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Screen reader can read all content (test with NVDA, JAWS, or VoiceOver if available)

### ⚡ Performance Testing

- [ ] Page loads in under 3 seconds (on 3G connection)
- [ ] No layout shift when images load
- [ ] Images load progressively (blur-up effect)
- [ ] No console errors
- [ ] No console warnings
- [ ] Lighthouse score:
  - [ ] Performance: 90+
  - [ ] Accessibility: 100
  - [ ] Best Practices: 100
  - [ ] SEO: 100

---

## Content Verification

### ✍️ Text Accuracy

**About Page**
- [ ] Name spelled correctly: "Ransford Chung Amponsah"
- [ ] Credentials correct: "CEng MIMechE TOGAF®"
- [ ] LinkedIn URL correct (check the %C2%AE encoding)
- [ ] TOGAF Credly URL correct
- [ ] All qualifications mentioned accurately:
  - [ ] CEng (Chartered Engineer)
  - [ ] MIMechE (Member of Institution of Mechanical Engineers)
  - [ ] TOGAF® Certified Practitioner
  - [ ] IMechE Council Member
  - [ ] Professional Reviewer
  - [ ] Azure AI Fundamentals (AI-900)
  - [ ] Azure AI Engineer Associate (AI-102)
- [ ] Personal details accurate:
  - [ ] Ghana → UK at 16
  - [ ] Senior manager in GB energy sector digitalisation
  - [ ] Powerlifting goals (300kg squat, 100kg incline press)
  - [ ] Bike list correct (UM Commando, Triumph Rocket 3 GT, Honda NC750X, Honda CB125R)
  - [ ] Cat's name: Sesame

**Pricing Page**
- [ ] Credit system described accurately
- [ ] "Payments not enabled yet" warning present
- [ ] No false promises about features
- [ ] Disclaimers present and accurate

### 🇬🇧 British English

Check for American spellings (should all be British):
- [ ] "colour" not "color"
- [ ] "organised" not "organized"
- [ ] "favour" not "favor"
- [ ] "optimise" not "optimize"
- [ ] "emphasise" not "emphasize"

### 🎭 Tone & Style

- [ ] Professional but not stuffy
- [ ] Humorous touches present
- [ ] Personal stories included
- [ ] Not boring (specific details, varied layouts)
- [ ] Honest and accurate

---

## Browser Testing

Test in these browsers (if possible):

### Desktop
- [ ] Chrome (Windows)
- [ ] Chrome (Mac)
- [ ] Firefox (Windows)
- [ ] Firefox (Mac)
- [ ] Safari (Mac)
- [ ] Edge (Windows)

### Mobile
- [ ] Safari (iOS)
- [ ] Chrome (Android)
- [ ] Samsung Internet (Android)

---

## Final Checks

### 🔧 Technical

- [ ] No linter errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] No 404 errors for images
- [ ] All CSS loads correctly
- [ ] Favicon displays

### 📊 Analytics

- [ ] Analytics tracking code present (if using)
- [ ] Page views tracked
- [ ] Link clicks tracked (optional)

### 🔍 SEO

- [ ] Page title correct: "About Ransford Chung Amponsah - CEng MIMechE TOGAF®"
- [ ] Meta description present and accurate
- [ ] Open Graph tags present (optional but recommended)
- [ ] Twitter Card tags present (optional but recommended)
- [ ] Canonical URL correct
- [ ] Robots.txt allows crawling

---

## Deployment Checklist

### Pre-Deploy

- [ ] All tests passed
- [ ] All images optimized
- [ ] All links tested
- [ ] Browser testing complete
- [ ] Accessibility verified
- [ ] Performance acceptable

### Deploy

- [ ] Build production version: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Verify everything still works in production mode
- [ ] Deploy to hosting (Vercel, Netlify, etc.)
- [ ] Verify deployed site works
- [ ] Test from different device/network

### Post-Deploy

- [ ] About page accessible at your-domain.com/about
- [ ] Pricing page accessible at your-domain.com/pricing
- [ ] Images load correctly
- [ ] SSL certificate valid (HTTPS)
- [ ] CDN working (if using)
- [ ] No mixed content warnings

---

## Maintenance Schedule

### Weekly
- [ ] Check for broken links
- [ ] Monitor page load times

### Monthly
- [ ] Verify credentials are still current
- [ ] Check external links (LinkedIn, Credly) still work
- [ ] Review analytics (if any)

### Quarterly
- [ ] Update content if needed (new achievements, role changes)
- [ ] Refresh professional photo (annually)
- [ ] Review and update hobbies/interests
- [ ] Check for outdated information

### Annually
- [ ] Full content review
- [ ] Image optimization review
- [ ] Design refresh consideration
- [ ] SEO audit

---

## Common Issues & Fixes

### Images Not Displaying

**Problem:** Images show broken icon or don't load
**Fix:**
1. Check filename matches exactly (case-sensitive)
2. Check file is in `/workspace/public/images/`
3. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
4. Check image file isn't corrupted
5. Try opening image directly: `http://localhost:3000/images/ransford-amponsah.jpg`

### Layout Looks Broken

**Problem:** Cards overlapping, text cut off, etc.
**Fix:**
1. Check image sizes are reasonable (not 10MB+)
2. Check images are roughly square
3. Clear browser cache
4. Try different browser
5. Check console for CSS errors

### Links Not Working

**Problem:** Clicking links does nothing or goes to wrong page
**Fix:**
1. Check href path is correct
2. Check file exists at that path
3. Clear browser cache
4. Check for JavaScript errors in console

### Performance Issues

**Problem:** Page loads slowly
**Fix:**
1. Optimize images (use Squoosh)
2. Compress images (target sizes in docs)
3. Enable CDN if available
4. Check image formats (JPEG for photos, PNG for logos)
5. Consider converting to WebP

---

## Sign-Off

### By Developer
- [ ] All code changes tested locally
- [ ] All documentation reviewed
- [ ] All files committed to git
- [ ] Build tested
- [ ] Ready for deployment

### By Reviewer (if applicable)
- [ ] Content accuracy verified
- [ ] Design approved
- [ ] Links tested
- [ ] Mobile responsive confirmed
- [ ] Accessibility checked

### By Ransford (Site Owner)
- [ ] Content approved (biography, interests, etc.)
- [ ] Images approved (professional photo, badges)
- [ ] Tone and style approved
- [ ] Ready to go live

---

## Success Criteria

All these should be TRUE before deploying:

✅ About page tells your story authentically  
✅ About page showcases credentials professionally  
✅ About page is visually impressive  
✅ Pricing page builds trust  
✅ Pricing page links to About page  
✅ All images display correctly  
✅ All links work  
✅ Mobile responsive  
✅ Accessible  
✅ Fast loading  
✅ No errors  

---

## Notes

- Keep a backup of original images
- Document any customizations made
- Save this checklist for future updates
- Share feedback with the team

---

**Checklist Version:** 1.0  
**Last Updated:** January 4, 2026  
**Created by:** UI/UX Agent (Sonnet 4.5)

---

## Need Help?

Refer to these documents:
- `/workspace/QUICK-START-ABOUT-PAGE.md` - Quick setup guide
- `/workspace/ABOUT-AND-PRICING-UPDATES-SUMMARY.md` - Full summary
- `/workspace/ABOUT-PAGE-IMPLEMENTATION.md` - Technical details
- `/workspace/public/images/README.md` - Image specifications

---

Good luck! 🚀
