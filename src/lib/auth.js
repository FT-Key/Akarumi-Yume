import jwt from 'jsonwebtoken';

/**
 * Verificar token JWT en el servidor
 */
export async function verifyToken(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return {
      id: decoded.userId,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

export default verifyToken;
