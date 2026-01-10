import * as essayService from "../services/essay.service.js";

export const createEssay = async (req, res) => {
  try {
    const { title, prompt, userProfileId, scholarshipId } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const essay = await essayService.createEssayWithAI({
      userId: req.user.id,
      title,
      prompt,
      userProfileId,
      scholarshipId,
    });

    res.status(201).json(essay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Essay generation failed" });
  }
};

export const getEssays = async (req, res) => {
  const essays = await essayService.getEssaysByUser(req.user.id);
  res.json(essays);
};

export const getEssay = async (req, res) => {
  const essay = await essayService.getEssayById(
    req.params.id,
    req.user.id
  );

  if (!essay) {
    return res.status(404).json({ message: "Essay not found" });
  }

  res.json(essay);
};

export const updateEssay = async (req, res) => {
  await essayService.updateEssay(
    req.params.id,
    req.user.id,
    req.body
  );

  res.json({ message: "Essay updated" });
};

export const deleteEssay = async (req, res) => {
  await essayService.deleteEssay(req.params.id, req.user.id);
  res.json({ message: "Essay deleted" });
};
