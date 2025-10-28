'use client';

export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
}