import queryFromFilters from "./queryFromFilters";

describe("Util Query from filters", () => {
  test("should constrain is exists", () => {
    expect(queryFromFilters([{ field: "name", constraint: "exists" }])).toEqual(
      {
        name: { $exists: true }
      }
    );
  });

  test("should constrain is does not exist", () => {
    expect(queryFromFilters([{ field: "name", constraint: "dne" }])).toEqual({
      name: { $exists: false }
    });
  });

  test("should constrain is equals", () => {
    expect(
      queryFromFilters([{ field: "name", constraint: "eq", compareTo: "goku" }])
    ).toEqual({
      name: "goku"
    });
  });

  test("should constrain is not equals", () => {
    expect(
      queryFromFilters([
        { field: "name", constraint: "neq", compareTo: "goku" }
      ])
    ).toEqual({
      name: { $ne: "goku" }
    });
  });

  test("should constrain is less than", () => {
    expect(
      queryFromFilters([{ field: "money", constraint: "lt", compareTo: "100" }])
    ).toEqual({
      money: { $lt: "100" }
    });
  });

  test("should constrain is less than", () => {
    expect(
      queryFromFilters([
        { field: "money", constraint: "lte", compareTo: "100" }
      ])
    ).toEqual({
      money: { $lte: "100" }
    });
  });

  test("should constrain is greater than", () => {
    expect(
      queryFromFilters([{ field: "money", constraint: "gt", compareTo: "100" }])
    ).toEqual({
      money: { $gt: "100" }
    });
  });

  test("should constrain is greater than or equal", () => {
    expect(
      queryFromFilters([
        { field: "money", constraint: "gte", compareTo: "100" }
      ])
    ).toEqual({
      money: { $gte: "100" }
    });
  });

  test("should constrain is starts with", () => {
    expect(
      queryFromFilters([
        { field: "name", constraint: "starts", compareTo: "goku" }
      ])
    ).toEqual({
      name: { $regex: "^goku" }
    });
  });

  test("should constrain is end with", () => {
    expect(
      queryFromFilters([
        { field: "name", constraint: "end", compareTo: "goku" }
      ])
    ).toEqual({
      name: { $regex: "goku$" }
    });
  });
});
