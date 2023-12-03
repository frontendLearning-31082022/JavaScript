const pearsonCorrelation = {
    round:2,
    calc: function (ar1, ar2) {
        ar1 = ar1.map(x => Number(x));
        ar2 = ar2.map(x => Number(x));

        const avr = (ar) => { return ar.reduce((a, b) => a + b, 0) / ar.length };
        const avr1 = avr(ar1);
        const avr2 = avr(ar2);

        const m = ar1.map((x, i) => { return { x: x, y: ar2[i] } });
        const top = m.reduce((a, b) => a + (b.x - avr1) * (b.y - avr2), 0);
        const bottomLeft = m.reduce((a, b) => a + Math.pow((b.x - avr1), 2), 0);
        const bottomRight = m.reduce((a, b) => a + Math.pow((b.y - avr2), 2), 0);

        const res = top / Math.sqrt(bottomLeft * bottomRight);

        return res.toFixed(this.round);
    }
};