import Decimal from "../../src";
import { assertEqual } from "./assert";
import { binaryTestCases } from "./test-cases";

type NumberOperation = (left: number, right: number) => number;
type InstanceDecimalOperation = (left: Decimal, right: Decimal) => Decimal
type StaticDecimalOperation = (left: number, right: number) => Decimal

type BinaryOperationTestSuite = [
  string,
  NumberOperation,
  StaticDecimalOperation[],
  InstanceDecimalOperation[]
];

const binaryOperationTestSuites: BinaryOperationTestSuite[] = [
  [
    ".add()",
    (n1, n2) => n1 + n2,
    [
      Decimal.add,
      Decimal.plus
    ],
    [
      (d1, d2) => d1.add(d2),
      (d1, d2) => d1.plus(d2),
    ]
  ],
  [
    ".sub()",
    (n1, n2) => n1 - n2,
    [
      Decimal.subtract,
      Decimal.sub,
      Decimal.minus
    ],
    [
      (d1, d2) => d1.subtract(d2),
      (d1, d2) => d1.sub(d2),
      (d1, d2) => d1.minus(d2)
    ]
  ],
  [
    ".mul()",
    (n1, n2) => n1 * n2,
    [
      Decimal.multiply,
      Decimal.mul,
      Decimal.times
    ],
    [
      (d1, d2) => d1.multiply(d2),
      (d1, d2) => d1.mul(d2),
      (d1, d2) => d1.times(d2),
    ]
  ],
  [
    ".div()",
    (n1, n2) => n1 / n2,
    [
      Decimal.divide,
      Decimal.div
    ],
    [
      (d1, d2) => d1.divide(d2),
      (d1, d2) => d1.divideBy(d2),
      (d1, d2) => d1.dividedBy(d2),
      (d1, d2) => d1.div(d2),
    ]
  ],
  [
    ".pow()",
    Math.pow,
    [
      Decimal.pow
    ],
    [
      (d1, d2) => d1.pow(d2)
    ]
  ],
  [
    ".max()",
    Math.max,
    [
      Decimal.max
    ],
    [
      (d1, d2) => d1.max(d2)
    ]
  ],
  [
    ".min()",
    Math.min,
    [
      Decimal.min
    ],
    [
      (d1, d2) => d1.min(d2)
    ]
  ],
  [
    ".log()",
    (n1, n2) => Math.log(n1) / Math.log(n2),
    [
      (n1, n2) => new Decimal(Decimal.log(n1, n2)),
      (n1, n2) => new Decimal(Decimal.logarithm(n1, n2)),
    ],
    [
      (d1, d2) => new Decimal(d1.log(d2.toNumber())),
      (d1, d2) => new Decimal(d1.logarithm(d2.toNumber()))
    ]
  ]
];

for (const testSuite of binaryOperationTestSuites) {
  describe(testSuite[0], () => {
    test.each(binaryTestCases)(
      "%s",
      (testCase) => {
        const numberOperation = testSuite[1];
        const numberResult = numberOperation(testCase.left.number, testCase.right.number);
        const staticDecimalOperations = testSuite[2];
        for (const decimalOperation of staticDecimalOperations) {
          const decimalResult = decimalOperation(testCase.left.number, testCase.right.number);
          assertEqual(decimalResult, numberResult);
        }
        const instanceDecimalOperations = testSuite[3];
        for (const decimalOperation of instanceDecimalOperations) {
          const decimalResult = decimalOperation(testCase.left.decimal, testCase.right.decimal);
          assertEqual(decimalResult, numberResult);
        }
      }
    );
  });
}