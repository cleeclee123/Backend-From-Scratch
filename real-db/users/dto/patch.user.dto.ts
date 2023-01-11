import { PutUserDto } from "./put.user.dto.js";

// data transfer object update user
export interface PatchUserDto extends Partial<PutUserDto> {}
