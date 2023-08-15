/**
 * Generates a random string of the specified length.
 * @param {number} length - The length of the random string to generate.
 * @returns {string} - The randomly generated string.
 */
export const generateRandomString = (length: number): string => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

/**
 * Generates a random userDTO
 * @returns UserDTO
 */
export function createUser() {
	return {
		login: generateRandomString(5) + 'user',
		password: generateRandomString(6),
		email: generateRandomString(10) + '@gmail.com',
	};
}
