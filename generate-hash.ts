import bcrypt from'bcryptjs';
export async function generateHash(password: string | undefined): Promise<string> {
    const saltRounds = 10;
    if (!password) {
        throw new Error('Password is undefined');
    }
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}
console.log('Add this to your .env file:');
(async () => {
    const hash = await generateHash(process.argv[2]);
    console.log(hash);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
})();

