/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// This provider guarantees that the same instance will be used in each request,
// instead of creating a new instance of the class per request
import { fluentProvide } from "inversify-binding-decorators";

export const provideSingleton = function (identifier: any): any {
    return fluentProvide(identifier).inSingletonScope().done();
};
