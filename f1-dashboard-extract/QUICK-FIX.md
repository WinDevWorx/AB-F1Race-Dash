# Quick Fix for Wouter Dependency Error

## Problem
You're getting this error:
```
Module not found: Can't resolve 'wouter'
```

## Solution Options

### Option 1: Run the Fix Script
```bash
# Make script executable and run
chmod +x f1-dashboard-extract/fix-dependencies.sh
./f1-dashboard-extract/fix-dependencies.sh
```

### Option 2: Manual Fix (if script doesn't work)
```bash
# Navigate to your Next.js project
cd /Users/winstondevilliers/Winton_devWorx/AB_campaign_scripts_next/abdevworxcollab

# Fix the wouter import
sed -i '' "s/import { Link } from 'wouter';//g" src/components/f1-dashboard/dashboard/DashboardHeader.jsx

# Fix import paths
find src/components/f1-dashboard -name "*.jsx" -exec sed -i '' 's|from "./ui/|from "../ui/|g' {} \;

# Create missing badge component
cat > src/components/f1-dashboard/ui/badge.jsx << 'EOF'
import React from 'react';

export function Badge({ children, className = '', variant = 'default' }) {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold';
  const variantClasses = {
    default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border-transparent bg-gray-600 text-white hover:bg-gray-700',
    destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
    outline: 'text-gray-900 border-gray-300'
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
EOF
```

### Option 3: Copy Fixed Files Directly
```bash
# Copy the corrected components from the extraction package
cp -r f1-dashboard-extract/src/components/f1-dashboard/* /Users/winstondevilliers/Winton_devWorx/AB_campaign_scripts_next/abdevworxcollab/src/components/f1-dashboard/
```

## After Fix
1. Restart your development server: `npm run dev`
2. Access the dashboard: `http://localhost:3000/dashboard`
3. You should see the F1 racing design with speedometers and circuit visualizations

The issue was that the components were copied from the Replit environment which uses wouter for routing, but Next.js has its own routing system. The fix removes these dependencies and makes the components work with standard React.