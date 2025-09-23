const API_URL = 'https://student-portal-system-theta.vercel.app';

async function testAPI() {
  console.log('🧪 Testing Student Portal API...\n');
  
  // 1. Test health endpoint
  console.log('1️⃣ Testing /api/health');
  try {
    const health = await fetch(`${API_URL}/api/health`);
    const healthData = await health.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // 2. Test the test endpoint
  console.log('\n2️⃣ Testing /api/test');
  try {
    const test = await fetch(`${API_URL}/api/test`);
    const testData = await test.json();
    console.log('✅ Test endpoint:', testData);
  } catch (error) {
    console.log('❌ Test endpoint failed:', error.message);
  }
  
  // 3. Test login
  console.log('\n3️⃣ Testing login with admin credentials');
  let cookies = '';
  try {
    const login = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      }),
      credentials: 'include'
    });
    
    if (login.ok) {
      const userData = await login.json();
      console.log('✅ Login successful:', { id: userData.id, username: userData.username });
      
      // Extract cookies from response
      const setCookies = login.headers.get('set-cookie');
      if (setCookies) {
        cookies = setCookies;
      }
    } else {
      const error = await login.text();
      console.log('❌ Login failed:', login.status, error);
    }
  } catch (error) {
    console.log('❌ Login request failed:', error.message);
  }
  
  // 4. Test authenticated endpoint
  console.log('\n4️⃣ Testing /api/user (authenticated)');
  try {
    const user = await fetch(`${API_URL}/api/user`, {
      headers: {
        'Cookie': cookies
      },
      credentials: 'include'
    });
    
    if (user.ok) {
      const userData = await user.json();
      console.log('✅ User data retrieved:', userData);
    } else {
      console.log('❌ User endpoint returned:', user.status);
    }
  } catch (error) {
    console.log('❌ User request failed:', error.message);
  }
  
  // 5. Test courses endpoint
  console.log('\n5️⃣ Testing /api/courses');
  try {
    const courses = await fetch(`${API_URL}/api/courses`);
    if (courses.ok) {
      const coursesData = await courses.json();
      console.log('✅ Courses retrieved:', coursesData.length, 'courses');
      if (coursesData.length > 0) {
        console.log('   First course:', coursesData[0]);
      }
    } else {
      console.log('❌ Courses endpoint returned:', courses.status);
    }
  } catch (error) {
    console.log('❌ Courses request failed:', error.message);
  }
  
  // 6. Test dashboard (authenticated)
  console.log('\n6️⃣ Testing /api/dashboard (authenticated)');
  try {
    const dashboard = await fetch(`${API_URL}/api/dashboard`, {
      headers: {
        'Cookie': cookies
      },
      credentials: 'include'
    });
    
    if (dashboard.ok) {
      const dashboardData = await dashboard.json();
      console.log('✅ Dashboard data retrieved:');
      console.log('   - User:', dashboardData.user?.username);
      console.log('   - Enrollments:', dashboardData.enrollments?.length || 0);
      console.log('   - Announcements:', dashboardData.announcements?.length || 0);
      console.log('   - Tasks:', dashboardData.tasks?.length || 0);
    } else {
      console.log('❌ Dashboard endpoint returned:', dashboard.status);
    }
  } catch (error) {
    console.log('❌ Dashboard request failed:', error.message);
  }
  
  console.log('\n✅ API testing complete!');
}

// Run the tests
testAPI().catch(console.error);