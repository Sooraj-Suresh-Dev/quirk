import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useInView } from './useInView';

describe('useInView', () => {
  it('returns a ref and inView state', () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toBeDefined();
    expect(result.current.inView).toBe(false);
  });

  it('accepts custom threshold', () => {
    const { result } = renderHook(() => useInView(0.5));
    expect(result.current.ref).toBeDefined();
    expect(result.current.inView).toBe(false);
  });
});
