import { FileRepository } from '../repositories/FileRepository'
import { File, FileStatus } from '../models/File'

export async function checkFileDownloadPermission(
  fileRepository: FileRepository,
  file: File
): Promise<boolean> {
  // TODO: ask Guillermo if we want to check the privateUrlUser with userRepository.getAuthenticated()

  if (file.version.status === FileStatus.DEACCESSIONED) {
    return fileRepository.getFileUserPermissionsById(file.id).then((permissions) => {
      return permissions.canEditDataset
    })
  }

  const isRestricted = file.access.restricted || file.access.latestVersionRestricted
  if (!isRestricted && !file.isActivelyEmbargoed) {
    return true
  }

  return fileRepository.getFileUserPermissionsById(file.id).then((permissions) => {
    return permissions.canDownloadFile
  })
}
