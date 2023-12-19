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