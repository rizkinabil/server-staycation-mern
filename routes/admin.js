const router = require('express').Router();
const adminController = require('../controller/adminController');
const { uploadMultiple, uploadSingle } = require('../middleware/multer');
const auth = require('../middleware/auth');

router.get('/signin', adminController.viewSignIn);
router.post('/signin', adminController.actionSignIn);
router.use(auth);
router.get('/Dashboard', adminController.viewDashboard);
router.get('/logout', adminController.actionLogOut);
// endpoint category
router.get('/Category', adminController.viewCategory);
router.post('/Category', adminController.addCategory);
router.put('/Category', adminController.editCategory);
router.delete('/Category/:id', adminController.deleteCategory);
// endpoint bank
router.get('/Bank', adminController.viewBank);
router.post('/Bank', uploadSingle, adminController.addBank);
router.put('/Bank', uploadSingle, adminController.editBank);
router.delete('/Bank/:id', adminController.deleteBank);
// endpoint item
router.get('/Item', adminController.viewItem);
router.post('/Item', uploadMultiple, adminController.addItem);
router.get('/Item/show-image/:id', adminController.showImageItem);
router.get('/Item/:id', adminController.showEditItem);
router.put('/Item/:id', uploadMultiple, adminController.editItem);
router.delete('/Item/:id/delete', adminController.deleteItem);

// endpoint detail item
router.get('/Item/show-detail-item/:itemId', adminController.viewDetailItem);

// endpoint feature
router.post('/Item/add/feature', uploadSingle, adminController.addFeature);
router.put('/Item/update/feature', uploadSingle, adminController.editFeature);
router.delete('/Item/:itemId/feature/:id', adminController.deleteFeature);

// endpoint activity
router.post('/Item/add/activity', uploadSingle, adminController.addActivity);
router.put('/Item/update/activity', uploadSingle, adminController.editActivity);
router.delete('/Item/:itemId/activity/:id', adminController.deleteActivity);

router.get('/Booking', adminController.viewBooking);
router.get('/Booking/:id', adminController.showDetailBooking);
router.put('/Booking/:id/confirmation', adminController.actionConfirmation);
router.put('/Booking/:id/reject', adminController.actionReject);

module.exports = router;
