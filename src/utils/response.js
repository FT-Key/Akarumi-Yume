// Respuesta exitosa
export function successResponse(res, data, statusCode = 200) {
  return new Response(
    JSON.stringify({
      success: true,
      data,
    }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Respuesta exitosa con paginación
export function paginatedResponse(res, { data, total, page, limit }) {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Respuesta de error
export function errorResponse(message, statusCode = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        message,
        code: statusCode,
      },
    }),
    {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
