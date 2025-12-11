{
  "name": "your-project-name",
  "version": "1.0.0",
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^27.0.0",
    "babel-jest": "^27.0.0",
    "babel-preset-react": "^6.24.1"
  }
}

import React from 'react';
import { render } from '@testing-library/react';
import Hello from '../Hello';

test('renders hello world', () => {
  const { getByText } = render(<Hello />);
  const linkElement = getByText(/hello world/i);
  expect(linkElement).toBeInTheDocument();
});