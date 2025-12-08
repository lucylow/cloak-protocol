import { render } from '@testing-library/react';
import App from '../App';

test('renders app shell', () => {
  const { container } = render(<App />);
  // Check that the app container is rendered
  expect(container).toBeTruthy();
});

