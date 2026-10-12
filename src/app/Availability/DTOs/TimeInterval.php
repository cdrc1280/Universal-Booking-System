<?php

declare(strict_types=1);

namespace App\Availability\DTOs;

use DateTimeImmutable;

/**
 * Immutable half-open time interval [start, end).
 * Represents a discrete window of available, busy, or buffer time.
 */
final readonly class TimeInterval
{
    public function __construct(
        public DateTimeImmutable $start,
        public DateTimeImmutable $end,
    ) {
        if ($this->end < $this->start) {
            throw new \InvalidArgumentException('Interval end cannot precede start.');
        }
    }

    public function durationInMinutes(): int
    {
        return (int) (($this->end->getTimestamp() - $this->start->getTimestamp()) / 60);
    }

    public function overlaps(self $other): bool
    {
        return $this->start < $other->end && $other->start < $this->end;
    }

    public function contains(DateTimeImmutable $point): bool
    {
        return $point >= $this->start && $point < $this->end;
    }

    public function containsInterval(self $inner): bool
    {
        return $this->start <= $inner->start && $this->end >= $inner->end;
    }

    /**
     * Subtract an overlapping interval from this interval.
     * Returns zero, one, or two remaining sub-intervals.
     *
     * @return list<self>
     */
    public function subtract(self $busy): array
    {
        if (! $this->overlaps($busy)) {
            return [$this];
        }

        $remaining = [];

        // Free segment prior to the busy window start
        if ($this->start < $busy->start) {
            $remaining[] = new self($this->start, $busy->start);
        }

        // Free segment following the busy window end
        if ($this->end > $busy->end) {
            $remaining[] = new self($busy->end, $this->end);
        }

        return $remaining;
    }
}
