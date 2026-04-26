import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, Share2, Heart, AlertCircle, BookOpen, User } from 'lucide-react';
import toast from 'react-hot-toast';

const PetTipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/pet-tips/${id}`);
        if (res.data.success) {
          setTip(res.data.data);
          // ✅ Check if current user already saved this tip
          if (user && res.data.data.savedBy?.includes(user._id)) {
            setSaved(true);
          }
        }
      } catch (error) {
        console.error("Error fetching tip:", error);
        toast.error("Failed to load tip details");
      } finally {
        setLoading(false);
      }
    };
    fetchTip();
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save tips");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:4000/api/pet-tips/${id}/save`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setSaved(!saved);
        toast.success(saved ? "Tip unsaved" : "Tip saved!");
      }
    } catch (error) {
      toast.error("Failed to save tip");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-6 flex justify-center">
        <div className="animate-pulse bg-white rounded-3xl p-8 max-w-4xl w-full h-[600px] shadow-sm"></div>
      </div>
    );
  }

  if (!tip) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tip Not Found</h2>
        <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/pet-care')} className="bg-orange-600 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition">
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Article Header (Hero) */}
      <div className="relative h-[60vh] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={tip.featured_image || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b"}
            alt={tip.title}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-5xl mx-auto inset-x-0">
          <Link to="/pet-care" className="inline-flex flex-row items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 font-medium">
            <ArrowLeft size={20} /> Back to Tips Hub
          </Link>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider shadow-sm">
              {tip.category}
            </span>
            <span className="bg-white text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
              <BookOpen size={14} /> {tip.difficulty_level}
            </span>
            <span className="bg-gray-800 border border-gray-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              {tip.pet_type} Focus
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 shadow-sm">
            {tip.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm mt-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <User size={18} className="text-white" />
              </div>
              <span className="font-medium text-white">{tip.author_information}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{new Date(tip.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">

          <div className="flex flex-row justify-between items-center pb-8 border-b border-gray-100 mb-8">
            <p className="text-xl text-gray-600 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-4 py-1">
              "{tip.short_summary}"
            </p>
            <div className="flex gap-3 ml-6">
              {/* ✅ Working Save button */}
              <button
                onClick={handleSave}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  saved
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                }`}
              >
                <Heart size={20} fill={saved ? 'white' : 'none'} />
              </button>
              {/* ✅ Working Share button */}
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-800">
            {tip.full_content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-6 leading-loose">{paragraph}</p>
              )
            ))}
          </div>

          {tip.tags && tip.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Related Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tip.tags.map((tag, idx) => (
                  <span key={idx} className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 cursor-pointer transition">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PetTipDetail;