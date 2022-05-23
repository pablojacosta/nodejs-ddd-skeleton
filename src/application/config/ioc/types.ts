export const TYPES = {
    // infrastructure
    ConnectionManager: Symbol.for("ConnectionManager"),
    IdGenerator: Symbol.for("IdGenerator"),

    // repositories
    UserRepository: Symbol.for("UserRepository"),
    ReportRepository: Symbol.for("ReportRepository"),

    // services
    CreateUserService: Symbol.for("CreateUserService"),
    UpdateUserService: Symbol.for("UpdateUserService"),
    RemoveUserService: Symbol.for("RemoveUserService"),
    CreateReportService: Symbol.for("CreateReportService"),
    UpdateReportService: Symbol.for("UpdateReportService"),
    RemoveReportService: Symbol.for("RemoveReportService"),
    IdGeneratorSrvice: Symbol.for("IdGeneratorService"),
    PublishReportsService: Symbol.for("PublishReportsService"),

    // middleware
    AuthorizationMiddleware: Symbol.for("AuthorizationMiddleware"),

    Logger: Symbol.for("Logger"),
};
