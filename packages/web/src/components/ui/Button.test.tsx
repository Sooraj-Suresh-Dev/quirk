import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeDisabled();
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByText('Primary');
    expect(btn.className).toContain('bg-coral');
  });

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByText('Secondary');
    expect(btn.className).toContain('bg-soft-white');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByText('Ghost');
    expect(btn.className).toContain('bg-transparent');
  });
});
