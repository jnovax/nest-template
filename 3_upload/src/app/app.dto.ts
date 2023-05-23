import { ApiProperty } from "@nestjs/swagger"

export class HelloDto {
    @ApiProperty({type:"string"})
    name: string
}


export class SingleFileDto{
    @ApiProperty({format: "binary"})
    photo_url: string

    @ApiProperty({example:"Rom"})
    username:string

    @ApiProperty({example:"12345678"})
    password:string
}

export class MultipleFileDto {
    @ApiProperty({ type: Array, format: 'binary' })
    photo_url: string[];
  
    @ApiProperty({ example: 'Rom' })
    username: string;
  
    @ApiProperty({ example: '12345678' })
    password: string;
  }