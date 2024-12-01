import { TIMEOUT_SEC } from './config';
import { async } from 'regenerator-runtime';

export class AppError extends Error {
    constructor(statusCode, statusText, message) {
        super();
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.message = message;
    }
}

//prettier-ignore
export const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAXrequest = async (url, uploadData = undefined) => {
    try {
        const fetchMe = fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(uploadData),
        });
        const fetchPro = uploadData ? fetchMe : fetch(url);

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok)
            throw new AppError(res.status, res.statusText, data.message);
        return data;
    } catch (err) {
        throw err;
    }
};

export const getJSON = async url => {
    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok)
            throw new AppError(res.status, res.statusText, data.message);
        return data;
    } catch (err) {
        throw err;
    }
};

export const sendJSON = async (url, uploadData) => {
    try {
        const fetchPro = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
        });
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok)
            throw new AppError(res.status, res.statusText, data.message);
        return data;
    } catch (err) {
        throw err;
    }
};
