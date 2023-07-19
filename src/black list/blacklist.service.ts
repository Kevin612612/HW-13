import { Inject, Injectable } from '@nestjs/common';
import { BlackListRepository } from './blacklist.repository';

@Injectable()
export class BlackListService {
  constructor(@Inject(BlackListRepository) protected blackListRepository: BlackListRepository) {}

  async deleteAllData() {
    return await this.blackListRepository.deleteAllData();
  }

  async deleteTokens() {
    return await this.blackListRepository.deleteTokens();
  }

  async createBlackList() {
    return await this.blackListRepository.createBlackList();
  }

  async addToken(token: string): Promise<any> {
    return await this.blackListRepository.addToken(token);
  }
}
