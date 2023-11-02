import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilesMockData } from './FileMockData'
import { File } from '../../files/domain/models/File'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FilePaginationInfo } from '../../files/domain/models/FilePaginationInfo'
import { FileUserPermissionsMother } from '../../../tests/component/files/domain/models/FileUserPermissionsMother'
import { FileUserPermissions } from '../../files/domain/models/FileUserPermissions'
import { DatasetVersion } from '../../dataset/domain/models/Dataset'

export class FileMockRepository implements FileRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAllByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo?: FilePaginationInfo
  ): Promise<File[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesMockData(paginationInfo))
      }, 1000)
    })
  }

  getFilesCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.create({ total: 200 }))
      }, 1000)
    })
  }

  getFilesTotalDownloadSizeByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion
  ): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(19900)
      }, 1000)
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getUserPermissionsById(id: number): Promise<FileUserPermissions> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FileUserPermissionsMother.create())
      }, 1000)
    })
  }
}