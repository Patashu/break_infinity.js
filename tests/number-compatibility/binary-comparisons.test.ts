import Decimal from "../../src";
import { binaryTestCases } from "./test-cases";

type NumberOperation = (left: number, right: number) => boolean;
type InstanceDecimalOperation = (left: Decimal, right: Decimal) => boolean
type StaticDecimalOperation = (left: number, right: number) => boolean

type BinaryComparisonTestSuite = [
  string,
  NumberOperation,
  StaticDecimalOperation[],
  InstanceDecimalOperation[]
];

const binaryComparisonTestSuites: BinaryComparisonTestSuite[] = [
  [
    ".eq()",
    (n1, n2) => n1 === n2,
    [
      Decimal.equals,
      Decimal.eq,
    ],
    [
      (d1, d2) => d1.equals(d2),
      (d1, d2) => d1.eq(d2)
    ]
  ],
  [
    ".neq()",
    (n1, n2) => n1 !== n2,
    [
      Decimal.notEquals,
      Decimal.neq,
    ],
    [
      (d1, d2) => d1.notEquals(d2),
      (d1, d2) => d1.neq(d2)
    ]
  ],
  [
    ".gt()",
    (n1, n2) => n1 > n2,
    [
      Decimal.gt
    ],
    [
      (d1, d2) => d1.greaterThan(d2),
      (d1, d2) => d1.gt(d2)
    ]
  ],
  [
    ".gte()",
    (n1, n2) => n1 >= n2,
    [
      Decimal.gte
    ],
    [
      (d1, d2) => d1.greaterThanOrEqualTo(d2),
      (d1, d2) => d1.gte(d2)
    ]
  ],
  [
    ".lt()",
    (n1, n2) => n1 < n2,
    [
      Decimal.lt
    ],
    [
      (d1, d2) => d1.lessThan(d2),
      (d1, d2) => d1.lt(d2)
    ]
  ],
  [
    ".lte()",
    (n1, n2) => n1 <= n2,
    [
      Decimal.lte
    ],
    [
      (d1, d2) => d1.lessThanOrEqualTo(d2),
      (d1, d2) => d1.lte(d2)
    ]
  ]
];

for (const testSuite of binaryComparisonTestSuites) {
  describe(testSuite[0], () => {
    test.each(binaryTestCases)(
      "%s",
      (testCase) => {
        const numberOperation = testSuite[1];
        const numberResult = numberOperation(testCase.left.number, testCase.right.number);
        const staticDecimalOperations = testSuite[2];
        for (const decimalOperation of staticDecimalOperations) {
          const decimalResult = decimalOperation(testCase.left.number, testCase.right.number);
          expect(decimalResult).toBe(numberResult);
        }
        const instanceDecimalOperations = testSuite[3];
        for (const decimalOperation of instanceDecimalOperations) {
          const decimalResult = decimalOperation(testCase.left.decimal, testCase.right.decimal);
          expect(decimalResult).toBe(numberResult);
        }
      }
    );
  });
}