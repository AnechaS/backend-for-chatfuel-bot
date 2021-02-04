import moment from "moment";

export const Constraints = {
  exists: {
    name: "exists",
    field: null,
    comparable: false
  },
  dne: {
    name: "does not exist",
    field: null,
    comparable: false
  },
  eq: {
    name: "equals",
    comparable: true
  },
  neq: {
    name: "does not equal",
    comparable: true
  },
  lt: {
    name: "less than",
    field: "Number",
    composable: true,
    comparable: true
  },
  lte: {
    name: "less than or equal",
    field: "Number",
    composable: true,
    comparable: true
  },
  gt: {
    name: "greater than",
    field: "Number",
    composable: true,
    comparable: true
  },
  gte: {
    name: "greater than or equal",
    field: "Number",
    composable: true,
    comparable: true
  },
  starts: {
    name: "starts with",
    comparable: true
  },
  ends: {
    name: "ends with",
    comparable: true
  },
  stringContainsString: {
    name: "string contains string",
    field: "String",
    composable: true,
    comparable: true
  },
  before: {
    name: "is before",
    field: "Date",
    composable: true,
    comparable: true
  },
  after: {
    name: "is after",
    field: "Date",
    composable: true,
    comparable: true
  },
  containsString: {
    name: "contains string",
    field: "String",
    composable: true,
    comparable: true
  },
  doesNotContainString: {
    name: "without string",
    field: "String",
    composable: true,
    comparable: true
  },
  containsNumber: {
    name: "contains number",
    field: "Number",
    composable: true,
    comparable: true
  },
  doesNotContainNumber: {
    name: "without number",
    field: "Number",
    composable: true,
    comparable: true
  },
  containsAny: {
    name: "contains",
    field: "Array",
    comparable: true
  },
  doesNotContainAny: {
    name: "does not contain",
    field: "Array",
    comparable: true
  },
  keyExists: {
    name: "key exists",
    field: "Object",
    composable: true,
    comparable: false
  },
  keyDne: {
    name: "key does not exist",
    field: "Object",
    composable: true,
    comparable: false
  },
  keyEq: {
    name: "key equals",
    field: "Object",
    composable: true,
    comparable: true
  },
  keyNeq: {
    name: "key does not equal",
    field: "Object",
    composable: true,
    comparable: true
  },
  keyGt: {
    name: "key greater than",
    field: "Object",
    composable: true,
    comparable: true
  },
  keyGte: {
    name: "key greater than/equal",
    field: "Object",
    composable: true,
    comparable: true
  },
  keyLt: {
    name: "key less than",
    field: "Object",
    composable: true,
    comparable: true
  },
  keyLte: {
    name: "key less than/equal",
    field: "Object",
    composable: true,
    comparable: true
  },
  unique: {
    name: "unique",
    field: null,
    comparable: false
  }
};

export const FieldConstraints = {
  ObjectId: ["exists", "dne", "eq", "neq", "unique"],
  Populate: ["exists", "dne", "eq", "neq", "unique"],
  Boolean: ["exists", "dne", "eq", "unique"],
  Number: ["exists", "dne", "eq", "neq", "lt", "lte", "gt", "gte", "unique"],
  String: [
    "exists",
    "dne",
    "eq",
    "neq",
    "starts",
    "ends",
    "stringContainsString",
    "unique"
  ],
  Date: ["exists", "dne", "before", "after", "unique"],
  Object: [
    "exists",
    "dne",
    "keyExists",
    "keyDne",
    "keyEq",
    "keyNeq",
    "keyGt",
    "keyGte",
    "keyLt",
    "keyLte",
    "unique"
  ],
  Array: [
    "exists",
    "dne",
    "containsString",
    "doesNotContainString",
    "containsNumber",
    "doesNotContainNumber",
    "containsAny",
    "doesNotContainAny"
  ]
};

export const DefaultComparisons = {
  ObjectId: "",
  Populate: "",
  Boolean: false,
  Number: "",
  String: "",
  Object: "",
  Date: moment().format("YYYY-MM-DD")
};

export const BLACKLISTED_FILTERS = [
  "containsAny",
  "doesNotContainAny",
  "keyGt",
  "keyGte",
  "keyLt",
  "keyLte",
  "unique"
];

export function availableFilters(
  schema,
  currentFilters,
  blacklist = BLACKLISTED_FILTERS
) {
  // console.log(blacklist);
  let disabled = {};
  if (currentFilters) {
    currentFilters.forEach(filter => {
      if (!Constraints[filter.constraint].composable) {
        disabled[filter.field] = true;
      }
    });
  }

  let available = {};
  for (let col in schema) {
    if (disabled[col]) {
      continue;
    }
    let type = schema[col].type;
    if (!FieldConstraints[type]) {
      continue;
    }
    available[col] = FieldConstraints[type].filter(
      c => blacklist.indexOf(c) < 0
    );
  }
  return available;
}
