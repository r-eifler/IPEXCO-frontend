import { subsetMinimal } from './answer-factory'

describe('answer-factory', () => {
    describe('#subsetMinimal', () => {
        it('should return an empty list for an empty input', () => {
            const result = subsetMinimal([]);

            expect(result).toEqual([]);
        });

        it('should not change the input when there is no pair of subsets', () => {
            const result = subsetMinimal([['a', 'b'], ['b', 'c'], ['a', 'c']]);

            expect(result).toEqual([['a', 'b'], ['b', 'c'], ['a', 'c']]);
        });

        it('should remove superset of ["a"]', () => {
            const result = subsetMinimal([['a'], ['b', 'c'], ['a', 'c']]);

            expect(result).toEqual([['a'], ['b', 'c']]);
        });
    });
});