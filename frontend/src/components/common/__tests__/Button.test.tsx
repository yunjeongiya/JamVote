// Button 컴포넌트 테스트

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('should render children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    await user.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply primary variant styles by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('should apply correct variant styles', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-gray-600');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText('Danger')).toHaveClass('bg-red-600');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText('Ghost')).toHaveClass('bg-transparent');
  });

  it('should apply correct size styles', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium')).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('should apply fullWidth class when prop is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByText('Full Width')).toHaveClass('w-full');
  });

  it('should have correct accessibility attributes', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('disabled');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should merge custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');

    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('rounded-lg'); // Base class
  });

  it('should be keyboard accessible', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Keyboard</Button>);

    const button = screen.getByText('Keyboard');
    button.focus();

    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should apply focus-visible styles', () => {
    render(<Button>Focus</Button>);
    expect(screen.getByText('Focus')).toHaveClass('focus-visible:ring-2');
  });
});
