import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Header } from '../../../sections/layout/header/Header'
import { UserRepository } from '../../../domain/UserRepository'
import { User } from '../../../domain/User'
import { userEvent, within } from '@storybook/testing-library'

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Header>

const testData: User = {
  name: 'Jane Doe'
}
class MockedUserRepository implements UserRepository {
  getAuthenticated(): Promise<User> {
    return Promise.resolve(testData)
  }

  removeAuthenticated(): Promise<void> {
    return Promise.resolve()
  }
}

export const LoggedIn: Story = {
  render: () => <Header userRepository={new MockedUserRepository()} />
}

export const LoggedOut: Story = {
  render: () => <Header userRepository={new MockedUserRepository()} />,
  play: async ({ canvasElement }) => {
    const { findByText } = within(canvasElement)

    await userEvent.click(await findByText(testData.name))
    await userEvent.click(await findByText('Log Out'))
  }
}
