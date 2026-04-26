import PetTip from "../models/PetTip.js";

// @desc    Get all active pet tips
// @route   GET /api/pet-tips
// @access  Public
export const getPetTips = async (req, res) => {
  try {
    const { category, pet_type, search } = req.query;

    let query = { publish_status: "Published" };

    if (category) {
      query.category = category;
    }

    if (pet_type) {
      query.pet_type = { $in: [pet_type, "All"] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }
      ];
    }

    const tips = await PetTip.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tips.length, data: tips });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch pet tips", error: error.message });
  }
};

// @desc    Get single pet tip by ID
// @route   GET /api/pet-tips/:id
// @access  Public
export const getPetTipById = async (req, res) => {
  try {
    const tip = await PetTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ success: false, message: "Tip not found" });
    res.status(200).json({ success: true, data: tip });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create a new pet tip
// @route   POST /api/pet-tips
// @access  Private (Admin/Shelter)
export const createPetTip = async (req, res) => {
  try {
    const newTip = await PetTip.create(req.body);
    res.status(201).json({ success: true, data: newTip });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create pet tip", error: error.message });
  }
};

// @desc    Update a pet tip
// @route   PUT /api/pet-tips/:id
// @access  Private (Admin/Shelter)
export const updatePetTip = async (req, res) => {
  try {
    const updatedTip = await PetTip.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!updatedTip) return res.status(404).json({ success: false, message: "Tip not found" });
    res.status(200).json({ success: true, data: updatedTip });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update tip", error: error.message });
  }
};

// @desc    Delete a pet tip
// @route   DELETE /api/pet-tips/:id
// @access  Private (Admin/Shelter)
export const deletePetTip = async (req, res) => {
  try {
    const tip = await PetTip.findByIdAndDelete(req.params.id);
    if (!tip) return res.status(404).json({ success: false, message: "Tip not found" });
    res.status(200).json({ success: true, message: "Tip deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete tip", error: error.message });
  }
};

// @desc    Toggle save/bookmark a pet tip
// @route   PUT /api/pet-tips/:id/save
// @access  Private
export const toggleSaveTip = async (req, res) => {
  try {
    const tip = await PetTip.findById(req.params.id);
    if (!tip) return res.status(404).json({ success: false, message: "Tip not found" });

    const userId = req.user._id;
    const alreadySaved = tip.savedBy.includes(userId);

    if (alreadySaved) {
      tip.savedBy = tip.savedBy.filter(id => id.toString() !== userId.toString());
    } else {
      tip.savedBy.push(userId);
    }

    await tip.save();
    res.status(200).json({
      success: true,
      message: alreadySaved ? "Tip unsaved" : "Tip saved",
      data: tip
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle save", error: error.message });
  }
};

// @desc    Get all featured tips
// @route   GET /api/pet-tips/featured
// @access  Public
export const getFeaturedTips = async (req, res) => {
  try {
    const tips = await PetTip.find({ isFeatured: true, publish_status: "Published" })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tips.length, data: tips });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch featured tips", error: error.message });
  }
};