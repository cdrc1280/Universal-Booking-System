<?php

declare(strict_types=1);

namespace App\Availability\Services;

use App\Availability\DTOs\AvailableSlot;
use App\Availability\DTOs\TimeInterval;
use DateTimeImmutable;
use DateTimeZone;

/**
 * Pure calculation service for generating available appointment slots.
 * Completely decoupled from Eloquent and HTTP layers for millisecond unit testing.
 */
final class AvailabilityCalculator
{
    /**
     * @param list<TimeInterval> $workingShifts Base shifts for the target date
     * @param list<TimeInterval> $busyWindows Booked appointments + breaks + time-off
     * @param int $serviceDurationMinutes Base service time
     * @param int $bufferBeforeMinutes Buffer time needed before appointment
     * @param int $bufferAfterMinutes Buffer time needed after appointment
     * @param int $slotStepMinutes Grid step (e.g. every 15 or 30 minutes)
     * @param list<int> $staffIds Staff assigned to this schedule
     * @return list<AvailableSlot>
     */
    public function computeSlotsForIntervals(
        array $workingShifts,
        array $busyWindows,
        int $serviceId,
        int $serviceDurationMinutes,
        int $bufferBeforeMinutes = 0,
        int $bufferAfterMinutes = 0,
        int $slotStepMinutes = 15,
        array $staffIds = [],
        int $priceInCents = 0,
    ): array {
        // Step 1: Compute free continuous time blocks by subtracting all busy windows from working shifts
        $freeIntervals = $this->subtractIntervals($workingShifts, $busyWindows);

        $totalSlotFootprintMinutes = $bufferBeforeMinutes + $serviceDurationMinutes + $bufferAfterMinutes;
        $slots = [];

        // Step 2: Step through free continuous blocks and test whether candidate slot + buffers fits entirely
        foreach ($freeIntervals as $interval) {
            $currentPointer = $interval->start;

            while (true) {
                // Proposed appointment window
                $proposedStart = $currentPointer;
                $proposedEnd = $proposedStart->modify("+{$serviceDurationMinutes} minutes");

                // Full reservation footprint including required turnaround buffers
                $footprintStart = $proposedStart->modify("-{$bufferBeforeMinutes} minutes");
                $footprintEnd = $proposedEnd->modify("+{$bufferAfterMinutes} minutes");

                $footprint = new TimeInterval($footprintStart, $footprintEnd);

                // Slot is valid if the complete buffer footprint is encompassed by this free block
                if ($interval->containsInterval($footprint)) {
                    $slots[] = new AvailableSlot(
                        start: $proposedStart,
                        end: $proposedEnd,
                        serviceId: $serviceId,
                        candidateStaffIds: $staffIds,
                        totalDurationMinutes: $serviceDurationMinutes,
                        totalPriceInCents: $priceInCents,
                    );
                }

                // Advance by configured slot step interval
                $currentPointer = $currentPointer->modify("+{$slotStepMinutes} minutes");

                // Stop if proposed start exceeds the free window boundaries
                if ($currentPointer >= $interval->end) {
                    break;
                }
            }
        }

        return $slots;
    }

    /**
     * Iteratively subtracts busy windows from an array of base intervals.
     *
     * @param list<TimeInterval> $bases
     * @param list<TimeInterval> $busyWindows
     * @return list<TimeInterval>
     */
    public function subtractIntervals(array $bases, array $busyWindows): array
    {
        $current = $bases;

        foreach ($busyWindows as $busy) {
            $next = [];

            foreach ($current as $interval) {
                foreach ($interval->subtract($busy) as $remainingPiece) {
                    $next[] = $remainingPiece;
                }
            }

            $current = $next;
        }

        return $current;
    }
}
