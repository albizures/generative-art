type OptionalNumber = number | undefined;
type RangeRanger =
	| [OptionalNumber, OptionalNumber]
	| [OptionalNumber, OptionalNumber, number];

const range = (
	[from = 0, to, inclusiveTo]: RangeRanger,
	stepBy = 1,
	ignoreInfinityRangeError = false,
): Iterable<number> => {
	const realTo = typeof to === 'number' ? to : inclusiveTo + 1;

	if (!(typeof realTo === 'number') || Number.isNaN(realTo)) {
		console.warn(
			"Ranger: returning an oneStepIterator since no valid 'to' was provided",
		);

		return (function* oneStepIterator(): Iterable<number> {
			yield from;
		})();
	}

	if ((from > realTo && stepBy > 0) || (from < realTo && stepBy < 0)) {
		if (!ignoreInfinityRangeError) {
			throw new Error(
				`Ranger: range([${from}, ${to ? to : ''}, ${
					inclusiveTo ? inclusiveTo : ''
				}], ${stepBy}) creates an infinity range`,
			);
		}
	}

	if (from === realTo) {
		return (function* iterator(): Iterable<number> {
			return;
		})();
	}

	function* iterator(): Iterable<number> {
		for (let index = from; index < realTo; index += stepBy) {
			yield index;
		}
	}

	return iterator();
};

export { range };
