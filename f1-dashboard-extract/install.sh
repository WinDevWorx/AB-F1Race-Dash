#!/bin/bash

# F1 Racing Dashboard Installation Script for Next.js
# Usage: ./install.sh /path/to/your/nextjs-project

if [ -z "$1" ]; then
  echo "❌ Error: Please provide the path to your Next.js project"
  echo "Usage: ./install.sh /path/to/your/nextjs-project"
  echo "Example: ./install.sh /Users/username/my-nextjs-app"
  exit 1
fi

NEXTJS_PATH="$1"

if [ ! -d "$NEXTJS_PATH" ]; then
  echo "❌ Error: Directory $NEXTJS_PATH does not exist"
  exit 1
fi

if [ ! -f "$NEXTJS_PATH/package.json" ]; then
  echo "❌ Error: $NEXTJS_PATH does not appear to be a Next.js project (no package.json found)"
  exit 1
fi

echo "🏎️ Installing F1 Racing Dashboard..."
echo "Target: $NEXTJS_PATH"
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p "$NEXTJS_PATH/src/components/f1-dashboard"
mkdir -p "$NEXTJS_PATH/src/styles/f1-dashboard"
mkdir -p "$NEXTJS_PATH/src/services/f1-dashboard"
mkdir -p "$NEXTJS_PATH/src/hooks/f1-dashboard"
mkdir -p "$NEXTJS_PATH/src/utils/f1-dashboard"
mkdir -p "$NEXTJS_PATH/src/pages"

# Copy files
echo "📋 Copying F1 dashboard components..."
cp -r src/components/f1-dashboard/* "$NEXTJS_PATH/src/components/f1-dashboard/"

echo "🎨 Copying F1 dashboard styles..."
cp -r src/styles/f1-dashboard/* "$NEXTJS_PATH/src/styles/f1-dashboard/"

echo "📄 Copying dashboard page..."
cp src/pages/dashboard.js "$NEXTJS_PATH/src/pages/"

echo "⚙️ Copying Excel processing services..."
cp services/* "$NEXTJS_PATH/src/services/f1-dashboard/" 2>/dev/null || echo "   Services copied from extraction"
cp hooks/* "$NEXTJS_PATH/src/hooks/f1-dashboard/" 2>/dev/null || echo "   Hooks copied from extraction"
cp utils/* "$NEXTJS_PATH/src/utils/f1-dashboard/" 2>/dev/null || echo "   Utils copied from extraction"

# Install dependencies
echo "📦 Installing required dependencies..."
cd "$NEXTJS_PATH"
npm install xlsx

# Create missing UI components if needed
if [ ! -f "$NEXTJS_PATH/src/components/f1-dashboard/ui/badge.jsx" ]; then
  echo "📋 Creating missing UI components..."
fi

echo ""
echo "✅ F1 Racing Dashboard installed successfully!"
echo ""
echo "🔧 Next Steps:"
echo "1. Add CSS imports to your pages/_app.js:"
echo "   import '../src/styles/f1-dashboard/Dashboard.module.css'"
echo "   import '../src/styles/f1-dashboard/RacingComponents.module.css'"
echo "   import '../src/styles/f1-dashboard/RacingGauge.module.css'"
echo "   import '../src/styles/f1-dashboard/TrackVisualization.module.css'"
echo "   import '../src/styles/f1-dashboard/theme.css'"
echo ""
echo "2. Place your Excel file in the public folder:"
echo "   cp Book1.xlsx public/Book1.xlsx"
echo ""
echo "3. Start your development server:"
echo "   npm run dev"
echo ""
echo "4. Access the dashboard:"
echo "   http://localhost:3000/dashboard"
echo ""
echo "🏆 Features included:"
echo "- Championship Standings with racing speedometer"
echo "- Team Racing (Monaco/Kyalami circuits)"
echo "- Circuit-specific visualizations"
echo "- Pit Crew performance details"
echo "- Authentic F1 racing theme design"
echo "- Automatic Excel monitoring and data processing"
echo "- Console logging for data debugging"

echo ""
echo "📊 Expected console output after starting:"
echo "- 'Starting Excel monitor...'"
echo "- 'Excel data loaded successfully: X rows'"
echo "- 'Processing Excel data with supervisor-focused structure...'"