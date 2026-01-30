

const getStats = async (prisma, userId) => {
    const totalEssays = await prisma.essay.count({
        where: {
            userId,
            isDeleted: false,
            status: { not: "FAILED" },
        },
    });

    const scholarshipAdded = await prisma.application.count({
        where: {
            userId,
        },
    });

    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const upcomingDeadlineCount = await prisma.application.count({
        where: {
            userId,
            scholarship: {
                deadline: {
                    gte: new Date(),
                    lte: threeDaysLater,
                },
            },
        },
    });

    const upcomingDeadline = await prisma.application.findFirst({
        where: {
            userId,
            scholarship: {
                deadline: {
                    gte: new Date(),
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
            status: { not: "FAILED" },
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
