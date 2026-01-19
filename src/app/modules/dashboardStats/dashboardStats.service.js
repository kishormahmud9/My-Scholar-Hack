

const getStats = async (prisma,userId) => {
    const totalEssays = await prisma.essay.count({
        where: {
            userId,
            isDeleted: false,
        },
    });

    const scholarshipAdded = await prisma.application.count({
        where: {
            userId,
        },
    });

    const upcomingDeadline = await prisma.application.findFirst({
        where: {
            userId,
            scholarshipDeadline: {
                gte: new Date(),
            },
        },
        orderBy: {
            scholarshipDeadline: "asc",
        },
        select: {
            scholarshipDeadline: true,
            scholarshipTitle: true,
        },
    });

    return {
        totalEssays,
        scholarshipAdded,
        upcomingDeadline,
    };
};

export const DashboardStatsService = {
    getStats,
};
