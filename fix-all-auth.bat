@echo off
echo Fixing ALL auth imports...

REM Fix all component imports
powershell -Command "(Get-Content 'client\src\components\Sidebar.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\components\Sidebar.tsx'"
powershell -Command "(Get-Content 'client\src\components\Navbar.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\components\Navbar.tsx'"
powershell -Command "(Get-Content 'client\src\components\NotificationPanel.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\components\NotificationPanel.tsx'"
powershell -Command "(Get-Content 'client\src\components\FacilityBooking.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\components\FacilityBooking.tsx'"

REM Fix all page imports
powershell -Command "(Get-Content 'client\src\pages\auth-page.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\auth-page.tsx'"
powershell -Command "(Get-Content 'client\src\pages\course-registration.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\course-registration.tsx'"
powershell -Command "(Get-Content 'client\src\pages\finance.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\finance.tsx'"
powershell -Command "(Get-Content 'client\src\pages\help.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\help.tsx'"
powershell -Command "(Get-Content 'client\src\pages\lifecycle.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\lifecycle.tsx'"
powershell -Command "(Get-Content 'client\src\pages\messages.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\messages.tsx'"
powershell -Command "(Get-Content 'client\src\pages\resources.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\resources.tsx'"
powershell -Command "(Get-Content 'client\src\pages\results.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\results.tsx'"
powershell -Command "(Get-Content 'client\src\pages\settings.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\settings.tsx'"
powershell -Command "(Get-Content 'client\src\pages\timetable.tsx') -replace '@/hooks/use-auth-supabase', '@/hooks/use-auth' | Set-Content 'client\src\pages\timetable.tsx'"

echo All auth imports fixed!