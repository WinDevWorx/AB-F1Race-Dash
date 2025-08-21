#!/bin/bash

# Quick fix for dependency issues in existing F1 Dashboard installation
# Run this from your Next.js project root

echo "🔧 Fixing F1 Dashboard dependency issues..."

# Fix wouter imports in DashboardHeader.jsx
if [ -f "src/components/f1-dashboard/dashboard/DashboardHeader.jsx" ]; then
  echo "Fixing wouter import in DashboardHeader..."
  sed -i "s/import { Link } from 'wouter';//g" src/components/f1-dashboard/dashboard/DashboardHeader.jsx
fi

# Fix import paths for UI components
echo "Fixing import paths..."
find src/components/f1-dashboard -name "*.jsx" -exec sed -i 's|from "./ui/|from "../ui/|g' {} \;
find src/components/f1-dashboard -name "*.jsx" -exec sed -i 's|from "@/components/ui/|from "../ui/|g' {} \;

# Create missing badge component
if [ ! -f "src/components/f1-dashboard/ui/badge.jsx" ]; then
  echo "Creating missing badge component..."
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
fi

# Remove any toast/useToast references since they cause dependency issues
echo "Removing problematic toast dependencies..."
find src/components/f1-dashboard -name "*.jsx" -exec sed -i '/useToast/d' {} \;
find src/components/f1-dashboard -name "*.jsx" -exec sed -i '/toast({/,/});/d' {} \;

echo "✅ Dependency issues fixed!"
echo ""
echo "Now restart your Next.js dev server:"
echo "npm run dev"