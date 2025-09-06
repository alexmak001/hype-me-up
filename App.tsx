import React, { useState } from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.9 4.8-4.8 1.9 4.8 1.9 1.9 4.8 1.9-4.8 4.8-1.9-4.8-1.9Z" />
    <path d="M5 21v-3" />
    <path d="M3.5 16.5h3" />
    <path d="M19 21v-3" />
    <path d="M17.5 16.5h3" />
  </svg>
);


const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="relative w-full max-w-lg">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-25 animate-pulse"></div>
        
        {/* Card component */}
        <div className="relative bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-2xl w-full text-center">
          <div className="flex justify-center items-center mb-6">
            <SparklesIcon className="h-12 w-12 text-primary animate-pulse"/>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
            Hype Me Up!
          </h1>
          
          <div className="mt-8">
            <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Upload an Image
            </label>
            <input 
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {imageSrc && (
            <div className="mt-8 relative w-full max-w-md mx-auto aspect-square">
              <img 
                src={imageSrc} 
                alt="Uploaded hype" 
                className="rounded-lg object-cover w-full h-full shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Hype Me Up!. All rights reserved.
      </footer>
    </main>
  );
};

export default App;