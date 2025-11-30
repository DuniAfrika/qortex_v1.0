import { describe, expect, it } from 'vitest';
import { determineQuorumOutcome } from './quorumValidator';

describe('determineQuorumOutcome', () => {
  it('detects consensus when majority meets threshold', () => {
    const outcome = determineQuorumOutcome(
      [
        { minerId: 'm1', label: 'positive' },
        { minerId: 'm2', label: 'positive' },
        { minerId: 'm3', label: 'negative' },
      ],
      0.6
    );

    expect(outcome.consensus).toBe(true);
    expect(outcome.decision).toBe('positive');
    expect(outcome.agreeingMiners).toContain('m1');
  });

  it('fails consensus when threshold not met', () => {
    const outcome = determineQuorumOutcome(
      [
        { minerId: 'm1', label: 'positive' },
        { minerId: 'm2', label: 'negative' },
      ],
      0.75
    );

    expect(outcome.consensus).toBe(false);
    expect(outcome.decision).toBe('positive');
    expect(outcome.dissentingMiners.length).toBeGreaterThan(0);
  });
});
