import DashboardSkeleton from '@/app/ui/skeletons';

/*
    1. loading.tsx is a special Next.js 
    file built on top of Suspense, it allows you to create fallback UI to show as a replacement while page content loads.

    2. Since <Sidebar> is static, so it's shown immediately. The user can interact with <Sidebar> while the dynamic content is loading.

    3. The user doesn't have to wait for the page to finish loading before navigating away (this is called interruptable navigation).
*/
export default function Loading() {
    //return <div>Loading...</div>;
    return <DashboardSkeleton/>
  }

/*
Now, the loading.tsx file will only apply to your dashboard overview page.

Route groups allow you to organize files into logical groups without affecting the URL path structure. 
When you create a new folder using parentheses (), the name won't be included in the URL path. 
So /dashboard/(overview)/page.tsx becomes /dashboard.

Here, you're using a route group to ensure loading.tsx only applies to your dashboard overview page. 
However, you can also use route groups to separate your application into sections 
(e.g. (marketing) routes and (shop) routes) or by teams for larger applications.
*/