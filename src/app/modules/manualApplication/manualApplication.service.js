import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { manualApplicationSearchableFields } from "./manualApplication.constant.js";

const create = async (prisma, data) => {
  return await prisma.manualApplication.create({
    data,
    include: {
      user: true,
      scholarship: true,
      essay: true,
    },
  });
};

const getAll = async (prisma, query) => {
  const builder = new QueryBuilder(query)
    .search(manualApplicationSearchableFields)
    .filter()
    .sort("-createdAt")
    .fields()
    .paginate();

  const prismaQuery = builder.build();

  const data = await prisma.manualApplication.findMany({
    ...prismaQuery,
    include: {
      user: true,
      scholarship: true,
      essay: true,
    },
  });

  const total = await prisma.manualApplication.count({
    where: prismaQuery.where,
  });

  return {
    data,
    meta: builder.getMeta(total),
  };
};

const getById = async (prisma, id) => {
  return await prisma.manualApplication.findUnique({
    where: { id },
    include: {
      user: true,
      scholarship: true,
      essay: true,
    },
  });
};

const update = async (prisma, id, data) => {
  return await prisma.manualApplication.update({
    where: { id },
    data,
    include: {
      user: true,
      scholarship: true,
      essay: true,
    },
  });
};

const remove = async (prisma, id) => {
  return await prisma.manualApplication.delete({
    where: { id },
  });
};

export const ManualApplicationService = {
  create,
  getAll,
  getById,
  update,
  remove,
};
