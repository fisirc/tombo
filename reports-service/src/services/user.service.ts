import type { IUser, IPreferences } from '../interfaces/user.interface';
import type { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async getUser(id: string) {
    return this.userRepository.findById(id);
  }

  async getUserByGoogleId(googleId: string) {
    return this.userRepository.findByGoogleId(googleId);
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async createUser(
    user: Omit<IUser, 'id' | 'preferences' | 'preferencesId'>,
    preferences: Partial<Omit<IPreferences, 'id'>> = {}
  ) {
    const defaultPreferences: Omit<IPreferences, 'id'> = {
      activeNotifications: preferences.activeNotifications ?? true,
      alertRadiusKm: preferences.alertRadiusKm ?? 5,
      interfaceTheme: preferences.interfaceTheme ?? 'light',
      language: preferences.language ?? 'es'
    };

    const createdUser = await this.userRepository.create(user, defaultPreferences);
    return createdUser;
  }

  async updateUser(id: string, user: Partial<IUser>, preferences?: Partial<IPreferences>) {
    const updatedUser = await this.userRepository.update(id, user, preferences);
    return updatedUser;
  }

  async checkUserExists(googleId: string): Promise<boolean> {
    const user = await this.userRepository.findByGoogleId(googleId);
    return !!user;
  }

  mapUserToProfile(user: IUser): any {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo: user.avatar,
    };
  }
}
