import Decimal from "../../src";
import { assertEqual } from "./assert";
import { unaryTestCases } from "./test-cases";

type NumberOperation = (value: number) => number;
type InstanceDecimalOperation = (value: Decimal) => Decimal | number
type StaticDecimalOperation = (value: number) => Decimal | number

type UnaryOperationTestSuite = [
  string,
  NumberOperation,
  StaticDecimalOperation[],
  InstanceDecimalOperation[]
];

const unaryOperationTestSuites: UnaryOperationTestSuite[] = [
  [
    ".neg()",
    v => -v,
    [
      Decimal.neg,
      Decimal.negate,
      Decimal.negated
    ],
    [
      v => v.neg(),
      v => v.negate(),
      v => v.negated()
    ]
  ],
  [
    ".recip()",
    v => 1 / v,
    [
      Decimal.recip,
      Decimal.reciprocal,
      Decimal.reciprocate
    ],
    [
      v => v.recip(),
      v => v.reciprocal(),
      v => v.reciprocate()
    ]
  ],
  [
    ".abs()",
    Math.abs,
    [
      Decimal.abs
    ],
    [
      v => v.abs()
    ]
  ],
  [
    ".ceil()",
    Math.ceil,
    [
      Decimal.ceil
    ],
    [
      v => v.ceil()
    ]
  ],
  [
    ".floor()",
    Math.floor,
    [
      Decimal.floor
    ],
    [
      v => v.floor()
    ]
  ],
  [
    ".round()",
    Math.round,
    [
      Decimal.round
    ],
    [
      v => v.round()
    ]
  ],
  [
    ".trunc()",
    Math.trunc,
    [
      Decimal.trunc
    ],
    [
      v => v.trunc()
    ]
  ],
  [
    ".sinh()",
    Math.sinh,
    [],
    [
      v => v.sinh()
    ]
  ],
  [
    ".cosh()",
    Math.cosh,
    [],
    [
      v => v.cosh()
    ]
  ],
  [
    ".tanh()",
    Math.tanh,
    [],
    [
      v => v.tanh()
    ]
  ],
  [
    ".asinh()",
    Math.asinh,
    [],
    [
      v => v.asinh()
    ]
  ],
  [
    ".acosh()",
    Math.acosh,
    [],
    [
      v => v.acosh()
    ]
  ],
  [
    ".atanh()",
    Math.atanh,
    [],
    [
      v => v.atanh()
    ]
  ],
  [
    ".pow10()",
    v => Math.pow(10, v),
    [
      Decimal.pow10
    ],
    []
  ],
  [
    ".exp()",
    Math.exp,
    [
      Decimal.exp
    ],
    [
      v => v.exp()
    ]
  ],
  [
    ".ln()",
    Math.log,
    [
      Decimal.ln
    ],
    [
      v => v.ln()
    ]
  ],
  [
    ".log2()",
    Math.log2,
    [
      Decimal.log2
    ],
    [
      v => v.log2()
    ]
  ],
  [
    ".log10()",
    Math.log10,
    [
      Decimal.log10
    ],
    [
      v => v.log10()
    ]
  ],
  [
    ".sign()",
    Math.sign,
    [
      Decimal.sign,
      Decimal.sgn,
    ],
    [
      v => v.sign(),
      v => v.sgn(),
      v => v.s
    ]
  ],
  [
    ".sqr()",
    v => v * v,
    [
      Decimal.sqr
    ],
    [
      v => v.sqr()
    ]
  ],
  [
    ".sqrt()",
    Math.sqrt,
    [
      Decimal.sqrt
    ],
    [
      v => v.sqrt()
    ]
  ],
  [
    ".cube()",
    v => v * v * v,
    [
      Decimal.cube
    ],
    [
      v => v.cube()
    ]
  ],
  [
    ".cbrt()",
    Math.cbrt,
    [
      Decimal.cbrt
    ],
    [
      v => v.cbrt()
    ]
  ]
];

for (const testSuite of unaryOperationTestSuites) {
  describe(testSuite[0], () => {
    test.each(unaryTestCases)(
      "%s",
      (testCase) => {
        const numberOperation = testSuite[1];
        const numberResult = numberOperation(testCase.value.number);
        const staticDecimalOperations = testSuite[2];
        for (const decimalOperation of staticDecimalOperations) {
          const decimalResult = decimalOperation(testCase.value.number);
          assertEqual(decimalResult, numberResult);
        }
        const instanceDecimalOperations = testSuite[3];
        for (const decimalOperation of instanceDecimalOperations) {
          const decimalResult = decimalOperation(testCase.value.decimal);
          assertEqual(decimalResult, numberResult);
        }
      }
    );
  });
}