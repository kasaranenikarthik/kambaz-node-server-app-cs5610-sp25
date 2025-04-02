import * as enrollmentDao from './dao.js';

export default function EnrollmentRoutes(app) {
    
    app.delete('/api/enrollments/:userId/:courseId', async (req, res) => {
        const { userId, courseId } = req.params;
        const status = await enrollmentDao.unenrollUserFromCourse(userId, courseId );
        res.send(status);
    });

    app.get('/api/enrollments/', async (req, res) => {
        const enrollments = await enrollmentDao.getEnrollments();
        res.json(enrollments);
    });

    app.post('/api/enrollments/', async (req, res) => {
        const { userId, courseId } = req.body;
        const status = await enrollmentDao.enrollUserInCourse(userId, courseId);
        const enrollment = await enrollmentDao.getEnrollments();
        res.json(enrollment);
    });
}