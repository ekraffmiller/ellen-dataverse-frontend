import { DatasetLabelValue } from '../../../../../src/dataset/domain/models/Dataset'
import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { FileHelper } from '../../../shared/files/FileHelper'

type Dataset = {
  datasetVersion: { metadataBlocks: { citation: { fields: { value: string }[] } } }
}

describe('Dataset', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  describe('Visit the Dataset Page as a logged in user', () => {
    it('successfully loads a dataset in draft mode', () => {
      cy.wrap(DatasetHelper.create())
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')
            cy.findByText(DatasetLabelValue.DRAFT).should('exist')
            // cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist') TODO - Implemnent isReleased property in js-dataverse to get the Unpublished label

            cy.findByText('Metadata').should('exist')
            cy.findByText('Files').should('exist')
          })
        })
    })

    it('loads page not found when the user is not authenticated and tries to access a draft', () => {
      cy.wrap(DatasetHelper.create())
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wrap(TestsUtils.logout())
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Page Not Found').should('exist')
        })
    })

    it('successfully loads a dataset when passing the id and version', () => {
      cy.wrap(DatasetHelper.create().then((dataset) => DatasetHelper.publish(dataset.persistentId)))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500)
          cy.visit(`/spa/datasets?persistentId=${persistentId}&version=1.0`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')
            cy.findByText(DatasetLabelValue.DRAFT).should('not.exist')
            // cy.findByText(DatasetLabelValue.UNPUBLISHED).should('not.exist') TODO - Implemnent isReleased property in js-dataverse to get the Unpublished label
            cy.findByText('Version 1.0').should('exist')
          })
        })
    })

    it('loads the latest version of the dataset when passing a wrong version', () => {
      cy.wrap(DatasetHelper.create().then((dataset) => DatasetHelper.publish(dataset.persistentId)))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the dataset to be published
          cy.visit(`/spa/datasets?persistentId=${persistentId}&version=2.0`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')

            cy.findByText(DatasetLabelValue.DRAFT).should('not.exist')
            cy.findByText('Version 1.0').should('exist')
          })
        })
    })

    it('loads page not found when passing a wrong persistentId', () => {
      cy.visit('/spa/datasets?persistentId=doi:10.5072/FK2/WRONG')
      cy.findByText('Page Not Found').should('exist')
    })

    it('successfully loads a dataset using a privateUrlToken', () => {
      cy.wrap(DatasetHelper.create().then((dataset) => DatasetHelper.createPrivateUrl(dataset.id)))
        .its('token')
        .then((token: string) => {
          cy.visit(`/spa/datasets?privateUrlToken=${token}`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')
            cy.findByText(DatasetLabelValue.DRAFT).should('exist')
            // cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist') TODO - Implemnent isReleased property in js-dataverse to get the Unpublished label
          })
        })
    })

    it('successfully loads a dataset using a privateUrlToken with anonymized fields', () => {
      cy.wrap(
        DatasetHelper.create().then((dataset) =>
          DatasetHelper.createPrivateUrlAnonymized(dataset.id)
        )
      )
        .its('token')
        .then((token: string) => {
          cy.visit(`/spa/datasets?privateUrlToken=${token}`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')
            cy.findByText(DatasetLabelValue.DRAFT).should('exist')
            // cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist') TODO - Implemnent isReleased property in js-dataverse to get the Unpublished label

            cy.findAllByText('withheld').should('exist')
          })
        })
    })

    it.skip('successfully loads a dataset deaccessioned', () => {
      // TODO - Add test when deaccessioned endpoint works
    })
  })

  describe('Visualizing the Files Tab', () => {
    it('successfully loads the files tab', () => {
      cy.wrap(DatasetHelper.create())
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('There are no files in this dataset.').should('exist')
        })
    })

    it('successfully loads the files tab with files', () => {
      cy.wrap(DatasetHelper.createWithFiles(FileHelper.createMany(3)), { timeout: 5000 })
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('1 to 3 of 3 Files').should('exist')
          cy.findByText('blob').should('exist')
          cy.findByText('blob-1').should('exist')
          cy.findByText('blob-2').should('exist')
        })
    })

    it('navigates to the next page of files', () => {
      cy.wrap(DatasetHelper.createWithFiles(FileHelper.createMany(30)), { timeout: 20000 })
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByRole('button', { name: /Sort/ }).click({ force: true })
          cy.findByText('Name (A-Z)').should('exist').click({ force: true })

          cy.findByText('1 to 10 of 30 Files').should('exist')
          cy.findByText('blob').should('exist')
          cy.findByText('blob-17').should('exist')

          cy.findByText('Next').click({ force: true })

          cy.findByText('11 to 20 of 30 Files').should('exist')
          cy.findByText('blob-18').should('exist')
          cy.findByText('blob-26').should('exist')

          cy.findByText('Previous').click({ force: true })

          cy.findByText('1 to 10 of 30 Files').should('exist')
          cy.findByText('blob').should('exist')
          cy.findByText('blob-17').should('exist')
        })
    })

    it('successfully loads the action buttons when the user is logged in as owner', () => {
      cy.wrap(DatasetHelper.createWithFiles(FileHelper.createMany(3)))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('Upload Files').should('exist')
          cy.findByText('Edit Files').should('exist')
          cy.findAllByRole('button', { name: 'Access File' }).should('exist')
          cy.findAllByRole('button', { name: 'File Options' }).should('exist')
        })
    })

    it('does not load the action buttons when the user is not logged in as owner', () => {
      cy.wrap(
        DatasetHelper.createWithFiles(FileHelper.createMany(3)).then((dataset) =>
          DatasetHelper.publish(dataset.persistentId)
        )
      )
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the dataset to be published
          cy.wrap(TestsUtils.logout())

          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('Upload Files').should('not.exist')
          cy.findByText('Edit Files').should('not.exist')
          cy.findAllByRole('button', { name: 'Access File' }).should('exist')
          cy.findAllByRole('button', { name: 'File Options' }).should('not.exist')
        })
    })

    it('loads the restricted files when the user is logged in as owner', () => {
      cy.wrap(DatasetHelper.createWithFiles(FileHelper.createManyRestricted(1)))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('Restricted File Icon').should('not.exist')
          cy.findByText('Restricted with access Icon').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist').click()
          cy.findByText('Restricted with Access Granted').should('exist')

          cy.findByRole('button', { name: 'File Options' }).should('exist').click()
          cy.findByText('Unrestrict').should('exist')
        })
    })

    it('loads the restricted files when the user is not logged in as owner', () => {
      cy.wrap(
        DatasetHelper.createWithFiles(FileHelper.createManyRestricted(1)).then((dataset) =>
          DatasetHelper.publish(dataset.persistentId)
        )
      )
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the dataset to be published

          cy.wrap(TestsUtils.logout())

          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.wait(1500) // Wait for the files to be loaded

          cy.findByText('Files').should('exist')

          cy.findByText('Restricted with access Icon').should('not.exist')
          cy.findByText('Restricted File Icon').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist').click()
          cy.findByText('Restricted').should('exist')
        })
    })

    it('loads the embargoed files', () => {
      cy.wrap(
        DatasetHelper.createWithFiles(FileHelper.createMany(1)).then((dataset) =>
          DatasetHelper.embargoFiles(
            dataset.persistentId,
            [dataset.files ? dataset.files[0].id : 0],
            '2100-10-20'
          )
        )
      )
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the files to be embargoed

          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.wait(1500) // Wait for the files to be loaded

          cy.findByText('Files').should('exist')

          cy.findByText(/Deposited/).should('exist')
          cy.findByText('Draft: will be embargoed until Oct 20, 2100').should('exist')

          cy.findByText('Edit Files').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist').click()
          cy.findByText('Embargoed').should('exist')
        })
    })

    it('applies filters to the Files Table in the correct order', () => {
      const files = [
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category'],
          restrict: 'true',
          tabIngest: 'false'
        }),
        FileHelper.create('csv', {
          description: 'Some description',
          restrict: 'true',
          tabIngest: 'false'
        }),
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category'],
          tabIngest: 'false'
        }),
        FileHelper.create('txt', {
          description: 'Some description',
          categories: ['category'],
          restrict: 'true'
        }),
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category'],
          restrict: 'true',
          tabIngest: 'false'
        }),
        FileHelper.create('csv', {
          description: 'Some description',
          categories: ['category'],
          restrict: 'true',
          tabIngest: 'false'
        })
      ]
      cy.wrap(DatasetHelper.createWithFiles(files))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('1 to 6 of 6 Files').should('exist')
          cy.findByText('blob').should('exist')
          cy.findByText('blob-1').should('exist')
          cy.findByText('blob-2').should('exist')
          cy.findByText('blob-3').should('exist')
          cy.findByText('blob-4').should('exist')
          cy.findByText('blob-5').should('exist')

          cy.findByLabelText('Search').type('blob-{enter}', { force: true })

          cy.findByText('1 to 5 of 5 Files').should('exist')
          cy.findByText('blob').should('not.exist')
          cy.findByText('blob-1').should('exist')
          cy.findByText('blob-2').should('exist')
          cy.findByText('blob-3').should('exist')
          cy.findByText('blob-4').should('exist')
          cy.findByText('blob-5').should('exist')

          cy.findByRole('button', { name: 'File Tags: All' }).click({ force: true })
          cy.findByText('Category (4)').should('exist').click({ force: true })

          cy.findByText('1 to 4 of 4 Files').should('exist')
          cy.findByText('blob').should('not.exist')
          cy.findByText('blob-1').should('not.exist')
          cy.findByText('blob-2').should('exist')
          cy.findByText('blob-3').should('exist')
          cy.findByText('blob-4').should('exist')
          cy.findByText('blob-5').should('exist')

          cy.findByRole('button', { name: 'Access: All' }).click({ force: true })
          cy.findByText('Restricted (3)').should('exist').click({ force: true })

          cy.findByText('1 to 3 of 3 Files').should('exist')
          cy.findByText('blob').should('not.exist')
          cy.findByText('blob-1').should('not.exist')
          cy.findByText('blob-2').should('not.exist')
          cy.findByText('blob-3').should('exist')
          cy.findByText('blob-4').should('exist')
          cy.findByText('blob-5').should('exist')

          cy.findByRole('button', { name: 'File Type: All' }).click({ force: true })
          cy.findByText('Comma Separated Values (2)').should('exist').click({ force: true })

          cy.findByText('1 to 2 of 2 Files').should('exist')
          cy.findByText('blob').should('not.exist')
          cy.findByText('blob-1').should('not.exist')
          cy.findByText('blob-2').should('not.exist')
          cy.findByText('blob-3').should('not.exist')
          cy.findByText('blob-4').should('exist')
          cy.findByText('blob-5').should('exist')

          cy.findByRole('button', { name: /Sort/ }).click({ force: true })
          cy.findByText('Name (Z-A)').should('exist').click({ force: true })

          cy.findByText('blob').should('not.exist')
          cy.findByText('blob-1').should('not.exist')
          cy.findByText('blob-2').should('not.exist')
          cy.findByText('blob-3').should('not.exist')
          cy.get('table > tbody > tr').eq(0).should('contain', 'blob-5')
          cy.get('table > tbody > tr').eq(1).should('contain', 'blob-4')
        })
    })

    it('shows the thumbnail for a file', () => {
      cy.wrap(FileHelper.createImage().then((file) => DatasetHelper.createWithFiles([file])))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByAltText('blob').should('exist')
        })
    })
  })

  describe('Downloading files', () => {
    it('downloads a file', () => {
      cy.wrap(
        DatasetHelper.createWithFiles(FileHelper.createMany(1)).then((dataset) =>
          DatasetHelper.publish(dataset.persistentId)
        )
      )
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the dataset to be published
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)
          cy.wait(1500) // Wait for the page to load

          cy.findByText('Files').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist').click()

          // Workaround for issue where Cypress gets stuck on the download
          cy.window()
            .document()
            .then(function (doc) {
              doc.addEventListener('click', () => {
                setTimeout(function () {
                  doc.location.reload()
                }, 5000)
              })
              cy.findByText('Plain Text').should('exist').click()
            })

          cy.findByText('1 Downloads').should('exist')
        })
    })

    it('downloads multiple files', () => {
      cy.wrap(
        DatasetHelper.createWithFiles(FileHelper.createMany(3)).then((dataset) =>
          DatasetHelper.publish(dataset.persistentId)
        )
      )
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the page to load
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)
          cy.wait(1500) // Wait for the page to load

          cy.findByText('Files').should('exist')

          cy.get('table > thead > tr > th > input[type=checkbox]').click()

          cy.findByRole('button', { name: 'Download' }).should('exist').click({ force: true })

          // Workaround for issue where Cypress gets stuck on the download
          cy.window()
            .document()
            .then(function (doc) {
              doc.addEventListener('click', () => {
                setTimeout(function () {
                  doc.location.reload()
                }, 5000)
              })
              cy.findByText('Original Format').should('exist').click()
            })

          cy.findAllByText('1 Downloads').should('exist')
        })
    })
  })
})
