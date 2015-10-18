"use strict";

import Rx from "rx";

Rx.Observable.fromDoubleCallback = function fromDoubleCallback(func, ctxrecv) {
    return function innerf() {
        let ctx = ctxrecv;

        if (typeof ctx === "undefined") {
            ctx = this; // eslint-disable-line consistent-this,no-invalid-this
        }

        const len = arguments.length;
        const args = new Array(len);

        for (let i = 0; i < len; i++) {
            args[i] = arguments[i];
        }

        const subject = new Rx.AsyncSubject();

        const handlerok = () => {
            const lenhand = arguments.length, results = new Array(lenhand);

            for (let i = 0; i < lenhand; i++) {
                results[i] = arguments[i];
            }

            window.console.log(results);
            if (results.length <= 1) {
                subject.onNext(results[0]);
            } else {
                subject.onNext(results);
            }
            subject.onCompleted();
        };

        const handlererr = () => {
            const lenhand = arguments.length, results = new Array(lenhand);

            for (let i = 0; i < lenhand; i++) {
                results[i] = arguments[i];
            }

            if (results.length <= 1) {
                subject.onError(results[0]);
            } else {
                subject.onError(results);
            }
            subject.onCompleted();
        };

        args.push(handlerok, handlererr);
        Reflect.apply(func, ctx, args);

        return subject.asObservable();
    };
};
