#!/bin/bash

# Add missing Excel processing services to existing F1 Dashboard installation

if [ -z "$1" ]; then
  echo "Usage: ./add-missing-services.sh /path/to/your/nextjs-project"
  echo "Example: ./add-missing-services.sh /Users/winstondevilliers/Winton_devWorx/AB_campaign_scripts_next/abdevworxcollab"
  exit 1
fi

NEXTJS_PATH="$1"

if [ ! -d "$NEXTJS_PATH" ]; then
  echo "Error: Directory $NEXTJS_PATH does not exist"
  exit 1
fi

echo "🔧 Adding missing Excel processing services..."
echo "Target: $NEXTJS_PATH"

# Create service directories if they don't exist
mkdir -p "$NEXTJS_PATH/src/services/f1-dashboard"
mkdir -p "$NEXTJS_PATH/src/hooks/f1-dashboard"

# Copy missing services
echo "📋 Copying Excel processing services..."
cp services/* "$NEXTJS_PATH/src/services/f1-dashboard/" 2>/dev/null || echo "Services already exist"
cp hooks/* "$NEXTJS_PATH/src/hooks/f1-dashboard/" 2>/dev/null || echo "Hooks already exist"

echo ""
echo "✅ Missing services added successfully!"
echo ""
echo "Now your F1 Racing Dashboard should:"
echo "- Load Excel data from public/Book1.xlsx automatically"
echo "- Show console logs of data processing"  
echo "- Display racing speedometers and circuit visualizations"
echo ""
echo "Restart your dev server: npm run dev"