const express = require('express');

const router = express.Router();

/**
 * List
 * @api {get} /sessions
 */
/* router.get('/', async (req, res, next) => {
  
}); */

/**
 * Create a new
 * @api {post} /sessions
 */
/* router.post('/', async (req, res, next) => {
  
}); */

/**
 * TODO: Clean Sessions of the User.
 * @api {post} /sessions
 */
router.post('/me/clean', async (req, res, next) => {});

/**
 * Get
 * @api {get} /sessions/:id
 */
/* router.get('/:id', async (req, res, next) => {
  
}); */

/**
 * Get Session info with the User
 * @api {get} /sessions/me
 */
/* router.get('/me', async (req, res, next) => {
  
});
 */

/**
 * Update
 * @api {put} /sessions/:id
 */
/* router.put('/:id', async (req, res, next) => {

}); */

/**
 * Delete a
 * @api {delete} /sessions/:id
 */
/* router.delete('/:id', async (req, res, next) => {
  
}); */

module.exports = router;
