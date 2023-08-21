//create function for creating random string
export const generateRandomString = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
  };
  
  //create random user
  export function createUser() {
	return {
	  login: generateRandomString(5) + 'user',
	  password: generateRandomString(6),
	  email: generateRandomString(10) + '@gmail.com',
	};
  }
  //create random blog
  export function createBlog() {
	return {
	  name: generateRandomString(5) + 'user',
	  description: generateRandomString(10),
	  websiteUrl: 'https://' + generateRandomString(5) + '@gmail.com',
	};
  }
  //create random post
  export function createPost() {
	return {
	  content: generateRandomString(5) + 'post',
	  shortDescription: 'about' + generateRandomString(10),
	  title: 'title' + generateRandomString(5),
	  blogId: null,
	};
  }
  //create random comment
  export function createComment() {
	return {
	  content: generateRandomString(15) + ' comment',
	};
  }
