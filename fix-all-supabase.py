import os
import glob

# Root directory
root_dir = "client/src"

# Files to fix
files_to_fix = [
    "client/src/pages/timetable.tsx",
    "client/src/pages/resources.tsx",
    "client/src/pages/results.tsx", 
    "client/src/pages/settings.tsx",
    "client/src/pages/help.tsx",
    "client/src/pages/lifecycle.tsx",
    "client/src/pages/messages.tsx",
    "client/src/pages/finance.tsx",
    "client/src/pages/auth-page.tsx",
    "client/src/pages/course-registration.tsx",
    "client/src/hooks/use-language.tsx",
    "client/src/components/Sidebar.tsx",
    "client/src/components/Navbar.tsx",
    "client/src/components/NotificationPanel.tsx",
    "client/src/components/FacilityBooking.tsx"
]

# Replace patterns
replacements = [
    ("use-auth-supabase", "use-auth"),
    ("supabaseApi", "// supabaseApi - removed"),
    ("from '@/lib/supabase'", "// from '@/lib/supabase' - removed")
]

fixed_count = 0

for filepath in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        for old_text, new_text in replacements:
            content = content.replace(old_text, new_text)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {filepath}")
            fixed_count += 1
        else:
            print(f"⏭️ No changes needed: {filepath}")
    else:
        print(f"❌ File not found: {filepath}")

print(f"\n🎯 Fixed {fixed_count} files total!")