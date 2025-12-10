"use client";

const logos = [
  { name: 'ISO 27001', svg: <ISO27001Logo /> },
  { name: 'BSI IT-Grundschutz', svg: <BSILogo /> },
  { name: 'ADESS', svg: <ADESSLogo /> },
  { name: 'Campus Cyber', svg: <CampusCyberLogo /> },
  { name: 'ANSSI', svg: <ANSSILogo /> },
];

export function LogoCarousel() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Trusted by leading standards and institutions
        </h2>
        <div className="mt-8 relative overflow-hidden">
          <div className="flex animate-scroll group-hover:animation-pause">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-16 flex items-center justify-center mx-8"
              >
                {logo.svg}
              </div>
            ))}
          </div>
          <style jsx>{`
            @keyframes scroll {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
            .animate-scroll {
              animation: scroll 40s linear infinite;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

function ISO27001Logo() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
      <span className="font-bold text-lg">ISO 27001</span>
    </div>
  );
}
function BSILogo() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <span className="font-bold text-lg">BSI</span>
    </div>
  );
}
function ADESSLogo() {
  return <span className="font-bold text-xl text-gray-500">ADESS</span>;
}
function CampusCyberLogo() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
      <span className="font-semibold text-sm">CAMPUS <br/> CYBER</span>
    </div>
  );
}
function ANSSILogo() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
      <span className="font-bold text-xl">ANSSI</span>
    </div>
  );
}
