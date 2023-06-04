import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from './useDataset'
import { Tabs, Col, Row } from 'dataverse-design-system'
import styles from './Dataset.module.scss'
import { DatasetLabels } from './dataset-labels/DatasetLabels'
import { useLoading } from '../loading/LoadingContext'
import { DatasetSkeleton } from './DatasetSkeleton'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { useTranslation } from 'react-i18next'
import { DatasetMetadata } from './dataset-metadata/DatasetMetadata'
import { DatasetSummary } from './dataset-summary/DatasetSummary'
import { DatasetCitation } from './dataset-citation/DatasetCitation'

interface DatasetProps {
  repository: DatasetRepository
  searchParams: {
    persistentId?: string
    privateUrlToken?: string
    version?: string
  }
}

export function Dataset({ repository, searchParams }: DatasetProps) {
  const { dataset } = useDataset(repository, searchParams)
  const { isLoading } = useLoading()
  const { t } = useTranslation('dataset')

  if (isLoading) {
    return <DatasetSkeleton />
  }

  return (
    <>
      {!dataset ? (
        <PageNotFound />
      ) : (
        <article>
          <header className={styles.header}>
            <h1>{dataset.title}</h1>
            <DatasetLabels labels={dataset.labels} />
          </header>
          <div className={styles.container}>
            <Row>
              <Col sm={9}>
                <DatasetCitation citation={dataset.citation} version={dataset.version} />
              </Col>
            </Row>
            <Row>
              <Col sm={9} className={styles['summary-container']}>
                <DatasetSummary summaryFields={dataset.summaryFields} license={dataset.license} />
              </Col>
            </Row>
            <Tabs defaultActiveKey="metadata">
              <Tabs.Tab eventKey="files" title={t('filesTabTitle')}>
                <div className={styles['tab-container']}>
                  <div>Files Section</div>
                </div>
              </Tabs.Tab>
              <Tabs.Tab eventKey="metadata" title={t('metadataTabTitle')}>
                <div className={styles['tab-container']}>
                  <DatasetMetadata metadataBlocks={dataset.metadataBlocks} />
                </div>
              </Tabs.Tab>
            </Tabs>
            <div className={styles['separation-line']}></div>
          </div>
        </article>
      )}
    </>
  )
}
