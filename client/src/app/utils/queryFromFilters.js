import moment from "moment";

export default function queryFromFilters(filters) {
  let query = {};
  filters.forEach(filter => {
    addConstraint(query, filter);
  });
  return query;
}

/* function addQueryConstraintFromObject(query, filter, constraintType) {
  let compareTo = JSON.parse(filter.get("compareTo"));
  for (let key of Object.keys(compareTo)) {
    query[constraintType](filter.get("field") + "." + key, compareTo[key]);
  }
} */

function addConstraint(query = {}, filter) {
  switch (filter.constraint) {
    case "exists":
      query[filter.field] = { $exists: true };
      break;
    case "dne":
      query[filter.field] = { $exists: false };
      break;
    case "eq":
      query[filter.field] = filter.compareTo;
      break;
    case "neq":
      query[filter.field] = { $ne: filter.compareTo };
      break;
    case "lt":
      query[filter.field] = { $lt: filter.compareTo };
      break;
    case "lte":
      query[filter.field] = { $lte: filter.compareTo };
      break;
    case "gt":
      query[filter.field] = { $gt: filter.compareTo };
      break;
    case "gte":
      query[filter.field] = { $gte: filter.compareTo };
      break;
    case "starts":
      query[filter.field] = { $regex: `^${filter.compareTo}` };
      break;
    case "ends":
      query[filter.field] = { $regex: `${filter.compareTo}$` };
      break;
    case "before":
      query[filter.field] = {
        $lte: moment(filter.compareTo)
          .startOf("day")
          .toDate()
      };
      break;
    case "after":
      query[filter.field] = {
        $gte: moment(filter.compareTo)
          .endOf("day")
          .toDate()
      };
      break;
    case "containsString":
    case "containsNumber":
      query[filter.field] = {
        $regex: `.*${filter.compareTo}.*`,
        $options: "i"
      };
      break;
    case "doesNotContainString":
    case "doesNotContainNumber":
      query[filter.field] = { $ne: filter.compareTo };
      break;
    case "containedIn":
      query[filter.field] = { $in: filter.compareTo };
      break;
    case "stringContainsString":
      query[filter.field] = {
        $regex: `.*${filter.compareTo}.*`,
        $options: "i"
      };
      break;
    case "keyExists":
      query[filter.field + "." + filter.compareTo] = { $exists: true };
      break;
    case "keyDne":
      query[filter.field + "." + filter.compareTo] = { $exists: false };
      break;
    case "keyEq":
      query[filter.field] = { $elemMatch: filter.compareTo };
      break;
    case "keyNeq":
      query[filter.field] = { $not: { $elemMatch: filter.compareTo } };
      break;
    case "keyGt":
      query[filter.field] = { $elemMatch: filter.compareTo };
      break;
    case "keyGte":
      query[filter.field] = { $elemMatch: filter.compareTo };
      break;
    case "keyLt":
      query[filter.field] = { $elemMatch: filter.compareTo };
      break;
    case "keyLte":
      query[filter.field] = { $elemMatch: filter.compareTo };
      break;
    default:
      break;
  }
  return query;
}
