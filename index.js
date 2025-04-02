import express from 'express';
import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import UserRoutes from "./Kambaz/Users/routes.js";
import cors from 'cors';
import session from 'express-session';
import 'dotenv/config';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || 'http://localhost:5173'
}));

const sessionOptions = {
    secret: process.env.SESSIOn_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV !== 'development') {
    sessionOptions.proxy = true
    sessionOptions.cookie = {
        secure: true,
        sameSite: 'none',
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions))
app.use(express.json());
Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);
app.listen(process.env.PORT || 4000)