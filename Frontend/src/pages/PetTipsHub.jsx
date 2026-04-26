import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TipCard from './TipCard';
import { Search, Filter, BookOpen } from 'lucide-react';

const PetTipsHub = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [petType, setPetType] = useState('');

  const categories = [
    "Grooming", "Feeding and Nutrition", "Vaccination", "Health and Illness", 
    "Training and Behavior", "Puppy Care", "Kitten Care", "Senior Pet Care", 
    "Rescue and Rehabilitation", "Adoption Preparation", "Travel With Pets", 
    "Emergency or First Aid"
  ];

  useEffect(() => {
    fetchTips();
  }, [category, petType, search]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      let queryUrl = `http://localhost:4000/api/pet-tips?search=${search}`;
      if (category) queryUrl += `&category=${category}`;
      if (petType) queryUrl += `&pet_type=${petType}`;
      
      const res = await axios.get(queryUrl);
      if (res.data.success) {
        setTips(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching pet tips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
              Master the Art of <span className="text-orange-500">Pet Care</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Explore our library of expert-backed tips, guides, and practical advice 
              to give your furry friends the best life possible.
            </p>
            <div className="relative max-w-xl mx-auto md:mx-0">
              <input 
                type="text" 
                placeholder="Search tips, guides, keywords..." 
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium bg-gray-50/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="hidden md:block flex-1">
            <img 
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80" 
              alt="Happy Dog" 
              className="rounded-3xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Area - Filters */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                <Filter size={18} className="text-orange-500"/> Filters
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Pet Type</h4>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Dog', 'Cat'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPetType(type === 'All' ? '' : type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        (petType === type || (!petType && type === 'All'))
                          ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Categories</h4>
                <div className="flex flex-col gap-1 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <button 
                    onClick={() => setCategory('')} 
                    className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${category === '' ? 'bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => setCategory(cat)} 
                      className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${category === cat ? 'bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cards Area */}
          <div className="w-full lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-orange-500"/> Latest Tips & Advice
              </h2>
              <span className="text-gray-500 font-medium text-sm">Showing {tips.length} results</span>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-80"></div>
                 ))}
              </div>
            ) : tips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tips.map((tip) => (
                  <TipCard key={tip._id} tip={tip} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                <img src="/assets/no-data.svg" alt="No Data" className="h-32 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tips found!</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => { setSearch(''); setCategory(''); setPetType(''); }}
                  className="mt-4 text-orange-500 hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetTipsHub;
