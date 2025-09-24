#!/bin/bash

# Fix all Supabase auth imports to use regular auth
echo "Fixing all Supabase references..."

# List of files to fix
files=(
  "client/src/pages/timetable.tsx"
  "client/src/pages/resources.tsx"
  "client/src/pages/results.tsx"
  "client/src/pages/settings.tsx"
  "client/src/pages/help.tsx"
  "client/src/pages/lifecycle.tsx"
  "client/src/pages/messages.tsx"
  "client/src/pages/finance.tsx"
  "client/src/pages/auth-page.tsx"
  "client/src/pages/course-registration.tsx"
  "client/src/hooks/use-language.tsx"
  "client/src/components/Sidebar.tsx"
  "client/src/components/Layout.tsx"
  "client/src/components/Navbar.tsx"
  "client/src/components/NotificationPanel.tsx"
  "client/src/components/FacilityBooking.tsx"
)

# Replace in each file
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    sed -i 's/use-auth-supabase/use-auth/g' "$file"
  fi
done

echo "Done! All Supabase auth references fixed."