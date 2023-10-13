"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.WorkStatus = exports.BountyStatus = exports.networks = exports.Err = exports.Ok = exports.Address = void 0;
const soroban_client_1 = require("soroban-client");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return soroban_client_1.Address; } });
const buffer_1 = require("buffer");
const invoke_js_1 = require("./invoke.js");
__exportStar(require("./invoke.js"), exports);
__exportStar(require("./method-options.js"), exports);
;
;
class Ok {
    value;
    constructor(value) {
        this.value = value;
    }
    unwrapErr() {
        throw new Error('No error');
    }
    unwrap() {
        return this.value;
    }
    isOk() {
        return true;
    }
    isErr() {
        return !this.isOk();
    }
}
exports.Ok = Ok;
class Err {
    error;
    constructor(error) {
        this.error = error;
    }
    unwrapErr() {
        return this.error;
    }
    unwrap() {
        throw new Error(this.error.message);
    }
    isOk() {
        return false;
    }
    isErr() {
        return !this.isOk();
    }
}
exports.Err = Err;
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || buffer_1.Buffer;
}
const regex = /Error\(Contract, #(\d+)\)/;
function parseError(message) {
    const match = message.match(regex);
    if (!match) {
        return undefined;
    }
    if (Errors === undefined) {
        return undefined;
    }
    let i = parseInt(match[1], 10);
    let err = Errors[i];
    if (err) {
        return new Err(err);
    }
    return undefined;
}
exports.networks = {
    futurenet: {
        networkPassphrase: "Test SDF Future Network ; October 2022",
        contractId: "CBUNZUDUGJ3P3SRWDTANFYWSETUX2R5XHARILC7RJFCQKN3UH5376JIY",
    }
};
const Errors = {
    0: { message: "" },
    100: { message: "" },
    110: { message: "" },
    111: { message: "" },
    112: { message: "" },
    115: { message: "" },
    120: { message: "" },
    121: { message: "" },
    122: { message: "" },
    123: { message: "" },
    130: { message: "" },
    131: { message: "" },
    132: { message: "" },
    133: { message: "" },
    134: { message: "" },
    135: { message: "" },
    136: { message: "" },
    137: { message: "" },
    138: { message: "" },
    139: { message: "" },
    140: { message: "" },
    141: { message: "" },
    142: { message: "" },
    143: { message: "" }
};
var BountyStatus;
(function (BountyStatus) {
    BountyStatus[BountyStatus["INIT"] = 0] = "INIT";
    BountyStatus[BountyStatus["ACTIVE"] = 1] = "ACTIVE";
    BountyStatus[BountyStatus["COMPLETE"] = 2] = "COMPLETE";
    BountyStatus[BountyStatus["CANCELLED"] = 3] = "CANCELLED";
    BountyStatus[BountyStatus["CLOSED"] = 4] = "CLOSED";
})(BountyStatus || (exports.BountyStatus = BountyStatus = {}));
var WorkStatus;
(function (WorkStatus) {
    WorkStatus[WorkStatus["INIT"] = 0] = "INIT";
    WorkStatus[WorkStatus["APPLIED"] = 1] = "APPLIED";
    WorkStatus[WorkStatus["SUBMITTED"] = 2] = "SUBMITTED";
    WorkStatus[WorkStatus["APPROVED"] = 3] = "APPROVED";
    WorkStatus[WorkStatus["REJECTED"] = 4] = "REJECTED";
})(WorkStatus || (exports.WorkStatus = WorkStatus = {}));
class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new soroban_client_1.ContractSpec([
            "AAAABAAAAAAAAAAAAAAACUVycm9yQ29kZQAAAAAAABgAAAAAAAAAB1N1Y2Nlc3MAAAAAAAAAAAAAAAAOR2V0RXJyb3JGYWlsZWQAAAAAAGQAAAAAAAAAC0FkbWluTm90U2V0AAAAAG4AAAAAAAAADkluY29ycmVjdEFkbWluAAAAAABvAAAAAAAAAAxJbnZhbGlkQWRtaW4AAABwAAAAAAAAAAlGZWVOb3RTZXQAAAAAAABzAAAAAAAAABlBbHJlYWR5QXBwbGllZFBhcnRpY2lwYW50AAAAAAAAeAAAAAAAAAAMV29ya05vdEZvdW5kAAAAeQAAAAAAAAAQTm90QXBwbGllZEJvdW50eQAAAHoAAAAAAAAADk5vdEFwcGxpZWRXb3JrAAAAAAB7AAAAAAAAAA5Cb3VudHlOb3RGb3VuZAAAAAAAggAAAAAAAAAUUGFydGljaXBhbnRJc0NyZWF0b3IAAACDAAAAAAAAABRJbmFjdGl2ZUJvdW50eVN0YXR1cwAAAIQAAAAAAAAACUVtcHR5TmFtZQAAAAAAAIUAAAAAAAAAClplcm9SZXdhcmQAAAAAAIYAAAAAAAAADFplcm9EZWFkbGluZQAAAIcAAAAAAAAAFEluc3VmZkNyZWF0b3JCYWxhbmNlAAAAiAAAAAAAAAAWSW5zdWZmQ3JlYXRvckFsbG93YW5jZQAAAAAAiQAAAAAAAAAOSW52YWxpZENyZWF0b3IAAAAAAIoAAAAAAAAAEkludmFsaWRQYXJ0aWNpcGFudAAAAAAAiwAAAAAAAAAPSW52YWxpZEJvdW50eUlEAAAAAIwAAAAAAAAAD0ludmFsaWRXb3JrUmVwbwAAAACNAAAAAAAAAAlOb1RpbWVvdXQAAAAAAACOAAAAAAAAABVJbnN1ZmZDb250cmFjdEJhbGFuY2UAAAAAAACP",
            "AAAAAQAAAAAAAAAAAAAAB0ZlZUluZm8AAAAAAgAAAAAAAAAIZmVlX3JhdGUAAAAEAAAAAAAAAApmZWVfd2FsbGV0AAAAAAAT",
            "AAAAAwAAAAAAAAAAAAAADEJvdW50eVN0YXR1cwAAAAUAAAAAAAAABElOSVQAAAAAAAAAAAAAAAZBQ1RJVkUAAAAAAAEAAAAAAAAACENPTVBMRVRFAAAAAgAAAAAAAAAJQ0FOQ0VMTEVEAAAAAAAAAwAAAAAAAAAGQ0xPU0VEAAAAAAAE",
            "AAAAAwAAAAAAAAAAAAAACldvcmtTdGF0dXMAAAAAAAUAAAAAAAAABElOSVQAAAAAAAAAAAAAAAdBUFBMSUVEAAAAAAEAAAAAAAAACVNVQk1JVFRFRAAAAAAAAAIAAAAAAAAACEFQUFJPVkVEAAAAAwAAAAAAAAAIUkVKRUNURUQAAAAE",
            "AAAAAQAAAAAAAAAAAAAACkJvdW50eUluZm8AAAAAAAYAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAIZW5kX2RhdGUAAAAGAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAJcGF5X3Rva2VuAAAAAAAAEwAAAAAAAAANcmV3YXJkX2Ftb3VudAAAAAAAAAYAAAAAAAAABnN0YXR1cwAAAAAH0AAAAAxCb3VudHlTdGF0dXM=",
            "AAAAAQAAAAAAAAAAAAAACFdvcmtJbmZvAAAAAwAAAAAAAAAJYm91bnR5X2lkAAAAAAAABAAAAAAAAAALcGFydGljaXBhbnQAAAAAEwAAAAAAAAAGc3RhdHVzAAAAAAfQAAAACldvcmtTdGF0dXMAAA==",
            "AAAAAQAAAAAAAAAAAAAAB1dvcmtLZXkAAAAAAgAAAAAAAAAJYm91bnR5X2lkAAAAAAAABAAAAAAAAAALcGFydGljaXBhbnQAAAAAEw==",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAAAAAAAAAAACUVycm9yQ29kZQAAAAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAADRmVlAAAAAAAAAAAAAAAAC0JvdW50eUNvdW50AAAAAAEAAAAAAAAAC1JlZ0JvdW50aWVzAAAAAAEAAAAEAAAAAAAAAAAAAAAJV29ya0NvdW50AAAAAAAAAQAAAAAAAAAIUmVnV29ya3MAAAABAAAABAAAAAEAAAAAAAAAC1JlZ1dvcmtLZXlzAAAAAAEAAAfQAAAAB1dvcmtLZXkA",
            "AAAAAAAAAAAAAAAEaW5pdAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAHdmVyc2lvbgAAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAA1uZXdfd2FzbV9oYXNoAAAAAAAD7gAAACAAAAAA",
            "AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAfQAAAACUVycm9yQ29kZQAAAA==",
            "AAAAAAAAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAPpAAAAEwAAB9AAAAAJRXJyb3JDb2RlAAAA",
            "AAAAAAAAAAAAAAAHc2V0X2ZlZQAAAAACAAAAAAAAAAhmZWVfcmF0ZQAAAAQAAAAAAAAACmZlZV93YWxsZXQAAAAAABMAAAABAAAD6QAAA+0AAAAAAAAH0AAAAAlFcnJvckNvZGUAAAA=",
            "AAAAAAAAAAAAAAAHZ2V0X2ZlZQAAAAAAAAAAAQAAA+kAAAPtAAAAAgAAAAQAAAATAAAH0AAAAAlFcnJvckNvZGUAAAA=",
            "AAAAAAAAAAAAAAANY3JlYXRlX2JvdW50eQAAAAAAAAUAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAEbmFtZQAAABAAAAAAAAAABnJld2FyZAAAAAAABgAAAAAAAAAJcGF5X3Rva2VuAAAAAAAAEwAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAQAAA+kAAAAEAAAH0AAAAAlFcnJvckNvZGUAAAA=",
            "AAAAAAAAAAAAAAAMYXBwbHlfYm91bnR5AAAAAgAAAAAAAAALcGFydGljaXBhbnQAAAAAEwAAAAAAAAAJYm91bnR5X2lkAAAAAAAABAAAAAEAAAPpAAAABAAAB9AAAAAJRXJyb3JDb2RlAAAA",
            "AAAAAAAAAAAAAAALc3VibWl0X3dvcmsAAAAAAgAAAAAAAAALcGFydGljaXBhbnQAAAAAEwAAAAAAAAAHd29ya19pZAAAAAAEAAAAAQAAA+kAAAAFAAAH0AAAAAlFcnJvckNvZGUAAAA=",
            "AAAAAAAAAAAAAAAMYXBwcm92ZV93b3JrAAAAAgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAd3b3JrX2lkAAAAAAQAAAABAAAD6QAAAAUAAAfQAAAACUVycm9yQ29kZQAAAA==",
            "AAAAAAAAAAAAAAALcmVqZWN0X3dvcmsAAAAAAgAAAAAAAAAHY3JlYXRvcgAAAAATAAAAAAAAAAd3b3JrX2lkAAAAAAQAAAABAAAD6QAAAAUAAAfQAAAACUVycm9yQ29kZQAAAA==",
            "AAAAAAAAAAAAAAANY2FuY2VsX2JvdW50eQAAAAAAAAIAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAAAAAAJYm91bnR5X2lkAAAAAAAABAAAAAEAAAPpAAAABQAAB9AAAAAJRXJyb3JDb2RlAAAA",
            "AAAAAAAAAAAAAAAMY2xvc2VfYm91bnR5AAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAlib3VudHlfaWQAAAAAAAAEAAAAAQAAA+kAAAAEAAAH0AAAAAlFcnJvckNvZGUAAAA=",
            "AAAAAAAAAAAAAAAOdG9rZW5fYmFsYW5jZXMAAAAAAAIAAAAAAAAAB2FjY291bnQAAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAAAY="
        ]);
    }
    async init({ admin }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'init',
            args: this.spec.funcArgsToScVals("init", { admin }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async version(options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'version',
            args: this.spec.funcArgsToScVals("version", {}),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("version", xdr);
            },
        });
    }
    async upgrade({ new_wasm_hash }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'upgrade',
            args: this.spec.funcArgsToScVals("upgrade", { new_wasm_hash }),
            ...options,
            ...this.options,
            parseResultXdr: () => { },
        });
    }
    async setAdmin({ new_admin }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_admin',
                args: this.spec.funcArgsToScVals("set_admin", { new_admin }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_admin", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async getAdmin(options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'get_admin',
                args: this.spec.funcArgsToScVals("get_admin", {}),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("get_admin", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async setFee({ fee_rate, fee_wallet }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'set_fee',
                args: this.spec.funcArgsToScVals("set_fee", { fee_rate, fee_wallet }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("set_fee", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async getFee(options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'get_fee',
                args: this.spec.funcArgsToScVals("get_fee", {}),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("get_fee", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async createBounty({ creator, name, reward, pay_token, deadline }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'create_bounty',
                args: this.spec.funcArgsToScVals("create_bounty", { creator, name, reward, pay_token, deadline }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("create_bounty", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async applyBounty({ participant, bounty_id }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'apply_bounty',
                args: this.spec.funcArgsToScVals("apply_bounty", { participant, bounty_id }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("apply_bounty", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async submitWork({ participant, work_id }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'submit_work',
                args: this.spec.funcArgsToScVals("submit_work", { participant, work_id }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("submit_work", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async approveWork({ creator, work_id }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'approve_work',
                args: this.spec.funcArgsToScVals("approve_work", { creator, work_id }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("approve_work", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async rejectWork({ creator, work_id }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'reject_work',
                args: this.spec.funcArgsToScVals("reject_work", { creator, work_id }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("reject_work", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async cancelBounty({ creator, bounty_id }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'cancel_bounty',
                args: this.spec.funcArgsToScVals("cancel_bounty", { creator, bounty_id }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("cancel_bounty", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async closeBounty({ admin, bounty_id }, options = {}) {
        try {
            return await (0, invoke_js_1.invoke)({
                method: 'close_bounty',
                args: this.spec.funcArgsToScVals("close_bounty", { admin, bounty_id }),
                ...options,
                ...this.options,
                parseResultXdr: (xdr) => {
                    return new Ok(this.spec.funcResToNative("close_bounty", xdr));
                },
            });
        }
        catch (e) {
            if (typeof e === 'string') {
                let err = parseError(e);
                if (err)
                    return err;
            }
            throw e;
        }
    }
    async tokenBalances({ account, token }, options = {}) {
        return await (0, invoke_js_1.invoke)({
            method: 'token_balances',
            args: this.spec.funcArgsToScVals("token_balances", { account, token }),
            ...options,
            ...this.options,
            parseResultXdr: (xdr) => {
                return this.spec.funcResToNative("token_balances", xdr);
            },
        });
    }
}
exports.Contract = Contract;
