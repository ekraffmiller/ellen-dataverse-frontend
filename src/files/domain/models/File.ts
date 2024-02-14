import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileMetadata } from './FileMetadata'
import { FileVersion } from './FileVersion'
import { FileAccess } from './FileAccess'
import { FileUserPermissions } from './FileUserPermissions'
import { FileIngest } from './FileIngest'
import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

export interface File {
  id: number
  version: FileVersion
  name: string
  access: FileAccess
  datasetVersion: DatasetVersion
  citation: string
  hierarchy: UpwardHierarchyNode
  permissions: FileUserPermissions
  metadata: FileMetadata
  ingest: FileIngest
}
