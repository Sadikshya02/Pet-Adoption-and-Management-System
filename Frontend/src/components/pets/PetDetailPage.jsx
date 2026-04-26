import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Heart, Share2, MapPin, Phone, Mail, Globe,
  Clock, Shield, Syringe, Home, Star, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Tips data pulled from your existing pet-tips system by species ──
const DOG_TIPS = [
  { icon: "🏠", title: "Pet-proof your home", body: "Secure loose wires, remove toxic plants, and gate off unsafe rooms before your dog arrives." },
  { icon: "🛏️", title: "Set up a safe space", body: "A crate or quiet corner with a bed gives your dog a retreat when they feel overwhelmed." },
  { icon: "🩺", title: "Vet visit within 72 hrs", body: "Book an appointment immediately to establish a baseline health record and continue any treatments." },
  { icon: "⏰", title: "Stick to a routine", body: "Feed and walk at the same times every day — predictability builds trust faster than anything else." },
];

const CAT_TIPS = [
  { icon: "🐾", title: "Start with one room", body: "Let your cat decompress in a single quiet room for a few days before exploring the whole home." },
  { icon: "🧴", title: "Use a pheromone diffuser", body: "Feliway diffusers reduce stress significantly during the first two weeks in a new environment." },
  { icon: "🚽", title: "Litter box placement", body: "One box per cat plus one extra, placed in low-traffic areas away from food and water." },
  { icon: "🤝", title: "Let the cat initiate", body: "Crouch down, extend a hand, and wait. Forcing contact sets back trust by days." },
];

// ── Reusable sub-components ──

const StatusBadge = ({ status }) => {
  const styles = {
    Available:      "bg-green-100 text-green-700",
    Reserved:       "bg-yellow-100 text-yellow-700",
    Adopted:        "bg-blue-100 text-blue-700",
    "Medical Hold": "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const CompatIcon = ({ value }) => {
  if (value === "Yes") return <CheckCircle size={18} className="text-green-500" />;
  if (value === "No")  return <XCircle size={18} className="text-red-500" />;
  return <AlertCircle size={18} className="text-yellow-500" />;
};

const InfoChip = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-sm font-semibold text-gray-800">{value || "—"}</div>
  </div>
);

