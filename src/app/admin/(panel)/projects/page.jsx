'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2, FiImage, FiCheckCircle, FiEye, FiEyeOff, FiEdit3, FiX, FiExternalLink, FiSearch, FiMonitor } from "react-icons/fi";
import gsap from 'gsap';
const CATEGORIES = [
  "Website",
  "Designs",
  "Photos",
  "Videos"
];
const convertToWebP = (file) => {
  return new Promise((resolve, reject) => {
    // If it's a video or non-image, just return the file as-is
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas empty'));
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve(newFile);
        }, 'image/webp', 0.9);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const EMPTY = {
  title: '',
  description: '',
  category: 'Website',
  tech: '',
  client: '',
  month: '',
  year: '',
  services: '',
  image_url: '',
  link: '',
  sort_order: 0,
  visible: true,
  gallery: [],
};

const MAX_GALLERY = 10;

export default function ArchiveAdmin() {
  const [works, setWorks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const fileRef = useRef(null);
  const galleryFileRef = useRef(null);
  const router  = useRouter();
  const formRef = useRef(null);

  const load = () => {
    fetch('/api/works?all=true')
      .then(async (r) => {
        if (r.status === 401) { router.push('/admin/login'); return null; }
        try { return await r.json(); } catch { return null; }
      })
      .then((data) => {
        const sorted = (data || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setWorks(sorted);
        setFiltered(sorted);
        setLoading(false);
      });
  };

  useEffect(load, [router]);

  useEffect(() => {
    const results = works.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tech?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, works]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
    gsap.fromTo(formRef.current, { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      title:       p.title       || '',
      description: p.description || '',
      category:    p.category    || 'Website',
      tech:        p.tech        || '',
      client:      p.client      || '',
      month:       p.month       || '',
      year:        p.year        || '',
      services:    p.services    || '',
      image_url:   p.image_url   || '',
      link:        p.link        || '',
      sort_order:  p.sort_order  ?? 0,
      visible:     p.visible     ?? true,
      gallery:     Array.isArray(p.gallery) ? p.gallery : [],
    });
    setShowForm(true);
    gsap.fromTo(formRef.current, { x: 400, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  };

  const closeForm = () => {
    gsap.to(formRef.current, {
      x: 400, opacity: 0, duration: 0.4, ease: "power3.in",
      onComplete: () => { setShowForm(false); setEditing(null); setForm(EMPTY); },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    const method = editing ? 'PATCH' : 'POST';
    const url    = editing ? `/api/works/${editing}` : '/api/works';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sort_order: Number(form.sort_order) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || `Server error ${res.status}`);
        return;
      }
      closeForm();
      load();
    } catch {
      setSaveError('Network error — check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisible = async (id, visible) => {
    await fetch(`/api/works/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !visible }),
    });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this item from the archive?')) return;
    await fetch(`/api/works/${id}`, { method: 'DELETE' });
    load();
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const webpFile = await convertToWebP(file);
      const fd = new FormData();
      fd.append('file', webpFile);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setForm(f => ({ ...f, image_url: data.url }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };



  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = MAX_GALLERY - (form.gallery?.length || 0);
    const toUpload = files.slice(0, remaining);
    if (!toUpload.length) return;
    setGalleryUploading(true);
    try {
      const urls = await Promise.all(toUpload.map(async (file) => {
        const webpFile = await convertToWebP(file);
        const fd = new FormData();
        fd.append('file', webpFile);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        return data.url || null;
      }));
      const valid = urls.filter(Boolean);
      setForm(f => ({ ...f, gallery: [...(f.gallery || []), ...valid] }));
    } catch (err) {
      console.error(err);
    } finally {
      setGalleryUploading(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (idx) => {
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors";
  const lbl = "text-[10px] text-white/30 tracking-[0.3em] uppercase mb-2 block font-medium";

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-white text-3xl font-black tracking-tight mb-2">Creative Archive</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#ff6b1a]/10 text-[#ff6b1a] text-[10px] font-bold tracking-widest uppercase rounded-full border border-[#ff6b1a]/20">
              {works.length} Items
            </span>
            <div className="h-4 w-px bg-white/10" />
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3 text-white/20" size={14} />
              <input type="text" placeholder="Search archive…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none text-xs text-white/50 focus:outline-none pl-9 w-48" />
            </div>
          </div>
        </div>
        <button onClick={openAdd}
          className="bg-[#ff6b1a] text-black font-black px-6 py-3.5 rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-[#ff8c42] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#ff6b1a]/10 flex items-center gap-2">
          <FiPlus size={16} />
          Add to Archive
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin h-8 w-8 border-4 border-[#ff6b1a] border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-40 bg-white/[0.02] border border-white/5 rounded-[2rem] border-dashed">
          <FiMonitor className="mx-auto text-4xl text-white/10 mb-4" />
          <p className="text-white/20 text-sm tracking-widest uppercase">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="group relative bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 hover:-translate-y-1 transition-all">
              <div className="aspect-video relative overflow-hidden bg-black/40">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <FiImage size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button onClick={() => openEdit(p)} className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 text-white transition-colors">
                    <FiEdit3 size={16} />
                  </button>
                  <button onClick={() => remove(p.id)} className="p-2.5 bg-red-500/10 backdrop-blur-md rounded-xl hover:bg-red-500/20 text-red-400 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="absolute top-4 left-4">
                  <button onClick={() => toggleVisible(p.id, p.visible)}
                    className={`p-2 rounded-xl backdrop-blur-md border transition-all ${p.visible ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/5 border-white/10 text-white/20"}`}>
                    {p.visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                  </button>
                </div>

                {p.gallery?.length > 0 && (
                  <div className="absolute bottom-4 right-4">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[9px] text-white/50 tracking-wider">
                      +{p.gallery.length} photos
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-white font-bold text-lg tracking-tight truncate mb-1">{p.title}</h3>
                  <p className="text-[#ff6b1a] text-[10px] uppercase tracking-[0.2em] font-medium">{p.category || "—"}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.tech?.split('·').map((t, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white/5 rounded-lg text-[9px] text-white/40 tracking-wider uppercase">{t.trim()}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-white/30 hover:text-white transition-colors flex items-center gap-2 tracking-[0.2em] uppercase">
                      <FiExternalLink size={12} /> Live
                    </a>
                  ) : <span className="text-[10px] text-white/10 italic tracking-wider">No link</span>}
                  <span className="text-[10px] text-white/15 tracking-widest">#{p.sort_order ?? 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over form */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeForm} />
          <div ref={formRef}
            className="relative w-full max-w-2xl bg-[#0d0d0d] h-full shadow-2xl border-l border-white/10 overflow-y-auto">
            <div className="sticky top-0 bg-[#0d0d0d]/80 backdrop-blur-md z-10 px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight">{editing ? 'Edit Item' : 'Add to Archive'}</h2>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] mt-1">Creative Archive</p>
              </div>
              <button onClick={closeForm} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">

              {/* Dynamic Labels based on category */}
              {(() => {
                const getTitle = () => {
                  switch (form.category) {
                    case 'Designs': return 'Design Name *';
                    case 'Photos': return 'Photo Shoot Name *';
                    case 'Videos': return 'Video Title *';
                    default: return 'Project Title *';
                  }
                };
                const getTitlePh = () => {
                  switch (form.category) {
                    case 'Designs': return 'e.g. Neo-Brutalism Poster';
                    case 'Photos': return 'e.g. Urban Architecture';
                    case 'Videos': return 'e.g. Cinematic Reel';
                    default: return 'Project Title';
                  }
                };
                const getTechLabel = () => {
                  switch (form.category) {
                    case 'Designs': return 'Design Tools';
                    case 'Photos': return 'Camera / Gear';
                    case 'Videos': return 'Software / Gear';
                    default: return 'Tech Stack';
                  }
                };
                const getTechPh = () => {
                  switch (form.category) {
                    case 'Designs': return 'e.g. Photoshop · Illustrator';
                    case 'Photos': return 'e.g. Sony A7IV · 35mm f/1.4';
                    case 'Videos': return 'e.g. Premiere Pro · RED Komodo';
                    default: return 'React · Next.js';
                  }
                };

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>{getTitle()}</label>
                        <input required value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder={getTitlePh()} className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Category</label>
                        <select value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className={inp + " cursor-pointer"}>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c} className="bg-[#0d0d0d]">{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className={lbl}>{getTechLabel()}</label>
                        <input value={form.tech}
                          onChange={(e) => setForm({ ...form, tech: e.target.value })}
                          placeholder={getTechPh()} className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Display Order</label>
                        <input type="number" value={form.sort_order}
                          onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                          className={inp} />
                      </div>
                    </div>
                  </>
                );
              })()}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Client</label>
                  <input value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="e.g. Acme Corp" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Month</label>
                  <input value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                    placeholder="e.g. October" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Year</label>
                  <input value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="e.g. 2026" className={inp} />
                </div>
              </div>

              <div>
                <label className={lbl}>Services (comma separated)</label>
                <input value={form.services}
                  onChange={(e) => setForm({ ...form, services: e.target.value })}
                  placeholder="Design, Interior, Exhibition" className={inp} />
              </div>

              {form.category === "Website" && (
                <div>
                  <label className={lbl}>External Link</label>
                  <input value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="https://…" className={inp} />
                </div>
              )}

              {/* Cover Image */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <label className={lbl + " !mb-0"}>Cover / Hover Image</label>
                  <span className="text-[8px] text-[#ff6b1a] uppercase tracking-[0.2em] border border-[#ff6b1a]/30 px-1.5 py-0.5 rounded-full bg-[#ff6b1a]/5">4:5</span>
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                  {form.image_url && (
                    <div className="w-40 aspect-[4/5] rounded-xl overflow-hidden shrink-0 border border-white/10 relative group">
                      {(form.image_url.includes('.mp4') || form.image_url.includes('.webm') || form.image_url.includes('.mov')) ? (
                        <video src={form.image_url} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                      ) : (
                        <img src={form.image_url} className="w-full h-full object-cover" alt="" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button type="button" className="text-red-400 hover:text-red-500 bg-black/50 p-3 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); setForm(prev => ({...prev, image_url: ""})); }}>
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-center">
                    <button type="button" onClick={() => fileRef.current.click()}
                      className="px-6 py-6 h-full bg-white/5 border border-white/10 border-dashed rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest font-bold w-full flex flex-col items-center justify-center gap-3">
                      <FiImage size={24} className="text-white/40" />
                      {uploading ? "Uploading…" : form.category === "Videos" ? "Upload Cover/Video" : "Upload Cover Photo"}
                    </button>
                    <input ref={fileRef} type="file" hidden accept="image/*,video/*" onChange={handleUpload} />
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={lbl + " mb-0"}>Gallery Images</label>
                  <span className="text-[9px] text-white/20 tracking-wider">
                    {form.gallery?.length || 0} / {MAX_GALLERY}
                  </span>
                </div>

                {form.gallery?.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {form.gallery.map((url, i) => (
                      <div key={i} className="relative group/img aspect-square rounded-lg overflow-hidden border border-white/10 bg-black">
                        {url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') ? (
                          <video src={url} className="w-full h-full object-cover" muted loop playsInline />
                        ) : (
                          <img src={url} className="w-full h-full object-cover" alt="" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <FiX size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {(form.gallery?.length || 0) < MAX_GALLERY && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => galleryFileRef.current.click()}
                      className="w-full py-4 bg-white/5 border border-white/10 border-dashed rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                    >
                      <FiImage size={16} />
                      {galleryUploading ? "Uploading…" : form.category === "Videos" ? "Add Videos to Gallery" : "Add Images to Gallery"}
                    </button>
                    <input
                      ref={galleryFileRef}
                      type="file"
                      hidden
                      accept="image/*,video/*"
                      multiple
                      onChange={handleGalleryUpload}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={lbl}>Description *</label>
                <textarea required rows={4} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the project…" className={inp + " resize-none"} />
              </div>

              <div className="flex items-center gap-3 py-1">
                <button type="button"
                  onClick={() => setForm(f => ({ ...f, visible: !f.visible }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                    form.visible
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-white/5 text-white/30 border-white/10"
                  }`}>
                  {form.visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                  {form.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              {saveError && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs tracking-wide">
                  {saveError}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#ff6b1a] text-black font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-[#ff8c42] transition-all flex items-center justify-center gap-2">
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add to Archive'}
                  {!saving && <FiCheckCircle size={16} />}
                </button>
                <button type="button" onClick={closeForm}
                  className="px-8 bg-white/5 text-white/60 font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
