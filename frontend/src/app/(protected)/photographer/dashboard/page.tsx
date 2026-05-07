"use client";

import { useState, useCallback } from "react";
import { Page } from "@/components/Page";
import { DataState } from "@/components/DataState";
import { RoleGate } from "@/components/guards/RoleGate";
import { 
  useMyPortfolioQuery, 
  useMyProfileQuery, 
  useUpdateProfileMutation,
  useAddMultiplePortfolioItemsMutation,
  useUploadFileMutation,
  useDeletePortfolioItemMutation
} from "@/features/photographer-studio/studio.queries";
import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Image as ImageIcon, User, Trash2, Plus, UploadCloud, X } from "lucide-react";
import { CITY_OPTIONS, SPECIALTY_OPTIONS } from "@/lib/constants/photographer";

export default function PhotographerDashboard() {
  const { data: portfolio = [], isLoading: portfolioLoading, error: portfolioError } = useMyPortfolioQuery();
  const { data: profile, isLoading: profileLoading, error: profileError } = useMyProfileQuery();
  
  const [activeTab, setActiveTab] = useState<"portfolio" | "settings">("portfolio");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { success, error: showError } = useToast();
  const updateProfileMutation = useUpdateProfileMutation();
  const addPortfolioMutation = useAddMultiplePortfolioItemsMutation();
  const uploadMutation = useUploadFileMutation();
  const deleteMutation = useDeletePortfolioItemMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      // 1. Upload to Cloudinary
      const uploadPromises = selectedFiles.map(file => 
        uploadMutation.mutateAsync({ file, folder: "portfolio" })
      );
      const results = await Promise.all(uploadPromises);
      
      // 2. Save to DB
      const items = results.map(res => ({
        mediaUrl: res.url,
        mediaType: "image" as const,
      }));
      
      await addPortfolioMutation.mutateAsync({ items });
      
      success(`${items.length} photos added to portfolio`);
      setSelectedFiles([]);
    } catch (err: any) {
      showError(err.message || "Failed to upload photos");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Remove this item from your portfolio?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      success("Item removed");
    } catch {
      showError("Failed to remove item");
    }
  };

  const isLoading = portfolioLoading || profileLoading;

  return (
    <RoleGate allowedRoles={["photographer"]}>
      <Page>
        <Page.Body className="max-w-6xl pt-10 sm:pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-300">Management</p>
              <h1 className="text-3xl font-light uppercase tracking-tight text-black">
                Studio <span className="font-bold italic">Dashboard</span>
              </h1>
            </div>

            <nav className="flex gap-8">
              {[
                { id: "portfolio", label: "Portfolio", icon: ImageIcon },
                { id: "settings", label: "Studio Settings", icon: LayoutDashboard }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-2 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${
                    activeTab === tab.id 
                      ? "border-black text-black" 
                      : "border-transparent text-gray-300 hover:text-gray-600"
                  }`}
                >
                  <tab.icon className="size-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {isLoading ? (
            <DataState.Loading />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "portfolio" && (
                <div className="space-y-12">
                  {/* Upload Section */}
                  <div className="bg-gray-50 border border-gray-100 p-8 sm:p-12">
                    <div className="max-w-xl mx-auto space-y-8">
                      <div className="text-center space-y-2">
                        <h2 className="text-lg font-light uppercase tracking-widest text-black">Expand Your Showcase</h2>
                        <p className="text-xs text-gray-400 tracking-wider">Add up to 10 images at once. Recommended: High quality WebP or JPG.</p>
                      </div>

                      <div className="border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center bg-white hover:border-black transition-colors group">
                        <UploadCloud className="size-8 text-gray-300 mb-4 group-hover:text-black transition-colors" />
                        <label className="cursor-pointer">
                          <span className="h-12 px-8 inline-flex items-center justify-center border border-black text-[10px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all">
                            Select Photos
                          </span>
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-5 gap-3">
                            {selectedFiles.map((file, idx) => (
                              <div key={idx} className="relative aspect-square bg-gray-100 border border-gray-200 group overflow-hidden">
                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => removeSelectedFile(idx)}
                                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="size-4 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <Button 
                            onClick={handleBatchUpload} 
                            disabled={isUploading}
                            className="w-full h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold"
                          >
                            {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} Photos`}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Portfolio Grid */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-black">Current Portfolio ({portfolio.length})</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                      {portfolio.map((item) => (
                        <div key={item._id} className="relative aspect-[4/5] bg-gray-50 group overflow-hidden">
                          <img 
                            src={item.mediaUrl} 
                            alt={item.category || "Portfolio work"} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                            {item.category && (
                              <span className="text-[10px] uppercase tracking-widest text-white/70 font-medium">{item.category}</span>
                            )}
                            <button 
                              onClick={() => handleDeleteItem(item._id!)}
                              className="size-10 bg-white flex items-center justify-center text-black hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {portfolio.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-dashed border-gray-100">
                          <p className="text-[10px] uppercase tracking-widest text-gray-300">Your portfolio is empty</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && profile && (
                <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-12">
                    <div className="space-y-2">
                      <h2 className="text-xl font-light uppercase tracking-widest text-black">Studio Information</h2>
                      <p className="text-xs text-gray-400 tracking-wider">Update your public availability, pricing and specialties.</p>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const specialties = Array.from(formData.getAll("specialties")) as string[];
                        
                        updateProfileMutation.mutate({
                          bio: formData.get("bio") as string,
                          location: formData.get("location") as string,
                          priceFrom: Number(formData.get("priceFrom")),
                          specialties
                        }, {
                          onSuccess: () => success("Studio settings updated")
                        });
                      }}
                      className="space-y-10"
                    >
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Public Username</label>
                            <div className="h-12 flex items-center px-4 bg-gray-50 text-gray-400 text-xs border border-transparent italic">
                              @{profile.username}
                            </div>
                            <p className="text-[9px] text-gray-300 uppercase tracking-wider">Username cannot be changed once set.</p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Location</label>
                            <select 
                              name="location" 
                              defaultValue={profile.location}
                              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-black transition-all outline-none"
                            >
                              {CITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Biography</label>
                          <textarea 
                            name="bio"
                            defaultValue={profile.bio}
                            placeholder="Tell potential clients about your style and experience..."
                            className="w-full min-h-[160px] p-4 bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-black transition-all outline-none resize-none leading-relaxed"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Starting Price (₹) / Day</label>
                          <input 
                            name="priceFrom"
                            type="number"
                            defaultValue={profile.priceFrom}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-xs focus:bg-white focus:border-black transition-all outline-none"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-4">Specialties (Select up to 3)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {SPECIALTY_OPTIONS.map(opt => (
                              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  name="specialties" 
                                  value={opt.value} 
                                  defaultChecked={profile.specialties?.includes(opt.value)}
                                  className="size-4 border-gray-200 rounded-none checked:bg-black transition-all"
                                />
                                <span className="text-[11px] text-gray-500 group-hover:text-black transition-colors">{opt.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-gray-50">
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                          className="w-full sm:w-auto px-16 h-14 bg-black hover:bg-gray-900 text-white rounded-none text-[10px] uppercase tracking-[0.25em] font-bold"
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Update Settings"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </Page.Body>
      </Page>
    </RoleGate>
  );
}
