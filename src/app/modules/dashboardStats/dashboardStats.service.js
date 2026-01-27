

const getStats = async (prisma, userId) => {
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

    const recommendations = await prisma.recommendation.findMany({
        where: { userId },
        include: {
            scholarship: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const essays = await prisma.essay.findMany({
        where: {
            userId,
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return {
        totalEssays,
        scholarshipAdded,
        totalRecommendations: recommendations.length,
        upcomingDeadline,
        essays,
        recommendations,
    };
};

export const DashboardStatsService = {
    getStats,
};
