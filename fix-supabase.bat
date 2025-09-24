@echo off
echo Fixing all Supabase references...

powershell -Command "(Get-Content 'client\src\pages\resources.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\resources.tsx'"
powershell -Command "(Get-Content 'client\src\pages\results.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\results.tsx'"
powershell -Command "(Get-Content 'client\src\pages\settings.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\settings.tsx'"
powershell -Command "(Get-Content 'client\src\pages\help.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\help.tsx'"
powershell -Command "(Get-Content 'client\src\pages\lifecycle.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\lifecycle.tsx'"
powershell -Command "(Get-Content 'client\src\pages\messages.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\messages.tsx'"
powershell -Command "(Get-Content 'client\src\pages\finance.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\finance.tsx'"
powershell -Command "(Get-Content 'client\src\pages\auth-page.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\auth-page.tsx'"
powershell -Command "(Get-Content 'client\src\pages\course-registration.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\pages\course-registration.tsx'"
powershell -Command "(Get-Content 'client\src\hooks\use-language.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\hooks\use-language.tsx'"
powershell -Command "(Get-Content 'client\src\components\Sidebar.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\components\Sidebar.tsx'"
powershell -Command "(Get-Content 'client\src\components\Navbar.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\components\Navbar.tsx'"
powershell -Command "(Get-Content 'client\src\components\NotificationPanel.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\components\NotificationPanel.tsx'"
powershell -Command "(Get-Content 'client\src\components\FacilityBooking.tsx') -replace 'use-auth-supabase', 'use-auth' | Set-Content 'client\src\components\FacilityBooking.tsx'"

echo Done!