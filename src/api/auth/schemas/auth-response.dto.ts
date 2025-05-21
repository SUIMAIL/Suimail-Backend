import { IUser } from "../../../models/user.model"

export class AuthResponseDto {
  constructor(user: IUser) {
    this.suimailNs = user.suimailNs
  }

  suimailNs: string

  static fromEntity(user: IUser): AuthResponseDto {
    return {
      suimailNs: user.suimailNs,
    }
  }
}
