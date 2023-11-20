import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'Логін має бути рядком.' })
  @Length(2, 30, {
    message: "Користувацьке ім'я має бути довжиною від 2 до 30 символів",
  })
  username: string;

  @ApiProperty()
  @IsString({ message: 'Пароль має бути рядком.' })
  @Length(5, 30, {
    message: 'Пароль має бути довжиною від 5 до 30 символів',
  })
  password: string;
}