const PhotoGallery = ({ photos, imageUrl, name }) => {
  const allPhotos = photos?.length > 0 ? photos : (imageUrl ? [{ url: imageUrl, caption: name }] : []);
  const [active, setActive] = useState(0);

  if (allPhotos.length === 0) {
    return (
      <div className="bg-gray-100 rounded-3xl h-[420px] flex items-center justify-center text-gray-400 text-lg">
        No photos available
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-3xl overflow-hidden h-[420px] bg-gray-900">
        <img
          src={allPhotos[active].url}
          alt={allPhotos[active].caption || name}
          className="w-full h-full object-cover"
        />
      </div>
      {allPhotos.length > 1 && (
        <div className="flex gap-3 mt-3 flex-wrap">
          {allPhotos.map((p, i) => (
            <img
              key={i}
              src={p.url}
              alt={p.caption || `Photo ${i + 1}`}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl object-cover cursor-pointer transition-all border-2 ${
                i === active ? "border-orange-500 opacity-100" : "border-transparent opacity-60 hover:opacity-90"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main Component ──

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/pets/${id}`);
        setPet(res.data);
        if (user && res.data.savedByUsers?.includes(user._id)) setSaved(true);
      } catch (err) {
        toast.error("Failed to load pet profile");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleSave = async () => {
    if (!user) { toast.error("Please login to save pets"); return; }
    try {
      // wire to your existing save endpoint if you have one
      setSaved(!saved);
      toast.success(saved ? "Removed from saved" : "Saved!");
    } catch {
      toast.error("Failed to save pet");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-6 flex justify-center">
        <div className="animate-pulse bg-white rounded-3xl p-8 max-w-5xl w-full h-[600px] shadow-sm" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pet Not Found</h2>
        <p className="text-gray-500 mb-6">This profile may have been removed.</p>
        <button onClick={() => navigate(-1)} className="bg-orange-600 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition">
          Go Back
        </button>
      </div>
    );
  }

  const tips = pet.species === "Cat" ? CAT_TIPS : DOG_TIPS;
  const tipsHeading = pet.species === "Cat"
    ? "🐱 What to expect your first week with a rescue cat"
    : "🐶 How to prepare your home for a rescue dog";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── Back Bar ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft size={20} /> Back to listings
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                saved ? "bg-red-500 border-red-500 text-white" : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
              }`}
            >
              <Heart size={18} fill={saved ? "white" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Top Grid: Gallery + Core Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Gallery */}
          <div>
            <PhotoGallery photos={pet.photos} imageUrl={pet.imageUrl} name={pet.name} />
            {pet.videoUrl && (
              <div className="mt-4 rounded-2xl overflow-hidden aspect-video">
                <iframe src={pet.videoUrl} title="Pet video" className="w-full h-full border-0" allowFullScreen />
              </div>
            )}
          </div>

          {/* Core Info Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 lg:sticky lg:top-24">

            {/* Status + Special Needs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={pet.adoptionStatus || (pet.status === "available" ? "Available" : pet.status)} />
              {pet.specialNeeds && (
                <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold">
                  Special Needs
                </span>
              )}
            </div>

            {/* Name & Breed */}
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
              {pet.emoji} {pet.name}
            </h1>
            <p className="text-gray-500 text-lg mb-6">{pet.breed} · {pet.species}</p>

            {/* Quick Chips */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <InfoChip label="Age"    value={pet.age} />
              <InfoChip label="Gender" value={pet.gender} />
              <InfoChip label="Size"   value={pet.size} />
              <InfoChip label="Color"  value={pet.color} />
              <InfoChip label="Weight" value={pet.weight ? `${pet.weight} kg` : null} />
              <InfoChip label="Energy" value={pet.energyLevel} />
            </div>

            {/* Temperament Tags */}
            {pet.temperament?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {pet.temperament.map((t) => (
                  <span key={t} className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Tags (your existing tags field) */}
            {pet.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {pet.tags.map((t) => (
                  <span key={t} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Adoption Fee */}
            <div className="bg-orange-500 rounded-2xl p-5 text-white mb-6">
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Adoption Fee</div>
              <div className="text-3xl font-extrabold">
                {pet.adoptionFee === 0 ? "Free!" : `$${pet.adoptionFee}`}
              </div>
              {pet.rescueDate && (
                <div className="text-sm opacity-80 mt-1">
                  Rescued on {new Date(pet.rescueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              )}
            </div>

            {/* CTA */}
            {(pet.adoptionStatus === "Available" || pet.status === "available") ? (
              <button
                onClick={() => navigate(`/adopt/${pet._id}/apply`)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors"
              >
                Apply to Adopt {pet.name}
              </button>
            ) : (
              <div className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-semibold text-center">
                Currently unavailable for adoption
              </div>
            )}
          </div>
        </div>

        {/* ── Profile Story ── */}
        {(pet.profileStory || pet.description) && (
          <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet {pet.name}</h2>
            <p className="text-gray-600 leading-loose text-base whitespace-pre-line border-l-4 border-orange-500 pl-5 italic">
              {pet.profileStory || pet.description}
            </p>
          </div>
        )}

        {/* ── Health + Compatibility ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* Health */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Shield size={20} className="text-orange-500" /> Health
            </h3>
            <div className="space-y-4">
              {[
                { icon: <Syringe size={16} />, label: "Vaccination", value: pet.vaccinationStatus },
                { icon: "✂️", label: pet.gender === "Female" ? "Spayed" : "Neutered", value: pet.isNeuteredOrSpayed ? "Yes" : "No" },
                { icon: "📡", label: "Microchipped",   value: pet.isMicrochipped  ? "Yes" : "No" },
                { icon: <Home size={16} />, label: "House Trained", value: pet.isHouseTrained ? "Yes" : "No" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <span className="text-orange-400">{icon}</span> {label}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{value || "Unknown"}</span>
                </div>
              ))}
            </div>
            {pet.medicalNotes && (
              <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-800">
                <strong>Medical Notes:</strong> {pet.medicalNotes}
              </div>
            )}
            {pet.specialNeeds && pet.specialNeedsDescription && (
              <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-purple-800">
                <strong>Special Needs:</strong> {pet.specialNeedsDescription}
              </div>
            )}
          </div>

          {/* Compatibility */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Star size={20} className="text-orange-500" /> Compatibility
            </h3>
            <div className="space-y-4">
              {[
                { label: "With Children", value: pet.compatibleWithChildren ?? (pet.traits?.suitableFor?.children ? "Yes" : "No") },
                { label: "With Dogs",     value: pet.compatibleWithDogs },
                { label: "With Cats",     value: pet.compatibleWithCats },
                { label: "Good for Apartment", value: pet.traits?.suitableFor?.apartment != null ? (pet.traits.suitableFor.apartment ? "Yes" : "No") : null },
                { label: "Good for Beginners", value: pet.traits?.suitableFor?.beginners != null ? (pet.traits.suitableFor.beginners ? "Yes" : "No") : null },
              ].filter(r => r.value).map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-medium text-gray-500">{label}</span>
                  <div className="flex items-center gap-2">
                    <CompatIcon value={value} />
                    <span className="text-sm font-semibold text-gray-800">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trait Bars (your existing traits) */}
            {pet.traits && (
              <div className="mt-6 space-y-3">
                {[
                  { label: "Energy",      value: pet.traits.energy },
                  { label: "Social",      value: pet.traits.social },
                  { label: "Maintenance", value: pet.traits.maintenance },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                      <span>{label}</span><span>{value}/10</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full transition-all"
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Shelter Info ── */}
        {pet.shelter?.name && (
          <div className="mt-6 bg-gray-900 text-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-orange-400 mb-5 flex items-center gap-2">
              <MapPin size={20} /> Shelter Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xl font-bold mb-1">{pet.shelter.name}</div>
                {pet.shelter.address && <div className="text-gray-400 text-sm">{pet.shelter.address}</div>}
                {(pet.shelter.city || pet.shelter.state) && (
                  <div className="text-gray-400 text-sm">
                    {[pet.shelter.city, pet.shelter.state, pet.shelter.zipCode].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {pet.shelter.phone && (
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Phone size={14} className="text-orange-400" /> {pet.shelter.phone}
                  </div>
                )}
                {pet.shelter.email && (
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Mail size={14} className="text-orange-400" /> {pet.shelter.email}
                  </div>
                )}
                {pet.shelter.operatingHours && (
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Clock size={14} className="text-orange-400" /> {pet.shelter.operatingHours}
                  </div>
                )}
                {pet.shelter.website && (
                  <a href={pet.shelter.website} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-orange-400 text-sm hover:text-orange-300 transition-colors font-medium">
                    <Globe size={14} /> Visit Website →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Tips Section (links to your PetTipsHub) ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{tipsHeading}</h2>
            <button
              onClick={() => navigate('/pet-care')}
              className="text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors"
            >
              More tips →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <div className="font-bold text-gray-900 text-sm mb-2">{tip.title}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{tip.body}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PetDetailPage;