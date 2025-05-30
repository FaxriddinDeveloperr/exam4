
import {
  IsString,

} from 'class-validator';

export class EmailPassword {

  @IsString()
  password: string
  @IsString()
  token: string
}
