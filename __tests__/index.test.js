import { render, screen } from '@testing-library/react';
import Index from '../pages/index';
import Map from '../components/Map';
import '@testing-library/jest-dom';

describe('Index Renders when Logged Out', () => {
  it('renders a heading', () => {
    render(<Index />);
    const heading = screen.getByText('HydroTag App');
    expect(heading).toBeInTheDocument();
  });
});

describe('Map Loads', () => {
  it('starts loading', async () => {
    render(<Map />);
    const heading = screen.getByText('Loading...');
    expect(heading).toBeInTheDocument();
  });
});
