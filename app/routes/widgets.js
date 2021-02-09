const express = require('express');
const { query } = require('express-validator');
const moment = require('moment');
const authorize = require('../middlewares/auth');
const validator = require('../middlewares/validator');

const People = require('../models/people');
const Schedule = require('../models/schedule');

const router = express.Router();

/**
 * Widget Scorecard peoples
 * @api {get} /widgets/1
 */
router.get(
  '/1',
  authorize(),
  validator([
    query('q')
      .if(value => value)
      .isJSON()
  ]),
  async (req, res, next) => {
    try {
      const { q } = req.query;
      const _query = q ? JSON.parse(q) : {};
      const count = await People.countDocuments(_query);
      return res.json({ value: count });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Widget Scorecard peoples with id
 * @api {get} /widgets/2
 */
router.get(
  '/2',
  authorize(),
  validator([
    query('q')
      .if(value => value)
      .isJSON()
  ]),
  async (req, res, next) => {
    try {
      const { q } = req.query;
      const _query = q ? JSON.parse(q) : {};
      const count1 = await People.countDocuments({
        dentalId: {
          $regex: /^\d{6}$/
        },
        ..._query
      });
      const count2 = await People.countDocuments(_query);
      const percent = Number(((count1 / count2) * 100).toFixed(2));
      return res.json({ value: count1, percent });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Widget Scorecard peoples without id
 * @api {get} /widgets/3
 */
router.get(
  '/3',
  authorize(),
  validator([
    query('q')
      .if(value => value)
      .isJSON()
  ]),
  async (req, res, next) => {
    try {
      const { q } = req.query;
      const _query = q ? JSON.parse(q) : {};
      const count1 = await People.countDocuments({
        dentalId: {
          $not: /^\d{6}$/
        },
        ..._query
      });
      const count2 = await People.countDocuments(_query);
      const percent = Number(((count1 / count2) * 100).toFixed(2));
      return res.json({ value: count1, percent });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Widget people created
 * @api {get} /widgets/5
 */
router.get(
  '/4',
  authorize(),
  validator([
    query('period')
      .if(value => value)
      .isIn(['day', 'month', 'year']),
    query('startDate')
      .if(value => value)
      .isAfter('2019-07-01'),
    query('endDate')
      .if(value => value)
      .isBefore(moment().format('YYYY-MM-DD'))
  ]),
  async (req, res, next) => {
    try {
      const { period, startDate, endDate } = req.query;
      const _period = period || 'month';
      let _endDate = endDate ? moment(endDate) : moment();
      _endDate = _endDate.endOf('day');
      let _startDate;
      if (!startDate) {
        if (_period === 'day') {
          _startDate = _endDate
            .clone()
            .startOf('day')
            .subtract(30, 'day');
        } else if (_period === 'month') {
          _startDate = _endDate
            .clone()
            .startOf('month')
            .subtract(10, 'month');
        } else {
          _startDate = moment('2019-07-01');
        }
      } else {
        _startDate = moment(startDate);
      }

      const idGroup = {
        day: {
          $dayOfMonth: { $add: ['$createdAt', 7 * 60 * 60 * 1000] }
        },
        month: {
          $month: { $add: ['$createdAt', 7 * 60 * 60 * 1000] }
        },
        year: {
          $year: { $add: ['$createdAt', 7 * 60 * 60 * 1000] }
        }
      };

      if (_period === 'month' || _period === 'year') {
        delete idGroup.day;
      }

      if (_period === 'year') {
        delete idGroup.month;
      }

      const pipeline = [
        {
          $match: {
            createdAt: {
              $gte: _startDate.toDate(),
              $lte: _endDate.toDate()
            }
          }
        },
        {
          $group: {
            _id: idGroup,
            count: { $sum: 1 }
          }
        }
      ];
      const data = await People.aggregate(pipeline);

      const dataChart = [];
      while (_endDate.isSameOrAfter(_startDate)) {
        const object = data.find(({ _id }) => {
          const d = moment();
          if (_id.day) {
            d.date(_id.day);
          }
          if (_id.month) {
            d.month(_id.month - 1);
          }
          if (_id.year) {
            d.year(_id.year);
          }
          return d.isSame(_startDate, _period);
        });

        if (_startDate.isSame(_endDate, _period)) {
          _startDate = _endDate.clone();
        }

        dataChart.push({
          t: _startDate.valueOf(),
          y: object ? object.count : 0
        });

        if (_startDate.isSame(_endDate.clone().subtract(1, _period), _period)) {
          _startDate = _endDate.clone();
          continue;
        }

        _startDate.add(1, _period).endOf(_period);
      }

      return res.json({ data: dataChart });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Widget province of peoples
 * @api {get} /widgets/5
 */
router.get('/5', authorize(), async (req, res, next) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: { $ifNull: ['$province', 'อื่นๆ'] },
          count: { $sum: 1 }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            province: '$_id',
            count: '$count'
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ];
    const data = await People.aggregate(pipeline);
    res.json({ data });
  } catch (error) {
    return next(error);
  }
});

/**
 * Widget province of peoples At befual date 2020-04-04
 * @api {get} /widgets/6
 */
router.get('/6', authorize(), async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          createdAt: {
            $lte: moment('2020-04-04')
              .endOf('day')
              .toDate()
          }
        }
      },
      {
        $group: {
          _id: {
            province: { $ifNull: ['$province', 'อื่นๆ'] }
          },
          count: { $sum: 1 },
          items: { $push: '$$ROOT' }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                province: '$_id.province',
                count: '$count',
                countDId: {
                  $size: {
                    $filter: {
                      input: '$items',
                      as: 'item',
                      cond: {
                        $eq: [
                          { $strLenCP: { $ifNull: ['$$item.dentalId', ''] } },
                          6
                        ]
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      },
      {
        $addFields: {
          countG: {
            $subtract: ['$count', '$countDId']
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ];

    const data = await People.aggregate(pipeline);
    res.json({ data });
  } catch (error) {
    return next(error);
  }
});

/**
 * Widget district of peoples
 * @api {get} /widgets/7
 */
router.get('/7', authorize(), async (req, res, next) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: {
            province: { $ifNull: ['$province', 'อื่นๆ'] },
            district: {
              $cond: {
                if: {
                  $gte: [{ $ifNull: ['$province', 'อื่นๆ'] }, 'อื่นๆ']
                },
                then: 'อำเภออื่นๆ',
                else: { $ifNull: ['$district', 'อำเภออื่นๆ'] }
              }
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                province: '$_id.province',
                district: '$_id.district',
                count: '$count'
              }
            ]
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ];
    const data = await People.aggregate(pipeline);
    return res.json({ data });
  } catch (error) {
    return next(error);
  }
});

/**
 * Widget district of peoples At befual date 2020-04-04
 * @api {get} /widgets/8
 */
router.get('/8', authorize(), async (req, res, next) => {
  try {
    const pipeline = [
      {
        $match: {
          createdAt: {
            $lte: moment('2020-04-04')
              .endOf('day')
              .toDate()
          }
        }
      },
      {
        $group: {
          _id: {
            province: { $ifNull: ['$province', 'อื่นๆ'] },
            district: {
              $cond: {
                if: {
                  $gte: [{ $ifNull: ['$province', 'อื่นๆ'] }, 'อื่นๆ']
                },
                then: 'อำเภออื่นๆ',
                else: { $ifNull: ['$district', 'อำเภออื่นๆ'] }
              }
            }
          },
          count: { $sum: 1 },
          items: { $push: '$$ROOT' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                province: '$_id.province',
                district: '$_id.district',
                count: '$count',
                countDId: {
                  $size: {
                    $filter: {
                      input: '$items',
                      as: 'item',
                      cond: {
                        $eq: [
                          { $strLenCP: { $ifNull: ['$$item.dentalId', ''] } },
                          6
                        ]
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      },
      {
        $addFields: {
          countG: {
            $subtract: ['$count', '$countDId']
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ];
    const data = await People.aggregate(pipeline);
    return res.json({ data });
  } catch (error) {
    return next(error);
  }
});

/**
 * Widget
 * @api {get} /widgets/9
 */
router.get(
  '/9',
  authorize(),
  validator([
    query('q')
      .if(value => value)
      .isJSON()
  ]),
  async (req, res, next) => {
    try {
      const { q } = req.query;
      const _query = q ? JSON.parse(q) : {};

      const pipeline = [
        {
          $addFields: {
            createdAt: {
              $dateToString: {
                format: '%Y-%m-%dT%H:%M:%S.%LZ',
                date: '$createdAt'
              }
            }
          }
        },
        {
          $match: _query
        },
        {
          $lookup: {
            from: 'progresses',
            localField: '_id',
            foreignField: 'people',
            as: 'progress'
          }
        },
        {
          $unwind: '$progress'
        },
        {
          $match: {
            'progress.status': 2
          }
        },
        {
          $group: {
            _id: '$progress.schedule',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ];

      const data = await People.aggregate(pipeline);
      const countPeople = await People.countDocuments(_query);
      const schedules = await Schedule.find().sort({ _id: 1 });
      const dataChart = schedules.map(o => {
        let count = 0;

        const object = data.find(
          subO => subO._id.toString() === o._id.toString()
        );
        if (object) {
          count = object.count;
        }

        const result = {
          x: o.name,
          y: Number(((count / countPeople) * 100).toFixed(2)),
          count
        };
        return result;
      });

      return res.json({ data: dataChart });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Widget
 * @api {get} /widgets/10
 */
router.get(
  '/10',
  validator([
    query('q')
      .if(value => value)
      .isJSON(),
    query('limit').toInt()
  ]),
  async (req, res, next) => {
    try {
      const { q, limit } = req.query;
      const _query = q ? JSON.parse(q) : {};
      const _limit = limit || 5;
      const _sort = { createdAt: -1 };
      const data = await People.find(_query)
        .sort(_sort)
        .limit(_limit);
      return res.json({ data });
    } catch (error) {
      return next(error);
    }
  }
);

// router.get('/5', authorize(), async (req, res, next) => {
//   try {
//     const data = await People.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $lte: DATE_END_ID1.toDate()
//           }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             month: {
//               $month: { $add: ['$createdAt', 7 * 60 * 60 * 1000] }
//             },
//             year: {
//               $year: { $add: ['$createdAt', 7 * 60 * 60 * 1000] }
//             }
//           },
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const dateStart = DATE_START.clone();
//     const dataChart = [];
//     while (DATE_END_ID1.isSameOrAfter(dateStart)) {
//       const object = data.find(o => {
//         const d = moment();
//         if (Object.hasOwnProperty.call(o._id, 'month')) {
//           d.month(o._id.month - 1);
//         }
//         if (Object.hasOwnProperty.call(o._id, 'year')) {
//           d.year(o._id.year);
//         }
//         return d.isSame(dateStart.format('YYYY-MM-DD'), 'month');
//       });

//       dataChart.push({
//         t: dateStart.valueOf(),
//         y: object ? object.count : 0
//       });
//       dateStart.add(1, 'month');
//     }

//     return res.json({ data: dataChart });
//   } catch (error) {
//     return next(error);
//   }
// });

module.exports = router;
