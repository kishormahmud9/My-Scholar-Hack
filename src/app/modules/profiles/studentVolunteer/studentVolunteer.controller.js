import { StudentVolunteerService } from "./studentVolunteer.service.js";

const createVolunteer = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, organization, timeline } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await StudentVolunteerService.create(prisma, {
            userProfileId,
            organization,
            timeline,
        });

        return res.json({
            success: true,
            message: "Volunteer work added successfully",
            data: result,
        });
    } catch (error) {
        console.error("createVolunteer error:", error);
        return res.status(500).json({ success: false, message: "Failed to add volunteer work" });
    }
};

const updateVolunteer = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const data = req.body;

        const result = await StudentVolunteerService.update(prisma, id, data);

        return res.json({
            success: true,
            message: "Volunteer work updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("updateVolunteer error:", error);
        return res.status(500).json({ success: false, message: "Failed to update volunteer work" });
    }
};

const deleteVolunteer = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;

        await StudentVolunteerService.delete(prisma, id);

        return res.json({
            success: true,
            message: "Volunteer work deleted successfully",
        });
    } catch (error) {
        console.error("deleteVolunteer error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete volunteer work" });
    }
};

const getVolunteerWorks = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await StudentVolunteerService.findAllByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getVolunteerWorks error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch volunteer work" });
    }
};

export const StudentVolunteerController = {
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
    getVolunteerWorks,
};
