/**
 * @swagger
 * components:
 *   schemas:
 *     Example:
 *       type: object
 *       required:
 *         - id
 *         - value
 *       properties:
 *         id:
 *           type: string
 *           description: The id of example
 *         name:
 *           type: string
 *           description: Value of example
 *       example:
 *         id: "12345"
 *         name: "Mr. Robot"
 *
 */
export interface Example {
    id: number;
    value: string;
    createdAt: number;
    updatedAt: number;
}
