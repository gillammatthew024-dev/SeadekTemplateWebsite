'use server';

export async function validateAdminPassword(inputPassword: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!correctPassword) {
    return { success: false, error: 'Admin password not configured' };
  }

  if (inputPassword === correctPassword) {
    return { success: true };
  }

  return { success: false, error: 'Incorrect password' };
}