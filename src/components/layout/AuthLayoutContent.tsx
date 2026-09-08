import AuthFooter from './AuthFooter';
import AuthHeader from './AuthHeader';

export default function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <AuthHeader />

      {/* Contenu principal avec scroll */}
      <main className="flex-1 overflow-y-auto">
        <div className="container-custom py-12 px-4">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
