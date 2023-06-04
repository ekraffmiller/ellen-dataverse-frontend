import { User } from '../../domain/models/User'
import {
  AuthenticatedUser,
  getCurrentAuthenticatedUser
} from '@IQSS/dataverse-client-javascript/dist/users'
import { ReadError } from '@IQSS/dataverse-client-javascript/dist/core'
import { logout, WriteError } from '@IQSS/dataverse-client-javascript'
import { UserRepository } from '../../domain/repositories/UserRepository'

export class UserJSDataverseRepository implements UserRepository {
  getAuthenticated(): Promise<User> {
    return getCurrentAuthenticatedUser
      .execute()
      .then((authenticatedUser: AuthenticatedUser) => {
        return { name: authenticatedUser.displayName }
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  removeAuthenticated(): Promise<void> {
    return logout.execute().catch((error: WriteError) => {
      throw new Error(error.message)
    })
  }
}
