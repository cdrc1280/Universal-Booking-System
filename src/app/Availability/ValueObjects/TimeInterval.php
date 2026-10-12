<?php

declare(strict_types=1);

namespace App\Availability\ValueObjects;

use Carbon\CarbonImmutable;
use InvalidArgumentException;

final readonly class TimeInterval
{
    public function __construct(
        public CarbonImmutable $start,
        public CarbonImmutable $end,
    ) {
        if ($this->end->lessThanOrEqualTo($this->start)) {
            throw new InvalidArgumentException(
                "Interval end ({$this->end->toIso8601String()}) must be strictly after start ({$this->start->toIso8601String()})."
            );
        }
    }

    public static function of(CarbonImmutable $start, CarbonImmutable $end): self
    {
        return new self($start, $end);
    }

    public function durationInMinutes(): int
    {
        return (int) $this->start->diffInMinutes($this->end);
    }

    public function overlaps(self $other): bool
    {
        return $this->start->lessThan($other->end) && $this->end->greaterThan($other->start);
    }

    public function contains(self $other): bool
    {
        return $this->start->lessThanOrEqualTo($other->start) && $this->end->greaterThanOrEqualTo($other->end);
    }

    /**
     * Calculates non-overlapping sub-intervals after carving out an exclusion window.
     *
     * @return array<int, self>
     */
    public function subtract(self $exclusion): array
    {
        if (! $this->overlaps($exclusion)) {
            return [$this];
        }

        $remaining = [];

        if ($this->start->lessThan($exclusion->start)) {
            $remaining[] = new self($this->start, $exclusion->start);
        }

        if ($this->end->greaterThan($exclusion->end)) {
            $remaining[] = new self($exclusion->end, $this->end);
        }

        return $remaining;
    }
}
