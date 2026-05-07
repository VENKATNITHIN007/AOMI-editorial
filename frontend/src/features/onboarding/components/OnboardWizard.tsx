"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CheckCircle2, ChevronRight, UploadCloud, X } from "lucide-react";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  useCreateProfileMutation, 
  useAddMultiplePortfolioItemsMutation, 
  useUploadFileMutation 
} from "@/features/photographer-studio/studio.queries";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";
import { photographerOnboardingSchema, type PhotographerOnboardingInput } from "@/lib/validations/photographer";

export function OnboardWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { success, error: showError } = useToast();

  const createProfileMutation = useCreateProfileMutation();
  const addPortfolioMutation = useAddMultiplePortfolioItemsMutation();
  const uploadMutation = useUploadFileMutation();

  const form = useForm<PhotographerOnboardingInput>({
    resolver: zodResolver(photographerOnboardingSchema),
    defaultValues: {
      username: "",
      location: "",
      specialties: [],
      priceFrom: "",
    },
  });

  const handleNextToDetails = () => setStep(2);

  const handleDetailsSubmit = async (data: PhotographerOnboardingInput) => {
    try {
      await createProfileMutation.mutateAsync({
        username: data.username,
        location: data.location,
        specialties: data.specialties,
        priceFrom: data.priceFrom ? Number(data.priceFrom) : undefined,
      });
      setStep(3);
    } catch (err: any) {
      showError(err.message || "Failed to create profile");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 10)); // max 10
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (selectedFiles.length === 0) {
      success("Studio created! You can add photos later.");
      router.replace("/photographer/dashboard");
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Upload files
      const uploadPromises = selectedFiles.map(file => uploadMutation.mutateAsync(file));
      const uploadedResults = await Promise.all(uploadPromises);
      
      // 2. Add to portfolio
      const items = uploadedResults.map(res => ({
        mediaUrl: res.url,
        mediaType: "image" as const,
      }));
      
      await addPortfolioMutation.mutateAsync({ items });
      
      success("Studio created with initial portfolio!");
      router.replace("/photographer/dashboard");
    } catch (err: any) {
      showError(err.message || "Failed to upload portfolio. You can try again later.");
      router.replace("/photographer/dashboard");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <div className={`size-8 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
          <span className={`text-xs font-bold uppercase tracking-[0.2em] ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>Intro</span>
        </div>
        <div className={`h-px flex-1 mx-4 ${step >= 2 ? 'bg-black' : 'bg-gray-100'}`} />
        <div className="flex items-center gap-4">
          <div className={`size-8 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
          <span className={`text-xs font-bold uppercase tracking-[0.2em] ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>Details</span>
        </div>
        <div className={`h-px flex-1 mx-4 ${step >= 3 ? 'bg-black' : 'bg-gray-100'}`} />
        <div className="flex items-center gap-4">
          <div className={`size-8 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
          <span className={`text-xs font-bold uppercase tracking-[0.2em] ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>Portfolio</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-black">
              Own Your <span className="font-bold italic">Creative</span>
            </h2>
            <p className="text-sm text-gray-400 font-light tracking-wider leading-relaxed max-w-lg mx-auto">
              Join Photophile's exclusive network of professional photographers. 
              Get a beautiful public portfolio, connect directly with clients, and manage your bookings—all with 0% commission.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
            <div className="text-center space-y-2 p-6 border border-gray-100 bg-gray-50">
              <p className="text-xl font-bold uppercase tracking-widest text-black">0%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Commission</p>
            </div>
            <div className="text-center space-y-2 p-6 border border-gray-100 bg-gray-50">
              <p className="text-xl font-bold uppercase tracking-widest text-black">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Control</p>
            </div>
            <div className="text-center space-y-2 p-6 border border-gray-100 bg-gray-50">
              <p className="text-xl font-bold uppercase tracking-widest text-black">∞</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Reach</p>
            </div>
          </div>

          <Button onClick={handleNextToDetails} className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold">
            Start Setup <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={form.handleSubmit(handleDetailsSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-light tracking-widest uppercase text-black">Studio Details</h3>
            <p className="text-xs tracking-wider text-gray-400">This information will be displayed on your public profile.</p>
          </div>

          <Form.Input
            control={form.control}
            name="username"
            label="Username"
            placeholder="your_handle"
            description="Your public URL: /photographers/[username]"
            disabled={createProfileMutation.isPending}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Form.Select
              control={form.control}
              name="location"
              label="Primary location"
              placeholder="Select city"
              options={CITY_OPTIONS}
              disabled={createProfileMutation.isPending}
            />

            <Form.Input
              control={form.control}
              name="priceFrom"
              label="Starting price (₹) / day"
              type="number"
              placeholder="e.g. 15000"
              disabled={createProfileMutation.isPending}
            />
          </div>

          <Form.MultiSelect
            control={form.control}
            name="specialties"
            label="Specialties"
            options={SPECIALTY_OPTIONS}
            description="Select up to 3 (e.g. Wedding, Fashion)"
            disabled={createProfileMutation.isPending}
          />

          <div className="pt-6 border-t border-gray-50">
            <Button type="submit" disabled={createProfileMutation.isPending} className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold">
              {createProfileMutation.isPending ? "Saving..." : "Continue to Portfolio"}
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-light tracking-widest uppercase text-black">Initial Portfolio</h3>
            <p className="text-xs tracking-wider text-gray-400">Upload up to 10 of your best images to start showcasing your work. You can add more later.</p>
          </div>

          <div className="border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center bg-gray-50/50 min-h-[200px]">
            <UploadCloud className="size-8 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-black mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mb-6">JPG, PNG up to 10MB each</p>
            <label className="cursor-pointer">
              <span className="h-10 px-6 inline-flex items-center justify-center bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-gray-50">
                Select Files
              </span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-100 group overflow-hidden border border-gray-200">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeFile(idx)}
                    className="absolute top-2 right-2 size-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row gap-4 justify-end">
            <Button onClick={handleComplete} disabled={isUploading} variant="outline" className="h-14 px-8 rounded-none text-[10px] uppercase tracking-[0.25em] font-bold border-gray-200">
              Skip for now
            </Button>
            <Button onClick={handleComplete} disabled={isUploading || selectedFiles.length === 0} className="h-14 px-12 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold">
              {isUploading ? "Uploading..." : "Complete Setup"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
