import UserService from "../services/UserService";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }
}

export default UserController;
