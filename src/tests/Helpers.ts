import { ReportStatus } from "domain/entity/Report";

////////////////////////////////////////////////////////
// Helper for User & Report
////////////////////////////////////////////////////////

export const nowTimeStamp = (Date.now() / 1000) | 0;

////////////////////////////////////////////////////////
// Helpers for User
////////////////////////////////////////////////////////

export const users = [
    {
        id: "969f4040-a622-4ac6-bb38-4dea10747b87",
        email: "user1@mail.com",
        name: "User 1",
        age: 30,
        country: "AR",
        createdAt: 1649342221,
        updatedAt: 1649342221,
    },
    {
        id: "38f37442-efcf-44bd-b316-342fff06685f",
        email: "user2@mail.com",
        name: "User 2",
        age: 40,
        country: "UY",
        createdAt: 1649342221,
        updatedAt: 1649342221,
    },
    {
        id: "28345975-d0b6-4c1b-9a01-8fa9cc4def76",
        email: "user3@mail.com",
        name: "User 3",
        age: 50,
        country: "CL",
        createdAt: 1649342221,
        updatedAt: 1649342221,
    },
];

export const userForPost = {
    email: "user4@mail.com",
    name: "User 4",
    age: 60,
    country: "AU",
};

export const userMissingEmail = {
    name: "User 5",
    age: 60,
    country: "AU",
};

export const userMissingName = {
    email: "user6@mail.com",
    age: 60,
    country: "AU",
};

export const userMissingAge = {
    email: "user6@mail.com",
    name: "User 6",
    country: "AU",
};

export const userMissingCountry = {
    email: "user7@mail.com",
    name: "User 7",
    age: 70,
};

export const userForPut = {
    name: "Modified Name",
    age: 90,
    country: "AR",
};

////////////////////////////////////////////////////////
// Helpers for Report
////////////////////////////////////////////////////////

export const reports = [
    {
        id: "2127124b-08f8-4655-bb69-988f5d0771fa",
        userId: "25c7e026-00f4-4127-a1a6-2365318ec253",
        title: "Report Test Number 1",
        content: "Report Test Number 1",
        status: ReportStatus.Published,
        publishAt: 1653320050,
        createdAt: 1653320031,
        updatedAt: 1653331332,
    },
    {
        id: "e02e6531-8036-4bef-ae46-bb7bd5bd6d12",
        userId: "e8381458-ba5f-452a-816a-46e6d45b1b81",
        title: "Report Test Number 2",
        content: "Report Test Number 2",
        status: ReportStatus.Draft,
        publishAt: 1653325085,
        createdAt: 1653325075,
        updatedAt: 1653331332,
    },
];

export const reportForPostPublished = {
    userId: "969f4040-a622-4ac6-bb38-4dea10747b87",
    title: "Published Test",
    content: "Published Test",
    publishAt: 1653320050,
};

export const reportForPostDraft = {
    userId: "969f4040-a622-4ac6-bb38-4dea10747b87",
    title: "Draft Test",
    content: "Draft Test",
    publishAt: 9999999999,
};

export const reportMissingUserId = {
    title: "Report Test Number 4",
    content: "Report Test Number 4",
    publishAt: 1653320050,
};

export const reportMissingTitle = {
    userId: "25c7e026-00f4-4127-a1a6-2365318ec253",
    content: "Report Test Number 5",
    publishAt: 1653320050,
};

export const reportMissingContent = {
    userId: "25c7e026-00f4-4127-a1a6-2365318ec253",
    title: "Report Test Number 6",
    publishAt: 1653320050,
};

export const reportMissingPublishAt = {
    userId: "25c7e026-00f4-4127-a1a6-2365318ec253",
    title: "Report Test Number 8",
    content: "Report Test Number 8",
};

export const reportForPutDraft = {
    userId: "969f4040-a622-4ac6-bb38-4dea10747b87",
    title: "MODIFIED Name",
    content: "MODIFIED Content",
    publishAt: 9999999999,
};

export const reportForPutPublished = {
    userId: "969f4040-a622-4ac6-bb38-4dea10747b87",
    title: "MODIFIED Name",
    content: "MODIFIED Content",
    publishAt: 1653320050,
};

export const reportForCreateServicePublished = {
    userId: "969f4040-a622-4ac6-bb38-4dea10747b87",
    title: "Published Test",
    content: "Published Test",
    publishAt: 1653320050,
    status: ReportStatus.Published,
};

export const reportForCreateServiceDraft = {
    userId: "969f4040-a622-4ac6-bb38-4dea10747b87",
    title: "Published Test",
    content: "Published Test",
    publishAt: 1653320050,
    status: ReportStatus.Draft,
};

export const reportForUpdateServicePublished = {
    userId: "25c7e026-00f4-4127-a1a6-2365318ec253",
    title: "Published Test",
    content: "Published Test",
    publishAt: 1653320050,
    status: ReportStatus.Published,
};

export const reportForUpdateServiceDraft = {
    userId: "25c7e026-00f4-4127-a1a6-2365318ec253",
    title: "Published Test",
    content: "Published Test",
    publishAt: 1653320050,
    status: ReportStatus.Draft,
};
