# 🏎️ F1 Racing Dashboard - Next.js Installation Guide

## Overview
This package provides a complete F1-themed sales dashboard with racing gauges, circuit visualizations, and team performance tracking.

## Quick Installation

### 1. Copy Files to Your Next.js Project

```bash
# Navigate to your Next.js project root
cd /path/to/your/nextjs-app

# Copy all F1 dashboard files
cp -r f1-dashboard-extract/src/* src/

# Or copy manually:
# - Copy f1-dashboard-extract/src/components/f1-dashboard/ to src/components/f1-dashboard/
# - Copy f1-dashboard-extract/src/styles/f1-dashboard/ to src/styles/f1-dashboard/
# - Copy f1-dashboard-extract/src/pages/dashboard.js to src/pages/dashboard.js
```

### 2. Install Required Dependencies

```bash
npm install xlsx
```

### 3. Add CSS Imports to _app.js

```javascript
// pages/_app.js
import '../src/styles/f1-dashboard/Dashboard.module.css'
import '../src/styles/f1-dashboard/RacingComponents.module.css'
import '../src/styles/f1-dashboard/RacingGauge.module.css'
import '../src/styles/f1-dashboard/TrackVisualization.module.css'
import '../src/styles/f1-dashboard/theme.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

### 4. Place Excel File

```bash
# Place your Excel file in the public folder
cp Book1.xlsx public/Book1.xlsx
```

### 5. Access Dashboard

Navigate to: `http://localhost:3000/dashboard`

## Directory Structure

```
src/
├── components/
│   └── f1-dashboard/
│       ├── F1RacingDashboard.jsx      # Main component
│       ├── circuits/                   # Monaco & Kyalami views
│       ├── dashboard/                  # Layout components
│       ├── gauges/                     # Racing speedometer
│       ├── pitcrew/                    # Team details
│       ├── racing/                     # Team racing view
│       └── ui/                         # UI components
├── styles/
│   └── f1-dashboard/
│       ├── Dashboard.module.css        # Main dashboard styles
│       ├── RacingComponents.module.css # Racing themed styles
│       ├── RacingGauge.module.css     # Speedometer styles
│       ├── TrackVisualization.module.css # Circuit track styles
│       └── theme.css                   # Global F1 theme
└── pages/
    └── dashboard.js                    # Dashboard page
```

## Features

### 🏆 Championship Standings
- Semi-circular racing speedometer
- Performance categories (Superstar, Target Achieved, On Track, Needs Boost, Recovery Mode)
- Company-wide metrics and KPI tracking

### 🏁 Team Racing
- Monaco and Kyalami circuit teams
- Team performance comparison
- Color-coded achievement levels

### 🇲🇨 Monaco Circuit
- Monaco track visualization
- Circuit-specific leaderboards
- Driver performance metrics

### 🇿🇦 Kyalami Circuit  
- Kyalami track layout
- South African circuit team tracking
- Regional performance analytics

### 👥 Pit Crew Details
- Individual consultant performance
- Supervisor team management
- Performance level categorization

## Excel File Requirements

Your `Book1.xlsx` must contain these columns:
- `Supervisor Name` - Team supervisor/manager
- `Consultant Name` - Individual consultant/employee  
- `TotalSalesVal` - Actual sales value
- `SalesValTarget` - Sales target value
- `TotalRealAppsVol` - Actual applications volume
- `RealAppsTarget` - Applications target

## Customization

### Change Excel File Path
```javascript
// In your page component
<F1RacingDashboard excelPath="/your-custom-file.xlsx" />
```

### Modify Circuit Assignments
Edit the `getCircuitAssignment` function in `F1RacingDashboard.jsx` to customize which supervisors belong to Monaco vs Kyalami circuits.

### Color Themes
Modify the CSS variables in `theme.css` to match your brand colors while keeping the F1 racing aesthetics.

## Troubleshooting

### Dependency Errors
If you get errors like "Module not found: Can't resolve 'wouter'", run the fix script:
```bash
cd f1-dashboard-extract
./fix-dependencies.sh
```

### Excel File Not Loading
- Ensure file is in `public/` folder
- Check file permissions
- Verify column names match requirements

### Styling Issues
- Ensure all CSS files are imported in `_app.js`
- Check for CSS module conflicts
- Verify Tailwind CSS is not overriding styles

### Performance Issues
- Large Excel files (>1000 rows) may need optimization
- Consider implementing pagination for very large datasets

## Support

This dashboard integrates seamlessly with existing Next.js applications and provides real-time Excel data processing with authentic F1 racing visuals.