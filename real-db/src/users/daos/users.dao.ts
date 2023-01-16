import mongooseService from "../../common/services/mongoose.service";
import { CreateUserDto } from "../dto/create.user.dto.js";
import { PatchUserDto } from "../dto/patch.user.dto.js";
import { PutUserDto } from "../dto/put.user.dto.js";
import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

// Data Access Object (in memory database)
// Using the singleton pattern (node caches same instance of class/same array of ids)
class UsersDao {
  public users: Array<CreateUserDto> = [];
  
  // create user Schema for Mongoose
  Schema = mongooseService.getMongoose().Schema;
  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number,
    },
    { id: false }
  );
  User = mongooseService.getMongoose().model("Users", this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }
  
  // CRUD operations below

  // create
  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });
    await user.save();
    return userId;
  }

  // reads
  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate("User").exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  // updates
  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  // delete
  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }
}

export default new UsersDao();
