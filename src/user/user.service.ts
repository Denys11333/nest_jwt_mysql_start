import { Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { CreateUserDto } from "./dto/create-user-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleService } from "../role/role.service";
import { CreateRoleDto } from "../role/dto/create-role.dto";

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>,
              private roleService: RoleService) {

  }

  async createUser(dto: CreateUserDto) {
    let role = await this.roleService.getRoleByValue("USER");

    if (!role) {
      let createdRole: CreateRoleDto = {
        "roleName": "USER",
        "description": "simple role"
      };

      role = await this.roleService.createRole(createdRole);
    }

    return await this.userRepository.save({ ...dto, roles: [role] });
  }

  async getUserByUsername(username: string) {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: {
        roles: true
      }
    });
  }

}
