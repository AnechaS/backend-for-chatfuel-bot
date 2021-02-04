import pagination from "./pagination";

it("should return", () => {
  expect(pagination(20, 1)).toEqual([1, 2, 3, 4, 5]);
  expect(pagination(20, 2)).toEqual([1, 2, 3, 4, 5]);
  expect(pagination(20, 3)).toEqual([1, 2, 3, 4, 5]);
  expect(pagination(20, 4)).toEqual([2, 3, 4, 5, 6]);
  expect(pagination(20, 5)).toEqual([3, 4, 5, 6, 7]);
  expect(pagination(20, 6)).toEqual([4, 5, 6, 7, 8]);
  expect(pagination(20, 7)).toEqual([5, 6, 7, 8, 9]);
  expect(pagination(20, 8)).toEqual([6, 7, 8, 9, 10]);
  expect(pagination(20, 9)).toEqual([7, 8, 9, 10, 11]);
  expect(pagination(20, 10)).toEqual([8, 9, 10, 11, 12]);
});

it("should return when last less than length page", () => {
  expect(pagination(1, 1)).toEqual([1]);
  expect(pagination(2, 1)).toEqual([1, 2]);
  expect(pagination(2, 2)).toEqual([1, 2]);
});
