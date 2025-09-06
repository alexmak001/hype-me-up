import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

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

const GIGACHAD_PROMPT = "Transform the person into a hyper-masculine, exaggerated 'Gigachad' style character. Strong, chiseled jawline, perfectly symmetrical face, sharp cheekbones, intense masculine features. Add a dramatic black-and-white aesthetic with high contrast lighting. The subject should look larger-than-life, confident, and stoic, like the famous 'Gigachad' meme. Emphasize flawless skin, sharp shadows, and a sculpted, powerful physique if visible.";
const GRAINY_PROMPT = "Apply a gritty, cinematic film-grain effect to the image. Add visible noise, scratches, and rough texture like an old 35mm film. The photo should feel raw and unpolished, with muted colors, slight desaturation, and a worn, analog aesthetic. The grain should be noticeable, giving the entire picture a rough and edgy atmosphere.";
const RED_EYES_PROMPT = "Enhance the subject with glowing, intimidating red eyes that emit a faint, fiery aura. The eyes should stand out as the focal point of the image, adding a powerful, menacing, and supernatural effect. Keep the rest of the person natural, but make the gaze intense and dominant.";


const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [modifiedImageSrc, setModifiedImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setModifiedImageSrc(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageModification = async (prompt: string) => {
    if (!imageSrc) return;

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const parts = imageSrc.split(';');
      const mimeType = parts[0].split(':')[1];
      const base64ImageData = parts[1].split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const newMimeType = part.inlineData.mimeType;
          setModifiedImageSrc(`data:${newMimeType};base64,${base64ImageBytes}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        setError("Could not generate a modified image. The model didn't return an image.");
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while modifying the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetApp = () => {
    setImageSrc(null);
    setModifiedImageSrc(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-25 animate-pulse"></div>
        
        <div className="relative bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-2xl w-full text-center">
          <div className="flex justify-center items-center mb-6">
            <SparklesIcon className="h-12 w-12 text-primary animate-pulse"/>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
            Hype Me Up!
          </h1>
          
          {!imageSrc && (
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
          )}

          {imageSrc && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="relative w-full max-w-md mx-auto aspect-square">
                <img 
                  src={modifiedImageSrc || imageSrc} 
                  alt="Hype content" 
                  className="rounded-lg object-cover w-full h-full shadow-lg"
                />
                 {isLoading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
                    <p className="text-lg font-semibold animate-pulse text-slate-100">Applying edit...</p>
                    <p className="text-sm text-muted-foreground">This might take a moment.</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 justify-center w-full">
                {!modifiedImageSrc && !isLoading && (
                  <div className="flex flex-col gap-2">
                     <button
                      onClick={() => handleImageModification(GIGACHAD_PROMPT)}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                      Gigachad Edit
                     </button>
                     <button
                      onClick={() => handleImageModification(GRAINY_PROMPT)}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                      Grainy Edit
                     </button>
                     <button
                      onClick={() => handleImageModification(RED_EYES_PROMPT)}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                      Red Eyes Edit
                     </button>
                  </div>
                )}
                <button 
                  onClick={resetApp}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full">
                  Start Over
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">{error}</p>
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
