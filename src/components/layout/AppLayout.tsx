import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import FilterBar from './FilterBar';
import FooterBar from './FooterBar';
import { PageMetaProvider } from '@/hooks/usePageMeta';

export default function AppLayout() {
  return (
    <PageMetaProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <TopHeader />
          <FilterBar />
          <main className="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
            <div className="max-w-[1280px] mx-auto px-6 py-5">
              <Outlet />
            </div>
          </main>
          <FooterBar />
        </div>
      </div>
    </PageMetaProvider>
  );
}
