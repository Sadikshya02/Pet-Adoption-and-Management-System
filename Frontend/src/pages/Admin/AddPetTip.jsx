import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddPetTip = () => {
  const [formData, setFormData] = useState({
    title: "",
    short_summary: "",
    full_content: "",
    category: "",
    pet_type: "All",
    age_group: "All",
    difficulty_level: "Beginner",
    tags: "",
    publish_status: "Published"
  });

  const categories = [
    "Grooming", "Feeding and Nutrition", "Vaccination", "Health and Illness",
    "Training and Behavior", "Puppy Care", "Kitten Care", "Senior Pet Care",
    "Rescue and Rehabilitation", "Adoption Preparation", "Travel With Pets",
    "Emergency or First Aid"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim())
      };

      const res = await axios.post("http://localhost:4000/api/pet-tips", payload);

      if (res.data.success) {
        toast.success("Tip added successfully!");
        setFormData({
          title: "",
          short_summary: "",
          full_content: "",
          category: "",
          pet_type: "All",
          age_group: "All",
          difficulty_level: "Beginner",
          tags: "",
          publish_status: "Published"
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add tip");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-orange-500">Add Pet Tip</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <textarea
            name="short_summary"
            placeholder="Short Summary"
            value={formData.short_summary}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />

          <textarea
            name="full_content"
            placeholder="Full Content (use ENTER for new lines)"
            value={formData.full_content}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg h-32"
            required
          />

          <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg" required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select name="pet_type" value={formData.pet_type} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option>All</option>
            <option>Dog</option>
            <option>Cat</option>
          </select>

          <select name="age_group" value={formData.age_group} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option>All</option>
            <option>Puppy/Kitten</option>
            <option>Adult</option>
            <option>Senior</option>
          </select>

          <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <select name="publish_status" value={formData.publish_status} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option>Published</option>
            <option>Draft</option>
          </select>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            Add Tip
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddPetTip;