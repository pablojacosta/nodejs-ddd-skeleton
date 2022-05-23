/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - age
 *         - country
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the User
 *         email:
 *           type: string
 *           description: The email of the User
 *         name:
 *           type: string
 *           description: The name of the User
 *         age:
 *           type: number
 *           description: The age of the User
 *         country:
 *           type: string
 *           description: The country of the User
 *         createdAt:
 *           type: number
 *           description: The User's creation date (Unix Timestamp)
 *         updatedAt:
 *           type: number
 *           description: The User's update date (Unix Timestamp)
 *       example:
 *         id: "12345"
 *         email: "user@example.com"
 *         name: "John Doe"
 *         country: "AR"
 *         createdAt: 1653065146
 *         updatedAt: 1653065156
 */
export interface User {
    id: string;
    email: string;
    name: string;
    age: number;
    country: string;
    createdAt: number;
    updatedAt: number;
}
