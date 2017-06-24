import React from 'react'
import App from './App'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import {Provider} from 'react-redux'

const mockStoreFactory = configureMockStore()

it('renders without crashing', () => {
  const tree = renderer.create(
    <Provider store={mockStoreFactory()}>
      <App />
    </Provider>
    ).toJSON()
  expect(tree).toMatchSnapshot()
})
