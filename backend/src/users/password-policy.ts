export function validatePassword(password: string, username?: string) {
  const reasons: string[] = [];
  if (typeof password !== 'string') reasons.push('Clave inválida');
  const pwd = String(password || '');
  const minLen = 12; // NIST/OWASP: mínimo 8, recomendado 12. Usamos 12.
  if (pwd.length < minLen) reasons.push(`La clave debe tener al menos ${minLen} caracteres`);
  if (pwd.length > 128) reasons.push('La clave no debe exceder 128 caracteres');
  // No permitir que sea igual al usuario
  if (username && pwd.toLowerCase() === String(username).toLowerCase()) reasons.push('La clave no puede ser igual al usuario');
  // Lista corta de contraseñas comunes (para demo; en prod usar servicio de breached passwords)
  const common = new Set([
    '123456','123456789','qwerty','password','12345','qwerty123','1q2w3e','12345678','111111','123123',
    '1234567890','000000','abc123','iloveyou','password1','admin','letmein','welcome','monkey','dragon'
  ]);
  if (common.has(pwd.toLowerCase())) reasons.push('La clave es demasiado común');
  // Al menos 1 letra y 1 no-letra (número o símbolo) para robustez básica
  if (!/[A-Za-z]/.test(pwd) || !/[^A-Za-z]/.test(pwd)) reasons.push('Use letras y números/símbolos');
  // Evitar un solo caracter repetido
  if (/^(.)\1{7,}$/.test(pwd)) reasons.push('La clave no debe repetir el mismo carácter en exceso');
  if (reasons.length) {
    const err = new Error(reasons.join('; '));
    (err as any).status = 400;
    throw err;
  }
}

