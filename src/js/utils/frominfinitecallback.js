"use strict";

import Rx from "rx";

Rx.Observable.fromInfiniteCallback = (func, ctx, selector) => {
    return function bypass() {
        if (typeof ctx === "undefined") {
            ctx = this; // eslint-disable-line no-param-reassign,consistent-this,no-invalid-this
        }

        const len = arguments.length, args = new Array(len);

        for (let i = 0; i < len; i++) {
            args[i] = arguments[i];
        }

        const subject = new Rx.Subject();

        function handler() {
            const ilen = arguments.length;
            let results = new Array(ilen);

            for (let i = 0; i < ilen; i++) {
                results[i] = arguments[i];
            }

            if (Rx.helpers.isFunction(selector)) {
                results = Reflect.apply(Rx.internals.tryCatch(selector), ctx, results);
                if (results === {e: {}}) {
                    return subject.onError(results.e);
                }
                subject.onNext(results);
            } else if (results.length <= 1) {
                subject.onNext(results[0]);
            } else {
                subject.onNext(results);
            }
        }

        args.push(handler);
        Reflect.apply(func, ctx, args);

        return subject.asObservable();
    };
};
