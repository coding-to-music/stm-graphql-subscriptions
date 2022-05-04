"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("not authenticated");
    }
    return next();
};
//# sourceMappingURL=isAuth.js.map