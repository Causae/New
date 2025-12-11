import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authBackgroundImage = PlaceHolderImages.find(p => p.id === 'auth-background');

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {authBackgroundImage && (
         <Image
            src={authBackgroundImage.imageUrl}
            alt={authBackgroundImage.description}
            fill
            className="object-cover -z-20"
            data-ai-hint={authBackgroundImage.imageHint}
          />
      )}
      <div className="absolute inset-0 bg-black/50 -z-10" />
       <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-white" />
            <span className="text-xl font-bold tracking-tight text-white">
              CAUSAE
            </span>
          </Link>
       </div>
      {children}
    </div>
  );
}