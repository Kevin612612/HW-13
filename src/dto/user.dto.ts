
export class UserDTO {
    // @Matches('^[a-zA-Z0-9_-]*$')
    login: string;

    password: string;

    // @Matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
    email: string;
  }
