import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
import {
  getDatasetByPersistentId,
  getDatasetCitation,
  getDatasetSummaryFieldNames,
  WriteError,
  Dataset as JSDataset,
  getPrivateUrlDataset,
  getPrivateUrlDatasetCitation
} from '@IQSS/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'

export class DatasetJSDataverseRepository implements DatasetRepository {
  getByPersistentId(persistentId: string, version?: string): Promise<Dataset | undefined> {
    return getDatasetByPersistentId
      .execute(persistentId, this.versionToVersionId(version))
      .then((jsDataset) =>
        Promise.all([
          jsDataset,
          getDatasetSummaryFieldNames.execute(),
          getDatasetCitation.execute(jsDataset.id, this.versionToVersionId(version))
        ])
      )
      .then(([jsDataset, summaryFieldsNames, citation]: [JSDataset, string[], string]) =>
        JSDatasetMapper.toDataset(jsDataset, citation, summaryFieldsNames)
      )
      .catch((error: WriteError) => {
        if (!version) {
          throw new Error(error.message)
        }
        return this.getByPersistentId(persistentId)
      })
  }

  getByPrivateUrlToken(privateUrlToken: string): Promise<Dataset | undefined> {
    return Promise.all([
      getPrivateUrlDataset.execute(privateUrlToken),
      getDatasetSummaryFieldNames.execute(),
      getPrivateUrlDatasetCitation.execute(privateUrlToken)
    ])
      .then(([jsDataset, summaryFieldsNames, citation]: [JSDataset, string[], string]) =>
        JSDatasetMapper.toDataset(jsDataset, citation, summaryFieldsNames)
      )
      .catch((error: WriteError) => {
        throw new Error(error.message)
      })
  }

  versionToVersionId(version?: string): string | undefined {
    if (version === 'DRAFT') {
      return ':draft'
    }

    return version
  }
}
