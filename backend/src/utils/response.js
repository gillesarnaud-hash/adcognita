const success = (res, data, statusCode = 200, meta = {}) => {
  const payload = { success: true, data };
  if (Object.keys(meta).length > 0) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const paginate = (res, data, total, page, limit) => {
  return res.json({
    success: true,
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};

module.exports = { success, paginate };
