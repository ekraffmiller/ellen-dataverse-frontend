import { PaginationControls } from '../../../../../../src/sections/shared/pagination/PaginationControls'
import { FilePaginationInfo } from '../../../../../../src/files/domain/models/FilePaginationInfo'

let paginationInfo: FilePaginationInfo
const page = 3
const pageSize = 10
const total = 200
describe('FilesPagination', () => {
  beforeEach(() => {
    cy.viewport(1000, 1000)
    paginationInfo = new FilePaginationInfo(page, pageSize, total)
  })

  it('clicking on the first page button calls goToPage 1', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: 'First' }).click()
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.goToPage(1))
  })

  it('clicking on the previous page button calls goToPreviousPage', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: 'Previous' }).click()
    cy.wrap(onPaginationInfoChange).should(
      'have.been.calledWith',
      paginationInfo.goToPreviousPage()
    )
  })

  it('clicking on a page button calls goToPage with the correct number', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: '5' }).click()
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.goToPage(5))
  })

  it('clicking on the next page button calls goToNextPage', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: 'Next' }).click()
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.goToNextPage())
  })

  it('clicking on the last page button calls setPageIndex with the last index', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: 'Last' }).click()
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.goToPage(20))
  })

  it('selecting a page size calls setPageSize with the selected value', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByLabelText('Files per page').select('50')
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.withPageSize(50))

    cy.findByRole('button', { name: 'Last' }).click()
    cy.wrap(onPaginationInfoChange).should(
      'have.been.calledWith',
      paginationInfo.withPageSize(50).goToPage(4)
    )
  })
})
