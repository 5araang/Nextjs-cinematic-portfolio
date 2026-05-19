"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { FiArrowLeft, FiPlus, FiTrash2, FiUploadCloud, FiImage, FiLink, FiCheckCircle, FiStar, FiMonitor } from "react-icons/fi";
import AdminNav from "@/components/admin/AdminNav";

export default function AddProjectPage() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    techStack: "",
    displayNumber: "",
    projectLink: "",
    mainImageUrl: "",
    additionalImages: [], 
    description: "",
    review: "",
    client: "",
    month: "",
    year: "",
    logo_full_view_url: "",
    desktop_view_url: "",
    phone_view_url: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file && form.additionalImages.length < 10) {
      const url = URL.createObjectURL(file);
      setForm(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, { file, url }]
      }));
    }
  };

  const handleSingleImage = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, [field]: url, [`${field}_file`]: file }));
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const uploadFile = async (file) => {
        if (!file) return null;
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        return data.url;
      };

      const image_url = form.mainImage_file ? await uploadFile(form.mainImage_file) : form.mainImageUrl;
      const logo_full_view_url = form.logo_file ? await uploadFile(form.logo_file) : form.logo_full_view_url;
      const desktop_view_url = form.desktop_file ? await uploadFile(form.desktop_file) : form.desktop_view_url;
      const phone_view_url = form.phone_file ? await uploadFile(form.phone_file) : form.phone_view_url;
      
      const gallery = [];
      for (const img of form.additionalImages) {
        if (img.file) {
          const url = await uploadFile(img.file);
          if (url) gallery.push(url);
        } else {
          gallery.push(img.url);
        }
      }

      const payload = {
        title: form.title,
        category: form.category || 'Website',
        tech: form.techStack,
        sort_order: parseInt(form.displayNumber) || 0,
        link: form.projectLink,
        image_url,
        description: form.description,
        review: form.review,
        client: form.client,
        month: form.month,
        year: form.year,
        logo_full_view_url,
        desktop_view_url,
        phone_view_url,
        gallery,
      };

      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('[add-project] Server error:', result);
        throw new Error(result.error || `Server returned ${res.status}`);
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      
    } catch (err) {
      console.error('[add-project] Submit error:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const catLower = (form.category || "").toLowerCase();
  let titleLabel = "Project Title *";
  let titlePlaceholder = "e.g. Creative Developer";
  let techLabel = "Tech stack";
  let techPlaceholder = "e.g. React · Next.js · GSAP";

  if (catLower.includes("photo")) {
    titleLabel = "Photo Shoot Name *";
    titlePlaceholder = "e.g. Urban Architecture";
    techLabel = "Camera / Gear";
    techPlaceholder = "e.g. Sony A7IV · 35mm f/1.4";
  } else if (catLower.includes("video")) {
    titleLabel = "Video Project Name *";
    titlePlaceholder = "e.g. Cinematic Edit";
    techLabel = "Software / Gear";
    techPlaceholder = "e.g. Premiere Pro · RED Komodo";
  } else if (catLower.includes("design")) {
    titleLabel = "Design Project Name *";
    titlePlaceholder = "e.g. Brand Identity";
    techLabel = "Design Tools";
    techPlaceholder = "e.g. Photoshop · Illustrator";
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff6b1a]/60 transition-all duration-300 text-sm";
  const labelClass = "text-[10px] text-white/40 tracking-[0.3em] uppercase mb-2 block font-medium";

  return (
    <div className="admin-cursor min-h-screen bg-[#080808] text-white font-sans pb-20">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-6 pt-32 admin-main">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/projects" 
              className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              <FiArrowLeft />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight">New Project</h1>
              <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mt-1">Portfolio Management System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
              submitted ? "border-green-500/50 text-green-500 bg-green-500/5" : "border-white/10 text-white/30"
            }`}>
              {submitted ? "Changes Saved" : "Editing Draft"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Core Details */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#ff6b1a]/10 flex items-center justify-center text-[#ff6b1a]">
                  <FiMonitor size={16} />
                </div>
                <h2 className="text-lg font-bold tracking-tight">Core Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>{titleLabel}</label>
                  <input 
                    required
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder={titlePlaceholder} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <input 
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    placeholder="e.g. WEB & INTERACTION" 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>{techLabel}</label>
                  <input 
                    name="techStack"
                    value={form.techStack}
                    onChange={handleInputChange}
                    placeholder={techPlaceholder} 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Display number</label>
                  <input 
                    name="displayNumber"
                    value={form.displayNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 01" 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Project Link</label>
                <div className="relative">
                  <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    name="projectLink"
                    value={form.projectLink}
                    onChange={handleInputChange}
                    placeholder="https://..." 
                    className={inputClass + " pl-12"} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className={labelClass}>Client</label>
                  <input 
                    name="client"
                    value={form.client}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corp" 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Month</label>
                  <input 
                    name="month"
                    value={form.month}
                    onChange={handleInputChange}
                    placeholder="e.g. October" 
                    className={inputClass} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Year</label>
                  <input 
                    name="year"
                    value={form.year}
                    onChange={handleInputChange}
                    placeholder="e.g. 2026" 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea 
                  required
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Tell the story of this project..." 
                  className={inputClass + " resize-none"} 
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <FiStar className="text-yellow-500/60" size={16} />
                  <h3 className="text-sm font-bold tracking-tight text-white/80">Review / Testimonial</h3>
                </div>
                <textarea 
                  name="review"
                  value={form.review}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="What did the client say? (Optional)" 
                  className={inputClass + " resize-none bg-yellow-500/[0.02] border-yellow-500/10"} 
                />
              </div>
            </div>
          </div>

          {/* Right Column: Visuals & Preview */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Main Visual / Hover Card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                    <FiImage size={16} />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight">Hover Card</h2>
                </div>
                <span className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Main Preview</span>
              </div>

              <div className="group relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 transition-all hover:border-[#ff6b1a]/40 shadow-2xl cursor-pointer" onClick={() => !form.mainImageUrl && document.getElementById('main_upload').click()}>
                {form.mainImageUrl ? (
                  <>
                    <img src={form.mainImageUrl} className="w-full h-full object-cover opacity-80" alt="Main" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                      <p className="text-[10px] text-[#ff6b1a] italic font-medium mb-1">{form.techStack || "Tech Stack"}</p>
                      <h4 className="text-xl font-black tracking-tighter">{form.title || "Project Title"}</h4>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setForm(prev => ({...prev, mainImageUrl: "", mainImage_file: null})) }}
                        className="bg-red-500/80 p-3 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/[0.01]">
                    <FiUploadCloud className="text-4xl text-white/10 mb-4 group-hover:text-[#ff6b1a] transition-colors" />
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.3em]">Tap to select image from gallery</p>
                  </div>
                )}
                <input type="file" id="main_upload" hidden accept="image/*" onChange={(e) => handleSingleImage(e, 'mainImageUrl')} />
              </div>

              <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo Full View */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold tracking-tight text-white/60">Logo Full View</h3>
                  </div>
                  <div 
                    onClick={() => document.getElementById('logo_upload').click()}
                    className="group relative aspect-video bg-white/5 rounded-xl overflow-hidden border border-dashed border-white/10 hover:border-[#ff6b1a]/30 cursor-pointer flex items-center justify-center transition-all"
                  >
                    {form.logo_full_view_url ? (
                      <>
                        <img src={form.logo_full_view_url} className="w-full h-full object-contain p-2" alt="Logo" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button type="button" className="text-red-400 hover:text-red-500 bg-black/50 p-2 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setForm(prev => ({...prev, logo_full_view_url: "", logo_file: null})); }}>
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <FiPlus className="text-white/20 group-hover:text-[#ff6b1a] transition-colors" size={24} />
                    )}
                  </div>
                  <input type="file" id="logo_upload" hidden accept="image/*" onChange={(e) => handleSingleImage(e, 'logo_full_view_url')} />
                </div>

                {/* Desktop Cover */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold tracking-tight text-white/60">Desktop Cover</h3>
                  </div>
                  <div 
                    onClick={() => document.getElementById('desktop_upload').click()}
                    className="group relative aspect-video bg-white/5 rounded-xl overflow-hidden border border-dashed border-white/10 hover:border-[#ff6b1a]/30 cursor-pointer flex items-center justify-center transition-all"
                  >
                    {form.desktop_view_url ? (
                      <>
                        <img src={form.desktop_view_url} className="w-full h-full object-cover" alt="Desktop" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button type="button" className="text-red-400 hover:text-red-500 bg-black/50 p-2 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setForm(prev => ({...prev, desktop_view_url: "", desktop_file: null})); }}>
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <FiPlus className="text-white/20 group-hover:text-[#ff6b1a] transition-colors" size={24} />
                    )}
                  </div>
                  <input type="file" id="desktop_upload" hidden accept="image/*" onChange={(e) => handleSingleImage(e, 'desktop_view_url')} />
                </div>

                {/* Mobile Cover */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold tracking-tight text-white/60">Mobile Cover</h3>
                    <span className="text-[8px] text-[#ff6b1a] uppercase tracking-[0.2em] border border-[#ff6b1a]/30 px-1.5 py-0.5 rounded-full bg-[#ff6b1a]/5">9:16</span>
                  </div>
                  <div 
                    onClick={() => document.getElementById('phone_upload').click()}
                    className="group relative aspect-[9/16] w-2/3 mx-auto bg-white/5 rounded-xl overflow-hidden border border-dashed border-white/10 hover:border-[#ff6b1a]/30 cursor-pointer flex items-center justify-center transition-all"
                  >
                    {form.phone_view_url ? (
                      <>
                        <img src={form.phone_view_url} className="w-full h-full object-cover" alt="Phone" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button type="button" className="text-red-400 hover:text-red-500 bg-black/50 p-2 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setForm(prev => ({...prev, phone_view_url: "", phone_file: null})); }}>
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <FiPlus className="text-white/20 group-hover:text-[#ff6b1a] transition-colors" size={24} />
                    )}
                  </div>
                  <input type="file" id="phone_upload" hidden accept="image/*" onChange={(e) => handleSingleImage(e, 'phone_view_url')} />
                </div>
              </div>

              {/* Gallery */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold tracking-tight text-white/60">Project Gallery</h3>
                  <span className="text-[10px] text-white/20">{form.additionalImages.length} / 10</span>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {form.additionalImages.map((img, idx) => (
                    <div key={idx} className="group relative aspect-square bg-white/5 rounded-xl overflow-hidden border border-white/5">
                      <img src={img.url} className="w-full h-full object-cover" alt={`Gall ${idx}`} />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="text-red-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {form.additionalImages.length < 10 && (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-[#ff6b1a]/30 transition-all group"
                    >
                      <FiPlus className="text-white/20 group-hover:text-[#ff6b1a] transition-colors" size={20} />
                    </button>
                  )}
                </div>
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={handleAddImage}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-10">
              <button
                disabled={isSubmitting || submitted}
                type="submit"
                className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 ${
                  submitted 
                    ? "bg-green-500 text-white" 
                    : "bg-[#ff6b1a] text-black hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_40px_rgba(255,107,26,0.3)]"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </span>
                ) : submitted ? (
                  <span className="flex items-center gap-3">
                    <FiCheckCircle size={22} />
                    Project Live
                  </span>
                ) : (
                  <>
                    <span>Add Project</span>
                    <FiPlus size={20} />
                  </>
                )}
              </button>
              
              <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.3em] mt-6">
                Press CMD + S to save as draft
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
