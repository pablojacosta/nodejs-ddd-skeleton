/**
 * @swagger
 * components:
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - content
 *         - status
 *         - publishAt
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the Report
 *         userId:
 *           type: string
 *           description: The id of the User that created the Report
 *         title:
 *           type: string
 *           description: The title of the Report
 *         content:
 *           type: string
 *           description: The content of the Report
 *         status:
 *           type: ReportStatus
 *           description: The status of the Report (draft or published)
 *         publishAt:
 *           type: number
 *           description: The Report's publish date (Unix Timestamp)
 *         createdAt:
 *           type: number
 *           description: The Report's creation date (Unix Timestamp)
 *         updatedAt:
 *           type: number
 *           description: The Report's update date (Unix Timestamp)
 *       example:
 *         id: "12345"
 *         userId: "12345"
 *         title: "Example title"
 *         content: "Example content"
 *         status: "draft"
 *         publishAt: 1653065246
 *         createdAt: 1653065146
 *         updatedAt: 1653065156
 */
export interface Report {
    id: string;
    userId: string;
    title: string;
    content: string;
    status: ReportStatus;
    publishAt: number;
    createdAt: number;
    updatedAt: number;
}

export enum ReportStatus {
    Draft = "draft",
    Published = "published"
}
