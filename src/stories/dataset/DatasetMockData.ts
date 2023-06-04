import {
  ANONYMIZED_FIELD_VALUE,
  DatasetStatus,
  DatasetVersion,
  DatasetLabelSemanticMeaning
} from '../../dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../dataset/domain/models/Dataset'
import { Dataset } from '../../dataset/domain/models/Dataset'

export const DatasetMockData = (props?: Partial<Dataset>, anonymized = false): Dataset => ({
  persistentId: '123456789',
  title: 'Dataset title',
  citation: `${
    anonymized ? 'Author name(s) withheld' : 'Bennet, Elizabeth; Darcy, Fitzwilliam'
  }, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1`,
  version: new DatasetVersion(1, 0, DatasetStatus.RELEASED),
  labels: [
    { value: 'Version 1.0', semanticMeaning: DatasetLabelSemanticMeaning.FILE },
    { value: 'Draft', semanticMeaning: DatasetLabelSemanticMeaning.DATASET }
  ],
  license: {
    name: 'CC0 1.0',
    uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
    iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  },
  summaryFields: [
    {
      name: MetadataBlockName.CITATION,
      fields: {
        dsDescription:
          'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) ',
        keyword: 'Malaria, Tuberculosis, Drug Resistant',
        subject: 'Medicine, Health and Life Sciences, Social Sciences',
        publication: 'CNN Journal [CNN.com](https://cnn.com)',
        notesText: 'Here is an image ![Alt text](https://picsum.photos/id/10/40/40)'
      }
    }
  ],
  metadataBlocks: [
    {
      name: MetadataBlockName.CITATION,
      fields: {
        persistentId: 'doi:10.5072/FK2/ABC123',
        alternativePersistentId: 'doi:10.5072/FK2/ABC123',
        publicationDate: anonymized ? ANONYMIZED_FIELD_VALUE : '2021-01-01',
        citationDate: '2021-01-01',
        title: 'Dataset Title',
        subject: ['Subject1', 'Subject2'],
        author: anonymized
          ? ANONYMIZED_FIELD_VALUE
          : [
              {
                authorName: 'Admin, Dataverse',
                authorAffiliation: 'Dataverse.org',
                authorIdentifierScheme: 'ORCID',
                authorIdentifier: '123456789'
              },
              {
                authorName: 'Owner, Dataverse',
                authorAffiliation: 'Dataverse.org',
                authorIdentifierScheme: 'ORCID',
                authorIdentifier: '123456789'
              }
            ]
      }
    },
    {
      name: MetadataBlockName.GEOSPATIAL,
      fields: {
        geographicUnit: 'km',
        geographicCoverage: anonymized
          ? ANONYMIZED_FIELD_VALUE
          : {
              geographicCoverageCountry: 'United States',
              geographicCoverageCity: 'Cambridge'
            }
      }
    }
  ],
  ...props
})
