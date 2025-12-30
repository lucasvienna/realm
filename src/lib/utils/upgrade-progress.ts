import { DateTime } from "luxon";

export interface UpgradeProgressParams {
	upgradeFinishesAt: string | null;
	upgradeSeconds: number;
	now: DateTime;
}

export function calculateUpgradeProgress({
	upgradeFinishesAt,
	upgradeSeconds,
	now,
}: UpgradeProgressParams): number {
	if (!upgradeFinishesAt) return 0;

	const finishTime = DateTime.fromISO(upgradeFinishesAt);
	if (!finishTime.isValid) return 0;

	const totalSeconds = upgradeSeconds;
	if (totalSeconds <= 0) return 100;

	const startTime = finishTime.minus({ seconds: totalSeconds });
	const elapsed = now.diff(startTime, "seconds").seconds;
	return Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
}

export function isUpgradeComplete(upgradeFinishesAt: string | null, now: DateTime): boolean {
	if (!upgradeFinishesAt) return false;
	const finishTime = DateTime.fromISO(upgradeFinishesAt);
	if (!finishTime.isValid) return false;
	return now >= finishTime;
}

export function formatRemainingTime(
	upgradeFinishesAt: string | null,
	now: DateTime,
): string | null {
	if (!upgradeFinishesAt) return null;

	const finishTime = DateTime.fromISO(upgradeFinishesAt);
	if (!finishTime.isValid) return null;

	const remaining = finishTime.diff(now, ["hours", "minutes", "seconds"]);
	if (remaining.as("seconds") <= 0) return "Complete!";

	const hours = Math.floor(remaining.hours);
	const minutes = Math.floor(remaining.minutes);
	const seconds = Math.floor(remaining.seconds);

	if (hours > 0) return `${hours}h ${minutes}m remaining`;
	if (minutes > 0) return `${minutes}m ${seconds}s remaining`;
	return `${seconds}s remaining`;
}
