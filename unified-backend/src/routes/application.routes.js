const express = require('express');
const router = express.Router();
const {
    submitApplication,
    checkPrevious,
    getStatus,
    getApplications,
    updateApplication
} = require('../controllers/application.controller');

router.post('/', submitApplication);
router.get('/previous', checkPrevious);
router.get('/status', getStatus);
router.get('/', getApplications);
router.patch('/:id', updateApplication);

module.exports = router;
