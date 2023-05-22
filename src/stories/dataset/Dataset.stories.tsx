import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { WithLayoutLoading } from '../WithLayoutLoading'
import { WithAnonymizedView } from './WithAnonymizedView'
import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetMockNoDataRepository } from './DatasetMockNoDataRepository'

const meta: Meta<typeof Dataset> = {
  title: 'Pages/Dataset',
  component: Dataset,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Dataset>

export const Default: Story = {
  decorators: [WithLayout],
  render: () => <Dataset repository={new DatasetMockRepository()} searchParams={{ id: '1' }} />
}

export const Loading: Story = {
  decorators: [WithLayoutLoading],
  render: () => <Dataset repository={new DatasetMockRepository()} searchParams={{ id: '1' }} />
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout],
  render: () => (
    <Dataset repository={new DatasetMockNoDataRepository()} searchParams={{ id: '1' }} />
  )
}

export const DatasetAnonymizedView: Story = {
  decorators: [WithLayout, WithAnonymizedView],
  render: () => (
    <Dataset
      repository={new DatasetMockRepository()}
      searchParams={{ privateUrlToken: '123456' }}
    />
  )
}