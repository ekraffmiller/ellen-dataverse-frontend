import { FileMother } from '../../../files/domain/models/FileMother'
import { DatasetFiles } from '../../../../../src/sections/dataset/dataset-files/DatasetFiles'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption
} from '../../../../../src/files/domain/models/FileCriteria'

const testFiles = FileMother.createMany(200)
const datasetPersistentId = 'test-dataset-persistent-id'
const datasetVersion = 'test-dataset-version'
const fileRepository: FileRepository = {} as FileRepository
describe('DatasetFiles', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves(testFiles)
  })

  it('renders the files table', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: /Files/ }).should('exist')
  })

  it('calls the useFiles hook with the correct parameters', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion
    )
  })

  it('calls the useFiles hook with the correct parameters when sortBy criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (A-Z)').should('exist').click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withSortBy(FileSortByOption.NAME_AZ)
    )
  })

  it('calls the useFiles hook with the correct parameters when filterByType criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: All' }).click()
    cy.findByText('Image (485)').should('exist').click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withFilterByType('image')
    )
  })

  it('calls the useFiles hook with the correct parameters when filterByAccess criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: 'Access: All' }).click()
    cy.findByText('Public (222)').should('exist').click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withFilterByAccess(FileAccessOption.PUBLIC)
    )
  })

  it('calls the useFiles hook with the correct parameters when filterByTag criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: All' }).click()
    cy.findByText('Document (5)').should('exist').click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withFilterByTag('document')
    )
  })

  it('calls the useFiles hook with the correct parameters when searchText criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByLabelText('Search').type('test{enter}')
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withSearchText('test')
    )
  })
})
