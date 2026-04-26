import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ChevronRight, User, Heart, Share2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TipCard = ({ tip }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user && tip.savedBy?.includes(user._id)) {
      setSaved(true);
    }
  }, [tip]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to save tips");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:4000/api/pet-tips/${tip._id}/save`,
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

  const handleShare = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/pet-care/${tip._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-200 hover:border-orange-200">
      <div className="relative h-48 overflow-hidden">
        <img
          src={tip.featured_image || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80"}
          alt={tip.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-semibold text-gray-800 shadow-sm border border-gray-100">
          {tip.category}
        </div>
        {/* ✅ Save button on card image */}
        <button
          onClick={handleSave}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
            saved ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={16} fill={saved ? 'white' : 'none'} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1 font-medium bg-gray-50 px-2 py-1 rounded">
            <BookOpen size={14} className="text-orange-500" />
            {tip.difficulty_level}
          </div>
          <div className="flex items-center gap-1 font-medium bg-gray-50 px-2 py-1 rounded">
            <Clock size={14} className="text-gray-400" />
            5 min read
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {tip.title}
        </h3>

        <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
          {tip.short_summary}
        </p>

        <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
              <User size={16} />
            </div>
            <span className="text-sm font-medium text-gray-600">{tip.author_information}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* ✅ Share button */}
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all"
            >
              <Share2 size={14} />
            </button>

            <Link
              to={`/pet-care/${tip._id}`}
              className="flex items-center gap-1 text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors"
            >
              Read <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCard;