/**
 * @vitest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Home from '../src/app/page';

describe.skip('Page', () => {
  it('dumb test', () => {
    expect('a').toBeTruthy();
  });
  //render(<Home />)
  //expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})