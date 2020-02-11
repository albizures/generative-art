type Ranger = Iterable<number>;

type OptionalNumber = number | undefined;
type RangeRanger =
	| [OptionalNumber, OptionalNumber]
	| [OptionalNumber, OptionalNumber, number];

const range = (
	[from = 0, to, inclusiveTo]: RangeRanger,
	stepBy = 1,
	ignoreInfinityRangeError = false,
): Ranger => {
	const realTo = to || inclusiveTo + 1;
	if (!realTo) {
		console.warn(
			"Ranger: returning an oneStepIterator since no valid 'to' was provided",
		);

		return (function* oneStepIterator(): Ranger {
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

	function* iterator(): Ranger {
		for (let index = from; index < realTo; index += stepBy) {
			yield index;
		}
	}

	return iterator();
};

export { range };
