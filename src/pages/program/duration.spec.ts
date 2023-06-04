import {formatSeconds} from "./duration";

const cases = [
  [1.23e-10, '0.12 ns'],
  [1.23e-9, '1.23 ns'],
  [1.23e-8, '12.3 ns'],
  [1.23e-7, '123 ns'],
  [1.23e-6, '1.23 μs'],
  [1.23e-5, '12.3 μs'],
  [1.23e-4, '123 μs'],
  [1.23e-3, '1.23 ms'],
  [1.23e-2, '12.3 ms'],
  [1.23e-1, '123 ms'],
  [1.23, '1.23 s'],
  [12.3, '12.3 s'],
  [59.9, '59.9 s'],
  [500, '500 s'],
];

for (const [seconds, expected] of cases) {
  test(`format ${(<number>seconds).toExponential()} as ${expected}`, () => {
    expect(formatSeconds((<number>seconds))).toEqual(expected);
  });
}
