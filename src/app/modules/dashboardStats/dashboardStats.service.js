

const getStats = async (prisma, userId) => {
    const totalEssays = await prisma.essay.count({
        where: {
            userId,
            isDeleted: false,
            status: { in: ["SAVED", "EDITED"] },
        },
    });

    const scholarshipAdded = await prisma.application.count({
        where: {
            userId,
        },
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const threeDaysLater = new Date(startOfToday);
    threeDaysLater.setDate(startOfToday.getDate() + 4); // End of 3 days from today

    const upcomingDeadlineCount = await prisma.application.count({
        where: {
            userId,
            status: "PROCESSING",
            scholarship: {
                deadline: {
                    gte: startOfToday,
                    lt: threeDaysLater,
                },
            },
        },
    });

    const upcomingDeadline = await prisma.application.findFirst({
        where: {
            userId,
            status: "PROCESSING",
            scholarship: {
                deadline: {
                    gte: startOfToday,
                },
            },
        },
        orderBy: {
            scholarship: {
                deadline: "asc",
            },
        },
        select: {
            scholarshipTitle: true,
            scholarship: {
                select: {
                    deadline: true,
                },
            },
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
            status: { in: ["SAVED", "EDITED"] },
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
        upcomingDeadlineCount,
        essays,
        recommendations,
    };
};

export const DashboardStatsService = {
    getStats,
};
