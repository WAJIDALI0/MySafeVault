import { SearchPageClient } from '@/features/search/components/search-page-client';

export const metadata = {
  title: 'Search | MySafeVault',
};

export default function SearchPage() {
  return (
    <div className="max-w-4xl mx-auto w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-slate-900 dark:text-white">Search Vault</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Find items securely across your entire vault.</p>
      </div>

      <SearchPageClient />
    </div>
  );
}
