import queryFromFilters from "./queryFromFilters";

describe("Util queryFromFilters", () => {
  test("constrain is exists", () => {
    expect(queryFromFilters([{ field: "name", constraint: "exists" }])).toEqual(
      {
        name: { $exists: true },
      }
    );
  });

  test("constrain is does not exist", () => {
    expect(queryFromFilters([{ field: "name", constraint: "dne" }])).toEqual({
      name: { $exists: false },
    });
  });

  test("constrain is equals", () => {
    expect(
      queryFromFilters([{ field: "name", constraint: "eq", compareTo: "goku" }])
    ).toEqual({
      name: "goku",
    });
  });

  test("constrain is not equals", () => {
    expect(
      queryFromFilters([
        { field: "name", constraint: "neq", compareTo: "goku" },
      ])
    ).toEqual({
      name: { $ne: "goku" },
    });
  });

  test("constrain is less than", () => {
    expect(
      queryFromFilters([{ field: "money", constraint: "lt", compareTo: "100" }])
    ).toEqual({
      money: { $lt: "100" },
    });
  });

  test("constrain is less than", () => {
    expect(
      queryFromFilters([
        { field: "money", constraint: "lte", compareTo: "100" },
      ])
    ).toEqual({
      money: { $lte: "100" },
    });
  });

  test("constrain is greater than", () => {
    expect(
      queryFromFilters([{ field: "money", constraint: "gt", compareTo: "100" }])
    ).toEqual({
      money: { $gt: "100" },
    });
  });

  test("constrain is greater than or equal", () => {
    expect(
      queryFromFilters([
        { field: "money", constraint: "gte", compareTo: "100" },
      ])
    ).toEqual({
      money: { $gte: "100" },
    });
  });

  test("constrain is starts with", () => {
    expect(
      queryFromFilters([
        { field: "name", constraint: "starts", compareTo: "goku" },
      ])
    ).toEqual({
      name: { $regex: "^goku" },
    });
  });

  test("constrain is ends with", () => {
    expect(
      queryFromFilters([
        { field: "name", constraint: "ends", compareTo: "goku" },
      ])
    ).toEqual({
      name: { $regex: "goku$" },
    });
  });

  test('constraint are "before" and "after"', () => {
    expect(
      queryFromFilters([
        { field: "date", constraint: "after", compareTo: "2020-01-01" },
        { field: "date", constraint: "before", compareTo: "2020-01-25" },
      ])
    ).toEqual({
      date: { 
        $gte: "2020-01-01T00:00:00.000Z",
        $lte: "2020-01-25T23:59:59.999Z",
      },
    });
  });
});
